// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

// The order of requires is significant
exports.ALLOW = {action: 'ALLOW'}
exports.IGNORE = {action: 'IGNORE'}
exports.USE_DEFAULT = {action: 'USE_DEFAULT'}
exports.CALL_DEFAULT = {action: 'CALL_DEFAULT'}
exports.CALL_DEFAULT_ALWAYS = {action: 'CALL_DEFAULT_ALWAYS'}
exports.ABORT = {action: 'ABORT'}
exports.Field = require('./_Field')
exports.FieldArray = require('./FieldArray')
exports.FieldBoolean = require('./FieldBoolean')
exports.FieldChoice = require('./FieldChoice')
exports.FieldChoiceArray = require('./FieldChoiceArray')
exports.FieldCollectionReference = require('./FieldCollectionReference')
exports.FieldCollectionReferenceArray =
  require('./FieldCollectionReferenceArray')
exports.FieldDateTime = require('./FieldDateTime')
exports.FieldDate = require('./FieldDate')
exports.FieldDateTimeCreation = require('./FieldDateTimeCreation')
exports.FieldDateTimeLastUpdate = require('./FieldDateTimeLastUpdate')
exports.FieldDocumentReference = require('./FieldDocumentReference')
exports.FieldDocumentReferenceArray =
  require('./FieldDocumentReferenceArray')
exports.FieldFixed = require('./FieldFixed')
exports.FieldInteger = require('./FieldInteger')
exports.FieldIntegerMap = require('./FieldIntegerMap')
exports.FieldJson = require('./FieldJson')
exports.FieldMap = require('./FieldMap')
exports.FieldSchema = require('./FieldSchema')
exports.FieldSchemaArray = require('./FieldSchemaArray')
exports.FieldString = require('./FieldString')
exports.FieldStringArray = require('./FieldStringArray')
exports.FieldStringMap = require('./FieldStringMap')
