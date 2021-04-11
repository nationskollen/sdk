import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'

// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import { Client } from './sdk'
import { Provider } from './sdk/react'

// Create a new API client and optionally setup a websocket connection.
// This MUST be provided to the provider via the 'client' prop.
const client = Client({ development: true, useWebSockets: true })

ReactDOM.render(
    <React.StrictMode>
        <Provider client={client}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
