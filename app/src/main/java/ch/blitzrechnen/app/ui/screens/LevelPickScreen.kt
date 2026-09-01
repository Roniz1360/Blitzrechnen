package ch.blitzrechnen.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.model.Level
import ch.blitzrechnen.app.ui.components.Mascot
import ch.blitzrechnen.app.ui.components.StarRow

@Composable
fun LevelPickScreen(
    type: ExerciseType,
    mode: String,
    onStart: (Level) -> Unit,
    onBack: () -> Unit
) {
    val color = Color(type.colorArgb)
    ScreenScaffold(title = type.title, onBack = onBack, headerColor = color) {
        Column(
            Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Mascot(message = type.description, sizeDp = 84)
            Spacer(Modifier.height(8.dp))
            Text(
                "Wie schwer soll es sein?",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(Modifier.height(16.dp))
            Level.entries.forEach { level ->
                LevelCard(level = level, color = color, onClick = { onStart(level) })
                Spacer(Modifier.height(14.dp))
            }
        }
    }
}

@Composable
private fun LevelCard(level: Level, color: Color, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            Modifier.padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(color.copy(alpha = 0.18f)),
                contentAlignment = Alignment.Center
            ) {
                Text("${level.stars}", fontWeight = FontWeight.ExtraBold, fontSize = 26.sp, color = color)
            }
            Spacer(Modifier.size(16.dp))
            Column(Modifier.weight(1f)) {
                Text(level.label, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp)
                StarRow(filled = level.stars, total = 3, starSize = 18)
            }
            Text("▶", fontSize = 28.sp, color = color)
        }
    }
}
