const Individual = ({ data }) => {
    return (
        <div className="individual">
            {data.profile_img_src && <img src={data.profile_img_src} className="individual-img" />}
            <div className="individual-content">
                <h2 className="individual-name">{data.name}</h2>
                {data.role && <h4 className="individual-role">{data.role}</h4>}
                {data.description && <p>{data.description}</p>}
            </div>
        </div>
    )
}

export default Individual
