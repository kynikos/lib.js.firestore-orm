// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, deferredModules, CollectionSetup, DocumentSnapshot} =
  require('./index')


module.exports = class DocumentReference {
  constructor({path, __fsDocument, parent, schema, structure}) {
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
  }

  collection(collectionPath) {
    return new deferredModules.CollectionReference({
      path: collectionPath,
      parent: this,
    })
  }

  async create(data) {
    const vData = this.schema.serialize(data)

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

    // TODO: Return the native WriteResult object in a custom class with the
    //        vData?
    return vData
  }
}
