import Event from './Event'
import { useEvents } from './sdk'

function Events() {
    const { data, error } = useEvents()

    return (
        <div className="events">
            <h2>Today's events</h2>
            {error && <p>Could not load events</p>}
            <div className="events-content">
                {data && data.map((it) => <Event key={it.id} data={it} />)}
            </div>
        </div>
    )
}

export default Events