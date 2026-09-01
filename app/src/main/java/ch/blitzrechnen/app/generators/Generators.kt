package ch.blitzrechnen.app.generators

import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.model.Level
import ch.blitzrechnen.app.model.Task
import ch.blitzrechnen.app.model.Visual
import kotlin.random.Random

/**
 * Aufgaben-Generatoren für die 2. Klasse (Zahlenraum bis 100), Lehrplan 21.
 * Jeder Generator liefert eine zufällige [Task] passend zur Schwierigkeitsstufe.
 */
object Generators {

    fun next(type: ExerciseType, level: Level, rnd: Random = Random.Default): Task = when (type) {
        ExerciseType.ANZAHL -> anzahl(level, rnd)
        ExerciseType.TAFEL -> tafel(level, rnd)
        ExerciseType.SCHRITTE -> schritte(level, rnd)
        ExerciseType.ERG_ZEHNER -> ergZehner(level, rnd)
        ExerciseType.ERG_HUNDERT -> ergHundert(level, rnd)
        ExerciseType.DOPPEL -> doppel(level, rnd)
        ExerciseType.PLUS -> plus(level, rnd)
        ExerciseType.MINUS -> minus(level, rnd)
        ExerciseType.HUNDERT_TEILEN -> hundertTeilen(level, rnd)
        ExerciseType.MALREIHEN -> malreihen(level, rnd)
    }

    // 1) Wie viele? — Anzahl am Hunderterfeld erfassen
    private fun anzahl(level: Level, rnd: Random): Task {
        val n = when (level) {
            Level.ANFAENGER -> rnd.nextInt(1, 5) * 10 + rnd.nextInt(0, 10) // klare Zehner+Einer
            Level.KOENNER -> rnd.nextInt(11, 80)
            Level.PROFI -> rnd.nextInt(21, 100)
        }
        return Task(
            type = ExerciseType.ANZAHL,
            question = "Wie viele Punkte?",
            answer = n,
            hint = "Zähle zuerst die vollen Zehnerstreifen, dann die einzelnen Punkte.",
            visual = Visual.HundredField(n)
        )
    }

    // 2) Zahlen finden — fehlende Zahl an der Hundertertafel
    private fun tafel(level: Level, rnd: Random): Task {
        return when (level) {
            Level.ANFAENGER -> {
                val m = rnd.nextInt(2, 98)
                Task(
                    ExerciseType.TAFEL,
                    "Welche Zahl liegt zwischen ${m - 1} und ${m + 1}?",
                    m, "Die Zahl in der Mitte.",
                    Visual.ChartStrip(listOf(m - 1, null, m + 1))
                )
            }
            Level.KOENNER -> {
                val m = rnd.nextInt(1, 90)
                val target = m + 10
                Task(
                    ExerciseType.TAFEL,
                    "Welche Zahl steht ein Feld unter $m?",
                    target, "Ein Feld nach unten heisst +10.",
                    Visual.ChartStrip(listOf(m, null))
                )
            }
            Level.PROFI -> {
                val m = rnd.nextInt(12, 89)
                Task(
                    ExerciseType.TAFEL,
                    "Welche Zahl kommt vor $m?",
                    m - 1, "Eins weniger.",
                    Visual.ChartStrip(listOf(null, m))
                )
            }
        }
    }

    // 3) Zählen in Schritten (2/5/10, vor/rückwärts)
    private fun schritte(level: Level, rnd: Random): Task {
        val step = when (level) {
            Level.ANFAENGER -> listOf(10, 5).random(rnd)
            Level.KOENNER -> listOf(2, 5, 10).random(rnd)
            Level.PROFI -> listOf(2, 5, 10).random(rnd)
        }
        val forward = if (level == Level.ANFAENGER) true else rnd.nextBoolean()
        val start = if (forward) rnd.nextInt(0, 100 - 4 * step)
        else rnd.nextInt(4 * step, 100)
        val seq = (0..2).map { start + (if (forward) it else -it) * step }
        val answer = start + (if (forward) 3 else -3) * step
        val shown = seq.joinToString(", ") { it.toString() } + ", ___"
        val dir = if (forward) "vorwärts" else "rückwärts"
        return Task(
            ExerciseType.SCHRITTE,
            "$shown\n\nWie geht es weiter? ($step-er Schritte $dir)",
            answer,
            "Immer ${if (forward) "+" else "−"}$step rechnen."
        )
    }

    // 4) Ergänzen zum Zehner
    private fun ergZehner(level: Level, rnd: Random): Task {
        val range = when (level) {
            Level.ANFAENGER -> 1..3
            Level.KOENNER -> 1..9
            Level.PROFI -> 1..9
        }
        val tens = rnd.nextInt(1, if (level == Level.ANFAENGER) 5 else 10)
        val ones = range.random(rnd)
        val start = tens * 10 + ones
        val target = (tens + 1) * 10
        return Task(
            ExerciseType.ERG_ZEHNER,
            "$start + ___ = $target",
            target - start,
            "Wie viel fehlt bis zum nächsten Zehner?",
            Visual.HundredField(start)
        )
    }

    // 5) Ergänzen bis 100
    private fun ergHundert(level: Level, rnd: Random): Task {
        val start = when (level) {
            Level.ANFAENGER -> rnd.nextInt(1, 10) * 10 // volle Zehner
            Level.KOENNER -> rnd.nextInt(1, 10) * 5
            Level.PROFI -> rnd.nextInt(1, 100)
        }
        return Task(
            ExerciseType.ERG_HUNDERT,
            "$start + ___ = 100",
            100 - start,
            "Denke: Wie weit ist es von $start bis 100?",
            Visual.HundredField(start)
        )
    }

    // 6) Verdoppeln & Halbieren
    private fun doppel(level: Level, rnd: Random): Task {
        val halve = when (level) {
            Level.ANFAENGER -> false
            else -> rnd.nextBoolean()
        }
        return if (halve) {
            val half = rnd.nextInt(1, if (level == Level.PROFI) 50 else 26)
            val n = half * 2
            Task(ExerciseType.DOPPEL, "Halbiere $n", half, "Die Hälfte von $n.")
        } else {
            val n = when (level) {
                Level.ANFAENGER -> rnd.nextInt(1, 6) * 5   // 5er/10er
                Level.KOENNER -> rnd.nextInt(1, 6) * 5
                Level.PROFI -> rnd.nextInt(10, 50)
            }
            Task(ExerciseType.DOPPEL, "Verdopple $n", n * 2, "$n und noch einmal $n.")
        }
    }

    // 7) Plusaufgaben
    private fun plus(level: Level, rnd: Random): Task {
        return when (level) {
            Level.ANFAENGER -> {
                // ZE + E ohne Übergang
                val tens = rnd.nextInt(1, 9)
                val e1 = rnd.nextInt(0, 5)
                val e2 = rnd.nextInt(0, 5)
                val a = tens * 10 + e1
                Task(ExerciseType.PLUS, "$a + $e2 = ", a + e2, "Zähle die Einer zusammen.")
            }
            Level.KOENNER -> {
                // ZE + ZE ohne Zehnerübergang
                val t1 = rnd.nextInt(1, 5); val e1 = rnd.nextInt(0, 5)
                val t2 = rnd.nextInt(1, 4); val e2 = rnd.nextInt(0, 5 - e1 + 1).coerceAtLeast(0)
                val a = t1 * 10 + e1; val b = t2 * 10 + e2
                Task(ExerciseType.PLUS, "$a + $b = ", a + b, "Zehner und Einer getrennt rechnen.")
            }
            Level.PROFI -> {
                // mit Zehnerübergang
                val a = rnd.nextInt(6, 60)
                val b = rnd.nextInt(6, 100 - a).coerceAtLeast(6)
                Task(ExerciseType.PLUS, "$a + $b = ", a + b, "Erst zum Zehner, dann weiter.")
            }
        }
    }

    // 8) Minusaufgaben
    private fun minus(level: Level, rnd: Random): Task {
        return when (level) {
            Level.ANFAENGER -> {
                val tens = rnd.nextInt(1, 9)
                val e1 = rnd.nextInt(2, 9)
                val a = tens * 10 + e1
                val b = rnd.nextInt(1, e1 + 1)
                Task(ExerciseType.MINUS, "$a − $b = ", a - b, "Nimm nur von den Einern weg.")
            }
            Level.KOENNER -> {
                val t1 = rnd.nextInt(2, 9); val e1 = rnd.nextInt(0, 9)
                val t2 = rnd.nextInt(1, t1); val e2 = rnd.nextInt(0, e1 + 1)
                val a = t1 * 10 + e1; val b = t2 * 10 + e2
                Task(ExerciseType.MINUS, "$a − $b = ", a - b, "Zehner und Einer getrennt.")
            }
            Level.PROFI -> {
                val a = rnd.nextInt(20, 100)
                val b = rnd.nextInt(6, a - 1)
                Task(ExerciseType.MINUS, "$a − $b = ", a - b, "Erst zum Zehner zurück.")
            }
        }
    }

    // 9) 100 teilen
    private fun hundertTeilen(level: Level, rnd: Random): Task {
        val part = when (level) {
            Level.ANFAENGER -> rnd.nextInt(1, 10) * 10
            Level.KOENNER -> rnd.nextInt(1, 20) * 5
            Level.PROFI -> rnd.nextInt(1, 100)
        }
        return Task(
            ExerciseType.HUNDERT_TEILEN,
            "100 = $part + ___",
            100 - part,
            "Die beiden Teile ergeben zusammen 100."
        )
    }

    // 10) Malreihen 2, 5, 10
    private fun malreihen(level: Level, rnd: Random): Task {
        val factor = when (level) {
            Level.ANFAENGER -> listOf(2, 10).random(rnd)
            Level.KOENNER -> listOf(2, 5, 10).random(rnd)
            Level.PROFI -> listOf(2, 5, 10).random(rnd)
        }
        val n = rnd.nextInt(1, 11)
        return Task(
            ExerciseType.MALREIHEN,
            "$factor · $n = ",
            factor * n,
            "Zähle in $factor-er-Schritten $n mal."
        )
    }
}
