import { BaseService } from './base'
import { Connection, HttpMethod } from '../connection'
import { User } from '../typings'

export class Users extends BaseService {
    constructor(connection: Connection) {
        super(connection)
    }

    public login = async (email: string, password: string): Promise<User> => {
        const user = await this.$connection.request<User>(
            HttpMethod.POST,
            '/users/login',
            {
                email,
                password,
            }
        )

        return user
    }

    public setToken(token: string) {
        this.$connection.setToken(token);
    }

}
