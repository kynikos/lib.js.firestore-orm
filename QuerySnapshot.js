const QueryDocumentSnapshot = require('./QueryDocumentSnapshot')


module.exports = class QuerySnapshot {
  constructor({collection, chooseModel, __fsQuerySnapshot}) {
    this.collection = collection
    this.__chooseModel = chooseModel
    this.__fsQuerySnapshot = __fsQuerySnapshot
    this.docs = __fsQuerySnapshot.docs
    this.empty = __fsQuerySnapshot.empty
    this.readTime = __fsQuerySnapshot.readTime
    this.size = __fsQuerySnapshot.size
  }

  forEach(callback, thisArgopt) {
    return this.__fsQuerySnapshot.forEach(
      (__fsQueryDocumentSnapshot) => {
        const queryDocumentSnapshot =
          new QueryDocumentSnapshot({
            chooseModel: this.__chooseModel,
            parentCollection: this.collection,
            __fsQueryDocumentSnapshot,
          })
        return callback(queryDocumentSnapshot).bind(thisArgopt)
      },
      thisArgopt,
    )
  }
}
