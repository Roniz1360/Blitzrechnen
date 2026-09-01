package ch.blitzrechnen.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import ch.blitzrechnen.app.data.AppRepository
import ch.blitzrechnen.app.data.AppState
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class AppViewModel(app: Application) : AndroidViewModel(app) {

    private val repo = AppRepository(app.applicationContext)

    val state: StateFlow<AppState> = repo.state
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), AppState())

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
}
