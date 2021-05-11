import Individual from './Individual'
import { useIndividuals } from './sdk'

const Individuals = ({ oid }) => {
    const { data, error } = useIndividuals(oid)

    return (
        <div className="individual-collection">
            {error && <p>No locations: {error.message}</p>}
            {data ? data.map((it) => <Individual key={it.id} data={it} />) : <p>Loading...</p>}
        </div>
    )
}

export default Individuals
