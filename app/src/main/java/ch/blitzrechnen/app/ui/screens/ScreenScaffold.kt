package ch.blitzrechnen.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.ui.theme.Blitz

/** Einheitlicher Bildschirm-Rahmen mit farbiger Kopfzeile und Zurück-Knopf. */
@Composable
fun ScreenScaffold(
    title: String,
    onBack: () -> Unit,
    headerColor: Color = Blitz,
    content: @Composable () -> Unit
) {
    Column(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .background(headerColor)
                .statusBarsPadding()
                .padding(horizontal = 12.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(22.dp))
                    .background(Color.White.copy(alpha = 0.2f))
                    .clickable { onBack() },
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, "Zurück", tint = Color.White)
            }
            Spacer(Modifier.size(12.dp))
            Text(title, color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 24.sp)
        }
        Spacer(Modifier.size(12.dp))
        content()
    }
}
