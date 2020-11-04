const {Database, CollectionSetup, DocumentSetup, DocumentSchema, FieldString,
  FieldInteger} = require('../index')
const {CollectionReference, DocumentReference} = require('../src/index')


describe('a complex nested database structure', () => {
  const doc1 = new DocumentSetup({
    path: 'doc1',
    schema: new DocumentSchema(
      new FieldString('str1'),
      new FieldInteger('int1'),
    ),
  })

  const doc5 = new DocumentSetup({
    path: 'doc5',
    schema: new DocumentSchema(
      new FieldString('str5'),
      new FieldInteger('int5'),
    ),
  })

  const coll3 = new CollectionSetup({
    path: 'coll3',
    structure: {
      doc5,
    },
  })

  const doc2plus = new DocumentSetup({
    path: (idVar) => `doc2-${idVar}`,
    schema: new DocumentSchema(
      new FieldString('str2'),
      new FieldInteger('int2'),
    ),
    structure: {
      coll3,
      fn3() {
        return this
      },
    },
  })

  const doc3 = new DocumentSetup({
    path: 'doc3',
    schema: new DocumentSchema(
      new FieldString('str3'),
      new FieldInteger('int3'),
    ),
  })

  const doc4 = new DocumentSetup({
    path: 'doc4',
    schema: new DocumentSchema(
      new FieldString('str4'),
      new FieldInteger('int4'),
    ),
  })

  const coll1 = new CollectionSetup({
    path: 'coll1',
    structure: {
      doc1,
      doc2(doc2var) {
        return doc2plus.make(this, doc2var)
      },
      fn1(val) {
        return val * 2
      },
      c1: 'foobar',
    },
  })

  const coll2 = new CollectionSetup({
    path: 'coll2',
    structure: {
      doc3,
      doc4,
      fn2() {
        return this
      },
    },
  })

  const database = new Database({
    coll1,
    coll2,
  })

  test('instantiates correctly', () => {
    expect.assertions(1)

    expect(database).toStrictEqual(expect.any(Database))
  })

  test('makes the expected object', () => {
    expect.assertions(7)

    expect(database.structure).toStrictEqual({
      coll1: {
        c1: 'foobar',
        doc1: null,
        doc2: expect.any(Function),
        fn1: expect.any(Function),
      },
      coll2: {
        doc3: null,
        doc4: null,
        fn2: expect.any(Function),
      },
    })

    expect(database.structure.coll1.fn1(3)).toBe(6)

    expect(database.structure.coll1.doc2('abc')).toStrictEqual({
      coll3: {
        doc5: null,
      },
      fn3: expect.any(Function),
    })

    expect(database.structure.coll2.fn2()).toBeInstanceOf(CollectionReference)

    expect(database.structure.coll2.fn2().structure).toStrictEqual({
      doc3: null,
      doc4: null,
      fn2: expect.any(Function),
    })

    expect(database.structure.coll1.doc2('abc').fn3())
      .toBeInstanceOf(DocumentReference)

    expect(database.structure.coll1.doc2('abc').fn3().database)
      .toBeInstanceOf(Database)
  })
})
