import { User, Scopes } from '../responses'
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

        if (!user.hasOwnProperty('scope')) {
            throw new ApiError('Could not read token scope from login response')
        }

        this.user = user
        this.setUser(user)

        return user
    }

    public setUser(user?: User) {
        this.$connection.setUser(user)
    }
    
    public logout = async(): Promise<void> => {
        await this.$connection.request<User>(HttpMethod.POST, '/users/logout', 
            undefined,
            [Scopes.Admin, Scopes.Staff]
        )

        this.setUser(undefined)
        this.user = undefined
    }
}
