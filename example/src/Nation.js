import Locations from './Locations'
import { useSDK, useUpload } from './sdk'

const Nation = ({ data }) => {
    const { api, user } = useSDK()
    const { result, onFileChanged, execute } = useUpload(api.nations.upload, [data.oid, 'cover'])

    if (!data) {
        return <p>Nothing</p>
    }

    const cover_img_src = result ? result.cover_img_src : data.cover_img_src

    return (
        <div className="nation">
            <div className="nation-cover" style={{ backgroundColor: data.accent_color }}>
                {cover_img_src && <img src={cover_img_src} className="nation-cover-image" />}
                <div className="nation-cover-content">
                    <div className="cover-right">
                        <h1>{data.name}</h1>
                        <p>{data.description}</p>
                        <p>
                            Default location: {data.default_location && data.default_location.name}
                        </p>
                    </div>
                    {user && user.oid === data.oid && (
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
