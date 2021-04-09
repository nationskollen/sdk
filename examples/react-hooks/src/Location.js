import { useApi } from './sdk/react'
import { useState, useEffect } from 'react'

const Location = ({ data }) => {
    const api = useApi()
    const [activity, setActivity] = useState(data.activity_level)

    useEffect(() => {
        api.activity.subscribe((message) => {
            if (message.oid === data.nation_id && message.location === data.id) {
                setActivity(message.activity)
            }
        })
    }, [api.activity, data.id, data.nation_id])

    return (
        <div>
            <p>ID: {data.id}</p>
            <p>Location ID: {data.nation_id}</p>
            <p>Location Name: {data.name}</p>
            <p>Description: {data.description}</p>
            <p>Address:{data.address}</p>
            <p>Max Capacity: {data.max_capacity}</p>
            <p>Activity level: {activity}</p>
            <img src={data.cover_img_src} />
        </div>
    )
}

export default Location
