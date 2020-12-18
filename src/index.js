// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {firestore} = require('firebase-admin')

// The order of requires is significant
exports.FieldPath = firestore.FieldPath
exports.Timestamp = firestore.Timestamp
exports.DEFAULT = {setting: 'DEFAULT'}
exports.CREATE = {writeMode: 'CREATE'}
exports.SET = {writeMode: 'SET'}
exports.UPDATE = {writeMode: 'UPDATE'}
// deferredModules is needed to work around circular dependencies
exports.deferredModules = {}
exports.WriteResults = require('./WriteResults')
exports.fn = require('./_functions')
exports.DocumentSetup = require('./DocumentSetup')
exports.CollectionSetup = require('./CollectionSetup')
exports._Schema = require('./_Schema')
exports.DocumentSchema = require('./DocumentSchema')
exports.WriteBatch = require('./WriteBatch')
exports.DocumentSnapshot = require('./DocumentSnapshot')
exports.QueryDocumentSnapshot = require('./QueryDocumentSnapshot')
exports.QuerySnapshot = require('./QuerySnapshot')
exports.Query = require('./Query')
const CollectionReference = require('./CollectionReference')
exports.CollectionReference = CollectionReference
exports.deferredModules.CollectionReference = CollectionReference
const DocumentReference = require('./DocumentReference')
exports.DocumentReference = DocumentReference
exports.deferredModules.DocumentReference = DocumentReference
exports.Database = require('./Database')
