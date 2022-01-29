/* eslint-disable max-lines */
const {withFreshDatabase, initDatabaseStatic, populate} =
  require('../tests/_setup')


describe('a Query object', () => {
  test('gets the results with get()', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      await expect(() => coll1.get()).rejects
        .toThrow('A document setup, or a function returning one, is required')

      const expected = [
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

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected)

      const res2 = await coll1.get((docId) => doc2Setup)

      expect(res2.docs.map((doc) => doc.data())).toStrictEqual(expected)
    },
  ))

  test('iters the results with iter()', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      await expect(() => coll1.iter().next()).rejects
        .toThrow('A document setup, collection setup, or a function returning one, is required')

      const expected = [
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

      const res1 = []

      for await (const ss of coll1.iter(doc2Setup)) {
        res1.push(ss.data())
      }

      expect(res1).toStrictEqual(expected)

      const res2 = []

      for await (const ss of coll1.iter((docId) => doc2Setup)) {
        res2.push(ss.data())
      }

      expect(res2).toStrictEqual(expected)
    },
  ))

  test('limits the results with limit()', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected = [
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
      ]

      expect(() => coll1.limit())
        .toThrow('Value for argument "limit" is not a valid integer.')

      const res1 = await coll1.limit(3).get(doc2Setup)

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected)
    },
  ))

  test('limits the results with limitToLast()', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected = [
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

      expect(() => coll1.limitToLast())
        .toThrow('Value for argument "limitToLast" is not a valid integer.')

      const res1 =
        await coll1.orderBy('int2', 'asc').limitToLast(3).get(doc2Setup)

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected)
    },
  ))

  test('orders the results with orderBy()', () => withFreshDatabase(
    3,
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

      const expected2 = [
        {
          int2: 4,
          str2: 'value4',
        },
        {
          int2: 3,
          str2: 'value3',
        },
        {
          int2: 2,
          str2: 'value2',
        },
        {
          int2: 1,
          str2: 'value1',
        },
        {
          int2: 0,
          str2: 'value0',
        },
      ]

      expect(() => coll1.orderBy())
        .toThrow('Value for argument "fieldPath" is not a valid field path. ' +
          'The path cannot be omitted.')

      const res1 =
        await coll1.orderBy('int2', 'asc').get(doc2Setup)

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected1)

      const res2 =
        await coll1.orderBy('int2', 'desc').get(doc2Setup)

      expect(res2.docs.map((doc) => doc.data())).toStrictEqual(expected2)
    },
  ))

  test('filters the results with select()', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected1 = [{}, {}, {}, {}, {}]

      const expected2 = [
        {
          str2: 'value0',
        },
        {
          str2: 'value1',
        },
        {
          str2: 'value2',
        },
        {
          str2: 'value3',
        },
        {
          str2: 'value4',
        },
      ]

      const expected3 = [
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

      const res1 = await coll1.select().get(doc2Setup)

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected1)

      const res2 = await coll1.select('str2').get(doc2Setup)

      expect(res2.docs.map((doc) => doc.data())).toStrictEqual(expected2)

      const res3 = await coll1.select('int2', 'str2').get(doc2Setup)

      expect(res3.docs.map((doc) => doc.data())).toStrictEqual(expected3)
    },
  ))

  test('does not support stream()', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    (database) => {
      const coll1 = database.structure.coll1.ref()

      expect(() => coll1.stream())
        .toThrow('Not implemented: use *iter()')
    },
  ))

  test('filters the results with where()', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 5)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const expected1 = [
        {
          int2: 3,
          str2: 'value3',
        },
        {
          int2: 4,
          str2: 'value4',
        },
      ]

      expect(() => coll1.where())
        .toThrow('Value for argument "fieldPath" is not a valid field path. ' +
          'The path cannot be omitted.')

      const res1 =
        await coll1.where('int2', '>', 2).get(doc2Setup)

      expect(res1.docs.map((doc) => doc.data())).toStrictEqual(expected1)
    },
  ))
})
