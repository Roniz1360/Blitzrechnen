package ch.blitzrechnen.app.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import kotlin.random.Random

private data class Piece(
    val x: Float, val delay: Float, val color: Color, val size: Float, val drift: Float, val rot: Float
)

/**
 * Kurzer, überspringbarer Konfetti-Regen als Belohnung.
 * [play] steuert den Ablauf (0f = versteckt, 1f = fertig gefallen).
 */
@Composable
fun Confetti(play: Boolean, modifier: Modifier = Modifier) {
    val colors = listOf(
        Color(0xFFFFD23F), Color(0xFF6D3BF5), Color(0xFF10B981),
        Color(0xFFEF6C6C), Color(0xFF3B82F6), Color(0xFFEC4899)
    )
    val pieces = remember {
        List(70) {
            Piece(
                x = Random.nextFloat(),
                delay = Random.nextFloat() * 0.3f,
                color = colors[Random.nextInt(colors.size)],
                size = 10f + Random.nextFloat() * 14f,
                drift = (Random.nextFloat() - 0.5f) * 0.3f,
                rot = Random.nextFloat() * 360f
            )
        }
    }
    val progress by animateFloatAsState(
        targetValue = if (play) 1f else 0f,
        animationSpec = tween(1400, easing = LinearEasing),
        label = "confetti"
    )
    if (progress <= 0f) return
    Canvas(modifier.fillMaxSize()) {
        pieces.forEach { p ->
            val t = ((progress - p.delay) / (1f - p.delay)).coerceIn(0f, 1f)
            if (t <= 0f) return@forEach
            val px = (p.x + p.drift * t) * size.width
            val py = t * (size.height + 40f) - 20f
            drawRect(
                color = p.color.copy(alpha = (1f - t).coerceIn(0.2f, 1f)),
                topLeft = Offset(px, py),
                size = Size(p.size, p.size * 0.6f)
            )
        }
    }
}
