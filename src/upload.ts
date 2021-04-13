export function createUploadBody(data: Record<string, Blob>) {
    const form = new FormData()

    for (const [key, value] of Object.entries(data)) {
        form.append(key, value)
    }

    return form
}
