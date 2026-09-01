package ch.blitzrechnen.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import ch.blitzrechnen.app.ui.theme.Blitz
import ch.blitzrechnen.app.ui.theme.Sunny

/**
 * Hunderterfeld: 10 x 10 Punkte. Die ersten [count] Punkte sind gefüllt.
 * Vollständige Zehnerstreifen sind farblich betont, damit Kinder in Zehnern zählen.
 */
@Composable
fun HundredField(count: Int, modifier: Modifier = Modifier) {
    val filled = Sunny
    val fullRow = Blitz
    val empty = Color(0xFFE3DCF3)
    Box(modifier.fillMaxWidth().padding(8.dp)) {
        Canvas(Modifier.fillMaxWidth().aspectRatio(1f)) {
            val cols = 10
            val rows = 10
            val gap = size.width / (cols * 6f)
            val cell = (size.width - gap * (cols + 1)) / cols
            val r = cell / 2.2f
            for (row in 0 until rows) {
                for (col in 0 until cols) {
                    val index = row * cols + col // 0-basiert
                    val isFilled = index < count
                    val rowComplete = (row + 1) * cols <= count
                    val cx = gap + col * (cell + gap) + cell / 2
                    val cy = gap + row * (cell + gap) + cell / 2
                    drawCircle(
                        color = when {
                            rowComplete -> fullRow
                            isFilled -> filled
                            else -> empty
                        },
                        radius = r,
                        center = Offset(cx, cy)
                    )
                }
            }
            // dezente Trennlinie nach dem 5. Streifen (Kraft der Fünf)
            val midY = gap + 5 * (cell + gap) - gap / 2
            drawLine(
                color = Color(0x33000000),
                start = Offset(0f, midY),
                end = Offset(size.width, midY),
                strokeWidth = gap
            )
        }
    }
}
