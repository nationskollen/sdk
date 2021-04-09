import Nations from './Nations'

// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import SDK from './sdk'

function App() {
    return (
        <SDK.Provider development={true}>
            <Nations />
        </SDK.Provider>
    )
}

export default App
