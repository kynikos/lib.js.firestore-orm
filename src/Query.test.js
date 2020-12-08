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

      const doc = await database.structure.coll1.doc1.ref().get()

      expect(doc.exists).toBe(true)

      expect(doc.data()).toStrictEqual({
        int1: 42,
        str1: 'astring',
      })
    },
  ))

  test.todo('query.get(chooseSetup)')

  test.todo('query.iter(chooseSetup)')

  test.todo('query.limit(limit)')

  test.todo('query.limitToLast(limit)')

  test.todo('query.orderBy(fieldPath, directionStr)')

  test.todo('query.select(...fieldPaths)')

  test.todo('query.stream()')

  test.todo('query.where(fieldPath, opStr, value)')
})
