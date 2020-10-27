const QueryDocumentSnapshot = require('./QueryDocumentSnapshot')


module.exports = class QuerySnapshot {
  constructor({collection, chooseModel, __fsQuerySnapshot}) {
    this.collection = collection
    this.__chooseModel = chooseModel
    this.__fsQuerySnapshot = __fsQuerySnapshot
    this.empty = __fsQuerySnapshot.empty
    this.readTime = __fsQuerySnapshot.readTime
    this.size = __fsQuerySnapshot.size
    this.docs = __fsQuerySnapshot.docs.map((__fsQueryDocumentSnapshot) => {
      return new QueryDocumentSnapshot({
        chooseModel: this.__chooseModel,
        parentCollection: this.collection,
        __fsQueryDocumentSnapshot,
      })
    })
  }

  forEach(callback, thisArgopt) {
    return this.docs.forEach((queryDocumentSnapshot) => {
      return callback(queryDocumentSnapshot).bind(thisArgopt)
    })
  }
}
