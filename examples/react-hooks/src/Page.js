import SDK from './sdk'

const Page = () => {
    const api = SDK.useApi()

    return <p>{api.development && 'development boi'}</p>
}

export default Page
