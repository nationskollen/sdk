import { useAuthentication } from './sdk/react'

const User = () => {
    const { error, user, authenticated } = useAuthentication('admin@vdala.se', 'vdalaadmin')

    return (
        <div className="user">
            {error && <p>Could not login: {error.message}</p>}
            {/* If authenticated is true, user will be set */}
            {authenticated && (
                <p>
                    Logged in with scope
                    <span className="scope">{user.scope}</span>
                    and token
                    <span className="token">{user.token}</span>
                </p>
            )}
        </div>
    )
}

export default User
