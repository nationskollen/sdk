import React from 'react'
import { useLogin } from './sdk/react'

const User = () => {
    const login = useLogin()

    return (
        <div className="user">
            {login.result ? (
                <p>
                    Logged in with scope
                    <span className="scope">{login.result.scope}</span>
                    and token
                    <span className="token">{login.result.token}</span>
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
                        login.error.data.map((error) => (
                            <div>
                                <p>
                                    {error.field} - {error.rule}
                                </p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}

export default User
