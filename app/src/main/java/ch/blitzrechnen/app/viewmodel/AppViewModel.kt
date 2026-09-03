package ch.blitzrechnen.app.viewmodel

import android.app.Activity
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import ch.blitzrechnen.app.data.AppRepository
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.data.CloudSync
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/** Zustand des Cloud-Sync für die Oberfläche. */
data class CloudUi(
    val configured: Boolean,
    val signedIn: Boolean = false,
    val busy: Boolean = false,
    val message: String? = null
)

class AppViewModel(app: Application) : AndroidViewModel(app) {

    private val repo = AppRepository(app.applicationContext)
    private val cloud = CloudSync(app.applicationContext)

    val state: StateFlow<AppState> = repo.state
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AppState())

    private val _cloud = MutableStateFlow(CloudUi(configured = cloud.isConfigured()))
    val cloudUi: StateFlow<CloudUi> = _cloud.asStateFlow()

    fun addProfile(name: String, avatar: String) = viewModelScope.launch { repo.addProfile(name, avatar) }
    fun selectProfile(id: String) = viewModelScope.launch { repo.selectProfile(id) }
    fun deleteProfile(id: String) = viewModelScope.launch { repo.deleteProfile(id) }
    fun setSound(on: Boolean) = viewModelScope.launch { repo.setSound(on) }
    fun setTestSeconds(sec: Int) = viewModelScope.launch { repo.setTestSeconds(sec) }
    fun setPin(pin: String) = viewModelScope.launch { repo.setPin(pin) }
    fun clearPin() = viewModelScope.launch { repo.clearPin() }

    fun recordPractice(typeId: String, correct: Int, stars: Int) = viewModelScope.launch {
        repo.recordPractice(typeId, correct)
        repo.addStars(stars)
    }

    fun recordTest(typeId: String, percent: Int, levelStars: Int, correct: Int, earnedStars: Int) =
        viewModelScope.launch {
            repo.recordTest(typeId, percent, levelStars, correct)
            repo.addStars(earnedStars)
        }

    // ---- Cloud-Sync ----

    fun refreshCloudStatus(activity: Activity) = viewModelScope.launch {
        if (!cloud.isConfigured()) return@launch
        val signed = cloud.isSignedIn(activity)
        _cloud.value = _cloud.value.copy(configured = true, signedIn = signed)
    }

    fun signInCloud(activity: Activity) = viewModelScope.launch {
        _cloud.value = _cloud.value.copy(busy = true, message = null)
        val ok = cloud.signIn(activity)
        _cloud.value = _cloud.value.copy(
            busy = false, signedIn = ok,
            message = if (ok) "Angemeldet" else "Anmeldung nicht möglich"
        )
    }

    /** Zwei-Wege-Sync: Cloud laden, zusammenführen, wieder hochladen. */
    fun syncNow(activity: Activity) = viewModelScope.launch {
        if (!cloud.isConfigured()) return@launch
        _cloud.value = _cloud.value.copy(busy = true, message = null)
        if (!cloud.isSignedIn(activity) && !cloud.signIn(activity)) {
            _cloud.value = _cloud.value.copy(busy = false, signedIn = false, message = "Bitte zuerst anmelden")
            return@launch
        }
        val loaded = cloud.load(activity)
        val cloudState = loaded.getOrNull()
        val merged = if (cloudState != null) repo.mergeAndSave(cloudState) else repo.currentState()
        val saved = cloud.save(activity, merged)
        _cloud.value = _cloud.value.copy(
            busy = false, signedIn = true,
            message = if (saved.isSuccess) "Synchronisiert ✓" else "Sync fehlgeschlagen"
        )
    }

    fun clearCloudMessage() {
        _cloud.value = _cloud.value.copy(message = null)
    }
}
