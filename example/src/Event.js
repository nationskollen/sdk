import { useNation } from './sdk/react'

function Event({ data }) {
    const { data: nation } = useNation(data.nation_id)

    return (
        <div className="event">
            {data.cover_img_src && <img src={data.cover_img_src} alt="dunno" />}
            <h3>{data.name}</h3>
            <h3>{nation ? nation.name : 'Loading nation name'}</h3>
            <p>{data.description}</p>
            <p>
                {data.occurs_at} - {data.ends_at}
            </p>
        </div>
    )
}

export default Event
