import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { User } from '../typings'

export class Auth extends BaseService {
    public user?: User

    constructor(connection: Connection) {
        super(connection)
    }

    public login = async (email: string, password: string): Promise<User> => {
        const user = await this.$connection.request<User>(HttpMethod.POST, '/users/login', {
            email,
            password,
        })

        if (user.hasOwnProperty('token')) {
            this.user = user
            this.setToken(user.token)
        } else {
            console.error('Could not read token from response')
        }

        return user
    }

    public setToken(token: string) {
        // TODO: Fetch information about user via token so that we can set user?
        this.$connection.setToken(token)
    }
}
