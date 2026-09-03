package ch.blitzrechnen.app.data

/**
 * Führt lokalen und Cloud-Stand zusammen. Regel: Es geht nie Fortschritt
 * verloren – pro Wert wird das jeweils Bessere/Höhere übernommen.
 * [local] hat bei reinen Einstellungen (Ton, PIN) Vorrang.
 */
fun mergeStates(local: AppState, cloud: AppState): AppState {
    val byId = LinkedHashMap<String, Profile>()
    for (p in local.profiles) byId[p.id] = p
    for (p in cloud.profiles) {
        val existing = byId[p.id]
        byId[p.id] = if (existing == null) p else mergeProfiles(existing, p)
    }
    val mergedProfiles = byId.values.toList()
    val activeId = local.activeProfileId?.takeIf { id -> mergedProfiles.any { it.id == id } }
        ?: cloud.activeProfileId?.takeIf { id -> mergedProfiles.any { it.id == id } }
        ?: mergedProfiles.firstOrNull()?.id

    return local.copy(
        profiles = mergedProfiles,
        activeProfileId = activeId,
        // Einstellungen: lokal gewinnt; PIN von lokal, sonst aus Cloud
        parentPinHash = local.parentPinHash ?: cloud.parentPinHash
    )
}

private fun mergeProfiles(a: Profile, b: Profile): Profile {
    val ids = a.progress.keys + b.progress.keys
    val progress = ids.associateWith { id ->
        mergeProgress(a.progress[id], b.progress[id])
    }
    return a.copy(
        name = a.name.ifBlank { b.name },
        avatar = a.avatar,
        totalStars = maxOf(a.totalStars, b.totalStars),
        progress = progress
    )
}

private fun mergeProgress(a: ExerciseProgress?, b: ExerciseProgress?): ExerciseProgress {
    if (a == null) return b ?: ExerciseProgress()
    if (b == null) return a
    return ExerciseProgress(
        practiced = a.practiced || b.practiced,
        tested = a.tested || b.tested,
        passed = a.passed || b.passed,
        bestPercent = maxOf(a.bestPercent, b.bestPercent),
        bestLevelStars = maxOf(a.bestLevelStars, b.bestLevelStars),
        totalCorrect = maxOf(a.totalCorrect, b.totalCorrect)
    )
}
