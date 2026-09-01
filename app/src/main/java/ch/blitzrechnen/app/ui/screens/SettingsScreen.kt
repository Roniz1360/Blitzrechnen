package ch.blitzrechnen.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.data.AppState

@Composable
fun SettingsScreen(
    state: AppState,
    onSound: (Boolean) -> Unit,
    onTestSeconds: (Int) -> Unit,
    onBack: () -> Unit
) {
    ScreenScaffold(title = "Einstellungen", onBack = onBack) {
        Column(
            Modifier.fillMaxSize().padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    Modifier.padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(Modifier.weight(1f)) {
                        Text("Töne", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("Rückmeldung mit Klang", fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    }
                    Switch(checked = state.soundOn, onCheckedChange = onSound)
                }
            }

            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(20.dp)) {
                    Text("Zeit für den Blitz-Test", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(Modifier.height(12.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        listOf(30, 60, 90, 120).forEach { sec ->
                            FilterChip(
                                selected = state.testSeconds == sec,
                                onClick = { onTestSeconds(sec) },
                                label = { Text("$sec s", fontWeight = FontWeight.Bold) }
                            )
                        }
                    }
                }
            }

            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(20.dp)) {
                    Text("Über Zahlenblitz", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(Modifier.height(6.dp))
                    Text(
                        "Kopfrechnen für die 2. Klasse (Zahlenraum bis 100), " +
                            "passend zum Lehrplan 21. Alle Daten bleiben offline auf dem Gerät.",
                        fontSize = 15.sp, lineHeight = 20.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                    )
                }
            }
        }
    }
}
