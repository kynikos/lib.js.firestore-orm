const {Timestamp} = require('../src/index')
const {withFreshDatabase, initDatabaseStatic, populate} =
  require('../tests/_setup')


describe('a QuerySnapshot object', () => {
  test('has the same attributes as the native object', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const res = await coll1.get(doc2Setup)

      expect(res.empty).toBe(false)
      expect(res.readTime).toBeInstanceOf(Timestamp)
      expect(res.size).toBe(5)
    },
  ))

  test("lists results in the 'docs' property", () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected1 = [
        {
          int2: 0,
          str2: 'value0',
        },
        {
          int2: 1,
          str2: 'value1',
        },
        {
          int2: 2,
          str2: 'value2',
        },
        {
          int2: 3,
          str2: 'value3',
        },
        {
          int2: 4,
          str2: 'value4',
        },
      ]

      const res1 = await coll1.get(doc2Setup)

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected1)
    },
  ))

  test('loops results with forEach()', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected1 = [
        {
          int2: 0,
          str2: 'value0',
        },
        {
          int2: 1,
          str2: 'value1',
        },
        {
          int2: 2,
          str2: 'value2',
        },
        {
          int2: 3,
          str2: 'value3',
        },
        {
          int2: 4,
          str2: 'value4',
        },
      ]

      const res1 = await coll1.get(doc2Setup)

      const data = []

      res1.forEach((ss) => data.push(ss.data()))

      expect(data).toStrictEqual(expected1)
    },
  ))

  test('iters results with iter()', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected1 = [
        {
          int2: 0,
          str2: 'value0',
        },
        {
          int2: 1,
          str2: 'value1',
        },
        {
          int2: 2,
          str2: 'value2',
        },
        {
          int2: 3,
          str2: 'value3',
        },
        {
          int2: 4,
          str2: 'value4',
        },
      ]

      const res1 = await coll1.get(doc2Setup)

      const data = []

      for (const ss of res1.iter()) {
        data.push(ss.data())
      }

      expect(data).toStrictEqual(expected1)
    },
  ))
})
