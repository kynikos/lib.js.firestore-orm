const {WriteResults, Timestamp} = require('../src/index')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a WriteResults object', () => {
  test('is returned when creating a document', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const melon = database.structure.coll1.doc2('melon').ref()

      const res = await melon.create({
        int2: 753,
        str2: 'ripe',
      })

      expect(res).toBeInstanceOf(WriteResults)
      expect(res.writeTime).toBeInstanceOf(Timestamp)
      expect(res.serializedData).toStrictEqual({
        int2: 753,
        str2: 'ripe',
      })
    },
  ))

  test('is returned when deleting a document', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const carrot = database.structure.coll1.doc2('carrot').ref()

      await carrot.create({
        int2: 159,
        str2: 'blue',
      })

      const res = await carrot.delete()

      expect(res).toBeInstanceOf(WriteResults)
      expect(res.writeTime).toBeInstanceOf(Timestamp)
      expect(res.serializedData).toBeNull()
    },
  ))

  test('is returned when setting a document', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      const res = await doc.set({
        array: ['a', 'b'],
        boolean: true,
        date: new Date(Date.UTC(2020, 10, 31)),
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      }, {merge: false})

      expect(res).toBeInstanceOf(WriteResults)
      expect(res.writeTime).toBeInstanceOf(Timestamp)
      expect(res.serializedData).toStrictEqual({
        array: ['a', 'b'],
        boolean: true,
        date: Timestamp.fromDate(new Date(Date.UTC(2020, 10, 31))),
        dateTime: Timestamp.fromDate(new Date(2020, 10, 12, 22, 30, 45)),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('is returned when updating a document', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      await doc.create({
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })

      const res = await doc.update({
        array: ['a', 'b'],
        boolean: true,
        date: new Date(Date.UTC(2010, 5, 6)),
        integer: 2,
        string: 'giraffe',
      })

      expect(res).toBeInstanceOf(WriteResults)
      expect(res.writeTime).toBeInstanceOf(Timestamp)
      expect(res.serializedData).toStrictEqual({
        array: ['a', 'b'],
        boolean: true,
        date: Timestamp.fromDate(new Date(Date.UTC(2010, 5, 6))),
        integer: 2,
        string: 'giraffe',
      })
    },
  ))

  // TODO: What's isEqual() even supposed to do?
  test.todo('can be compared to some data with isEqual()')
})
