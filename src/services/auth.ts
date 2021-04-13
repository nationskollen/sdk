import { User } from '../typings'
import { ApiError } from '../errors'
import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'

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

        if (!user.hasOwnProperty('token')) {
            throw new ApiError('Could not read token from login response')
        }

        this.user = user
        this.setToken(user.token)

        return user
    }

    public setToken(token: string) {
        // TODO: Fetch information about user via token so that we can set user?
        this.$connection.setToken(token)
    }
}
