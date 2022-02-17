// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {CollectionSetup, DocumentSetup, Query} = require('./index')

const errorMessage = "'pathSetup' must be an Array alternating the " +
  'CollectionSetup and DocumentSetup instances that represent the setup path ' +
  'to the expected documents; the Array must start with the root ' +
  "CollectionSetup and end with the document's parent CollectionSetup"


module.exports = class CollectionGroup extends Query {
  constructor({id, database, pathSetups}) {
    if (id.includes('/')) {
      throw new Error("'id' cannot be a path of segments separated by '/'")
    }

    let index = 0

    while (true) {
      const collectionSetup = pathSetups[index]

      if (!collectionSetup) break

      if (!(collectionSetup instanceof CollectionSetup)) {
        throw new Error(errorMessage)
      }

      index++

      const documentSetup = pathSetups[index]

      if (!documentSetup) break

      if (!(documentSetup instanceof DocumentSetup)) {
        throw new Error(errorMessage)
      }

      index++
    }

    super({__callPostConstructor: true})
    this.__database = database
    this.database = database.structure
    this.__parent = database
    this.parent = database.structure
    this.__fsCollectionGroup = database.__fsDocument.collectionGroup(id)
    this.id = id
    this.pathSetups = pathSetups
    this.__Query_postConstructor({
      collection: this,
      __fsQueryOrCollection: this.__fsCollectionGroup,
    })
  }
}
