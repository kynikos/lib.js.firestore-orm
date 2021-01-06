const {Database, CollectionReference, DocumentReference} =
  require('../src/index')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a complex nested database structure', () => {
  test('instantiates correctly', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    (database) => {
      expect(database).toStrictEqual(expect.any(Database))
    },
  ))

  test('makes the expected object', () => withFreshDatabase(
    9,
    initDatabaseStatic,
    (database) => {
      expect(database.structure).toStrictEqual({
        coll1: {
          doc1: {
            ref: expect.any(Function),
            create: expect.any(Function),
            snapshot: expect.any(Function),
          },
          ref: expect.any(Function),
          doc2: expect.any(Function),
          get1: expect.any(Function),
          get2: expect.any(Function),
          fn1: expect.any(Function),
        },
        coll2: {
          doc3: {
            ref: expect.any(Function),
          },
          doc4: null,
          allFields: {
            ref: expect.any(Function),
            create: expect.any(Function),
          },
          manyFields: {
            ref: expect.any(Function),
            create: expect.any(Function),
          },
          doc6: expect.any(Function),
          ref: expect.any(Function),
        },
      })

      expect(database.structure.coll1.fn1(3)).toBe(6)

      expect(database.structure.coll1.doc2('abc')).toStrictEqual({
        coll3: {
          doc: expect.any(Function),
          ref: expect.any(Function),
          get: expect.any(Function),
        },
        create: expect.any(Function),
        ref: expect.any(Function),
      })

      expect(database.structure.coll2.ref()).toBeInstanceOf(CollectionReference)

      expect(database.structure.coll2.ref().structure).toStrictEqual({
        doc3: {
          ref: expect.any(Function),
        },
        doc4: null,
        allFields: {
          ref: expect.any(Function),
          create: expect.any(Function),
        },
        manyFields: {
          ref: expect.any(Function),
          create: expect.any(Function),
        },
        doc6: expect.any(Function),
        ref: expect.any(Function),
      })

      expect(database.structure.coll2.doc6('doc3').ref())
        .toBeInstanceOf(DocumentReference)

      expect(database.structure.coll2.doc6('doc3').ref().database)
        .toBeInstanceOf(Database)

      expect(database.structure.coll1.doc2('abc').ref())
        .toBeInstanceOf(DocumentReference)

      expect(database.structure.coll1.doc2('abc').ref().database)
        .toBeInstanceOf(Database)
    },
  ))
})
