package ch.blitzrechnen.app

import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.data.ExerciseProgress
import ch.blitzrechnen.app.data.Profile
import ch.blitzrechnen.app.data.checkPin
import ch.blitzrechnen.app.data.mergeStates
import ch.blitzrechnen.app.data.pinHash
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class LogicTest {

    @Test
    fun pinHashIsStableAndChecks() {
        assertEquals(pinHash("1234"), pinHash("1234"))
        assertTrue(checkPin("1234", pinHash("1234")))
        assertFalse(checkPin("0000", pinHash("1234")))
        assertFalse(checkPin("1234", null))
        // PIN wird nie im Klartext gespeichert
        assertFalse(pinHash("1234").contains("1234"))
    }

    @Test
    fun mergeNeverLosesProgress() {
        val local = AppState(
            profiles = listOf(
                Profile(
                    id = "a", name = "Mia", avatar = "🦊", totalStars = 10,
                    progress = mapOf("plus" to ExerciseProgress(practiced = true, bestPercent = 60, totalCorrect = 30))
                )
            ),
            activeProfileId = "a"
        )
        val cloud = AppState(
            profiles = listOf(
                Profile(
                    id = "a", name = "Mia", avatar = "🦊", totalStars = 25,
                    progress = mapOf(
                        "plus" to ExerciseProgress(tested = true, passed = true, bestPercent = 90, totalCorrect = 12),
                        "minus" to ExerciseProgress(practiced = true, totalCorrect = 5)
                    )
                ),
                Profile(id = "b", name = "Leo", avatar = "🐼")
            )
        )

        val merged = mergeStates(local, cloud)

        // Beide Profile bleiben erhalten
        assertEquals(2, merged.profiles.size)
        val mia = merged.profiles.first { it.id == "a" }
        // Höchste Sterne gewinnen
        assertEquals(25, mia.totalStars)
        val plus = mia.progress.getValue("plus")
        // Bester Prozentwert + geübt-UND-getestet bleiben erhalten
        assertEquals(90, plus.bestPercent)
        assertTrue(plus.practiced)
        assertTrue(plus.tested)
        assertTrue(plus.passed)
        assertEquals(30, plus.totalCorrect) // Maximum aus 30/12
        // Übung nur in der Cloud bleibt erhalten
        assertNotNull(mia.progress["minus"])
        // Aktives Profil bleibt gültig
        assertEquals("a", merged.activeProfileId)
    }

    @Test
    fun mergeKeepsLocalSettings() {
        val local = AppState(soundOn = false, testSeconds = 90, parentPinHash = pinHash("1111"))
        val cloud = AppState(soundOn = true, testSeconds = 30, parentPinHash = pinHash("2222"))
        val merged = mergeStates(local, cloud)
        assertFalse(merged.soundOn)          // lokal gewinnt
        assertEquals(90, merged.testSeconds) // lokal gewinnt
        assertTrue(checkPin("1111", merged.parentPinHash)) // lokale PIN bleibt
    }
}
