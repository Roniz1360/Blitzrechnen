package ch.blitzrechnen.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.model.Level
import ch.blitzrechnen.app.ui.components.Confetti
import ch.blitzrechnen.app.ui.components.Mascot
import ch.blitzrechnen.app.ui.components.StarRow
import ch.blitzrechnen.app.ui.theme.Blitz
import ch.blitzrechnen.app.ui.theme.BlitzDark
import ch.blitzrechnen.app.ui.theme.Grass

@Composable
fun ResultView(
    type: ExerciseType,
    isTest: Boolean,
    correct: Int,
    total: Int,
    level: Level,
    onHome: () -> Unit,
    onAgain: () -> Unit
) {
    val percent = if (total > 0) correct * 100 / total else 0
    val stars = when {
        percent >= 90 -> 3
        percent >= 70 -> 2
        percent >= 40 -> 1
        else -> 0
    }
    val passed = isTest && percent >= 80
    val great = percent >= 70

    val message = when {
        passed -> "Bestanden! Du hast den Blitz geschafft! 🏅"
        percent >= 70 -> "Super gemacht!"
        percent >= 40 -> "Gut geübt – weiter so!"
        else -> "Übung macht den Meister. Nochmal?"
    }

    var celebrate by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { celebrate = great }

    Box(Modifier.fillMaxSize()) {
        Column(
            Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Blitz, BlitzDark)))
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Mascot(animate = great, sizeDp = 120)
            Spacer(Modifier.height(8.dp))
            Text(
                message,
                color = Color.White,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 24.sp,
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(20.dp))

            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    Modifier.fillMaxWidth().padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(type.title, fontWeight = FontWeight.Bold, fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                    Spacer(Modifier.height(8.dp))
                    StarRow(filled = stars, total = 3, starSize = 44)
                    Spacer(Modifier.height(12.dp))
                    Text("$correct von $total richtig",
                        fontWeight = FontWeight.ExtraBold, fontSize = 26.sp,
                        color = MaterialTheme.colorScheme.onSurface)
                    if (isTest) {
                        Text("$percent %", fontWeight = FontWeight.Bold, fontSize = 20.sp,
                            color = if (passed) Grass else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                    }
                }
            }

            Spacer(Modifier.height(24.dp))
            Button(
                onClick = onAgain,
                modifier = Modifier.fillMaxWidth().height(60.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = BlitzDark)
            ) { Text("Nochmal", fontWeight = FontWeight.ExtraBold, fontSize = 20.sp) }
            Spacer(Modifier.height(12.dp))
            OutlinedButton(
                onClick = onHome,
                modifier = Modifier.fillMaxWidth().height(56.dp),
                shape = RoundedCornerShape(20.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
            ) { Text("Zur Startseite", fontWeight = FontWeight.Bold, fontSize = 18.sp) }
        }

        Confetti(play = celebrate, modifier = Modifier.fillMaxSize())
    }
}
