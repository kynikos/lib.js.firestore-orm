const DocumentSnapshot = require('./DocumentSnapshot')


module.exports = class QueryDocumentSnapshot extends DocumentSnapshot {
  constructor({chooseModel, parentCollection, __fsQueryDocumentSnapshot}) {
    super({
      __fsDocumentSnapshot: __fsQueryDocumentSnapshot,
      chooseModel,
      parent: parentCollection,
    })
    this.__fsQueryDocumentSnapshot = __fsQueryDocumentSnapshot
  }
}
