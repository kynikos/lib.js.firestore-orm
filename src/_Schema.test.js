const {Timestamp} = require('./index')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a document with all field types and default options', () => {
  test('is serialized correctly', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const res = await database.structure.coll2.manyFields.ref().schema
        .serialize({
          arr1: ['a', 'b'],
          bool1: true,
          date1: new Date(Date.UTC(2020, 9, 31)),
          ts1: new Date(2020, 10, 12, 22, 30, 45),
          int1: 42,
          intmap1: {c: 3, k: 6},
          map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
          str1: 'astring',
          strarr1: ['almond', 'pecan'],
          strmap1: {s: 'duck', t: 'notduck'},
        })

      expect(res).toStrictEqual({
        arr1: ['a', 'b'],
        bool1: true,
        date1: Timestamp.fromDate(new Date(Date.UTC(2020, 9, 31))),
        ts1: Timestamp.fromDate(new Date(2020, 10, 12, 22, 30, 45)),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'astring',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test.todo(`serialize(data, options = {}) {
    const {
      ignoreAllMissingFields = false,
      onlyTheseFields = false,
      ignoreExtraneousFields = false,
      ...fieldOptions
    } = options`)

  test.todo(`deserialize(data, options = {}) {
    const {
      fillWithDefaults = false,
      onlyTheseFields = false,
      ignoreExtraneousFields = false,
      ...fieldOptions
    } = options`)

  test.todo('deserializeField(fieldName, value, data, fieldOptions)')
})
