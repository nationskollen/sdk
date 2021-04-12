interface Data {
    [key: string]: unknown
}

export class Cache {
    private $data: Data

    constructor() {
        this.$data = {}
    }

    public exists(key: string | undefined) {
        if (!key) {
            return false
        }

        return this.$data.hasOwnProperty(key)
    }

    public get(key: string) {
        return this.$data[key]
    }

    public save(key: string, data: unknown) {
        this.$data[key] = data
    }

    public remove(key: string) {
        if (this.exists(key)) {
            delete this.$data[key]
        }
    }

    public clear() {
        this.$data = {}
    }
}
