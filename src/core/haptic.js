export function haptic() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate([20]);
    } catch {
      // Ignore unsupported embedded-webview vibration failures.
    }
  }
}
