package ch.blitzrechnen.app.ui.screens

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
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
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ch.blitzrechnen.app.data.AppState
import ch.blitzrechnen.app.generators.Generators
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.model.Level
import ch.blitzrechnen.app.model.Task
import ch.blitzrechnen.app.model.Visual
import ch.blitzrechnen.app.ui.components.ChartStrip
import ch.blitzrechnen.app.ui.components.Confetti
import ch.blitzrechnen.app.ui.components.HundredField
import ch.blitzrechnen.app.ui.components.NumberPad
import ch.blitzrechnen.app.ui.theme.Coral
import ch.blitzrechnen.app.ui.theme.Grass
import ch.blitzrechnen.app.viewmodel.AppViewModel
import kotlinx.coroutines.delay

private enum class Feedback { NONE, CORRECT, WRONG }

@Composable
fun PlayScreen(
    type: ExerciseType,
    mode: String,
    levelOrdinal: Int,
    state: AppState,
    vm: AppViewModel,
    onHome: () -> Unit,
    onAgain: () -> Unit
) {
    val isTest = mode == "test"
    val level = Level.fromOrdinalSafe(levelOrdinal)
    val total = if (isTest) state.testCount else 10
    val color = Color(type.colorArgb)
    val context = LocalContext.current
    val view = LocalView.current

    // Aufgaben einmalig erzeugen
    val tasks = remember(type, level, mode) {
        List(total) { Generators.next(type, level) }.toMutableList()
    }

    var index by remember { mutableIntStateOf(0) }
    var input by remember { mutableStateOf("") }
    var correct by remember { mutableIntStateOf(0) }
    var feedback by remember { mutableStateOf(Feedback.NONE) }
    var finished by remember { mutableStateOf(false) }
    var timeLeft by remember { mutableIntStateOf(state.testSeconds) }

    // Timer nur im Test
    if (isTest) {
        LaunchedEffect(Unit) {
            while (timeLeft > 0 && !finished) {
                delay(1000)
                timeLeft -= 1
            }
            if (!finished) finished = true
        }
    }

    fun playSound(ok: Boolean) {
        try {
            view.performHapticFeedback(
                if (ok) android.view.HapticFeedbackConstants.VIRTUAL_KEY
                else android.view.HapticFeedbackConstants.LONG_PRESS
            )
            if (state.soundOn) {
                val tg = android.media.ToneGenerator(android.media.AudioManager.STREAM_MUSIC, 70)
                tg.startTone(
                    if (ok) android.media.ToneGenerator.TONE_PROP_ACK
                    else android.media.ToneGenerator.TONE_PROP_NACK, 150
                )
            }
        } catch (_: Exception) { }
    }

    fun advance() {
        feedback = Feedback.NONE
        input = ""
        if (index + 1 >= total) finished = true else index += 1
    }

    fun submit() {
        val task = tasks[index]
        val value = input.toIntOrNull() ?: return
        if (value == task.answer) {
            correct += 1
            feedback = Feedback.CORRECT
            playSound(true)
        } else {
            feedback = Feedback.WRONG
            playSound(false)
        }
    }

    // Nach Feedback automatisch weiter
    LaunchedEffect(feedback, index) {
        if (feedback == Feedback.CORRECT) {
            delay(650)
            advance()
        } else if (feedback == Feedback.WRONG && isTest) {
            delay(900)
            advance()
        }
    }

    // Ergebnis speichern
    LaunchedEffect(finished) {
        if (finished) {
            val percent = if (total > 0) correct * 100 / total else 0
            if (isTest) {
                val earned = when {
                    percent >= 80 -> level.stars * 2
                    percent >= 50 -> level.stars
                    else -> 1
                }
                vm.recordTest(type.id, percent, level.stars, correct, earned)
            } else {
                vm.recordPractice(type.id, correct, correct)
            }
        }
    }

    if (finished) {
        ResultView(
            type = type, isTest = isTest, correct = correct, total = total,
            level = level, onHome = onHome, onAgain = onAgain
        )
        return
    }

    val task = tasks[index]
    Column(
        Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Kopf: Fortschritt + Timer
        Column(
            Modifier
                .fillMaxWidth()
                .background(color)
                .statusBarsPadding()
                .padding(16.dp)
        ) {
            Row(
                Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("${index + 1} / $total", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text(type.title, color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 18.sp)
                if (isTest) {
                    Box(
                        Modifier
                            .clip(RoundedCornerShape(14.dp))
                            .background(Color.White.copy(alpha = 0.25f))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) { Text("⏱ $timeLeft", color = Color.White, fontWeight = FontWeight.Bold) }
                } else {
                    Text("✓ $correct", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
            }
            Spacer(Modifier.height(10.dp))
            val progress by animateFloatAsState((index).toFloat() / total, label = "prog")
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier.fillMaxWidth().height(10.dp).clip(RoundedCornerShape(6.dp)),
                color = Color.White,
                trackColor = Color.White.copy(alpha = 0.3f)
            )
        }

        // Aufgabe
        Column(
            Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            task.visual?.let { v ->
                when (v) {
                    is Visual.HundredField -> HundredField(v.count, Modifier.widthIn(max = 320.dp))
                    is Visual.ChartStrip -> ChartStrip(v.values)
                }
                Spacer(Modifier.height(12.dp))
            }

            Text(
                task.question,
                fontSize = 34.sp,
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center,
                lineHeight = 42.sp,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(Modifier.height(16.dp))

            // Antwortfeld
            val boxColor by animateColorAsState(
                when (feedback) {
                    Feedback.CORRECT -> Grass
                    Feedback.WRONG -> Coral
                    Feedback.NONE -> MaterialTheme.colorScheme.surfaceVariant
                }, label = "box"
            )
            Box(
                Modifier
                    .widthIn(min = 160.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(boxColor)
                    .padding(horizontal = 32.dp, vertical = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = input.ifEmpty { "?" },
                    fontSize = 44.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = if (feedback == Feedback.NONE) MaterialTheme.colorScheme.onSurface else Color.White
                )
            }

            if (feedback == Feedback.WRONG && !isTest) {
                Spacer(Modifier.height(12.dp))
                Text(
                    "Fast! ${task.hint}",
                    color = Coral,
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp,
                    textAlign = TextAlign.Center
                )
            }
        }

        // Ziffernblock
        Box(Modifier.padding(16.dp)) {
            NumberPad(
                onDigit = { d ->
                    if (feedback != Feedback.CORRECT && input.length < 3) {
                        if (feedback == Feedback.WRONG) { feedback = Feedback.NONE; input = "" }
                        input += d.toString()
                    }
                },
                onDelete = {
                    if (feedback == Feedback.WRONG) { feedback = Feedback.NONE }
                    input = input.dropLast(1)
                },
                onOk = { if (feedback == Feedback.NONE) submit() },
                okEnabled = input.isNotEmpty() && feedback == Feedback.NONE
            )
        }
    }
}
