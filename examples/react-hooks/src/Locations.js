import Location from './Location'

const Locations = ({ data }) => {
    if (!data) {
        return <p>No locations</p>
    }

    return (
        <div>
            {data.map((it) => (
                <Location key={it.id} data={it} />
            ))}
        </div>
    )
}

export default Locations
