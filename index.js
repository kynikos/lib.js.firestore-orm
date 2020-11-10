// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {
  AppManager,
  CollectionSetup,
  DocumentSetup,
  DocumentSchema,
} = require('./src/index')

const {
  FieldArray,
  FieldBoolean,
  FieldDate,
  FieldDateTime,
  FieldInteger,
  FieldIntegerMap,
  FieldMap,
  FieldString,
  FieldStringArray,
  FieldStringMap,
} = require('./src/fields/index')

module.exports = {
  AppManager,
  CollectionSetup,
  DocumentSetup,
  DocumentSchema,
  FieldArray,
  FieldBoolean,
  FieldDate,
  FieldDateTime,
  FieldInteger,
  FieldIntegerMap,
  FieldMap,
  FieldString,
  FieldStringArray,
  FieldStringMap,
}
