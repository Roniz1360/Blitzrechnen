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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.LinearProgressIndicator
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
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.ui.theme.Grass
import ch.blitzrechnen.app.ui.theme.Sunny

@Composable
fun PassScreen(state: AppState, onBack: () -> Unit) {
    val profile = state.activeProfile
    val passCount = profile?.passCount ?: 0
    ScreenScaffold(title = "Mein Blitz-Pass", onBack = onBack, headerColor = Sunny) {
        LazyColumn(
            Modifier.fillMaxSize().padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (passCount == 10) Grass else MaterialTheme.colorScheme.primaryContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(Modifier.padding(20.dp)) {
                        Text(
                            if (passCount == 10) "🏆 Blitzrechen-Pass geschafft!" else "Dein Fortschritt",
                            fontWeight = FontWeight.ExtraBold, fontSize = 22.sp,
                            color = if (passCount == 10) Color.White else MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "$passCount von 10 Blitzen bestanden",
                            fontSize = 16.sp,
                            color = if (passCount == 10) Color.White else MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Spacer(Modifier.height(12.dp))
                        LinearProgressIndicator(
                            progress = { passCount / 10f },
                            modifier = Modifier.fillMaxWidth().height(14.dp).clip(RoundedCornerShape(8.dp)),
                            color = if (passCount == 10) Color.White else Grass,
                            trackColor = Color.White.copy(alpha = 0.5f)
                        )
                    }
                }
            }
            items(ExerciseType.all, key = { it.id }) { type ->
                val p = profile?.forType(type.id)
                PassRow(
                    type = type,
                    practiced = p?.practiced == true,
                    tested = p?.tested == true,
                    passed = p?.passed == true,
                    best = p?.bestPercent ?: 0
                )
            }
            item { Spacer(Modifier.height(12.dp)) }
        }
    }
}

@Composable
private fun PassRow(type: ExerciseType, practiced: Boolean, tested: Boolean, passed: Boolean, best: Int) {
    val color = Color(type.colorArgb)
    Card(
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                Modifier.size(52.dp).clip(RoundedCornerShape(16.dp)).background(color.copy(alpha = 0.18f)),
                contentAlignment = Alignment.Center
            ) { Text(type.emoji, fontSize = 28.sp) }
            Spacer(Modifier.size(14.dp))
            Column(Modifier.weight(1f)) {
                Text(type.title, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Badge("geübt", practiced)
                    Badge("getestet", tested)
                    if (best > 0) Text("$best%", fontSize = 13.sp, fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                }
            }
            Text(if (passed) "🏅" else "⚪", fontSize = 30.sp)
        }
    }
}

@Composable
private fun Badge(label: String, on: Boolean) {
    Text(
        (if (on) "✓ " else "· ") + label,
        fontSize = 13.sp,
        fontWeight = FontWeight.Medium,
        color = if (on) Grass else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.45f)
    )
}
