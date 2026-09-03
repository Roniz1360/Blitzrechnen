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
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.data.findActivity
import ch.blitzrechnen.app.ui.components.SetPinDialog
import ch.blitzrechnen.app.ui.components.VerifyPinDialog
import ch.blitzrechnen.app.viewmodel.CloudUi

@Composable
fun SettingsScreen(
    state: AppState,
    cloud: CloudUi,
    onSound: (Boolean) -> Unit,
    onTestSeconds: (Int) -> Unit,
    onSetPin: (String) -> Unit,
    onClearPin: () -> Unit,
    onCloudRefresh: (android.app.Activity) -> Unit,
    onCloudSignIn: (android.app.Activity) -> Unit,
    onCloudSync: (android.app.Activity) -> Unit,
    onBack: () -> Unit
) {
    val activity = LocalContext.current.findActivity()
    LaunchedEffect(cloud.configured) {
        if (cloud.configured && activity != null) onCloudRefresh(activity)
    }
    // Zugangssperre: bei gesetzter PIN erst entsperren
    var unlocked by remember { mutableStateOf(!state.hasPin) }
    if (!unlocked) {
        VerifyPinDialog(
            expectedHash = state.parentPinHash,
            title = "Einstellungen – Eltern-PIN",
            onSuccess = { unlocked = true },
            onCancel = onBack
        )
    }

    var showSetPin by remember { mutableStateOf(false) }
    var showRemovePin by remember { mutableStateOf(false) }
    if (showSetPin) {
        SetPinDialog(
            onSet = { onSetPin(it); showSetPin = false },
            onCancel = { showSetPin = false }
        )
    }
    if (showRemovePin) {
        VerifyPinDialog(
            expectedHash = state.parentPinHash,
            title = "PIN entfernen",
            onSuccess = { onClearPin(); showRemovePin = false },
            onCancel = { showRemovePin = false }
        )
    }

    ScreenScaffold(title = "Einstellungen", onBack = onBack) {
        if (!unlocked) return@ScreenScaffold
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

            // Eltern-Bereich: PIN
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(20.dp)) {
                    Text("Eltern-PIN 🔒", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(Modifier.height(4.dp))
                    Text(
                        if (state.hasPin)
                            "Aktiv. Schützt das Löschen von Profilen und die Einstellungen."
                        else
                            "Aus. Richte eine PIN ein, damit Kinder keine Profile löschen können.",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    Spacer(Modifier.height(12.dp))
                    if (state.hasPin) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            OutlinedButton(onClick = { showSetPin = true }) { Text("PIN ändern") }
                            OutlinedButton(
                                onClick = { showRemovePin = true },
                                colors = ButtonDefaults.outlinedButtonColors(
                                    contentColor = MaterialTheme.colorScheme.error
                                )
                            ) { Text("PIN entfernen") }
                        }
                    } else {
                        Button(
                            onClick = { showSetPin = true },
                            shape = RoundedCornerShape(14.dp)
                        ) { Text("PIN einrichten", fontWeight = FontWeight.Bold) }
                    }
                }
            }

            // Cloud-Sync (mehrere Geräte, gleiches Google-Konto)
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(Modifier.padding(20.dp)) {
                    Text("Cloud-Sync ☁️", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(Modifier.height(4.dp))
                    if (!cloud.configured) {
                        Text(
                            "Noch nicht eingerichtet. Sobald die App-ID von Play Games " +
                                "hinterlegt ist, kann der Fortschritt über mehrere Geräte " +
                                "mit demselben Google-Konto geteilt werden.",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    } else {
                        Text(
                            if (cloud.signedIn) "Angemeldet bei Play Games."
                            else "Melde dich an, um den Fortschritt geräteübergreifend zu sichern.",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                        Spacer(Modifier.height(12.dp))
                        if (cloud.busy) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                CircularProgressIndicator(Modifier.height(22.dp).padding(end = 12.dp))
                                Text("Bitte warten …", fontWeight = FontWeight.Medium)
                            }
                        } else {
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                if (!cloud.signedIn) {
                                    Button(
                                        onClick = { activity?.let(onCloudSignIn) },
                                        shape = RoundedCornerShape(14.dp)
                                    ) { Text("Anmelden", fontWeight = FontWeight.Bold) }
                                }
                                Button(
                                    onClick = { activity?.let(onCloudSync) },
                                    shape = RoundedCornerShape(14.dp)
                                ) { Text("Jetzt synchronisieren", fontWeight = FontWeight.Bold) }
                            }
                        }
                        cloud.message?.let {
                            Spacer(Modifier.height(8.dp))
                            Text(it, fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary)
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
