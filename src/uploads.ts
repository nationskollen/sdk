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
