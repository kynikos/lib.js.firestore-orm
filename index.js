// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {
  DatabaseConnection,
  CollectionSetup,
  DocumentSetup,
  DocumentSchema,
} = require('./src/index')

const {
  FieldArray,
  FieldBoolean,
  FieldChoice,
  FieldChoiceArray,
  FieldCollectionReference,
  FieldCollectionReferenceArray,
  FieldDate,
  FieldDateTime,
  FieldDocumentReference,
  FieldDocumentReferenceArray,
  FieldFixed,
  FieldInteger,
  FieldIntegerMap,
  FieldJson,
  FieldMap,
  FieldString,
  FieldStringArray,
  FieldStringMap,
} = require('./src/fields/index')

module.exports = {
  DatabaseConnection,
  CollectionSetup,
  DocumentSetup,
  DocumentSchema,
  FieldArray,
  FieldBoolean,
  FieldChoice,
  FieldChoiceArray,
  FieldCollectionReference,
  FieldCollectionReferenceArray,
  FieldDate,
  FieldDateTime,
  FieldDocumentReference,
  FieldDocumentReferenceArray,
  FieldFixed,
  FieldInteger,
  FieldIntegerMap,
  FieldJson,
  FieldMap,
  FieldString,
  FieldStringArray,
  FieldStringMap,
}
