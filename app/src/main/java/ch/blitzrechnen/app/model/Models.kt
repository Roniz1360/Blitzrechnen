package ch.blitzrechnen.app.model

/** Schwierigkeitsstufe (difficulty level). */
enum class Level(val label: String, val stars: Int) {
    ANFAENGER("Anfänger", 1),
    KOENNER("Könner", 2),
    PROFI("Profi", 3);

    companion object {
        fun fromOrdinalSafe(i: Int): Level = entries.getOrElse(i) { ANFAENGER }
    }
}

/** Die 10 Blitz-Übungstypen der 2. Klasse (Zahlenraum bis 100). */
enum class ExerciseType(
    val id: String,
    val title: String,
    val short: String,
    val emoji: String,
    val colorArgb: Long,
    val lp21: String,
    val description: String
) {
    ANZAHL(
        "anzahl", "Wie viele?", "Anzahl", "👀", 0xFFEF6C6C,
        "MA.1.A.1", "Zähle die Punkte am Hunderterfeld."
    ),
    TAFEL(
        "tafel", "Zahlen finden", "Tafel", "🔢", 0xFFF59E0B,
        "MA.1.A.1.c", "Welche Zahl fehlt?"
    ),
    SCHRITTE(
        "schritte", "Zählen in Schritten", "Schritte", "🐾", 0xFF10B981,
        "MA.1.A.2.d", "Zähle in 2er-, 5er- oder 10er-Schritten."
    ),
    ERG_ZEHNER(
        "erg_zehner", "Ergänzen zum Zehner", "Zehner", "🔟", 0xFF14B8A6,
        "MA.1.A.3.b", "Ergänze bis zum nächsten Zehner."
    ),
    ERG_HUNDERT(
        "erg_hundert", "Ergänzen bis 100", "bis 100", "💯", 0xFF3B82F6,
        "MA.1.A.3.b", "Ergänze bis 100."
    ),
    DOPPEL(
        "doppel", "Verdoppeln & Halbieren", "Doppelt", "✌️", 0xFF8B5CF6,
        "MA.1.A.3.b", "Verdopple oder halbiere die Zahl."
    ),
    PLUS(
        "plus", "Plusaufgaben", "Plus", "➕", 0xFF6D3BF5,
        "MA.1.A.3.b", "Rechne die Plusaufgabe."
    ),
    MINUS(
        "minus", "Minusaufgaben", "Minus", "➖", 0xFFEC4899,
        "MA.1.A.3.b", "Rechne die Minusaufgabe."
    ),
    HUNDERT_TEILEN(
        "hundert_teilen", "100 teilen", "100 teilen", "🍰", 0xFFF97316,
        "MA.1.A.3.b", "Wie viel fehlt zu 100?"
    ),
    MALREIHEN(
        "malreihen", "Malreihen 2·5·10", "Mal", "⭐", 0xFF0EA5E9,
        "MA.1.A.3.c", "Rechne mit den Reihen 2, 5 und 10."
    );

    companion object {
        fun byId(id: String): ExerciseType? = entries.firstOrNull { it.id == id }
        val all: List<ExerciseType> get() = entries.toList()
    }
}

/** Optionale bildliche Darstellung zu einer Aufgabe. */
sealed interface Visual {
    /** Hunderterfeld: [count] Punkte als Zehnerstreifen + Einer. */
    data class HundredField(val count: Int) : Visual
    /** Ausschnitt aus der Hundertertafel mit einer Lücke. */
    data class ChartStrip(val values: List<Int?>) : Visual
}

/** Eine einzelne Rechenaufgabe. */
data class Task(
    val type: ExerciseType,
    val question: String,
    val answer: Int,
    val hint: String = "",
    val visual: Visual? = null
)
