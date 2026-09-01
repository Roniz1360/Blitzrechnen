package ch.blitzrechnen.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat

// Fröhliche, kräftige Farbpalette für Kinder
val Blitz = Color(0xFF6D3BF5)      // Violett (Primär)
val BlitzDark = Color(0xFF4C1FBF)
val Sunny = Color(0xFFFFD23F)      // Sonnengelb (Blitz-Farbe)
val Grass = Color(0xFF10B981)      // Grün (richtig)
val Coral = Color(0xFFEF6C6C)      // Koralle (falsch, sanft)
val Sky = Color(0xFF3B82F6)
val Cream = Color(0xFFFFF8EE)      // Warmer Hintergrund
val InkText = Color(0xFF2A2140)

private val LightColors = lightColorScheme(
    primary = Blitz,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFE9DEFF),
    onPrimaryContainer = BlitzDark,
    secondary = Sky,
    onSecondary = Color.White,
    tertiary = Sunny,
    onTertiary = InkText,
    background = Cream,
    onBackground = InkText,
    surface = Color.White,
    onSurface = InkText,
    surfaceVariant = Color(0xFFF1ECFB),
    error = Coral,
    onError = Color.White
)

private val DarkColors = darkColorScheme(
    primary = Color(0xFFB79BFF),
    onPrimary = Color(0xFF1E0F3D),
    background = Color(0xFF15121F),
    onBackground = Color(0xFFEDE7FB),
    surface = Color(0xFF221C33),
    onSurface = Color(0xFFEDE7FB),
    tertiary = Sunny,
    error = Coral
)

private val KidTypography = Typography(
    displayLarge = TextStyle(fontWeight = FontWeight.ExtraBold, fontSize = 56.sp),
    headlineLarge = TextStyle(fontWeight = FontWeight.ExtraBold, fontSize = 34.sp),
    headlineMedium = TextStyle(fontWeight = FontWeight.Bold, fontSize = 26.sp),
    titleLarge = TextStyle(fontWeight = FontWeight.Bold, fontSize = 22.sp),
    bodyLarge = TextStyle(fontWeight = FontWeight.Medium, fontSize = 18.sp),
    labelLarge = TextStyle(fontWeight = FontWeight.Bold, fontSize = 18.sp)
)

@Composable
fun BlitzTheme(darkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
    val colors = if (darkTheme) DarkColors else LightColors
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = Blitz.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }
    MaterialTheme(colorScheme = colors, typography = KidTypography, content = content)
}
