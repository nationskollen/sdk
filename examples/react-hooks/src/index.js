import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'

// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import { Provider } from './sdk/react'

ReactDOM.render(
    <React.StrictMode>
        <Provider config={{ development: true, useWebSockets: true }}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
