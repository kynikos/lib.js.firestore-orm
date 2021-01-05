const {Timestamp} = require('./index')
const fields = require('./fields')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a document with all field types and default options', () => {
  test('is serialized correctly', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const schema = database.structure.coll2.manyFields.ref().schema
      const filteredFields = Object.values(fields).filter((field) => {
        return field.prototype && ![
          fields._FieldTimestamp,
          fields.Field,
          // TODO Can't test FieldDateTimeCreation so easily
          fields.FieldDateTimeCreation,
          // TODO Can't test FieldDateTimeLastUpdate so easily
          fields.FieldDateTimeLastUpdate,
        ].includes(field)
      }).map((field) => field.name)

      expect(Object.values(schema.fields)
        .map((field) => field.constructor.name))
        .toStrictEqual(filteredFields)

      const data = {
        array: ['a', 'b'],
        boolean: true,
        choice: 'venus',
        choiceArray: ['saturn', 'neptune'],
        collectionReference: database.structure.coll2.ref(),
        collectionReferenceArray: [database.structure.coll2.ref()],
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        date: new Date(Date.UTC(2020, 9, 31)),
        documentReference: database.structure.coll2.manyFields.ref(),
        documentReferenceArray: [database.structure.coll2.manyFields.ref()],
        fixed: 3.14,
        integer: 42,
        integerMap: {c: 3, k: 6},
        json: ['carbon', {name: 'oxygen', symbol: 'O'}, 'uranium'],
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        schema: {string: 'spring'},
        schemaArray: [{string: 'autumn'}, {string: 'winter'}],
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      }

      expect(Object.keys(data)).toHaveLength(filteredFields.length)

      const res = await schema.serialize(data)

      expect(res).toStrictEqual({
        array: ['a', 'b'],
        boolean: true,
        choice: 'venus',
        choiceArray: ['saturn', 'neptune'],
        collectionReference: 'coll2',
        collectionReferenceArray: ['coll2'],
        dateTime: Timestamp.fromDate(new Date(2020, 10, 12, 22, 30, 45)),
        date: Timestamp.fromDate(new Date(Date.UTC(2020, 9, 31))),
        documentReference:
          database.structure.coll2.manyFields.ref().__fsDocument,
        documentReferenceArray:
          [database.structure.coll2.manyFields.ref().__fsDocument],
        fixed: 314,
        integer: 42,
        integerMap: {c: 3, k: 6},
        json:
          JSON.stringify(['carbon', {name: 'oxygen', symbol: 'O'}, 'uranium']),
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        schema: {string: 'spring'},
        schemaArray: [{string: 'autumn'}, {string: 'winter'}],
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
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
