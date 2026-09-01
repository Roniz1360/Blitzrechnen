package ch.blitzrechnen.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.ui.theme.Grass
import ch.blitzrechnen.app.ui.theme.Sunny

@Composable
fun ExercisePickScreen(
    state: AppState,
    mode: String,
    onPick: (ExerciseType) -> Unit,
    onBack: () -> Unit
) {
    val isTest = mode == "test"
    val title = if (isTest) "Blitz-Test wählen" else "Übung wählen"
    val profile = state.activeProfile
    ScreenScaffold(title = title, onBack = onBack, headerColor = if (isTest) Grass else ch.blitzrechnen.app.ui.theme.Blitz) {
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(ExerciseType.all, key = { it.id }) { type ->
                val prog = profile?.forType(type.id)
                ExerciseTile(
                    type = type,
                    passed = prog?.passed == true,
                    bestPercent = prog?.bestPercent ?: 0,
                    isTest = isTest,
                    onClick = { onPick(type) }
                )
            }
        }
    }
}

@Composable
private fun ExerciseTile(
    type: ExerciseType,
    passed: Boolean,
    bestPercent: Int,
    isTest: Boolean,
    onClick: () -> Unit
) {
    val color = Color(type.colorArgb)
    Box(
        Modifier
            .fillMaxWidth()
            .aspectRatio(0.92f)
            .clip(RoundedCornerShape(26.dp))
            .background(color)
            .clickable { onClick() }
            .padding(14.dp)
    ) {
        if (passed) {
            Box(
                Modifier
                    .align(Alignment.TopEnd)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color.White)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) { Text("🏅", fontSize = 18.sp) }
        }
        Column(
            Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(type.emoji, fontSize = 46.sp)
            Column {
                Text(
                    type.title,
                    color = Color.White,
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 19.sp,
                    lineHeight = 22.sp
                )
                if (isTest && bestPercent > 0) {
                    Spacer(Modifier.size(4.dp))
                    Text("Bestwert: $bestPercent%", color = Color.White.copy(alpha = 0.9f), fontSize = 13.sp)
                }
            }
        }
    }
}
