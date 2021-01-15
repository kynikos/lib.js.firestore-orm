const {withFreshDatabase, initDatabaseStatic} = require('../tests/_setup')


describe('Database hooks', () => {
  test('are called when creating a document', () => withFreshDatabase(
    4,
    () => {
      const mock1 = jest.fn()
      const mock2 = jest.fn()

      return initDatabaseStatic({
        userData: {
          mock1,
          mock2,
        },
        options: {hooks: {
          beforeCreatingDocument: (...args) => mock1(...args),
          afterCreatingDocument: (...args) => mock2(...args),
        }},
      })
    },
    async (database) => {
      const melon = database.structure.coll1.doc2('melon').ref()

      await melon.create({
        int2: 753,
        str2: 'ripe',
      })

      expect(database.userData.mock1).toHaveBeenCalledTimes(1)
      // TODO: Also test the passed arguments (for all hooks), for example:
      //       expect(database.userData.mock1).toHaveBeenCalledWith(args)
      expect(database.userData.mock2).toHaveBeenCalledTimes(1)

      const pineapple = database.structure.coll1.doc2('pineapple').ref()

      await pineapple.create({
        int2: 551,
        str2: 'juicy',
      })

      expect(database.userData.mock1).toHaveBeenCalledTimes(2)
      expect(database.userData.mock2).toHaveBeenCalledTimes(2)
    },
  ))

  test('are called when deleting a document', () => withFreshDatabase(
    4,
    () => {
      const mock1 = jest.fn()
      const mock2 = jest.fn()

      return initDatabaseStatic({
        userData: {
          mock1,
          mock2,
        },
        options: {hooks: {
          beforeDeletingDocument: (...args) => mock1(...args),
          afterDeletingDocument: (...args) => mock2(...args),
        }},
      })
    },
    async (database) => {
      const carrot = database.structure.coll1.doc2('carrot').ref()
      const potato = database.structure.coll1.doc2('potato').ref()

      await Promise.all([
        carrot.create({
          int2: 159,
          str2: 'blue',
        }),
        potato.create({
          int2: 783,
          str2: 'cyan',
        }),
      ])

      await carrot.delete()

      expect(database.userData.mock1).toHaveBeenCalledTimes(1)
      expect(database.userData.mock2).toHaveBeenCalledTimes(1)

      await potato.delete()

      expect(database.userData.mock1).toHaveBeenCalledTimes(2)
      expect(database.userData.mock2).toHaveBeenCalledTimes(2)
    },
  ))

  test('are called when setting a document', () => withFreshDatabase(
    4,
    () => {
      const mock1 = jest.fn()
      const mock2 = jest.fn()

      return initDatabaseStatic({
        userData: {
          mock1,
          mock2,
        },
        options: {hooks: {
          beforeSettingDocument: (...args) => mock1(...args),
          afterSettingDocument: (...args) => mock2(...args),
        }},
      })
    },
    async (database) => {
      const doc = database.structure.coll2.manyFields.ref()

      await doc.set({
        array: ['a', 'b'],
        boolean: true,
        date: new Date(Date.UTC(2020, 10, 31)),
        dateTime: new Date(2020, 10, 12, 22, 30, 45),
        integer: 42,
        integerMap: {c: 3, k: 6},
        map: {foo: {j: 'aaa', k: 'bbb'}, bar: {j: 'ccc', k: 'ddd'}},
        string: 'astring',
        stringArray: ['almond', 'pecan'],
        stringMap: {s: 'duck', t: 'notduck'},
      }, {merge: false})

      expect(database.userData.mock1).toHaveBeenCalledTimes(1)
      expect(database.userData.mock2).toHaveBeenCalledTimes(1)

      await doc.set({
        integer: 84,
      }, {merge: true})

      expect(database.userData.mock1).toHaveBeenCalledTimes(2)
      expect(database.userData.mock2).toHaveBeenCalledTimes(2)
    },
  ))

  test('are called when updating a document', () => withFreshDatabase(
    4,
    () => {
      const mock1 = jest.fn()
      const mock2 = jest.fn()

      return initDatabaseStatic({
        userData: {
          mock1,
          mock2,
        },
        options: {hooks: {
          beforeUpdatingDocument: (...args) => mock1(...args),
          afterUpdatingDocument: (...args) => mock2(...args),
        }},
      })
    },
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

      await doc.update({
        array: ['a', 'b'],
        boolean: true,
        date: new Date(Date.UTC(2010, 5, 6)),
        integer: 2,
        string: 'giraffe',
      })

      expect(database.userData.mock1).toHaveBeenCalledTimes(1)
      expect(database.userData.mock2).toHaveBeenCalledTimes(1)

      await doc.update({
        integer: 16,
      })

      expect(database.userData.mock1).toHaveBeenCalledTimes(2)
      expect(database.userData.mock2).toHaveBeenCalledTimes(2)
    },
  ))
})
