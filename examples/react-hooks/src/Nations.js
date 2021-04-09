import SDK from './sdk'
import { useState } from 'react'

const Nations = () => {
    const api = SDK.useApi()
    const [nations, setNations] = useState([])

    if (nations.length === 0) {
        api.nations.all().then((data) => setNations(data))
        return <p>No nations</p>
    }

    return (
        <div>
            {nations.map((it) => (
                <p key={it.oid}>{it.name}</p>
            ))}
        </div>
    )
}

export default Nations
