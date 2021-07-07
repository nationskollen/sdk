import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()

global.console = {
    ...global.console,
    info: jest.fn(), // console.error are ignored in tests
    error: jest.fn(), // console.error are ignored in tests
}
