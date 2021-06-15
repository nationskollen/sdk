import React from 'react'
import { Environment, Constants, Provider, Consumer } from '../src'
import { render, screen } from '@testing-library/react'

function renderProvider(environment: Environment) {
    const hostnameId = 'hostname'
    const httpsId = 'https'
    const environmentId = 'environment'

    render(
        <Provider config={{ environment }}>
            <Consumer>
                {({ https, hostname, environment }) => (
                    <>
                        <p data-testid={environmentId}>{environment}</p>
                        {https && <p data-testid={httpsId} />}
                        <p data-testid={hostnameId}>{hostname}</p>
                    </>
                )}
            </Consumer>
        </Provider>
    )

    return {
        hostnameId,
        httpsId,
        environmentId,
    }
}

test('it sets the hostname correctly during testing', () => {
    const { hostnameId, environmentId, httpsId } = renderProvider('testing')
    expect(screen.getByTestId(hostnameId)).toHaveTextContent(Constants.HOSTNAMES.testing)
    expect(screen.getByTestId(environmentId)).toHaveTextContent('testing')
    expect(screen.queryByTestId(httpsId)).not.toBeInTheDocument()
})

test('it sets the hostname correctly during staging', () => {
    const { hostnameId, environmentId, httpsId } = renderProvider('staging')
    expect(screen.getByTestId(hostnameId)).toHaveTextContent(Constants.HOSTNAMES.staging)
    expect(screen.getByTestId(environmentId)).toHaveTextContent('staging')
    expect(screen.getByTestId(httpsId)).toBeInTheDocument()
})

test('it sets the hostname correctly during production', () => {
    const { hostnameId, environmentId, httpsId } = renderProvider('production')
    expect(screen.getByTestId(hostnameId)).toHaveTextContent(Constants.HOSTNAMES.production)
    expect(screen.getByTestId(environmentId)).toHaveTextContent('production')
    expect(screen.getByTestId(httpsId)).toBeInTheDocument()
})
