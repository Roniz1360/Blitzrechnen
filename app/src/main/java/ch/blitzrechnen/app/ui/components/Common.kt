package ch.blitzrechnen.app.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.R
import ch.blitzrechnen.app.ui.theme.Sunny

/** Zahlen-Ausschnitt aus der Hundertertafel; null-Feld ist die Lücke. */
@Composable
fun ChartStrip(values: List<Int?>, modifier: Modifier = Modifier) {
    Row(
        modifier.padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        values.forEach { v ->
            val gap = v == null
            Box(
                Modifier
                    .size(72.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(if (gap) Sunny.copy(alpha = 0.25f) else MaterialTheme.colorScheme.surfaceVariant)
                    .border(
                        width = if (gap) 3.dp else 0.dp,
                        color = if (gap) Sunny else Color.Transparent,
                        shape = RoundedCornerShape(16.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = v?.toString() ?: "?",
                    fontSize = 30.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}

/** Blitzi-Maskottchen mit sanfter Wackel-Animation und optionaler Sprechblase. */
@Composable
fun Mascot(
    message: String? = null,
    modifier: Modifier = Modifier,
    animate: Boolean = true,
    sizeDp: Int = 96
) {
    val transition = rememberInfiniteTransition(label = "mascot")
    val angle by transition.animateFloat(
        initialValue = -6f, targetValue = 6f,
        animationSpec = infiniteRepeatable(tween(900), RepeatMode.Reverse), label = "angle"
    )
    Row(modifier, verticalAlignment = Alignment.CenterVertically) {
        androidx.compose.foundation.Image(
            painter = painterResource(R.drawable.blitzi),
            contentDescription = "Blitzi",
            modifier = Modifier
                .size(sizeDp.dp)
                .graphicsLayer { if (animate) rotationZ = angle }
        )
        if (message != null) {
            Surface(
                color = Color.White,
                shape = RoundedCornerShape(20.dp),
                shadowElevation = 3.dp,
                modifier = Modifier.padding(start = 8.dp)
            ) {
                Text(
                    message,
                    Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Start,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}

/** Reihe von Sternen (gefüllt/leer). */
@Composable
fun StarRow(filled: Int, total: Int = 3, starSize: Int = 22, modifier: Modifier = Modifier) {
    Row(modifier) {
        repeat(total) { i ->
            Text(
                if (i < filled) "⭐" else "☆",
                fontSize = starSize.sp,
                color = if (i < filled) Sunny else Color(0xFFBBBBBB)
            )
        }
    }
}
