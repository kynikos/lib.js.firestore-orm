const {Timestamp, DocumentSchema} = require('./index')
const fields = require('./fields')
const {FieldInteger, FieldString} = fields
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a document schema', () => {
  test('requires unique field names', () => {
    expect.assertions(2)

    expect(() => {
      return new DocumentSchema(
        new FieldString('aaa'),
        new FieldInteger('bbb'),
        new FieldString('aaa'),
      )
    }).toThrow('Duplicated field name: aaa')

    expect(() => {
      return new DocumentSchema(
        new FieldString('aaa'),
        new FieldInteger('aaa'),
        new FieldString('bbb'),
      )
    }).toThrow('Duplicated field name: aaa')
  })

  test('correctly serializes data', () => {
    expect.assertions(5)

    const schema = new DocumentSchema(
      new FieldString('string1'),
      new FieldInteger('integer1'),
      new FieldString('string2'),
      new FieldInteger('integer2'),
    )

    const ser1 = schema.serialize({
      string1: 'New York',
      integer1: 10,
    })

    // Writing a document checks required fields thanks to 'writeMode'
    // Simply serializing from the schema has writeMode=false, so no check
    // is done
    expect(ser1).toStrictEqual({
      string1: 'New York',
      integer1: 10,
    })

    const ser2 = schema.serialize({
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    })

    expect(ser2).toStrictEqual({
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    })

    const ser3 = schema.serialize({
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    }, {onlyTheseFields: ['string1', 'integer2']})

    expect(ser3).toStrictEqual({
      string1: 'New York',
      integer2: 27,
    })

    expect(() => {
      schema.serialize({
        string1: 'New York',
        integer1: 10,
        string3: 'Singapore',
      })
    }).toThrow('Extraneous field names: string3')

    const ser4 = schema.serialize({
      string1: 'New York',
      integer1: 10,
      string3: 'Singapore',
    }, {ignoreExtraneousFields: true})

    expect(ser4).toStrictEqual({
      string1: 'New York',
      integer1: 10,
    })
  })

  test('correctly deserializes data', () => {
    expect.assertions(5)

    const schema = new DocumentSchema(
      new FieldString('string1'),
      new FieldInteger('integer1'),
      new FieldString('string2'),
      new FieldInteger('integer2'),
    )

    const ser1 = schema.deserialize({
      string1: 'New York',
      integer1: 10,
    })

    expect(ser1).toStrictEqual({
      string1: 'New York',
      integer1: 10,
    })

    const ser2 = schema.deserialize({
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    })

    expect(ser2).toStrictEqual({
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    })

    const ser3 = schema.deserialize({
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    }, {onlyTheseFields: ['string1', 'integer2']})

    expect(ser3).toStrictEqual({
      string1: 'New York',
      integer2: 27,
    })

    expect(() => {
      schema.deserialize({
        string1: 'New York',
        integer1: 10,
        string3: 'Singapore',
      })
    }).toThrow('Extraneous field names: string3')

    const ser4 = schema.deserialize({
      string1: 'New York',
      integer1: 10,
      string3: 'Singapore',
    }, {ignoreExtraneousFields: true})

    expect(ser4).toStrictEqual({
      string1: 'New York',
      integer1: 10,
    })
  })

  test('correctly deserializes a single field', () => {
    expect.assertions(2)

    const schema = new DocumentSchema(
      new FieldString('string1'),
      new FieldInteger('integer1'),
      new FieldString('string2'),
      new FieldInteger('integer2'),
    )

    expect(() => {
      schema.deserializeField('string3', 'Singapore', {
        string1: 'New York',
        integer1: 10,
      })
    }).toThrow("Cannot read property '__deserialize' of undefined")

    const ser1 = schema.deserializeField('string2', 'Sydney', {
      string1: 'New York',
      integer1: 10,
      string2: 'Sydney',
      integer2: 27,
    })

    expect(ser1).toStrictEqual('Sydney')
  })

  test('throws an error when not all required fields are given values to serialize', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.allFields.ref()

      // Writing a document checks required fields thanks to 'writeMode'
      // Simply serializing from the schema has writeMode=false, so no check
      // is done
      await expect(() => doc.create({
        integer: 42,
        string: 'astring',
      })).rejects.toThrow('Field array requires a value, but none was given')
    },
  ))

  test('serializes correctly a document with all field types and default options', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const schema = database.structure.coll2.allFields.ref().schema
      const filteredFields = Object.values(fields).filter((field) => {
        return field.prototype && ![
          fields._FieldTimestamp,
          fields.FieldArrayMixin,
          fields.FieldMapMixin,
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
        dateTime: new Date(2021, 11, 9, 20, 1, 13),
        dateTimeArray: [
          new Date(2019, 3, 15, 8, 9, 33),
          new Date(2020, 10, 12, 22, 30, 45),
        ],
        date: new Date(Date.UTC(2020, 7, 23)),
        dateArray: [
          new Date(Date.UTC(2019, 5, 2)),
          new Date(Date.UTC(2020, 9, 31)),
        ],
        documentReference: database.structure.coll2.allFields.ref(),
        documentReferenceArray: [database.structure.coll2.allFields.ref()],
        fixed: 3.14,
        integer: 42,
        integerArray: [11, 13, 17],
        integerMap: {c: 3, k: 6},
        json: ['carbon', {name: 'oxygen', symbol: 'O'}, 'uranium'],
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        schema: {string: 'spring'},
        schemaArray: [{string: 'autumn'}, {string: 'winter'}],
        schemaMap: {aaa: {string: 'broccoli'}, bbb: {string: 'cauliflower'}},
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
        dateTime: Timestamp.fromDate(new Date(2021, 11, 9, 20, 1, 13)),
        dateTimeArray: [
          Timestamp.fromDate(new Date(2019, 3, 15, 8, 9, 33)),
          Timestamp.fromDate(new Date(2020, 10, 12, 22, 30, 45)),
        ],
        date: Timestamp.fromDate(new Date(Date.UTC(2020, 7, 23))),
        dateArray: [
          Timestamp.fromDate(new Date(Date.UTC(2019, 5, 2))),
          Timestamp.fromDate(new Date(Date.UTC(2020, 9, 31))),
        ],
        documentReference:
          database.structure.coll2.allFields.ref().__fsDocument,
        documentReferenceArray:
          [database.structure.coll2.allFields.ref().__fsDocument],
        fixed: 314,
        integer: 42,
        integerArray: [11, 13, 17],
        integerMap: {c: 3, k: 6},
        json:
          JSON.stringify(['carbon', {name: 'oxygen', symbol: 'O'}, 'uranium']),
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        schema: {string: 'spring'},
        schemaArray: [{string: 'autumn'}, {string: 'winter'}],
        schemaMap: {aaa: {string: 'broccoli'}, bbb: {string: 'cauliflower'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })
    },
  ))
})
