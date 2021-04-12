import Locations from './Locations'

const Nation = ({ data }) => {
    if (!data) {
        return <p>Nothing</p>
    }

    return (
        <div className="nation">
            <div className="nation-cover" style={{ backgroundColor: data.accent_color }}>
                {data.cover_img_src && (
                    <img src={data.cover_img_src} className="nation-cover-image" />
                )}
                <div className="nation-cover-content">
                    <h1>{data.name}</h1>
                    <p>{data.description}</p>
                </div>
            </div>
            <Locations data={data.locations} />
        </div>
    )
}

export default Nation
