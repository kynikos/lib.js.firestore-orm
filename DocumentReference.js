// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {oneLine, CollectionsContainer, DocumentSnapshot} = require('./_internal')


module.exports = class DocumentReference extends CollectionsContainer {
  constructor({parent, model, __fsDocument}) {
    super(model.__mapCollectionModels)
    this.database = parent.database
    this.parent = parent
    this.model = model
    this.__fsDocument = __fsDocument

    for (
      const [methodName, method]
      of Object.entries(model.__additionalMethods || [])
    ) {
      if (this[methodName]) {
        throw new Error(`The document already has a ${methodName} property`)
      }
      this[methodName] = method.bind(this)
    }
  }

  async create(data) {
    const vData = this.model.schema.serialize(data)

    await this.__fsDocument.create(vData)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  delete(precondition) {
    // TODO: Wrap the returned native WriteResult object in a custom class?
    return this.__fsDocument.delete(precondition)
  }

  async get() {
    const __fsDocumentSnapshot = await this.__fsDocument.get()
    return new DocumentSnapshot({
      __fsDocumentSnapshot,
      chooseModel: this.model,
      documentReference: this,
    })
  }

  async set(data, options) {
    let sOptions

    if (
      !options ||
      // XOR
      ((options.merge == null) === (options.mergeFields == null))
    ) {
      throw new Error(oneLine`set() must explicitly specify either the 'merge'
        or the 'mergeFields' option, not both or neither`)
    } else if (options.mergeFields == null) {
      sOptions = {
        ignoreAllMissingFields: options.merge,
        onlyTheseFields: false,
      }
    } else {
      sOptions = {
        ignoreAllMissingFields: false,
        onlyTheseFields: options.mergeFields,
      }
    }

    const vData = this.model.schema.serialize(data, sOptions)

    await this.__fsDocument.set(vData, options)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  async update(data, ...preconditionOrValues) {
    // Use 'ignoreAllMissingFields' when updating, otherwise any unspecified fields
    // would be overwritten with their default values
    const vData = this.model.schema.serialize(data, {
      ignoreAllMissingFields: true,
      onlyTheseFields: false,
    })

    await this.__fsDocument.update(vData, ...preconditionOrValues)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }
}
