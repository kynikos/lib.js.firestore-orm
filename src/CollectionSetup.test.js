/* eslint-disable max-lines */
const {Database, CollectionSetup, DocumentSetup, CollectionReference} =
  require('./index')
const {initializeApp, withFreshDatabase} = require('../tests/_setup')


describe('a CollectionSetup object', () => {
  test('requires an argument', () => {
    expect.assertions(1)
    const fn = () => new CollectionSetup()
    expect(fn).toThrow("Cannot destructure property 'match' of " +
      "'undefined' as it is undefined.")
  })

  test('is correctly found with match:true', () => withFreshDatabase(
    4,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      collections: [
        new CollectionSetup({
          match: 'some id',
        }),
        new CollectionSetup({
          match: false,
        }),
        new CollectionSetup({
          match: (arg1) => arg1.startsWith('coll1-'),
        }),
        new CollectionSetup({
          match: /coll2-\d+/u,
        }),
        new CollectionSetup({
          match: true,
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: true,
              structure: {
                ref: (doc) => doc,
              },
              collections: [
                new CollectionSetup({
                  match: 'some other id',
                }),
                new CollectionSetup({
                  match: false,
                }),
                new CollectionSetup({
                  match: (arg1) => arg1.startsWith('coll4-'),
                }),
                new CollectionSetup({
                  match: /coll5-\d+/u,
                }),
                new CollectionSetup({
                  match: true,
                  structure: {
                    ref: (coll) => coll,
                  },
                  documents: [
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
          ],
        }),
      ],
    }),
    (database) => {
      const coll3Ref = database.collection('coll3').ref()
      expect(coll3Ref).toBeInstanceOf(CollectionReference)
      expect(coll3Ref.id).toStrictEqual('coll3')

      const coll6Ref = database.collection('coll3').ref().doc('doc1').ref()
        .collection('coll6').ref()
      expect(coll6Ref).toBeInstanceOf(CollectionReference)
      expect(coll6Ref.id).toStrictEqual('coll6')
    },
  ))

  test('is correctly found with match:id', () => withFreshDatabase(
    4,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      collections: [
        new CollectionSetup({
          match: false,
        }),
        new CollectionSetup({
          match: (arg1) => arg1.startsWith('coll1-'),
        }),
        new CollectionSetup({
          match: /coll2-\d+/u,
        }),
        new CollectionSetup({
          match: 'some id',
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: true,
              structure: {
                ref: (doc) => doc,
              },
              collections: [
                new CollectionSetup({
                  match: false,
                }),
                new CollectionSetup({
                  match: (arg1) => arg1.startsWith('coll4-'),
                }),
                new CollectionSetup({
                  match: /coll5-\d+/u,
                }),
                new CollectionSetup({
                  match: 'some other id',
                  structure: {
                    ref: (coll) => coll,
                  },
                  documents: [
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
          ],
        }),
      ],
    }),
    (database) => {
      const collRef = database.collection('some id').ref()
      expect(collRef).toBeInstanceOf(CollectionReference)
      expect(collRef.id).toStrictEqual('some id')

      const collBRef = database.collection('some id').ref().doc('doc1').ref()
        .collection('some other id').ref()
      expect(collBRef).toBeInstanceOf(CollectionReference)
      expect(collBRef.id).toStrictEqual('some other id')
    },
  ))

  test('is correctly found with match:regExp', () => withFreshDatabase(
    4,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      collections: [
        new CollectionSetup({
          match: false,
        }),
        new CollectionSetup({
          match: (arg1) => arg1.startsWith('coll1-'),
        }),
        new CollectionSetup({
          match: 'some id',
        }),
        new CollectionSetup({
          match: /coll2-\d+/u,
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: true,
              structure: {
                ref: (doc) => doc,
              },
              collections: [
                new CollectionSetup({
                  match: false,
                }),
                new CollectionSetup({
                  match: (arg1) => arg1.startsWith('coll4-'),
                }),
                new CollectionSetup({
                  match: 'some other id',
                }),
                new CollectionSetup({
                  match: /coll5-\d+/u,
                  structure: {
                    ref: (coll) => coll,
                  },
                  documents: [
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
          ],
        }),
      ],
    }),
    (database) => {
      const collRef = database.collection('coll2-123').ref()
      expect(collRef).toBeInstanceOf(CollectionReference)
      expect(collRef.id).toStrictEqual('coll2-123')

      const collBRef = database.collection('coll2-123').ref().doc('doc1').ref()
        .collection('coll5-456').ref()
      expect(collBRef).toBeInstanceOf(CollectionReference)
      expect(collBRef.id).toStrictEqual('coll5-456')
    },
  ))

  test('is correctly found with match:function', () => withFreshDatabase(
    4,
    () => new Database({
      firebaseAdminApp: initializeApp(),
      collections: [
        new CollectionSetup({
          match: false,
        }),
        new CollectionSetup({
          match: 'some id',
        }),
        new CollectionSetup({
          match: /coll2-\d+/u,
        }),
        new CollectionSetup({
          match: (arg1) => arg1.startsWith('coll1-'),
          structure: {
            ref: (coll) => coll,
          },
          documents: [
            new DocumentSetup({
              match: true,
              structure: {
                ref: (doc) => doc,
              },
              collections: [
                new CollectionSetup({
                  match: false,
                }),
                new CollectionSetup({
                  match: 'some other id',
                }),
                new CollectionSetup({
                  match: /coll5-\d+/u,
                }),
                new CollectionSetup({
                  match: (arg1) => arg1.startsWith('coll4-'),
                  structure: {
                    ref: (coll) => coll,
                  },
                  documents: [
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
          ],
        }),
      ],
    }),
    (database) => {
      const collRef = database.collection('coll1-pqr').ref()
      expect(collRef).toBeInstanceOf(CollectionReference)
      expect(collRef.id).toStrictEqual('coll1-pqr')

      const collBRef = database.collection('coll1-pqr').ref().doc('doc1').ref()
        .collection('coll4-xyz').ref()
      expect(collBRef).toBeInstanceOf(CollectionReference)
      expect(collBRef.id).toStrictEqual('coll4-xyz')
    },
  ))
})
