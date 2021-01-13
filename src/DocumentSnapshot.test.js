const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a DocumentSnapshot object', () => {
  test('gets its data with the data() method', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc1.create({
        int1: 42,
        str1: 'astring',
      })

      const snapshot = await database.structure.coll1.doc1.ref().get()

      expect(snapshot.data()).toStrictEqual({
        int1: 42,
        str1: 'astring',
      })
    },
  ))

  test("gets a field's data with the get() method", () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc1.create({
        int1: 42,
        str1: 'astring',
      })

      const snapshot = await database.structure.coll1.doc1.ref().get()

      expect(snapshot.get('int1')).toStrictEqual(42)
      expect(snapshot.get('str1')).toStrictEqual('astring')
    },
  ))

  test('can be extended with the snapshotFunctions option', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc1.create({
        int1: 42,
        str1: 'astring',
      })

      const snapshot = await database.structure.coll1.doc1.ref().get()

      expect(snapshot.schema.multiply(3)).toStrictEqual(126)
    },
  ))
})
