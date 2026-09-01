package ch.blitzrechnen.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.ui.components.Mascot
import ch.blitzrechnen.app.ui.theme.Blitz
import ch.blitzrechnen.app.ui.theme.BlitzDark
import ch.blitzrechnen.app.ui.theme.Grass
import ch.blitzrechnen.app.ui.theme.Sunny

@Composable
fun HomeScreen(
    state: AppState,
    onPractice: () -> Unit,
    onTest: () -> Unit,
    onPass: () -> Unit,
    onProfiles: () -> Unit,
    onSettings: () -> Unit,
    onAddProfile: (String, String) -> Unit
) {
    val profile = state.activeProfile
    var showCreate by remember { mutableStateOf(false) }

    if (profile == null || showCreate) {
        CreateProfileDialog(
            canCancel = profile != null,
            onCreate = { name, avatar -> onAddProfile(name, avatar); showCreate = false },
            onDismiss = { showCreate = false }
        )
    }

    Column(
        Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(listOf(Blitz, BlitzDark))
            )
            .verticalScroll(rememberScrollState())
            .statusBarsPadding()
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Kopfzeile: Profil + Einstellungen
        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.18f))
                    .clickable { onProfiles() }
                    .padding(horizontal = 14.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(profile?.avatar ?: "🦊", fontSize = 26.sp)
                Spacer(Modifier.size(8.dp))
                Text(
                    profile?.name ?: "Kind",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
            }
            Icon(
                Icons.Filled.Settings,
                contentDescription = "Einstellungen",
                tint = Color.White,
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color.White.copy(alpha = 0.18f))
                    .clickable { onSettings() }
                    .padding(8.dp)
            )
        }

        Spacer(Modifier.height(10.dp))
        Mascot(message = "Hallo${profile?.name?.let { " $it" } ?: ""}! Bereit zum Blitzrechnen?", sizeDp = 110)
        Spacer(Modifier.height(6.dp))

        // Sterne + Pass-Zähler
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            StatChip("⭐", "${profile?.totalStars ?: 0}", "Sterne")
            StatChip("🏅", "${profile?.passCount ?: 0}/10", "Blitze")
        }

        Spacer(Modifier.height(20.dp))

        BigActionCard(
            title = "Üben",
            subtitle = "In Ruhe trainieren",
            emoji = "✏️",
            color = Sunny,
            textColor = BlitzDark,
            onClick = onPractice
        )
        Spacer(Modifier.height(14.dp))
        BigActionCard(
            title = "Blitz-Test",
            subtitle = "Auf Zeit rechnen",
            emoji = "⏱️",
            color = Grass,
            textColor = Color.White,
            onClick = onTest
        )
        Spacer(Modifier.height(14.dp))
        BigActionCard(
            title = "Mein Blitz-Pass",
            subtitle = "Was ich schon kann",
            emoji = "🏆",
            color = Color.White,
            textColor = BlitzDark,
            onClick = onPass
        )
        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun StatChip(emoji: String, value: String, label: String) {
    Row(
        Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White.copy(alpha = 0.16f))
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(emoji, fontSize = 22.sp)
        Spacer(Modifier.size(6.dp))
        Text(value, color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
        Spacer(Modifier.size(6.dp))
        Text(label, color = Color.White.copy(alpha = 0.85f), fontSize = 14.sp)
    }
}

@Composable
private fun BigActionCard(
    title: String,
    subtitle: String,
    emoji: String,
    color: Color,
    textColor: Color,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        colors = CardDefaults.cardColors(containerColor = color),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(textColor.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) { Text(emoji, fontSize = 34.sp) }
            Spacer(Modifier.size(16.dp))
            Column {
                Text(title, color = textColor, fontWeight = FontWeight.ExtraBold, fontSize = 26.sp)
                Text(subtitle, color = textColor.copy(alpha = 0.8f), fontSize = 16.sp)
            }
        }
    }
}
