import { useApi } from './sdk/react'
import { useState, useEffect } from 'react'
import Nation from './Nation'

const Nations = () => {
    const api = useApi()
    const [nations, setNations] = useState([])

    useEffect(() => {
        api.nations
            .all()
            .then((data) => setNations(data))
            .catch((error) => console.error(error))
    }, [api.nations])

    return (
        <div>
            {nations.map((it) => (
                <Nation key={it.oid} data={it} />
            ))}
        </div>
    )
}

export default Nations
