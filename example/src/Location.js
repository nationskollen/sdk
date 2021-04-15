import OpeningHours from './OpeningHours'
import { useActivityLevel } from './sdk'

const Location = ({ data }) => {
    const activityLevel = useActivityLevel(data.id, data.activity_level)

    return (
        <div className="location">
            <div className="location-content">
                <h2>{data.name}</h2>
                <p>{data.description}</p>
                <p>Address: {data.address}</p>
                <p>Max Capacity: {data.max_capacity}</p>
                <p>Activity level: {activityLevel}</p>
                <img src={data.cover_img_src} />
            </div>
            <div className="location-opening-hours">
                <OpeningHours data={data.opening_hours} title="Regular opening hours" />
                <OpeningHours data={data.opening_hour_exceptions} title="Exceptions" />
            </div>
        </div>
    )
}

export default Location
