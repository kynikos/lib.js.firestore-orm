// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const admin = require('firebase-admin')
const CollectionsContainer = require('./CollectionsContainer')
const Collection = require('./Collection')


module.exports = class Database extends CollectionsContainer {
  constructor({collections}) {
    // Do not require the Collection class directly in this module, or it will
    // cause a circular reference with the other modules
    super(Collection, collections)
    this.database = this
    admin.initializeApp()
    this.__firestore = admin.firestore()
    this.__fsDocument = this.__firestore
  }
}
