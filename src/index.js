// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

// The order of requires is significant
exports.CREATE = {writeMode: 'CREATE'}
exports.SET = {writeMode: 'SET'}
exports.UPDATE = {writeMode: 'UPDATE'}
// deferredModules is needed to work around circular dependencies
module.exports.deferredModules = {}
module.exports.fn = require('./_functions')
module.exports.DocumentSetup = require('./DocumentSetup')
module.exports.CollectionSetup = require('./CollectionSetup')
module.exports._Schema = require('./_Schema')
module.exports.DocumentSchema = require('./DocumentSchema')
module.exports.WriteBatch = require('./WriteBatch')
module.exports.DocumentSnapshot = require('./DocumentSnapshot')
module.exports.QueryDocumentSnapshot = require('./QueryDocumentSnapshot')
module.exports.QuerySnapshot = require('./QuerySnapshot')
module.exports.Query = require('./Query')
const CollectionReference = require('./CollectionReference')
module.exports.CollectionReference = CollectionReference
module.exports.deferredModules.CollectionReference = CollectionReference
const DocumentReference = require('./DocumentReference')
module.exports.DocumentReference = DocumentReference
module.exports.deferredModules.DocumentReference = DocumentReference
module.exports.DatabaseConnection = require('./DatabaseConnection')
