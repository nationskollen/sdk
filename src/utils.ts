export function removeCallback<T>(array: Array<T>, cb: T) {
    // Find and remove the callback from the callback array, mutating the original
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === cb) {
            array.splice(i, 1)
        }
    }
}

export function createUploadBody(data: Record<string, Blob>) {
    const form = new FormData()

    for (const [key, value] of Object.entries(data)) {
        if (!value) {
            continue
        }

        form.append(key, value)
    }

    return form
}
