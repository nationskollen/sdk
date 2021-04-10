import { Service } from './sdk'

const api = Service({ development: true, useWebsockets: true })

async function printNations() {
    const nations = await api.nations.all()
    console.log(nations)
}

printNations()