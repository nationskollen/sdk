import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()

global.console = {
  ...global.console,
  error: jest.fn() // console.error are ignored in tests
};
