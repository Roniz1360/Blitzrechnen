package ch.blitzrechnen.app.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import ch.blitzrechnen.app.data.checkPin
import ch.blitzrechnen.app.ui.theme.Coral

private fun String.onlyDigits(max: Int = 4) = filter { it.isDigit() }.take(max)

/** Fragt die Eltern-PIN ab und ruft [onSuccess] bei richtiger Eingabe. */
@Composable
fun VerifyPinDialog(
    expectedHash: String?,
    onSuccess: () -> Unit,
    onCancel: () -> Unit,
    title: String = "Eltern-PIN eingeben"
) {
    var pin by remember { mutableStateOf("") }
    var error by remember { mutableStateOf(false) }
    AlertDialog(
        onDismissRequest = onCancel,
        title = { Text(title, fontWeight = FontWeight.ExtraBold) },
        text = {
            Column {
                Text("Bitte die 4-stellige PIN eingeben.")
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(
                    value = pin,
                    onValueChange = { pin = it.onlyDigits(); error = false },
                    singleLine = true,
                    isError = error,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.NumberPassword,
                        imeAction = ImeAction.Done
                    )
                )
                if (error) {
                    Spacer(Modifier.height(6.dp))
                    Text("Falsche PIN", color = Coral, fontWeight = FontWeight.Bold)
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = { if (checkPin(pin, expectedHash)) onSuccess() else error = true },
                enabled = pin.length == 4
            ) { Text("OK", fontWeight = FontWeight.Bold) }
        },
        dismissButton = { TextButton(onClick = onCancel) { Text("Abbrechen") } }
    )
}

/** Legt eine neue PIN fest (zweimal eingeben). */
@Composable
fun SetPinDialog(
    onSet: (String) -> Unit,
    onCancel: () -> Unit
) {
    var pin by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    val mismatch = confirm.length == 4 && pin != confirm
    AlertDialog(
        onDismissRequest = onCancel,
        title = { Text("Eltern-PIN festlegen", fontWeight = FontWeight.ExtraBold) },
        text = {
            Column {
                Text("Wähle eine 4-stellige PIN. Damit schützt du das Löschen von Profilen und die Einstellungen.")
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(
                    value = pin,
                    onValueChange = { pin = it.onlyDigits() },
                    label = { Text("Neue PIN") },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword)
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = confirm,
                    onValueChange = { confirm = it.onlyDigits() },
                    label = { Text("PIN wiederholen") },
                    singleLine = true,
                    isError = mismatch,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.NumberPassword,
                        imeAction = ImeAction.Done
                    )
                )
                if (mismatch) {
                    Spacer(Modifier.height(6.dp))
                    Text("Die PINs stimmen nicht überein", color = Coral, fontWeight = FontWeight.Bold)
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = { onSet(pin) },
                enabled = pin.length == 4 && pin == confirm
            ) { Text("Speichern", fontWeight = FontWeight.Bold) }
        },
        dismissButton = { TextButton(onClick = onCancel) { Text("Abbrechen") } }
    )
}
