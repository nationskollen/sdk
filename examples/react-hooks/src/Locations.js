import Location from './Location'
import { useApi } from './sdk/react'
import { useAsync } from 'react-async-hook'

const Locations = ({ oid }) => {
    const api = useApi()
    const { loading, result, error } = useAsync(api.locations.all, [oid])

    return (
        <div className="locations">
            {error && <p>No locations: {error.message}</p>}
            {loading && <p>Loading...</p>}
            {result && result.map((it) => <Location key={it.id} data={it} />)}
        </div>
    )
}

export default Locations
