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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.border
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.ui.theme.Blitz
import ch.blitzrechnen.app.ui.theme.Sunny

val AVATARS = listOf("🦊", "🐼", "🐯", "🦄", "🐸", "🐵", "🐰", "🐧", "🐨", "🦁", "🐹", "🐢")

@Composable
fun ProfilesScreen(
    state: AppState,
    onSelect: (String) -> Unit,
    onAdd: (String, String) -> Unit,
    onDelete: (String) -> Unit,
    onBack: () -> Unit
) {
    var showCreate by remember { mutableStateOf(false) }
    var pendingDelete by remember { mutableStateOf<String?>(null) }
    if (showCreate) {
        CreateProfileDialog(
            canCancel = true,
            onCreate = { name, avatar -> onAdd(name, avatar); showCreate = false },
            onDismiss = { showCreate = false }
        )
    }
    pendingDelete?.let { id ->
        ch.blitzrechnen.app.ui.components.VerifyPinDialog(
            expectedHash = state.parentPinHash,
            title = "Profil löschen – Eltern-PIN",
            onSuccess = { onDelete(id); pendingDelete = null },
            onCancel = { pendingDelete = null }
        )
    }

    fun requestDelete(id: String) {
        if (state.hasPin) pendingDelete = id else onDelete(id)
    }

    ScreenScaffold(title = "Wer bist du?", onBack = onBack) {
        LazyColumn(
            Modifier.fillMaxSize().padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(state.profiles, key = { it.id }) { p ->
                Card(
                    onClick = { onSelect(p.id) },
                    shape = RoundedCornerShape(22.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (p.id == state.activeProfileId)
                            MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(p.avatar, fontSize = 40.sp)
                        Spacer(Modifier.size(16.dp))
                        Column(Modifier.weight(1f)) {
                            Text(p.name, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp)
                            Text("⭐ ${p.totalStars}  ·  🏅 ${p.passCount}/10",
                                fontSize = 15.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                        }
                        IconButton(onClick = { requestDelete(p.id) }) {
                            Icon(Icons.Filled.Delete, "Löschen", tint = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }
            item {
                Card(
                    onClick = { showCreate = true },
                    shape = RoundedCornerShape(22.dp),
                    colors = CardDefaults.cardColors(containerColor = Sunny.copy(alpha = 0.25f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(Modifier.padding(20.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.Add, null, tint = Blitz, modifier = Modifier.size(32.dp))
                        Spacer(Modifier.size(12.dp))
                        Text("Neues Kind hinzufügen", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                }
            }
        }
    }
}

@OptIn(androidx.compose.foundation.layout.ExperimentalLayoutApi::class)
@Composable
fun CreateProfileDialog(
    canCancel: Boolean,
    onCreate: (String, String) -> Unit,
    onDismiss: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var avatar by remember { mutableStateOf(AVATARS.first()) }
    AlertDialog(
        onDismissRequest = { if (canCancel) onDismiss() },
        confirmButton = {
            TextButton(
                onClick = { onCreate(name, avatar) },
                enabled = name.isNotBlank()
            ) { Text("Los geht's!", fontWeight = FontWeight.Bold) }
        },
        dismissButton = if (canCancel) {
            { TextButton(onClick = onDismiss) { Text("Abbrechen") } }
        } else null,
        title = { Text("Neues Kind", fontWeight = FontWeight.ExtraBold) },
        text = {
            Column {
                OutlinedTextField(
                    value = name,
                    onValueChange = { if (it.length <= 12) name = it },
                    label = { Text("Dein Name") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done)
                )
                Spacer(Modifier.height(16.dp))
                Text("Wähle ein Tier:", fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                androidx.compose.foundation.layout.FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AVATARS.forEach { a ->
                        Box(
                            Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(
                                    if (a == avatar) Blitz.copy(alpha = 0.2f) else Color.Transparent
                                )
                                .border(
                                    width = if (a == avatar) 2.dp else 0.dp,
                                    color = if (a == avatar) Blitz else Color.Transparent,
                                    shape = CircleShape
                                )
                                .clickable { avatar = a },
                            contentAlignment = Alignment.Center
                        ) { Text(a, fontSize = 26.sp) }
                    }
                }
            }
        }
    )
}
