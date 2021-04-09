import Nation from './Nation'
import Nations from './Nations'

// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import { Provider } from './sdk/react'

function App() {
    return (
        <Provider development={true}>
            <Nations />
            <Nation />
        </Provider>
    )
}

export default App
