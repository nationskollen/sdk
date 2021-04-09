import Locations from './Locations'

const Nation = ({ data }) => {
    if (!data) {
        return <p>Nothing</p>
    }

    return (
        <div style={{backgroundColor:"#0be881", paddingLeft: "1rem"}}>
            <h1>{data.name}</h1>
            <p>{data.description}</p>
            <p>{data.accent_color}</p>
            <img src={data.cover_img_src} />
            <div style={{backgroundColor: "#d2dae2", margin: "2rem"}}>
                <h2>Locations</h2>
                <Locations data={data.locations} />
            </div>
        </div>
    )
}

export default Nation
