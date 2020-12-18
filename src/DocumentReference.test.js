/* eslint-disable max-lines */
const {Timestamp, DocumentSnapshot} = require('./index')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('within a DocumentReference object', () => {
  test('collection() correctly refers to collections', () => withFreshDatabase(
    7,
    initDatabaseStatic,
    async (database) => {
      const docAbc = database.structure.coll1.doc2('Abc').ref()

      await docAbc.create({
        int2: 345,
        str2: 'blaalb',
      })

      await docAbc.collection('coll3').ref().doc('doc5').create({
        int: 678,
        str: 'something',
      })

      await docAbc.collection('coll3').ref().doc('doc5').coll51
        .doc('doc51').create({
          int: 656,
          str: 'else',
        })

      expect(() => docAbc.collection()).toThrow('Invalid collection path')
      expect(() => docAbc.collection(35))
        .toThrow('relPathSegments[0].split is not a function or its return ' +
          'value is not iterable')

      const doc5 = docAbc.collection('coll3').ref().doc('doc5')
      const doc5snapshot = await doc5.snapshot()

      expect(doc5snapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      const doc51 = docAbc.collection('coll3/doc5/coll51').ref().doc('doc51')
      const doc51snapshot = await doc51.snapshot()

      expect(doc51snapshot.data()).toStrictEqual({
        int: 656,
        str: 'else',
      })

      expect(() => {
        return docAbc.collection('/coll3/doc5/coll51').doc('doc51')
      }).toThrow('Unexpected collection or document id: ')

      expect(() => {
        return docAbc.collection('coll3/doc5/coll51/').doc('doc51')
      }).toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => {
        return docAbc.collection('/coll3/doc5/coll51/').doc('doc51')
      }).toThrow('Unexpected collection or document id: ')
    },
  ))

  test('doc() correctly refers to documents', () => withFreshDatabase(
    6,
    initDatabaseStatic,
    async (database) => {
      const docAbc = database.structure.coll1.doc2('Abc').ref()

      await docAbc.create({
        int2: 345,
        str2: 'blaalb',
      })

      await docAbc.collection('coll3').ref().doc('doc5').create({
        int: 678,
        str: 'something',
      })

      expect(() => database.doc()).toThrow('Invalid document path; use ' +
        'docAutoId() to auto-generate a document ID')
      expect(() => database.doc(35)).toThrow('relPathSegments[0].split is ' +
        'not a function or its return value is not iterable')

      const doc5b = docAbc.doc('coll3/doc5')
      const doc5bsnapshot = await doc5b.snapshot()

      expect(doc5bsnapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      expect(() => docAbc.doc('/coll3/doc5'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => docAbc.doc('coll3/doc5/'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => docAbc.doc('/coll3/doc5/'))
        .toThrow('Unexpected collection or document id: ')
    },
  ))

  test('get() correctly retrieves a snapshot', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const pear = database.structure.coll1.doc2('pear').ref()

      await pear.create({
        int2: 369,
        str2: 'juicy',
      })

      const snapshot = await pear.get()

      expect(snapshot).toBeInstanceOf(DocumentSnapshot)
      expect(snapshot.data()).toStrictEqual({
        int2: 369,
        str2: 'juicy',
      })
    },
  ))

  test('create() correctly creates a document', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const melon = database.structure.coll1.doc2('melon').ref()

      await melon.create({
        int2: 753,
        str2: 'ripe',
      })

      const snapshot = await melon.get()

      expect(snapshot.exists).toBe(true)
    },
  ))

  test('delete() correctly deletes a document', () => withFreshDatabase(
    4,
    initDatabaseStatic,
    async (database) => {
      const carrot = database.structure.coll1.doc2('carrot').ref()

      await carrot.create({
        int2: 159,
        str2: 'blue',
      })

      const coll = database.structure.coll1.ref()
      const snapshots = await coll.get(coll.documentSetups[1])

      expect(snapshots.size).toBe(1)

      const snapshot = await carrot.get()

      expect(snapshot.exists).toBe(true)

      await carrot.delete()

      const snapshots2 = await coll.get(coll.documentSetups[1])

      expect(snapshots2.size).toBe(0)

      const snapshot2 = await carrot.get()

      expect(snapshot2.exists).toBe(false)
    },
  ))

  test("set() needs options 'merge' or 'mergeFields'", () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const melon = database.structure.coll1.doc2('book').ref()

      await expect(() => melon.set({
        int1: 2,
        str1: 'giraffe',
      })).rejects.toThrow("set() must explicitly specify either the 'merge' " +
        "or the 'mergeFields' option, not both or neither")

      await expect(() => melon.set({
        int1: 2,
        str1: 'giraffe',
      }, {merge: true, mergeFields: ['int1']})).rejects.toThrow('set() must ' +
        "explicitly specify either the 'merge' or the " +
        "'mergeFields' option, not both or neither")
    },
  ))

  test('set() correctly creates a document', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(false)

      await doc.set({
        arr1: ['a', 'b'],
        bool1: true,
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'astring',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      }, {merge: false})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        arr1: ['a', 'b'],
        bool1: true,
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'astring',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('set() correctly overwrites a document with merge:false', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      await doc.create({
        arr1: ['a', 'b'],
        bool1: true,
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'astring',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.set({
        int1: 2,
        str1: 'giraffe',
      }, {merge: false})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        int1: 2,
        str1: 'giraffe',
      })
    },
  ))

  test('set() correctly updates a document with merge:true', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      await doc.create({
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'astring',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.set({
        arr1: ['a', 'b'],
        bool1: true,
        int1: 2,
        str1: 'giraffe',
      }, {merge: true})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        arr1: ['a', 'b'],
        bool1: true,
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 2,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'giraffe',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('set() correctly updates a document with mergeFields', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      await doc.create({
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'astring',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.set({
        arr1: ['a', 'b'],
        bool1: true,
        date1: '2010-05-06',
        int1: 2,
        str1: 'giraffe',
      }, {mergeFields: ['bool1', 'str1']})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        bool1: true,
        date1: '2020-10-31',
        ts1: new Date(2020, 10, 12, 22, 30, 45),
        int1: 42,
        intmap1: {c: 3, k: 6},
        map1: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        str1: 'giraffe',
        strarr1: ['almond', 'pecan'],
        strmap1: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test.todo('document.update(dataOrField, ...preconditionOrValues)')

  test.todo('enableCreate')

  test.todo('enableDelete')

  test.todo('enableSet')

  test.todo('enableUpdate')

  test('userData is correctly stored and retrieved', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    (database) => {
      const doc3 = database.structure.coll2.doc3.ref()

      expect(doc3.userData).toStrictEqual({
        animal: 'butterfly',
      })
    },
  ))
})
