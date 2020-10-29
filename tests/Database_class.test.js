const {Database} = require('../index')


describe('instantiating Database', () => {
  test('supports no constructor arguments', () => {
    expect.assertions(1)

    const database = new Database()

    expect(database).toStrictEqual(expect.any(Database))
  })
})
