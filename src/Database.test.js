/* eslint-disable max-lines */
const {withFreshDatabase, initDatabaseStatic, populate} =
  require('../tests/_setup')


describe('a Database object', () => {
  test('references collections with collection()', () => withFreshDatabase(
    11,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc2('Abc').create({
        int2: 345,
        str2: 'blaalb',
      })

      await database.structure.coll1.doc2('Abc').coll3.doc('doc5').create({
        int: 678,
        str: 'something',
      })

      await database.structure.coll1.doc2('Abc').coll3.doc('doc5').coll51
        .doc('doc51').create({
          int: 656,
          str: 'else',
        })

      expect(() => database.collection()).toThrow('Invalid collection path')
      expect(() => database.collection(35))
        .toThrow('relPathSegments[0].split is not a function or its return ' +
          'value is not iterable')

      const docA = database.collection('coll1').ref().doc('Abc')
      const docAsnapshot = await docA.ref().get()

      expect(docAsnapshot.data()).toStrictEqual({
        int2: 345,
        str2: 'blaalb',
      })

      expect(() => database.collection('/coll1'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => database.collection('coll1/'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => database.collection('/coll1/'))
        .toThrow('Unexpected collection or document id: ')

      const doc5 = database.collection('coll1/Abc/coll3').ref().doc('doc5')
      const doc5snapshot = await doc5.snapshot()

      expect(doc5snapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      const doc51 = database.collection('coll1/Abc/coll3/doc5/coll51').ref()
        .doc('doc51')
      const doc51snapshot = await doc51.snapshot()

      expect(doc51snapshot.data()).toStrictEqual({
        int: 656,
        str: 'else',
      })

      expect(() => {
        return database.collection('/coll1/Abc/coll3/doc5/coll51').doc('doc51')
      }).toThrow('Unexpected collection or document id: ')

      expect(() => {
        return database.collection('coll1/Abc/coll3/doc5/coll51/').doc('doc51')
      }).toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => {
        return database.collection('/coll1/Abc/coll3/doc5/coll51/').doc('doc51')
      }).toThrow('Unexpected collection or document id: ')
    },
  ))

  test('references documents with doc()', () => withFreshDatabase(
    10,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc2('Abc').create({
        int2: 345,
        str2: 'blaalb',
      })

      await database.structure.coll1.doc2('Abc').coll3.doc('doc5').create({
        int: 678,
        str: 'something',
      })

      expect(() => database.doc()).toThrow('Invalid document path; use ' +
        'docAutoId() to auto-generate a document ID')
      expect(() => database.doc(35)).toThrow('relPathSegments[0].split is ' +
        'not a function or its return value is not iterable')

      const doc5 = database.doc('coll1/Abc')
      const doc5snapshot = await doc5.ref().get()

      expect(doc5snapshot.data()).toStrictEqual({
        int2: 345,
        str2: 'blaalb',
      })

      expect(() => database.doc('/coll1/doc1'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => database.doc('coll1/doc1/'))
        .toThrow('setups is not iterable')

      expect(() => database.doc('/coll1/doc1/'))
        .toThrow('Unexpected collection or document id: ')

      const doc5b = database.doc('coll1/Abc/coll3/doc5')
      const doc5bsnapshot = await doc5b.snapshot()

      expect(doc5bsnapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      expect(() => database.doc('/coll1/Abc/coll3/doc5'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => database.doc('coll1/Abc/coll3/doc5/'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => database.doc('/coll1/Abc/coll3/doc5/'))
        .toThrow('Unexpected collection or document id: ')
    },
  ))

  test('stores and retrieves userData', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    (database) => {
      expect(database.userData).toStrictEqual({
        fruit: 'mandarin',
      })
    },
  ))

  test('merges queries with merge()', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      await populate(database, 20)

      const coll1 = database.structure.coll1.ref()
      const doc2Setup = coll1.documentSetups[1]

      const res1 = []

      for await (const snapshot of database.merge([
        coll1.where('int2', '<', 4),
        coll1.where('int2', '>', 15),
        coll1.where('int2', 'in', [2, 6, 16, 18]),
      ], null, doc2Setup)) {
        res1.push(snapshot.data())
      }

      expect(res1).toStrictEqual([
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
          int2: 16,
          str2: 'value16',
        },
        {
          int2: 17,
          str2: 'value17',
        },
        {
          int2: 18,
          str2: 'value18',
        },
        {
          int2: 19,
          str2: 'value19',
        },
        {
          int2: 16,
          str2: 'value16',
        },
        {
          int2: 18,
          str2: 'value18',
        },
        {
          int2: 2,
          str2: 'value2',
        },
        {
          int2: 6,
          str2: 'value6',
        },
      ])

      const res2 = []

      for await (const snapshot of database.merge([
        coll1.where('int2', '<', 4),
        coll1.where('int2', '>', 15),
        coll1.where('int2', 'in', [2, 6, 16, 18]),
      ], 'str2', doc2Setup)) {
        res2.push(snapshot.data())
      }

      expect(res2).toStrictEqual([
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
          int2: 16,
          str2: 'value16',
        },
        {
          int2: 17,
          str2: 'value17',
        },
        {
          int2: 18,
          str2: 'value18',
        },
        {
          int2: 19,
          str2: 'value19',
        },
        {
          int2: 6,
          str2: 'value6',
        },
      ])

      const res3 = []

      for await (const snapshot of database.merge([
        coll1.where('int2', '<', 4),
        coll1.where('int2', '>', 15),
        coll1.where('int2', 'in', [2, 6, 16, 18]),
      ], (ss) => ss.get('str2'), doc2Setup)) {
        res3.push(snapshot.data())
      }

      expect(res3).toStrictEqual([
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
          int2: 16,
          str2: 'value16',
        },
        {
          int2: 17,
          str2: 'value17',
        },
        {
          int2: 18,
          str2: 'value18',
        },
        {
          int2: 19,
          str2: 'value19',
        },
        {
          int2: 6,
          str2: 'value6',
        },
      ])
    },
  ))
})
