import React from 'react'
import { useLogin, useLogout, useUser} from './sdk'

const User = () => {
    const user = useUser()
    const login = useLogin()
    const logout = useLogout()

    return (
        <div className="user">
            <h1 className="logo user-fill">Nationskollen</h1>
            {user ? (
                <p>
                    Logged in with scope
                    <span className="scope">{user.scope}</span>
                    and token
                    <span className="token">{user.token}</span>
                    <button onClick={logout.execute}>Logout</button>
                </p>
            ) : (
                <div className="login-inputs">
                    <input
                        type="email"
                        placeholder="Email"
                        value={login.email}
                        onChange={(e) => login.setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={login.password}
                        onChange={(e) => login.setPassword(e.target.value)}
                    />
                    <button onClick={login.execute}>Login</button>
                </div>
            )}
            {login.error && (
                <div className="login-errors">
                    <p>Could not login: {login.error.message}</p>
                    {login.error.data &&
                        login.error.data.map((error, index) => (
                            <div key={index}>
                                <p>
                                    {error.field} - {error.rule}
                                </p>
                            </div>
                        ))}
                </div>
            )}
            {!login.result && <div className="user-fill"></div>}
        </div>
    )
}

export default User
