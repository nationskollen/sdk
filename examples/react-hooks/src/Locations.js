const Locations = ({ data }) => {
    if (!data) {
        return <p>No locations</p>
    }

    return (
        <div>
            {data.map((it) => {
                return (
                    <div>
                        <p>{it.nation_id}</p>
                        <p>{it.name}</p>
                        <p>{it.description}</p>
                        <p>{it.address}</p>
                        <p>{it.max_capacity}</p>
                        <p>{it.activity_level}</p>
                        <img src={it.cover_img_src} />
                    </div>
                )
            })}
        </div>
    )
}

export default Locations
