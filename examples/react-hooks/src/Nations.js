import { useApi } from './sdk/react'
import { useState, useEffect } from 'react'

const Nations = () => {
    const api = useApi()
    const [nations, setNations] = useState([])

    useEffect(() => api.nations.all().then((data) => setNations(data)), [api.nations])

    return (
        <div>
            {nations.map((it) => (
                <p key={it.oid}>{it.name}</p>
            ))}
        </div>
    )
}

export default Nations
