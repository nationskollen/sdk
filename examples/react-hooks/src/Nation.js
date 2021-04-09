import { useApi } from './sdk/react'
import { useState, useEffect } from 'react'

const Nation = () => {
    const api = useApi()
    const [nation, setNation] = useState([])

    useEffect(() => api.nations.single(400).then((data) => setNation(data)), [api.nations])

    return (
        <div>
            <p>{nation.name}</p>
            <p>{nation.description}</p>
            <p>{nation.accent_color}</p>
            <img src={nation.cover_img_src} />
        </div>
    )
}

export default Nation
