/* eslint-disable max-lines */
const axios = require('axios')
const firebaseAdmin = require('firebase-admin')
const {IGNORE, Database, CollectionSetup, DocumentSetup,
  DocumentSchema, FieldArray, FieldBoolean, FieldDate, FieldDateTime,
  FieldInteger, FieldIntegerMap, FieldMap, FieldString, FieldStringArray,
  FieldStringMap} = require('../index')


function initializeApp() {
  return firebaseAdmin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT,
  })
}
exports.initializeApp = initializeApp


exports.initDatabaseStatic = function initDatabaseStatic() {
  return new Database({
    firebaseAdminApp: initializeApp(),
    structure: {
      coll1: 'coll1',
      coll2: 'coll2',
    },
    userData: {
      fruit: 'mandarin',
    },
    collections: [
      new CollectionSetup({
        match: 'coll1',
        structure: {
          doc1: 'doc1',
          ref: (coll) => coll,
          doc2: (doc2var, coll) => coll.doc(doc2var),
          get1: (coll) => coll.get(coll.documentSetups[0]),
          get2: (coll) => coll.get(coll.documentSetups[1]),
          fn1: (val) => val * 2,
        },
        documents: [
          new DocumentSetup({
            match: 'doc1',
            schema: new DocumentSchema(
              new FieldString('str1'),
              new FieldInteger('int1'),
            ),
            structure: {
              ref: (doc) => doc,
              create: (data, doc) => doc.create(data),
              snapshot: (doc) => doc.get(),
            },
          }),
          new DocumentSetup({
            match: true,
            schema: new DocumentSchema(
              new FieldString('str2'),
              new FieldInteger('int2'),
            ),
            structure: {
              coll3: 'coll3',
              ref: (doc) => doc,
              create: (data, doc) => doc.create(data),
            },
            collections: [
              new CollectionSetup({
                match: 'coll3',
                structure: {
                  doc: (id, coll) => coll.doc(id),
                  ref: (coll) => coll,
                  get: (coll) => coll.get(coll.documentSetups[0]),
                },
                documents: [
                  new DocumentSetup({
                    match: true,
                    schema: new DocumentSchema(
                      new FieldString('str'),
                      new FieldInteger('int'),
                    ),
                    structure: {
                      coll51: 'coll51',
                      create: (data, doc) => doc.create(data),
                      snapshot: (doc) => doc.get(),
                    },
                    collections: [
                      new CollectionSetup({
                        match: 'coll51',
                        structure: {
                          doc: (id, coll) => coll.doc(id),
                          ref: (coll) => coll,
                          get: (coll) => coll.get(coll.documentSetups[0]),
                        },
                        documents: [
                          new DocumentSetup({
                            match: true,
                            schema: new DocumentSchema(
                              new FieldString('str'),
                              new FieldInteger('int'),
                            ),
                            structure: {
                              create: (data, doc) => doc.create(data),
                              snapshot: (doc) => doc.get(),
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
        ],
      }),
      new CollectionSetup({
        match: 'coll2',
        structure: {
          doc3: 'doc3',
          doc4: 'doc4',
          manyFields: 'many-fields',
          doc6: (doc6, coll) => coll.doc(doc6),
          ref: (coll) => coll,
        },
        userData: {
          foo: 'bar',
        },
        documents: [
          new DocumentSetup({
            match: 'doc3',
            schema: new DocumentSchema(
              new FieldString('str3'),
              new FieldInteger('int3'),
            ),
            structure: {
              ref: (doc) => doc,
            },
            userData: {
              animal: 'butterfly',
            },
          }),
          new DocumentSetup({
            match: 'doc4',
            schema: new DocumentSchema(
              new FieldString('str4'),
              new FieldInteger('int4'),
            ),
          }),
          new DocumentSetup({
            match: 'many-fields',
            schema: new DocumentSchema(
              new FieldArray('arr1', {onWriteNil: IGNORE}),
              new FieldBoolean('bool1', {onWriteNil: IGNORE}),
              new FieldDate('date1', {onWriteNil: IGNORE}),
              new FieldDateTime('ts1', {onWriteNil: IGNORE}),
              new FieldInteger('int1', {onWriteNil: IGNORE}),
              new FieldIntegerMap('intmap1', {onWriteNil: IGNORE}),
              new FieldMap('map1', {onWriteNil: IGNORE}),
              new FieldString('str1', {onWriteNil: IGNORE}),
              new FieldStringArray('strarr1', {onWriteNil: IGNORE}),
              new FieldStringMap('strmap1', {onWriteNil: IGNORE}),
            ),
            structure: {
              ref: (doc) => doc,
              create: (data, doc) => doc.create(data),
            },
          }),
          new DocumentSetup({
            match: true,
            schema: new DocumentSchema(
              new FieldString('str6'),
              new FieldInteger('int6'),
            ),
            structure: {
              ref: (doc) => doc,
              writeRestrictions: 'writeRestrictions',
            },
            collections: [
              new CollectionSetup({
                match: 'writeRestrictions',
                structure: {
                  enableDirectCreate: 'enableDirectCreate',
                  enableDirectDelete: 'enableDirectDelete',
                  enableDirectSet: 'enableDirectSet',
                  enableDirectUpdate: 'enableDirectUpdate',
                  enableBatchCreate: 'enableBatchCreate',
                  enableBatchDelete: 'enableBatchDelete',
                  enableBatchSet: 'enableBatchSet',
                  enableBatchUpdate: 'enableBatchUpdate',
                },
                documents: [
                  new DocumentSetup({
                    match: 'enableDirectCreate',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableDirectCreate: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableDirectDelete',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableDirectDelete: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableDirectSet',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableDirectSet: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableDirectUpdate',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableDirectUpdate: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableBatchCreate',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableBatchCreate: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableBatchDelete',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableBatchDelete: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableBatchSet',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableBatchSet: false,
                    structure: {ref: (doc) => doc},
                  }),
                  new DocumentSetup({
                    match: 'enableBatchUpdate',
                    schema: new DocumentSchema(new FieldString('str')),
                    enableBatchUpdate: false,
                    structure: {ref: (doc) => doc},
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}


exports.initBrokenDatabase = function initBrokenDatabase(desc, args, error) {
  return withFreshDatabase(
    1,
    () => {
      const fn = () => {
        const firebaseAdminApp = initializeApp()
        try {
          // eslint-disable-next-line no-new
          new Database({firebaseAdminApp, ...args})
        } finally {
          firebaseAdminApp.delete()
        }
      }
      expect(fn).toThrow(error)
      // Mock a database that can be closed by withFreshDatabase() to avoid a
      // further exception
      return {__app: {delete: () => null}}
    },
    () => null,
  )
}


exports.initDatabase = function initDatabase(desc, args) {
  return withFreshDatabase(
    1,
    () => {
      return new Database({
        firebaseAdminApp: initializeApp(),
        ...args,
      })
    },
    (database) => {
      expect(database).toBeInstanceOf(Database)
    },
  )
}


function clearDatabase() {
  return axios.delete(`http://${process.env.FIRESTORE_EMULATOR_HOST
  }/emulator/v1/projects/${process.env.GCLOUD_PROJECT
  }/databases/(default)/documents`)
}


async function withFreshDatabase(
  expectedAssertions,
  initDatabase,
  testFn,
) {
  expect.assertions(expectedAssertions)

  await clearDatabase()

  const database = initDatabase()

  try {
    await testFn(database)
  } finally {
    await database.__app.delete()
  }

  return true
}
exports.withFreshDatabase = withFreshDatabase
