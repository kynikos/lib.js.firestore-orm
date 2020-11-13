// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {fn, CollectionSetup, DocumentSnapshot} = require('./index')


module.exports = class DocumentReference {
  constructor({
    id, __fsDocument, parent, schema, getCollectionSetup, structure,
    __calledBySetup,
  }) {
    if (__calledBySetup !== true) {
      throw new Error('DocumentReference should only be instantiated ' +
        'internally by a DocumentSetup object')
    }
    if (id && id.includes('/')) {
      throw new Error("'id' cannot be a path of segments separated by '/'")
    }

    this.database = parent.database
    this.parent = parent
    this.schema = schema
    this.__fsDocument = __fsDocument || (id
      ? parent.__fsCollection.doc(id)
      // Even passing id=undefined would cause an error, so use a separate call
      // to doc() to auto-generate an ID
      : parent.__fsCollection.doc())
    this.id = this.__fsDocument.id
    this.path = this.__fsDocument.path
    this.getCollectionSetup = getCollectionSetup
    this.structure = fn.makeStructure(this, structure, CollectionSetup)
  }

  collection(path) {
    return fn.getCollection(this, path)
  }

  create(data) {
    return fn.createDocument({
      docRef: this,
      data,
      createFn: (data_) => this.__fsDocument.create(data_),
    })
  }

  delete(precondition) {
    return fn.deleteDocument({
      docRef: this,
      precondition,
      deleteFn: (precondition_) => this.__fsDocument.delete(precondition_),
    })
  }

  async get() {
    const __fsDocumentSnapshot = await this.__fsDocument.get()
    return new DocumentSnapshot({
      __fsDocumentSnapshot,
      documentReference: this,
    })
  }

  set(data, options) {
    return fn.setDocument({
      docRef: this,
      data,
      options,
      setFn: (data_, options_) => this.__fsDocument.set(data_, options_),
    })
  }

  update(dataOrField, ...preconditionOrValues) {
    return fn.updateDocument({
      docRef: this,
      dataOrField,
      preconditionOrValues,
      updateFn: (dataOrField_, ...preconditionOrValues_) => {
        return this.__fsDocument.update(dataOrField_, ...preconditionOrValues_)
      },
    })
  }
}
