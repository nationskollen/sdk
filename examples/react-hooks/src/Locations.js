const Locations = ({ data }) => {
    if (!data) {
        return <p>No locations</p>
    }

    return (
        <div>
            {data.map((it) => {
                return (
                    <div>
                        <p>Location ID: {it.nation_id}</p>
                        <p>Location Name: {it.name}</p>
                        <p>Description: {it.description}</p>
                        <p>Address:{it.address}</p>
                        <p>Max Capacity: {it.max_capacity}</p>
                        <p>Activity Level: {it.activity_level}</p>
                        <img src={it.cover_img_src} />
                    </div>
                )
            })}
        </div>
    )
}

export default Locations
