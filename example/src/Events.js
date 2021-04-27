import Event from './Event'
import EventDescription from './EventDescription'
import { useEvents } from './sdk'
import { useState } from 'react'

function Events() {
    // If you want regular pagination, use this instead and pass in the
    // 'page' variable to the event query params. I.e.
    // const [page, setPage] = useState(1)
    // const { ... } = useEvents(null, { page, amount: 9 })

    // amount can also be a state variable if you so wish
    // Replace null with an oid to only fetch events for that nation
    const { data, error, pagination, size, setSize } = useEvents(null, { amount: 9 })
    const [showDescription, setShowDescription] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const updateEventDescription = (eventData, nationName) => {
        setSelectedEvent({ eventData, nationName })
        setShowDescription(true)
    }

    return (
        <div className="events">
            <div className="events-header">
                <h2>Today's events</h2>
                {pagination && (
                    <div className="pagination">
                        <button onClick={() => setSize(size - 1)} disabled={size === 1}>
                            Previous page
                        </button>
                        <button
                            onClick={() => setSize(size + 1)}
                            disabled={size === pagination.last_page}
                        >
                            Next page
                        </button>
                    </div>
                )}
            </div>
            <div className="events-content">
                {error && <p>Could not load events: {error.message}</p>}
                {data &&
                    data.map((it) => (
                        <Event key={it.id} data={it} onClick={updateEventDescription} />
                    ))}
            </div>
            {showDescription && <EventDescription {...selectedEvent} />}
        </div>
    )
}

export default Events
