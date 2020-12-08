/* eslint-disable max-lines */
const {Database, CollectionSetup, DocumentSetup, DocumentReference} =
  require('./index')
const {initializeApp, withFreshDatabase} = require('../tests/_setup')


describe('a DocumentSetup object', () => {
  test('requires an argument', () => {
    expect.assertions(1)
    const fn = () => new DocumentSetup()
    expect(fn).toThrow("Cannot destructure property 'match' of 'undefined' " +
      'as it is undefined.')
  })

  test('is correctly found with match:true', () => withFreshDatabase(
    2,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      structure: {
        coll1: 'coll1',
      },
      collections: [
        new CollectionSetup({
          match: true,
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: 'some id',
            }),
            new DocumentSetup({
              match: false,
            }),
            new DocumentSetup({
              match: (arg1) => arg1.startsWith('doc1-'),
            }),
            new DocumentSetup({
              match: /doc2-\d+/u,
            }),
            new DocumentSetup({
              match: true,
              structure: {
                ref: (doc) => doc,
              },
            }),
          ],
        }),
      ],
    }),
    (database) => {
      const docRef = database.structure.coll1.ref().doc('doc3').ref()
      expect(docRef).toBeInstanceOf(DocumentReference)
      expect(docRef.id).toStrictEqual('doc3')
    },
  ))

  test('is correctly found with match:id', () => withFreshDatabase(
    2,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      structure: {
        coll1: 'coll1',
      },
      collections: [
        new CollectionSetup({
          match: true,
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: false,
            }),
            new DocumentSetup({
              match: (arg1) => arg1.startsWith('doc1-'),
            }),
            new DocumentSetup({
              match: /doc2-\d+/u,
            }),
            new DocumentSetup({
              match: 'some id',
              structure: {
                ref: (doc) => doc,
              },
            }),
          ],
        }),
      ],
    }),
    (database) => {
      const docRef = database.structure.coll1.ref().doc('some id').ref()
      expect(docRef).toBeInstanceOf(DocumentReference)
      expect(docRef.id).toStrictEqual('some id')
    },
  ))

  test('is correctly found with match:regExp', () => withFreshDatabase(
    2,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      structure: {
        coll1: 'coll1',
      },
      collections: [
        new CollectionSetup({
          match: true,
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: false,
            }),
            new DocumentSetup({
              match: (arg1) => arg1.startsWith('doc1-'),
            }),
            new DocumentSetup({
              match: 'some id',
            }),
            new DocumentSetup({
              match: /doc2-\d+/u,
              structure: {
                ref: (doc) => doc,
              },
            }),
          ],
        }),
      ],
    }),
    (database) => {
      const docRef = database.structure.coll1.ref().doc('doc2-567').ref()
      expect(docRef).toBeInstanceOf(DocumentReference)
      expect(docRef.id).toStrictEqual('doc2-567')
    },
  ))

  test('is correctly found with match:function', () => withFreshDatabase(
    2,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      structure: {
        coll1: 'coll1',
      },
      collections: [
        new CollectionSetup({
          match: true,
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: false,
            }),
            new DocumentSetup({
              match: /doc2-\d+/u,
            }),
            new DocumentSetup({
              match: 'some id',
            }),
            new DocumentSetup({
              match: (arg1) => arg1.startsWith('doc1-'),
              structure: {
                ref: (doc) => doc,
              },
            }),
          ],
        }),
      ],
    }),
    (database) => {
      const docRef = database.structure.coll1.ref().doc('doc1-234').ref()
      expect(docRef).toBeInstanceOf(DocumentReference)
      expect(docRef.id).toStrictEqual('doc1-234')
    },
  ))
})
