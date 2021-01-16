const {FieldString} = require('./index')


describe('a Field object', () => {
  test('requires simple field names', () => {
    expect.assertions(3)

    expect(() => new FieldString('a.b'))
      .toThrow('Field names must match /^[a-zA-Z_][0-9a-zA-Z_]*$/')

    expect(() => new FieldString('2a'))
      .toThrow('Field names must match /^[a-zA-Z_][0-9a-zA-Z_]*$/')

    expect(() => new FieldString('a-b'))
      .toThrow('Field names must match /^[a-zA-Z_][0-9a-zA-Z_]*$/')
  })

  test.todo('Also test all common and specific field options, and all explicitly thrown Errors')
})
