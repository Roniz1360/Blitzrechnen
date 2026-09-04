package ch.blitzrechnen.app.util

import android.media.AudioManager
import android.media.ToneGenerator

/**
 * Kurze Ton-Rückmeldung (richtig/falsch).
 *
 * Wichtig für Stabilität: Es wird EIN [ToneGenerator] wiederverwendet statt bei
 * jedem Tipp einen neuen zu erzeugen. So werden auf schwächeren Geräten keine
 * Audio-Ressourcen erschöpft, auch wenn ein Kind hunderte Aufgaben löst.
 */
object SoundFeedback {

    private var tone: ToneGenerator? = null

    @Synchronized
    fun play(correct: Boolean, enabled: Boolean) {
        if (!enabled) return
        try {
            val tg = tone ?: ToneGenerator(AudioManager.STREAM_MUSIC, 70).also { tone = it }
            tg.startTone(
                if (correct) ToneGenerator.TONE_PROP_ACK else ToneGenerator.TONE_PROP_NACK,
                150
            )
        } catch (_: Exception) {
            // Bei Ressourcenmangel: zurücksetzen, damit der nächste Versuch neu aufbaut.
            runCatching { tone?.release() }
            tone = null
        }
    }

    @Synchronized
    fun release() {
        runCatching { tone?.release() }
        tone = null
    }
}
