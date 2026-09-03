package ch.blitzrechnen.app.data

import android.app.Activity
import android.content.Context
import com.google.android.gms.games.PlayGames
import com.google.android.gms.games.PlayGamesSdk
import com.google.android.gms.games.SnapshotsClient
import com.google.android.gms.games.snapshot.Snapshot
import com.google.android.gms.games.snapshot.SnapshotMetadataChange
import ch.blitzrechnen.app.R
import kotlinx.coroutines.tasks.await
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/**
 * Cloud-Sync über Google Play Games – "Gespeicherte Spiele" (Snapshots).
 * Der Fortschritt hängt am Google-Konto des Nutzers und synct so über Geräte.
 *
 * Bewusst schlank: nur Anmelden, Speichern, Laden. Alles ist optional –
 * ohne Anmeldung bleibt die App komplett offline.
 */
class CloudSync(private val appContext: Context) {

    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }
    private var initialized = false

    /** true, wenn eine echte App-ID hinterlegt wurde (kein Platzhalter). */
    fun isConfigured(): Boolean {
        val id = appContext.getString(R.string.game_services_project_id)
        return id.isNotBlank() && id.any { it.isDigit() } && id != "0000000000"
    }

    private fun ensureInit() {
        if (!initialized && isConfigured()) {
            PlayGamesSdk.initialize(appContext)
            initialized = true
        }
    }

    /** Prüft, ob der Nutzer bereits bei Play Games angemeldet ist. */
    suspend fun isSignedIn(activity: Activity): Boolean {
        if (!isConfigured()) return false
        ensureInit()
        return runCatching {
            PlayGames.getGamesSignInClient(activity).isAuthenticated().await().isAuthenticated
        }.getOrDefault(false)
    }

    /** Startet die Anmeldung (öffnet ggf. den Play-Games-Dialog). */
    suspend fun signIn(activity: Activity): Boolean {
        if (!isConfigured()) return false
        ensureInit()
        return runCatching {
            PlayGames.getGamesSignInClient(activity).signIn().await().isAuthenticated
        }.getOrDefault(false)
    }

    /** Speichert den Zustand in der Cloud. */
    suspend fun save(activity: Activity, state: AppState): Result<Unit> = runCatching {
        require(isSignedIn(activity)) { "Nicht angemeldet" }
        val snapshot = openSnapshot(activity)
        val bytes = json.encodeToString(state).toByteArray()
        snapshot.snapshotContents.writeBytes(bytes)
        val meta = SnapshotMetadataChange.Builder()
            .setDescription("Zahlenblitz-Fortschritt")
            .build()
        PlayGames.getSnapshotsClient(activity).commitAndClose(snapshot, meta).await()
        Unit
    }

    /** Lädt den Zustand aus der Cloud (null, wenn noch nichts gespeichert wurde). */
    suspend fun load(activity: Activity): Result<AppState?> = runCatching {
        require(isSignedIn(activity)) { "Nicht angemeldet" }
        val snapshot = openSnapshot(activity)
        val bytes = snapshot.snapshotContents.readFully()
        // Offenes Snapshot wieder schliessen (ohne Änderung)
        PlayGames.getSnapshotsClient(activity)
            .commitAndClose(snapshot, SnapshotMetadataChange.EMPTY_CHANGE).await()
        if (bytes == null || bytes.isEmpty()) null
        else runCatching { json.decodeFromString<AppState>(String(bytes)) }.getOrNull()
    }

    private suspend fun openSnapshot(activity: Activity): Snapshot {
        val result = PlayGames.getSnapshotsClient(activity)
            .open(SAVE_NAME, true, SnapshotsClient.RESOLUTION_POLICY_HIGHEST_PROGRESS)
            .await()
        return result.data ?: error("Snapshot konnte nicht geöffnet werden")
    }

    companion object {
        private const val SAVE_NAME = "zahlenblitz_progress"
    }
}
