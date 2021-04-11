export function removeCallback<T>(array: Array<T>, cb: T) {
    // Find and remove the callback from the callback array, mutating the original
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === cb) {
            array.splice(i, 1)
        }
    }
}
