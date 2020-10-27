const DocumentReference = require('./DocumentReference')


module.exports = class DocumentSnapshot {
  constructor({__fsDocumentSnapshot, chooseModel, documentReference, parent}) {
    this.model = typeof chooseModel === 'function'
      ? chooseModel(__fsDocumentSnapshot.ref)
      : chooseModel

    this.__fsDocumentSnapshot = __fsDocumentSnapshot
    this.createTime = __fsDocumentSnapshot.createTime
    this.exists = __fsDocumentSnapshot.exists
    this.id = __fsDocumentSnapshot.id
    this.readTime = __fsDocumentSnapshot.readTime
    this.updateTime = __fsDocumentSnapshot.updateTime

    if (__fsDocumentSnapshot.exists) {
      if (documentReference) {
        this.ref = documentReference
      } else {
        this.ref = new DocumentReference({
          parent,
          model: this.model,
          __fsDocument: __fsDocumentSnapshot.ref,
        })
      }
    } else {
      this.ref = null
    }
  }

  data() {
    return this.model.schema.deserialize(this.__fsDocumentSnapshot.data())
  }

  get(field) {
    return this.model.schema
      .deserialize(this.__fsDocumentSnapshot.get(field))
  }
}
