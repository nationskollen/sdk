import { useEventDescription } from './sdk'

function EventDescription({ eventData, nationName }) {
    const { error, data } = useEventDescription(eventData.id)

    return (
        <div className="event-description">
            {error && <p>Could not load event</p>}
            {data && (
                <div>
                    {data.cover_img_src && <img src={eventData.cover_img_src} alt="dunno" />}
                    <h3>{nationName}</h3>
                    <p>{eventData.occurs_at} - {eventData.ends_at}</p>
                    <p>{data.long_description}</p>
                    <p>Skapad: {data.created_at}</p>
                    <p>Uppdaterad: {data.updated_at}</p>
                </div>
            )}
        </div>
    )
}

export default EventDescription
