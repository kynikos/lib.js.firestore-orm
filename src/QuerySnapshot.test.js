const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('querying the database', () => {
  test('gets a document', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc1.create({
        int1: 42,
        str1: 'astring',
      })

      const doc = await database.structure.coll1.doc1.snapshot()

      expect(doc.exists).toBe(true)

      expect(doc.data()).toStrictEqual({
        int1: 42,
        str1: 'astring',
      })
    },
  ))

  test.todo('querySnapshot.docs()')

  test.todo('querySnapshot.forEach(callback, thisArgopt)')

  test.todo('querySnapshot.iter()')
})
