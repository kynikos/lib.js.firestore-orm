/* eslint-disable max-lines */
const {FieldPath, WriteBatch} = require('../src/index')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a WriteBatch object', () => {
  test('works with Database.prototype.batch() and commit()', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const coll1 = database.structure.coll1
      const docA = coll1.doc2('Abc').ref()
      const docD = coll1.doc2('Def').ref()
      const docG = coll1.doc2('Ghi').ref()

      const batch = database.batch()

      await Promise.all([
        batch.create(docA, {
          str2: 'mercury',
          int2: 6,
        }),
        batch.create(docD, {
          str2: 'venus',
          int2: 5,
        }),
        batch.create(docG, {
          str2: 'earth',
          int2: 19,
        }),
      ])

      await batch.commit()

      const doc2Setup = coll1.ref().documentSetups[1]
      const res = await coll1.ref().get(doc2Setup)

      expect(res.docs.map((doc) => doc.data())).toStrictEqual([
        {
          str2: 'mercury',
          int2: 6,
        },
        {
          str2: 'venus',
          int2: 5,
        },
        {
          str2: 'earth',
          int2: 19,
        },
      ])
    },
  ))

  test('works with Database.prototype.batchCommit()', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const coll1 = database.structure.coll1
      const docA = coll1.doc2('Abc').ref()
      const docD = coll1.doc2('Def').ref()
      const docG = coll1.doc2('Ghi').ref()

      await database.batchCommit((batch) => {
        return Promise.all([
          batch.create(docA, {
            str2: 'mercury',
            int2: 6,
          }),
          batch.create(docD, {
            str2: 'venus',
            int2: 5,
          }),
          batch.create(docG, {
            str2: 'earth',
            int2: 19,
          }),
        ])
      })

      const doc2Setup = coll1.ref().documentSetups[1]
      const res = await coll1.ref().get(doc2Setup)

      expect(res.docs.map((doc) => doc.data())).toStrictEqual([
        {
          str2: 'mercury',
          int2: 6,
        },
        {
          str2: 'venus',
          int2: 5,
        },
        {
          str2: 'earth',
          int2: 19,
        },
      ])
    },
  ))

  test('creates a document with create()', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const melon = database.structure.coll1.doc2('melon').ref()

      await batch.create(melon, {
        int2: 753,
        str2: 'ripe',
      })

      await batch.commit()

      const snapshot = await melon.get()

      expect(snapshot.exists).toBe(true)
    },
  ))

  test('deletes a document with delete()', () => withFreshDatabase(
    4,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const carrot = database.structure.coll1.doc2('carrot').ref()

      await batch.create(carrot, {
        int2: 159,
        str2: 'blue',
      })

      await batch.commit()

      const coll = database.structure.coll1.ref()
      const snapshots = await coll.get(coll.documentSetups[1])

      expect(snapshots.size).toBe(1)

      const snapshot = await carrot.get()

      expect(snapshot.exists).toBe(true)

      const batch2 = database.batch()

      await batch2.delete(carrot)

      await batch2.commit()

      const snapshots2 = await coll.get(coll.documentSetups[1])

      expect(snapshots2.size).toBe(0)

      const snapshot2 = await carrot.get()

      expect(snapshot2.exists).toBe(false)
    },
  ))

  test("needs options 'merge' or 'mergeFields' for set()", () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const melon = database.structure.coll1.doc2('book').ref()

      await expect(() => batch.set(melon, {
        int1: 2,
        str1: 'giraffe',
      })).rejects.toThrow("set() must explicitly specify either the 'merge' " +
        "or the 'mergeFields' option, not both or neither")

      await expect(() => batch.set(melon, {
        int1: 2,
        str1: 'giraffe',
      }, {merge: true, mergeFields: ['int1']})).rejects.toThrow('set() must ' +
        "explicitly specify either the 'merge' or the " +
        "'mergeFields' option, not both or neither")
    },
  ))

  test('creates a document with set()', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const doc = database.structure.coll2.manyFields.ref()

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(false)

      await batch.set(doc, {
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

      await batch.commit()

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

  test('overwrites a document with set(data, {merge:false})', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const doc = database.structure.coll2.manyFields.ref()

      await batch.create(doc, {
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

      await batch.commit()

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      const batch2 = database.batch()

      await batch2.set(doc, {
        integer: 2,
        string: 'giraffe',
      }, {merge: false})

      await batch2.commit()

      const snapshot2 = await doc.get()

      expect(snapshot2.data()).toStrictEqual({
        integer: 2,
        string: 'giraffe',
      })
    },
  ))

  test('updates a document with set(data, {merge:true})', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const doc = database.structure.coll2.manyFields.ref()

      await batch.create(doc, {
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })

      await batch.commit()

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      const batch2 = database.batch()

      await batch2.set(doc, {
        array: ['a', 'b'],
        boolean: true,
        integer: 2,
        string: 'giraffe',
      }, {merge: true})

      await batch2.commit()

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

  test('updates a document with set(data, {mergeFields})', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const doc = database.structure.coll2.manyFields.ref()

      await batch.create(doc, {
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })

      await batch.commit()

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      const batch2 = database.batch()

      await batch2.set(doc, {
        array: ['a', 'b'],
        boolean: true,
        date: '2010-05-06',
        integer: 2,
        string: 'giraffe',
      }, {mergeFields: ['boolean', 'string']})

      await batch2.commit()

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

  test('does not support the alternating field/value signature of the native update()', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const doc = database.structure.coll2.manyFields.ref()

      await batch.create(doc, {
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })

      await batch.commit()

      const batch2 = database.batch()

      await expect(() => batch2.update(doc, 'arr1', ['a', 'b'])).rejects
        .toThrow('Passing an alternating list of field paths and values is ' +
          'not supported')

      await expect(() => batch2.update(doc, new FieldPath('arr1'), ['a', 'b'])).rejects
        .toThrow('Passing an alternating list of field paths and values is ' +
          'not supported')
    },
  ))

  test('updates a document with update()', () => withFreshDatabase(
    2,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const doc = database.structure.coll2.manyFields.ref()

      await batch.create(doc, {
        date: '2020-10-31',
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      })

      await batch.commit()

      const snapshot1 = await doc.get()

      expect(snapshot1.exists).toBe(true)

      const batch2 = database.batch()

      await batch2.update(doc, {
        array: ['a', 'b'],
        boolean: true,
        date: '2010-05-06',
        integer: 2,
        string: 'giraffe',
      })

      await batch2.commit()

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

  test("can be concatenated and has a 'lastSerializedData' attribute", () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      const batch = database.batch()
      const melon = database.structure.coll1.doc2('melon').ref()

      expect(batch.lastSerializedData).toBeUndefined()

      const batch2 = await batch.create(melon, {
        int2: 753,
        str2: 'ripe',
      })

      expect(batch2).toBeInstanceOf(WriteBatch)

      expect(batch2.lastSerializedData).toStrictEqual({
        int2: 753,
        str2: 'ripe',
      })
    },
  ))
})
