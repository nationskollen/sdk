import Locations from './Locations'

const Nation = ({ data }) => {
    if (!data) {
        return <p>Nothing</p>
    }

    return (
        <div>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <p>{data.accent_color}</p>
            <img src={data.cover_img_src} />
            <div>
                <h2>Locations</h2>
                <Locations data={data.locations} />
            </div>
        </div>
    )
}

export default Nation
