package ch.blitzrechnen.app.data

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.UUID

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "blitz_state")

/**
 * Speichert den gesamten App-Zustand offline auf dem Gerät (kein Internet nötig).
 */
class AppRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }
    private val stateKey = stringPreferencesKey("app_state")

    val state: Flow<AppState> = context.dataStore.data.map { prefs ->
        prefs[stateKey]?.let {
            runCatching { json.decodeFromString<AppState>(it) }.getOrNull()
        } ?: AppState()
    }

    private suspend fun update(transform: (AppState) -> AppState) {
        context.dataStore.edit { prefs ->
            val current = prefs[stateKey]?.let {
                runCatching { json.decodeFromString<AppState>(it) }.getOrNull()
            } ?: AppState()
            prefs[stateKey] = json.encodeToString(transform(current))
        }
    }

    suspend fun addProfile(name: String, avatar: String) = update { s ->
        val p = Profile(id = UUID.randomUUID().toString(), name = name.trim().ifBlank { "Kind" }, avatar = avatar)
        s.copy(profiles = s.profiles + p, activeProfileId = s.activeProfileId ?: p.id)
    }

    suspend fun selectProfile(id: String) = update { it.copy(activeProfileId = id) }

    suspend fun deleteProfile(id: String) = update { s ->
        val remaining = s.profiles.filterNot { it.id == id }
        s.copy(
            profiles = remaining,
            activeProfileId = if (s.activeProfileId == id) remaining.firstOrNull()?.id else s.activeProfileId
        )
    }

    suspend fun setSound(on: Boolean) = update { it.copy(soundOn = on) }
    suspend fun setTestSeconds(sec: Int) = update { it.copy(testSeconds = sec) }

    /** Ergebnis einer Übungs-Runde einarbeiten. */
    suspend fun recordPractice(typeId: String, correct: Int) = updateActive { p ->
        val cur = p.forType(typeId)
        p.progress + (typeId to cur.copy(
            practiced = true,
            totalCorrect = cur.totalCorrect + correct
        ))
    }

    /** Ergebnis eines Tests einarbeiten (Pass ab 80%). */
    suspend fun recordTest(typeId: String, percent: Int, levelStars: Int, correct: Int) = updateActive { p ->
        val cur = p.forType(typeId)
        val passed = cur.passed || percent >= 80
        p.progress + (typeId to cur.copy(
            tested = true,
            passed = passed,
            bestPercent = maxOf(cur.bestPercent, percent),
            bestLevelStars = maxOf(cur.bestLevelStars, if (percent >= 80) levelStars else 0),
            totalCorrect = cur.totalCorrect + correct
        ))
    }

    suspend fun addStars(count: Int) = update { s ->
        val active = s.activeProfile ?: return@update s
        s.copy(profiles = s.profiles.map {
            if (it.id == active.id) it.copy(totalStars = it.totalStars + count) else it
        })
    }

    private suspend fun updateActive(transform: (Profile) -> Map<String, ExerciseProgress>) = update { s ->
        val active = s.activeProfile ?: return@update s
        s.copy(profiles = s.profiles.map {
            if (it.id == active.id) it.copy(progress = transform(it)) else it
        })
    }
}
