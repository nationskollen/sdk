import Event from './Event'
import { useEvents } from './sdk'

function Events() {
    // amount can also be a state variable if you so wish
    // Replace null with an oid to only fetch events for that nation
    const { data, error, pagination, size, setSize } = useEvents(null, { amount: 9 })

    return (
        <div className="events">
            <div className="events-header">
                <h2>Today's events</h2>
                {pagination && (
                    <div className="pagination">
                        <button onClick={() => setSize(size - 1)} disabled={size === 1}>
                            Previous size
                        </button>
                        <button
                            onClick={() => setSize(size + 1)}
                            disabled={size === pagination.last_page}
                        >
                            Next size
                        </button>
                    </div>
                )}
            </div>
            <div className="events-content">
                {error && <p>Could not load events: {error.message}</p>}
                {data && data.map((it) => <Event key={it.id} data={it} />)}
            </div>
        </div>
    )
}

export default Events
