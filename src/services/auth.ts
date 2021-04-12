import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { User } from '../typings'

export class Auth extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public login = async (email: string, password: string): Promise<User> => {
        const user = await this.$connection.request<User>(HttpMethod.POST, '/users/login', {
            email,
            password,
        })

        if (user.hasOwnProperty('token')) {
            this.setToken(user.token)
        } else {
            console.error('Could not read token from login response')
        }

        return user
    }

    public setToken(token: string) {
        this.$connection.setToken(token)
    }
}
