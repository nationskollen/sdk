import WS from 'jest-websocket-mock'
import { expect, test } from '@jest/globals'
import { Connection } from '../src/connection'
import { Subscriptions } from '../src/websockets'
import { ActivityLevels } from '../src/responses'
import { Activity } from '../src/services/activity'

const BASE_URL = 'ws://localhost:1235'
const server = new WS(BASE_URL, { jsonProtocol: true })
const connection = new Connection('', BASE_URL, true)

const MOCK_LOCATION_ID = 1
const MOCK_ACTIVITY_DATA = {
    type: Subscriptions.Activity,
    data: {
        oid: 400,
        location_id: MOCK_LOCATION_ID,
        activity_level: ActivityLevels.Low,
        estimated_people_count: 0,
    }
}

test('it can subscribe to activity changes', async () => {
    await server.connected

    const activity = new Activity(connection)
    const promise = new Promise((resolve) => activity.subscribe(MOCK_LOCATION_ID, (data) => {
        resolve(data)
    }))

    server.send(MOCK_ACTIVITY_DATA)

    const receivedData = await promise

    expect(receivedData).not.toBeNull()
    expect(receivedData).toStrictEqual({
        level: MOCK_ACTIVITY_DATA.data.activity_level,
        people: MOCK_ACTIVITY_DATA.data.estimated_people_count
    })
})

test('it only receives changes for the selected location', async () => {
    const callback = jest.fn()
    const anotherLocationId = 1337
    const activity = new Activity(connection)

    await server.connected

    activity.subscribe(anotherLocationId, callback)
    server.send(MOCK_ACTIVITY_DATA)
    server.send(MOCK_ACTIVITY_DATA)

    expect(callback).toBeCalledTimes(0)
})

test('it can unsubscribe from activity changes', async () => {
    const callback = jest.fn()
    const activity = new Activity(connection)

    await server.connected

    activity.subscribe(MOCK_LOCATION_ID, callback)
    server.send(MOCK_ACTIVITY_DATA)
    activity.unsubscribe(MOCK_LOCATION_ID, callback)
    server.send(MOCK_ACTIVITY_DATA)

    expect(callback).toBeCalledTimes(1)
})

test('it can subscribe multiple times to the same location', async () => {
    const callback = jest.fn()
    const callbackTwo = jest.fn()
    const callbackThree = jest.fn()
    const activity = new Activity(connection)

    await server.connected

    activity.subscribe(MOCK_LOCATION_ID, callback)
    activity.subscribe(MOCK_LOCATION_ID, callbackTwo)
    activity.subscribe(MOCK_LOCATION_ID, callbackThree)

    server.send(MOCK_ACTIVITY_DATA)

    expect(callback).toBeCalledTimes(1)
    expect(callbackTwo).toBeCalledTimes(1)
    expect(callbackThree).toBeCalledTimes(1)
})

test('it can subscribe multiple times to the same location with the same function', async () => {
    const callback = jest.fn()
    const activity = new Activity(connection)

    await server.connected

    activity.subscribe(MOCK_LOCATION_ID, callback)
    activity.subscribe(MOCK_LOCATION_ID, callback)
    activity.subscribe(MOCK_LOCATION_ID, callback)

    server.send(MOCK_ACTIVITY_DATA)

    expect(callback).toBeCalledTimes(3)
})

test('it does not crash when removing a non-existing callback', async () => {
    const noop = jest.fn()
    const activity = new Activity(connection)

    // Add a placeholder callback
    activity.subscribe(MOCK_LOCATION_ID, noop)
    expect(activity.getCallbacks()).toHaveProperty(MOCK_LOCATION_ID.toString())
    expect(activity.getCallbacks()[MOCK_LOCATION_ID][0]).toStrictEqual(noop)

    // Remove a non-existing callback and make sure that the placeholder
    // still exists
    activity.unsubscribe(MOCK_LOCATION_ID, jest.fn())
    expect(activity.getCallbacks()).toHaveProperty(MOCK_LOCATION_ID.toString())
    expect(activity.getCallbacks()[MOCK_LOCATION_ID][0]).toStrictEqual(noop)
})

test('it does not crash when removing a callback from non-existant location id', async () => {
    const activity = new Activity(connection)
    activity.unsubscribe(MOCK_LOCATION_ID, jest.fn())
})

test('it upates the alive property on disconnect', async () => {
    await server.connected
    expect(connection.getWebSocket()?.isAlive()).toBeTruthy()
    server.close()
    expect(connection.getWebSocket()?.isAlive()).toBeFalsy()
})
