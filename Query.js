const QuerySnapshot = require('./QuerySnapshot')


module.exports = class Query {
  constructor({collection, __fsQuery}) {
    this.collection = collection
    this.__fsQuery = __fsQuery
  }

  async get(chooseModel) {
    const __fsQuerySnapshot = await this.__fsQuery.get()
    return new QuerySnapshot({
      collection: this.collection,
      chooseModel,
      __fsQuerySnapshot,
    })
  }

  async *iter(chooseModel) {
    const {docs} = await this.get(chooseModel)
    yield* docs
  }

  async where(fieldPath, opStr, value) {
    const __fsQuery = await this.__fsQuery.where(fieldPath, opStr, value)
    return new Query({
      collection: this.collection,
      __fsQuery,
    })
  }
}
