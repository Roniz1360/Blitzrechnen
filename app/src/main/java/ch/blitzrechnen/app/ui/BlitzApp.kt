package ch.blitzrechnen.app.ui

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import ch.blitzrechnen.app.model.ExerciseType
import ch.blitzrechnen.app.ui.screens.ExercisePickScreen
import ch.blitzrechnen.app.ui.screens.HomeScreen
import ch.blitzrechnen.app.ui.screens.LevelPickScreen
import ch.blitzrechnen.app.ui.screens.PassScreen
import ch.blitzrechnen.app.ui.screens.PlayScreen
import ch.blitzrechnen.app.ui.screens.ProfilesScreen
import ch.blitzrechnen.app.ui.screens.SettingsScreen
import ch.blitzrechnen.app.viewmodel.AppViewModel

@Composable
fun BlitzApp(vm: AppViewModel) {
    val nav = rememberNavController()
    val state by vm.state.collectAsState()

    NavHost(
        navController = nav,
        startDestination = "home",
        enterTransition = { fadeIn(tween(200)) },
        exitTransition = { fadeOut(tween(200)) }
    ) {
        composable("home") {
            HomeScreen(
                state = state,
                onPractice = { nav.navigate("pick/practice") },
                onTest = { nav.navigate("pick/test") },
                onPass = { nav.navigate("pass") },
                onProfiles = { nav.navigate("profiles") },
                onSettings = { nav.navigate("settings") },
                onAddProfile = { name, avatar -> vm.addProfile(name, avatar) }
            )
        }
        composable("profiles") {
            ProfilesScreen(
                state = state,
                onSelect = { vm.selectProfile(it); nav.popBackStack() },
                onAdd = { name, avatar -> vm.addProfile(name, avatar) },
                onDelete = { vm.deleteProfile(it) },
                onBack = { nav.popBackStack() }
            )
        }
        composable(
            "pick/{mode}",
            arguments = listOf(navArgument("mode") { type = NavType.StringType })
        ) { entry ->
            val mode = entry.arguments?.getString("mode") ?: "practice"
            ExercisePickScreen(
                state = state,
                mode = mode,
                onPick = { type -> nav.navigate("level/${type.id}/$mode") },
                onBack = { nav.popBackStack() }
            )
        }
        composable(
            "level/{typeId}/{mode}",
            arguments = listOf(
                navArgument("typeId") { type = NavType.StringType },
                navArgument("mode") { type = NavType.StringType }
            )
        ) { entry ->
            val type = ExerciseType.byId(entry.arguments?.getString("typeId") ?: "") ?: ExerciseType.PLUS
            val mode = entry.arguments?.getString("mode") ?: "practice"
            LevelPickScreen(
                type = type,
                mode = mode,
                onStart = { level -> nav.navigate("play/${type.id}/$mode/${level.ordinal}") },
                onBack = { nav.popBackStack() }
            )
        }
        composable(
            "play/{typeId}/{mode}/{level}",
            arguments = listOf(
                navArgument("typeId") { type = NavType.StringType },
                navArgument("mode") { type = NavType.StringType },
                navArgument("level") { type = NavType.IntType }
            )
        ) { entry ->
            val type = ExerciseType.byId(entry.arguments?.getString("typeId") ?: "") ?: ExerciseType.PLUS
            val mode = entry.arguments?.getString("mode") ?: "practice"
            val level = entry.arguments?.getInt("level") ?: 0
            PlayScreen(
                type = type,
                mode = mode,
                levelOrdinal = level,
                state = state,
                vm = vm,
                onHome = { nav.popBackStack("home", inclusive = false) },
                onAgain = {
                    nav.popBackStack()
                }
            )
        }
        composable("pass") {
            PassScreen(state = state, onBack = { nav.popBackStack() })
        }
        composable("settings") {
            SettingsScreen(
                state = state,
                onSound = { vm.setSound(it) },
                onTestSeconds = { vm.setTestSeconds(it) },
                onSetPin = { vm.setPin(it) },
                onClearPin = { vm.clearPin() },
                onBack = { nav.popBackStack() }
            )
        }
    }
}
