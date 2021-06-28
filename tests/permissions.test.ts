import { expect, test } from '@jest/globals'
import { usePermissionTypes } from '../src/hooks'
// import Permission from '../src/services/permissions'

test('it can fetch permission types using route', () => {
    const permissionTypes = usePermissionTypes()
    expect(permissionTypes)
})
