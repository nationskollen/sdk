import React from 'react'

const TYPES = {
    DEFAULT: 0,
    EXCEPTION: 1,
}

const toDayString = (hour) => {
    if (hour.type === TYPES.EXCEPTION) {
        return `${hour.day_special}, ${hour.day_special_date}`
    }

    switch (hour.day) {
        case 0:
            return 'Monday'
        case 1:
            return 'Tuesday'
        case 2:
            return 'Wednesday'
        case 3:
            return 'Thursday'
        case 4:
            return 'Friday'
        case 5:
            return 'Saturday'
        case 6:
            return 'Sunday'
        default:
            return 'Unknown'
    }
}

const OpeningHours = ({ data, title }) => {
    return (
        <div className="opening-hours">
            <h3>{title}</h3>
            {data.map((hour) => (
                <div className="opening-hour" key={hour.id}>
                    {hour.is_open ? (
                        <React.Fragment>
                            <p>
                                {toDayString(hour)}: {hour.open}-{hour.close}
                            </p>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <p>{toDayString(hour)}: Closed</p>
                        </React.Fragment>
                    )}
                </div>
            ))}
        </div>
    )
}

export default OpeningHours
