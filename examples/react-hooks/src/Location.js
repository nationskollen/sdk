import { useActivityLevel } from './sdk/react'

const Location = ({ data }) => {
    const activityLevel = useActivityLevel(data.id, data.activity_level)

    return (
        <div className="location">
            <p>ID: {data.id}</p>
            <p>Location ID: {data.nation_id}</p>
            <p>Location Name: {data.name}</p>
            <p>Description: {data.description}</p>
            <p>Address:{data.address}</p>
            <p>Max Capacity: {data.max_capacity}</p>
            <p>Activity level: {activityLevel}</p>
            <img src={data.cover_img_src} />
        </div>
    )
}

export default Location
