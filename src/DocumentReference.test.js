/* eslint-disable max-lines */
const {FieldPath, DocumentSnapshot} = require('./index')
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
        array: ['a', 'b'],
        boolean: true,
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      }, {merge: false})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        array: ['a', 'b'],
        boolean: true,
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('set() correctly overwrites a document with merge:false', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      await doc.create({
        array: ['a', 'b'],
        boolean: true,
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.set({
        integer: 2,
        string: 'giraffe',
      }, {merge: false})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        integer: 2,
        string: 'giraffe',
      })
    },
  ))

  test('set() correctly updates a document with merge:true', () => withFreshDatabase(
    2,
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

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.set({
        array: ['a', 'b'],
        boolean: true,
        integer: 2,
        string: 'giraffe',
      }, {merge: true})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        array: ['a', 'b'],
        boolean: true,
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 2,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'giraffe',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('set() correctly updates a document with mergeFields', () => withFreshDatabase(
    2,
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

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.set({
        array: ['a', 'b'],
        boolean: true,
        date: '2010-05-06',
        integer: 2,
        string: 'giraffe',
      }, {mergeFields: ['boolean', 'string']})

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        boolean: true,
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'giraffe',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('document() does not support the alternating field/value signature', () => withFreshDatabase(
    2,
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

      await expect(() => doc.update('arr1', ['a', 'b'])).rejects
        .toThrow('Passing an alternating list of field paths and values is ' +
          'not supported')

      await expect(() => doc.update(new FieldPath('arr1'), ['a', 'b'])).rejects
        .toThrow('Passing an alternating list of field paths and values is ' +
          'not supported')
    },
  ))

  test('update() correctly updates a document', () => withFreshDatabase(
    2,
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

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      await doc.update({
        array: ['a', 'b'],
        boolean: true,
        date: '2010-05-06',
        integer: 2,
        string: 'giraffe',
      })

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        array: ['a', 'b'],
        boolean: true,
        date: '2010-05-06',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 2,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'giraffe',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })
    },
  ))

  test('enableDirectCreate prevents creating a document', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableDirectCreate.ref()

      await expect(doc.create({str: 'bbb'})).rejects
        .toThrow('Creating document enableDirectCreate directly is not ' +
          'permitted')
    },
  ))

  test('enableDirectDelete prevents deleting a document', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableDirectDelete.ref()

      await doc.create({str: 'bbb'})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      await expect(doc.delete()).rejects
        .toThrow('Deleting document enableDirectDelete directly is not ' +
          'permitted')
    },
  ))

  test('enableDirectSet prevents setting a document', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableDirectSet.ref()

      await doc.create({str: 'bbb'})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      await expect(doc.set({str: 'ccc'}, {merge: true})).rejects
        .toThrow('Setting document enableDirectSet directly is not ' +
          'permitted')
    },
  ))

  test('enableDirectUpdate prevents updating a document', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableDirectUpdate.ref()

      await doc.create({str: 'bbb'})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      await expect(doc.update({str: 'ddd'})).rejects
        .toThrow('Updating document enableDirectUpdate directly is not ' +
          'permitted')
    },
  ))

  test('enableBatchCreate prevents batch-creating documents', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()

      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableBatchCreate.ref()

      await expect(batch.create(doc, {str: 'bbb'})).rejects
        .toThrow('Creating document enableBatchCreate in a batch is not ' +
          'permitted')
    },
  ))

  test('enableBatchDelete prevents batch-deleting documents', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableBatchDelete.ref()

      await doc.create({str: 'bbb'})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      const batch = database.batch()

      await expect(batch.delete(doc)).rejects
        .toThrow('Deleting document enableBatchDelete in a batch is not ' +
          'permitted')
    },
  ))

  test('enableBatchSet prevents batch-setting documents', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableBatchSet.ref()

      await doc.create({str: 'bbb'})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      const batch = database.batch()

      await expect(batch.set(doc, {str: 'ccc'}, {merge: true})).rejects
        .toThrow('Setting document enableBatchSet in a batch is not ' +
          'permitted')
    },
  ))

  test('enableBatchUpdate prevents batch-updating documents', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').writeRestrictions
        .enableBatchUpdate.ref()

      await doc.create({str: 'bbb'})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      const batch = database.batch()

      await expect(batch.update(doc, {str: 'ccc'})).rejects
        .toThrow('Updating document enableBatchUpdate in a batch is not ' +
          'permitted')
    },
  ))

  test('defaultEnableDirectCreate prevents creating a document', () => withFreshDatabase(
    1,
    () => initDatabaseStatic({options: {defaultEnableDirectCreate: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await expect(doc.create({str6: 'bbb', int6: 3})).rejects
        .toThrow('Creating document aaa directly is not permitted')
    },
  ))

  test('defaultEnableDirectDelete prevents deleting a document', () => withFreshDatabase(
    2,
    () => initDatabaseStatic({options: {defaultEnableDirectDelete: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await doc.create({str6: 'bbb', int6: 3})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      await expect(doc.delete()).rejects
        .toThrow('Deleting document aaa directly is not permitted')
    },
  ))

  test('defaultEnableDirectSet prevents setting a document', () => withFreshDatabase(
    2,
    () => initDatabaseStatic({options: {defaultEnableDirectSet: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await doc.create({str6: 'bbb', int6: 3})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      await expect(doc.set({str6: 'ccc', int6: 4}, {merge: true})).rejects
        .toThrow('Setting document aaa directly is not permitted')
    },
  ))

  test('defaultEnableDirectUpdate prevents updating a document', () => withFreshDatabase(
    2,
    () => initDatabaseStatic({options: {defaultEnableDirectUpdate: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await doc.create({str6: 'bbb', int6: 3})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      await expect(doc.update({str6: 'ccc', int6: 4})).rejects
        .toThrow('Updating document aaa directly is not permitted')
    },
  ))

  test('defaultEnableBatchCreate prevents creating documents', () => withFreshDatabase(
    1,
    () => initDatabaseStatic({options: {defaultEnableBatchCreate: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      const batch = database.batch()

      await expect(batch.create(doc, {str6: 'bbb', int6: 3})).rejects
        .toThrow('Creating document aaa in a batch is not permitted')
    },
  ))

  test('defaultEnableBatchDelete prevents deleting documents', () => withFreshDatabase(
    2,
    () => initDatabaseStatic({options: {defaultEnableBatchDelete: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await doc.create({str6: 'bbb', int6: 3})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      const batch = database.batch()

      await expect(batch.delete(doc)).rejects
        .toThrow('Deleting document aaa in a batch is not permitted')
    },
  ))

  test('defaultEnableBatchSet prevents setting documents', () => withFreshDatabase(
    2,
    () => initDatabaseStatic({options: {defaultEnableBatchSet: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await doc.create({str6: 'bbb', int6: 3})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      const batch = database.batch()

      await expect(batch.set(doc, {str6: 'ccc', int6: 4}, {merge: true}))
        .rejects.toThrow('Setting document aaa in a batch is not permitted')
    },
  ))

  test('defaultEnableBatchUpdate prevents updating documents', () => withFreshDatabase(
    2,
    () => initDatabaseStatic({options: {defaultEnableBatchUpdate: false}}),
    async (database) => {
      const doc = database.structure.coll2.doc6('aaa').ref()

      await doc.create({str6: 'bbb', int6: 3})

      const snapshot = await doc.get()

      expect(snapshot.exists).toBe(true)

      const batch = database.batch()

      await expect(batch.update(doc, {str6: 'ccc', int6: 4})).rejects
        .toThrow('Updating document aaa in a batch is not permitted')
    },
  ))

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
