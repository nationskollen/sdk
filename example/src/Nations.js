import Nation from './Nation'
import { useNations } from './sdk'

const Nations = () => {
    const { data, error } = useNations()

    return (
        <div className="nations">
            {error && <p>Could not fetch nations: {error.message}</p>}
            {data ? data.map((it) => <Nation key={it.oid} data={it} />) : <p>Loading...</p>}
        </div>
    )
}

export default Nations
