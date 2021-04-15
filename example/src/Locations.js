import Location from './Location'
import { useLocations } from './sdk'

const Locations = ({ oid }) => {
    const { data, error } = useLocations(oid)

    return (
        <div className="locations">
            {error && <p>No locations: {error.message}</p>}
            {data ? data.map((it) => <Location key={it.id} data={it} />) : <p>Loading...</p>}
        </div>
    )
}

export default Locations
