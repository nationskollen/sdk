import Locations from './Locations'
import { useSDK, useUpload } from './sdk/react'

const Nation = ({ data }) => {
    const { api, user } = useSDK()
    const { onFileChanged, execute } = useUpload(api.nations.upload, [data.oid, 'cover'])

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
                    <div className="cover-right">
                        <h1>{data.name}</h1>
                        <p>{data.description}</p>
                    </div>
                    {user && (
                        <div className="cover-upload">
                            <input type="file" onChange={onFileChanged} />
                            <button onClick={execute}>Upload cover image</button>
                        </div>
                    )}
                </div>
            </div>
            <Locations oid={data.oid} />
        </div>
    )
}

export default Nation
