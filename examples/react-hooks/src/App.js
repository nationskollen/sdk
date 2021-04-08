// ./sdk is equivalent with @dsp-krabby/sdk
// We need to copy it into this example on compile,
// since react can not read files from outside src/.
import SDK from './sdk'
import Page from './Page'

function App() {
    return (
        <SDK.Provider development={true}>
            <Page />
        </SDK.Provider>
    )
}

export default App
