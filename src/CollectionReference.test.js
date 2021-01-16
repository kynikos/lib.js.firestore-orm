const {CollectionReference} = require('../src/index')
const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a CollectionReference object', () => {
  test('cannot be directly instantiated', () => {
    expect.assertions(1)
    expect(() => new CollectionReference({
      id: 'coll1',
      parent: null,
    })).toThrow('CollectionReference should only be instantiated ' +
      'internally by a CollectionSetup object')
  })

  test('cannot have a path as an id', () => {
    expect.assertions(1)
    expect(() => new CollectionReference({
      id: 'coll1/coll2',
      parent: null,
      __calledBySetup: true,
    })).toThrow("'id' cannot be a path of segments separated by '/'")
  })

  test('references documents with doc()', () => withFreshDatabase(
    12,
    initDatabaseStatic,
    async (database) => {
      await Promise.all([
        database.structure.coll1.doc1.create({
          int1: 42,
          str1: 'astring',
        }),
        database.structure.coll1.doc2('Abc').create({
          int2: 345,
          str2: 'blaalb',
        }),
      ])

      await database.structure.coll1.doc2('Abc').coll3.doc('doc5').create({
        int: 678,
        str: 'something',
      })

      const coll1 = database.structure.coll1.ref()

      expect(() => coll1.doc()).toThrow('Invalid document path; use ' +
        'docAutoId() to auto-generate a document ID')
      expect(() => coll1.doc(35)).toThrow('relPathSegments[0].split is not a ' +
        'function or its return value is not iterable')

      const doc1a = coll1.doc('doc1')
      const doc1asnapshot = await doc1a.snapshot()

      expect(doc1asnapshot.data()).toStrictEqual({
        int1: 42,
        str1: 'astring',
      })

      expect(() => coll1.doc('/doc1')).toThrow('Making a DocumentSetup ' +
        "requires 'id' to be defined")

      expect(() => coll1.doc('doc1/')).toThrow('setups is not iterable')

      expect(() => coll1.doc('/doc1/')).toThrow('Making a DocumentSetup ' +
        "requires 'id' to be defined")

      const doc5 = coll1.doc('Abc').coll3.doc('doc5')
      const doc5snapshot = await doc5.snapshot()

      expect(doc5snapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      expect(() => {
        return coll1.doc('Abc/coll3')
      }).toThrow('The path resolves to a collection, not a document')

      const doc5a = coll1.doc('Abc/coll3/doc5')
      const doc5asnapshot = await doc5a.snapshot()

      expect(doc5asnapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      expect(() => coll1.doc('/Abc/coll3/doc5')).toThrow('Making a ' +
        "DocumentSetup requires 'id' to be defined")

      expect(() => coll1.doc('Abc/coll3/doc5/'))
        .toThrow('Unexpected collection or document id: ')

      expect(() => coll1.doc('/Abc/coll3/doc5/')).toThrow('Making a ' +
        "DocumentSetup requires 'id' to be defined")
    },
  ))

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

      const coll1 = database.structure.coll1.ref()

      expect(() => coll1.collection()).toThrow('Invalid collection path')
      expect(() => coll1.collection(35)).toThrow('relPathSegments[0].split ' +
        'is not a function or its return value is not iterable')

      const doc5a = coll1.collection('Abc/coll3').doc('doc5')
      const doc5asnapshot = await doc5a.snapshot()

      expect(doc5asnapshot.data()).toStrictEqual({
        int: 678,
        str: 'something',
      })

      expect(() => coll1.collection('/Abc/coll3').doc('doc5'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => coll1.collection('Abc/coll3/').doc('doc5'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => coll1.collection('/Abc/coll3/').doc('doc5'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      const doc51a = coll1.collection('Abc/coll3/doc5/coll51').doc('doc51')
      const doc51asnapshot = await doc51a.snapshot()

      expect(doc51asnapshot.data()).toStrictEqual({
        int: 656,
        str: 'else',
      })

      expect(() => {
        return coll1.collection('Abc/coll3/doc5')
      }).toThrow('The path resolves to a document, not a collection')

      expect(() => coll1.collection('/Abc/coll3/doc5/coll51').doc('doc51'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => coll1.collection('Abc/coll3/doc5/coll51/').doc('doc51'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")

      expect(() => coll1.collection('/Abc/coll3/doc5/coll51/').doc('doc51'))
        .toThrow("Making a DocumentSetup requires 'id' to be defined")
    },
  ))

  test('disallows using the native add() method', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    (database) => {
      const coll1 = database.structure.coll1.ref()

      const fn = () => coll1.add({
        int1: 42,
        str1: 'astring',
      })

      expect(fn).toThrow('Not implemented: to add a document with an ' +
        "auto-generated ID, use a CollectionReference object's its " +
        'docAutoId() method, then either create() or set() the document ' +
        'reference')
    },
  ))

  test('references auto-generated document IDs with docAutoId()', () => withFreshDatabase(
    3,
    initDatabaseStatic,
    async (database) => {
      await database.structure.coll1.doc2('Abc').create({
        int2: 345,
        str2: 'blaalb',
      })

      const coll1 = database.structure.coll1.ref()

      expect(() => coll1.docAutoId()).toThrow('A document setup is required')

      const docAuto1 = coll1.docAutoId(coll1.documentSetups[0])

      await docAuto1.create({
        int1: 678,
        str1: 'something',
      })

      const docAuto1snapshot = await docAuto1.snapshot()

      expect(docAuto1snapshot.data()).toStrictEqual({
        int1: 678,
        str1: 'something',
      })

      const coll3 = coll1.doc('Abc').coll3.ref()
      const docAuto5 = coll3.docAutoId(coll3.documentSetups[0])

      await docAuto5.create({
        int: 656,
        str: 'else',
      })

      const docAuto5snapshot = await docAuto5.snapshot()

      expect(docAuto5snapshot.data()).toStrictEqual({
        int: 656,
        str: 'else',
      })
    },
  ))

  test('deletes all contained documents with deleteAllDocuments()', () => withFreshDatabase(
    4,
    initDatabaseStatic,
    async (database) => {
      await Promise.all([
        database.structure.coll1.doc2('Abc').create({
          int2: 1,
          str2: 'aaa',
        }),
        database.structure.coll1.doc2('Def').create({
          int2: 2,
          str2: 'bbb',
        }),
        database.structure.coll1.doc2('Ghi').create({
          int2: 3,
          str2: 'ccc',
        }),
        database.structure.coll1.doc2('Jkl').create({
          int2: 4,
          str2: 'ddd',
        }),
        database.structure.coll1.doc2('Mno').create({
          int2: 345,
          str2: 'blaalb',
        }),
      ])

      const coll3 = database.structure.coll1.doc2('Mno').coll3

      await Promise.all([
        coll3.doc('Pqr').create({
          int: 55,
          str: 'xxx',
        }),
        coll3.doc('Stu').create({
          int: 66,
          str: 'yyy',
        }),
        coll3.doc('Vwx').create({
          int: 77,
          str: 'zzz',
        }),
      ])

      const coll1 = database.structure.coll1

      const doc2s = await coll1.get1()

      expect(doc2s.docs).toHaveLength(5)

      const docxs = await coll3.get()

      expect(docxs.docs).toHaveLength(3)

      await coll1.ref().deleteAllDocuments(coll1.ref().documentSetups[0])
      await coll3.ref().deleteAllDocuments(coll3.ref().documentSetups[0])

      const doc2ss = await coll1.get1()

      expect(doc2ss.docs).toHaveLength(0)

      const docxss = await coll3.get()

      expect(docxss.docs).toHaveLength(0)
    },
  ))

  test('stores and retrieves userData', () => withFreshDatabase(
    1,
    initDatabaseStatic,
    (database) => {
      const coll2 = database.structure.coll2.ref()

      expect(coll2.userData).toStrictEqual({
        foo: 'bar',
      })
    },
  ))
})
