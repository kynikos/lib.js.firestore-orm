// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldMapMixin, FieldSchema} = require('./index')


module.exports = class FieldSchemaMap extends FieldMapMixin(FieldSchema) {}
