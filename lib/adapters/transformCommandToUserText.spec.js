const { transformForUser, reverseCommandFromUser } = require('./transformCommandToUserText')

describe('#transformCommandToUserText', () => {
  test('test transformFromUser', () => {
    const transformedValue = reverseCommandFromUser('new_user_enthusiasm')
    expect(transformedValue).toEqual('newUserEnthusiasm')
  })
   test('test transformForUser', () => {
    const transformedValue = transformForUser('command')
    expect(transformedValue).toEqual('CO STORY')
  })
})