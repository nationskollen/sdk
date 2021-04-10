import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'

// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import { Connection } from './sdk'
import { Provider } from './sdk/react'

// Create a connection to the API and optionally the websocket server.
// This MUST be provided to the provider via the 'connection' prop.
const connection = new Connection({ development: true, useWebSockets: true })

ReactDOM.render(
    <React.StrictMode>
        <Provider connection={connection}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
