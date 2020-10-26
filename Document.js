// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const CollectionsContainer = require('./CollectionsContainer')
const Collection = require('./Collection')


module.exports = class Document extends CollectionsContainer {
  constructor({parent, model, __fsDocument}) {
    // Do not require the Collection class directly in this module, or it will
    // cause a circular reference with the other modules
    super(Collection, model.__mapCollectionModels)
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

  async create(data, options = {}) {
    const vData = this.model.schema.serialize(data)

    await this.__fsDocument.create(vData, options)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  async update(data, options = {}) {
    // Use 'ignoreMissingNames' when updating, otherwise any unspecified fields
    // would be overwritten with their default values
    const vData = this.model.schema.serialize(data, {ignoreMissingNames: true})

    await this.__fsDocument.update(vData, options)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  async set(data, options = {}) {
    // Use 'ignoreMissingNames' when updating, otherwise any unspecified fields
    // would be overwritten with their default values
    const vData = this.model.schema.serialize(data, {ignoreMissingNames: true})

    await this.__fsDocument.set(vData, options)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  delete(precondition) {
    // TODO: Wrap the returned native WriteResult object in a custom class?
    return this.__fsDocument.delete(precondition)
  }

  async get() {
    const __fsDoc = await this.__fsDocument.get()
    if (__fsDoc.exists) {
      return this.model.schema.deserialize(__fsDoc.data())
    }
    return null
  }
}
