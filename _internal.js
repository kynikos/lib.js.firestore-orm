// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

// The order of requires is significant
module.exports = {
  // deferredModules is needed to work around circular dependencies
  deferredModules: {},
  ...require('./fields/_internal'),
  oneLine: require('common-tags/lib/oneLine'),
}
module.exports.firebaseAdmin = require('firebase-admin')
module.exports.DocumentSchema = require('./DocumentSchema')
module.exports.CollectionModel = require('./CollectionModel')
module.exports.DocumentModel = require('./DocumentModel')
module.exports.WriteBatch = require('./WriteBatch')
module.exports.DocumentSnapshot = require('./DocumentSnapshot')
module.exports.QueryDocumentSnapshot = require('./QueryDocumentSnapshot')
module.exports.QuerySnapshot = require('./QuerySnapshot')
module.exports.Query = require('./Query')
module.exports.CollectionsContainer = require('./CollectionsContainer')
const CollectionReference = require('./CollectionReference')
module.exports.CollectionReference = CollectionReference
module.exports.deferredModules.CollectionReference = CollectionReference
const DocumentReference = require('./DocumentReference')
module.exports.DocumentReference = DocumentReference
module.exports.deferredModules.DocumentReference = DocumentReference
module.exports.Database = require('./Database')
