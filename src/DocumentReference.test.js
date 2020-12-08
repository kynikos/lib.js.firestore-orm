const {DocumentSnapshot} = require('./index')
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

      expect(() => docAbc.collection('/coll3/doc5/coll51')
        .doc('doc51'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => docAbc.collection('coll3/doc5/coll51/')
        .doc('doc51'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => docAbc.collection('/coll3/doc5/coll51/')
        .doc('doc51'))
        .toThrow('Unexpected collection or document id: ')
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

      const snapshots = await database.structure.coll1.ref().get()

      expect(snapshots.size).toBe(1)

      const snapshot = await carrot.get()

      expect(snapshot.exists).toBe(true)

      await carrot.delete()

      const snapshots2 = await database.structure.coll1.ref().get()

      expect(snapshots2.size).toBe(0)

      const snapshot2 = await carrot.get()

      expect(snapshot2.exists).toBe(false)
    },
  ))

  test.todo('document.set(data, options)')

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
