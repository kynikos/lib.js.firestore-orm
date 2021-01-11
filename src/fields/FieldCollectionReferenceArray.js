// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {FieldArrayMixin, FieldCollectionReference} = require('./index')


module.exports = class FieldCollectionReferenceArray extends FieldArrayMixin(FieldCollectionReference) {
  deserialize(value, options, data) {
    return (database) => {
      return value.map((ref) => super.deserialize(ref, options, data)(database))
    }
  }
}
