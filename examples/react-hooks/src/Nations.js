import Nation from './Nation'
import { useApi } from './sdk/react'
import { useAsync } from 'react-async-hook'

const Nations = () => {
    const api = useApi()
    const { loading, result, error, execute } = useAsync(api.nations.all, [])

    return (
        <div className='nations'>
            <div className='actions'>
                <button onClick={() => execute({ invalidate: true })}>Invalidate</button>
                <button onClick={() => execute({ invalidate: false })}>Cache</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Could not fetch nations: {error.message}</p>}
            {result && result.map((it) => <Nation key={it.oid} data={it} />)}
        </div>
    )
}

export default Nations
