package ch.blitzrechnen.app.data

import java.security.MessageDigest

/**
 * Wandelt eine PIN in einen SHA-256-Hash um (Hex).
 * So wird die PIN nie im Klartext gespeichert.
 */
fun pinHash(pin: String): String {
    val bytes = MessageDigest.getInstance("SHA-256").digest(pin.trim().toByteArray())
    return bytes.joinToString("") { "%02x".format(it) }
}

/** Prüft, ob die eingegebene PIN zum gespeicherten Hash passt. */
fun checkPin(pin: String, storedHash: String?): Boolean =
    storedHash != null && pinHash(pin) == storedHash
