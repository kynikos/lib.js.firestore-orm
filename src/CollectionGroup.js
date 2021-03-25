// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Query} = require('./index')


module.exports = class CollectionGroup extends Query {
  constructor({id, database, pathSetups}) {
    if (id.includes('/')) {
      throw new Error("'id' cannot be a path of segments separated by '/'")
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
