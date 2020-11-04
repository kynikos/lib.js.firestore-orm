// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, CollectionSetup, DocumentSnapshot} = require('./index')


module.exports = class DocumentReference {
  constructor({path, __fsDocument, parent, schema, structure, hooks}) {
    this.database = parent.database
    this.parent = parent
    this.schema = schema
    this.__fsDocument = __fsDocument || (path
      ? parent.__fsCollection.doc(path)
      // Even passing id=undefined would cause an error, so use a separate call
      // to doc() to auto-generate an ID
      : parent.__fsCollection.doc())
    this.id = this.__fsDocument.id
    this.path = this.__fsDocument.path
    this.structure = fn.makeStructure(this, structure, CollectionSetup)
    this.__hooks = hooks
  }

  // eslint-disable-next-line class-methods-use-this
  collection() {
    throw new Error('Not implemented: use CollectionSetup and the structure ' +
      'objects')
  }

  async create(data) {
    const vData = this.schema.serialize(data)

    await this.__fsDocument.create(vData)

    await this.__hooks.afterWritingDocument &&
      this.__hooks.afterWritingDocument(this)

    await this.database.__hooks.afterWritingDocument &&
      this.database.__hooks.afterWritingDocument(this)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  async delete(precondition) {
    // TODO: Wrap the returned native WriteResult object in a custom class?
    const res = await this.__fsDocument.delete(precondition)

    await this.__hooks.afterWritingDocument &&
      this.__hooks.afterWritingDocument(this)

    await this.database.__hooks.afterWritingDocument &&
      this.database.__hooks.afterWritingDocument(this)

    return res
  }

  async get() {
    const __fsDocumentSnapshot = await this.__fsDocument.get()
    return new DocumentSnapshot({
      __fsDocumentSnapshot,
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
      throw new Error("set() must explicitly specify either the 'merge' " +
        "or the 'mergeFields' option, not both or neither")
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

    const vData = this.schema.serialize(data, sOptions)

    await this.__fsDocument.set(vData, options)

    await this.__hooks.afterWritingDocument &&
      this.__hooks.afterWritingDocument(this)

    await this.database.__hooks.afterWritingDocument &&
      this.database.__hooks.afterWritingDocument(this)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }

  async update(data, ...preconditionOrValues) {
    // Use 'ignoreAllMissingFields' when updating, otherwise any unspecified
    // fields would be overwritten with their default values
    const vData = this.schema.serialize(data, {
      ignoreAllMissingFields: true,
      onlyTheseFields: false,
    })

    await this.__fsDocument.update(vData, ...preconditionOrValues)

    await this.__hooks.afterWritingDocument &&
      this.__hooks.afterWritingDocument(this)

    await this.database.__hooks.afterWritingDocument &&
      this.database.__hooks.afterWritingDocument(this)

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }
}
