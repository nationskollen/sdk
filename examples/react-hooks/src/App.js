// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import { Client } from './sdk'

const client = new Client('test')

function App() {
    return <div>{client.baseUrl}</div>
}

export default App
