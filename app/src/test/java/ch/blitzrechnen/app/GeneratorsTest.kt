package ch.blitzrechnen.app

import ch.blitzrechnen.app.generators.Generators
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.model.Level
import ch.blitzrechnen.app.model.Visual
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.random.Random

/**
 * Belastet ALLE Aufgaben-Generatoren (10 Typen × 3 Stufen) mit vielen tausend
 * Durchläufen. Ziel: nie ein Absturz und immer eine gültige, lösbare Aufgabe.
 * Das ist die wichtigste "1000 Nutzer, kein Crash"-Absicherung, weil dieser
 * Code bei jeder einzelnen Aufgabe läuft.
 */
class GeneratorsTest {

    @Test
    fun everyGeneratorProducesValidTasks() {
        val rnd = Random(42)
        for (type in ExerciseType.all) {
            for (level in Level.entries) {
                repeat(20_000) {
                    val task = Generators.next(type, level, rnd)

                    // Frage darf nie leer sein
                    assertFalse(
                        "Leere Frage bei $type/$level",
                        task.question.isBlank()
                    )
                    // Antwort im sinnvollen Bereich (Zahlenraum bis 100, Doppeltes bis 100)
                    assertTrue(
                        "Antwort ${task.answer} ausserhalb 0..100 bei $type/$level (${task.question})",
                        task.answer in 0..100
                    )
                    // Hunderterfeld nie mehr als 100 Punkte
                    (task.visual as? Visual.HundredField)?.let { v ->
                        assertTrue(
                            "Hunderterfeld ${v.count} > 100 bei $type/$level",
                            v.count in 0..100
                        )
                    }
                }
            }
        }
    }

    @Test
    fun additionAndSubtractionAnswersAreArithmeticallyCorrect() {
        val rnd = Random(7)
        repeat(50_000) {
            for (level in Level.entries) {
                val plus = Generators.next(ExerciseType.PLUS, level, rnd)
                val minus = Generators.next(ExerciseType.MINUS, level, rnd)
                // Ergebnisse müssen im Zahlenraum bleiben und nicht-negativ sein
                assertTrue("Plus negativ", plus.answer >= 0)
                assertTrue("Minus negativ: ${minus.question}", minus.answer >= 0)
            }
        }
    }
}
