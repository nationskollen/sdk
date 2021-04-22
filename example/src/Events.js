import { useState } from 'react'
import Event from './Event'
import { useEvents } from './sdk'

function Events() {
    const [page, setPage] = useState(1)

    // amount can also be a state variable if you so wish
    const { data, error, pagination } = useEvents({ page, amount: 10 })

    return (
        <div className="events">
            <div className="events-header">
                <h2>Today's events</h2>
                {pagination && (
                    <div className="pagination">
                        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                            Previous page
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === pagination.last_page}
                        >
                            Next page
                        </button>
                    </div>
                )}
            </div>
            <div className="events-content">
                {error && <p>Could not load events</p>}
                {data && data.map((it) => <Event key={it.id} data={it} />)}
            </div>
        </div>
    )
}

export default Events
