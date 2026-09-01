package ch.blitzrechnen.app.data

import kotlinx.serialization.Serializable

/** Fortschritt zu einer einzelnen Übung (Blitz). */
@Serializable
data class ExerciseProgress(
    val practiced: Boolean = false,   // schon geübt
    val tested: Boolean = false,      // schon getestet
    val passed: Boolean = false,      // Test bestanden (Pass-Stempel)
    val bestPercent: Int = 0,         // bestes Testergebnis in %
    val bestLevelStars: Int = 0,      // Stufe des besten Tests
    val totalCorrect: Int = 0         // richtig gelöste Aufgaben insgesamt
)

/** Ein Kinder-Profil (anonym, ohne Personendaten – DSG-konform). */
@Serializable
data class Profile(
    val id: String,
    val name: String,
    val avatar: String = "🦊",
    val totalStars: Int = 0,
    val progress: Map<String, ExerciseProgress> = emptyMap()
) {
    val passCount: Int get() = progress.values.count { it.passed }

    fun forType(id: String): ExerciseProgress = progress[id] ?: ExerciseProgress()
}

/** Gesamter App-Zustand, der gespeichert wird. */
@Serializable
data class AppState(
    val profiles: List<Profile> = emptyList(),
    val activeProfileId: String? = null,
    val soundOn: Boolean = true,
    val testSeconds: Int = 60,
    val testCount: Int = 10,
    /** SHA-256-Hash der Eltern-PIN; null = keine PIN gesetzt. */
    val parentPinHash: String? = null
) {
    val activeProfile: Profile?
        get() = profiles.firstOrNull { it.id == activeProfileId }

    val hasPin: Boolean get() = parentPinHash != null
}
