package ch.blitzrechnen.app.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.layout.RowScope
import ch.blitzrechnen.app.ui.theme.Grass

/**
 * Grosser, kinderfreundlicher Ziffernblock mit 0–9, Löschen und OK.
 */
@Composable
fun NumberPad(
    onDigit: (Int) -> Unit,
    onDelete: () -> Unit,
    onOk: () -> Unit,
    okEnabled: Boolean,
    modifier: Modifier = Modifier
) {
    Column(modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        val rows = listOf(listOf(1, 2, 3), listOf(4, 5, 6), listOf(7, 8, 9))
        rows.forEach { row ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                row.forEach { d -> DigitButton(d, onDigit) }
            }
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            PadButton(
                label = "⌫",
                container = MaterialTheme.colorScheme.surfaceVariant,
                content = MaterialTheme.colorScheme.onSurface,
                onClick = onDelete
            )
            DigitButton(0, onDigit)
            PadButton(
                label = "OK",
                container = if (okEnabled) Grass else Color(0xFFBFCBD6),
                content = Color.White,
                enabled = okEnabled,
                onClick = onOk
            )
        }
    }
}

@Composable
private fun RowScope.DigitButton(d: Int, onDigit: (Int) -> Unit) {
    PadButton(
        label = d.toString(),
        container = MaterialTheme.colorScheme.primaryContainer,
        content = MaterialTheme.colorScheme.onPrimaryContainer,
        onClick = { onDigit(d) }
    )
}

@Composable
private fun RowScope.PadButton(
    label: String,
    container: Color,
    content: Color,
    enabled: Boolean = true,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        shape = RoundedCornerShape(20.dp),
        colors = ButtonDefaults.buttonColors(containerColor = container, contentColor = content),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp),
        modifier = Modifier
            .weight(1f)
            .aspectRatio(1.4f)
            .padding(0.dp)
    ) {
        Text(label, fontSize = 30.sp, fontWeight = FontWeight.ExtraBold)
    }
}
