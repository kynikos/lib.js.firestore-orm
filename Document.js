// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const CollectionsContainer = require('./CollectionsContainer')
const Collection = require('./Collection')


module.exports = class Document extends CollectionsContainer {
  constructor({path, parent, model}) {
    // Do not require the Collection class directly in this module, or it will
    // cause a circular reference with the other modules
    super(Collection, model.__mapCollectionModels)
    this.database = parent.database
    this.parent = parent
    this.model = model
    this.__fsDocument = parent.__fsCollection.doc(path)

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

    return vData
  }

  async update(data, options = {}) {
    // Use 'ignoreMissingNames' when updating, otherwise any unspecified fields
    // would be overwritten with their default values
    const vData = this.model.schema.serialize(data, {ignoreMissingNames: true})

    await this.__fsDocument.update(vData, options)

    return vData
  }

  async get() {
    const doc = await this.__fsDocument.get()
    if (doc.exists) {
      return this.model.schema.deserialize(doc.data())
    }
    return null
  }
}
