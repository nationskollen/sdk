import { Connection } from '../connection'

export class BaseService {
    protected $connection: Connection

    constructor(connection: Connection) {
        this.$connection = connection
    }
}
