// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {Timestamp} = require('../index')
const {Field} = require('./index')


module.exports = class _FieldTimestamp extends Field {
  serializeNotNull(value, options, data) {
    // Firestore would also accept a Date object directly, however I may also
    // use the schema to serialize and deserialize data that's not going/coming
    // directly to/from the database, so it's better to return a Timestamp
    // object here
    return Timestamp.fromDate(value)
  }

  deserialize(value, options, data) {
    // TODO: Firestore stores Timestamp objects; the docs say that toDate()
    //       may lose precision
    //       https://googleapis.dev/nodejs/firestore/latest/Timestamp.html#toDate
    //       Optionally keep it as a Timestamp?
    return value && value.toDate()
  }
}
