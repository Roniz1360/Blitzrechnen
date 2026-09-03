package ch.blitzrechnen.app.data

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper

/** Findet die zugehörige Activity zu einem Compose-Context (für Play Games nötig). */
fun Context.findActivity(): Activity? {
    var ctx: Context? = this
    while (ctx is ContextWrapper) {
        if (ctx is Activity) return ctx
        ctx = ctx.baseContext
    }
    return null
}
