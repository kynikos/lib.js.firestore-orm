module.exports = class DocumentSnapshot {
  constructor({__fsRef, chooseModel, parent}) {
    const model = typeof chooseModel === 'function'
      ? chooseModel(__fsRef)
      : chooseModel

    this.ref = new Document({parent, model, __fsDocument: __fsRef})
  }
}
