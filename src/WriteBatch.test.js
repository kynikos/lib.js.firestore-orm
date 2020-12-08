const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('a batch operation', () => {
  test('creates multiple documents', () => withFreshDatabase(
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

      const res = await coll1.get2()

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

  test.todo('database.batch()')

  test.todo('database.batchCommit(callBack)')

  test.todo('batch.commit()')

  test.todo('batch.create(document, data)')

  test.todo('batch.delete(document, precondition)')

  test.todo('batch.set(document, data, options)')

  test.todo('batch.update(document, dataOrField, ...preconditionOrValues)')
})
