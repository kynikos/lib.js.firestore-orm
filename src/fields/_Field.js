// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class Field {
  constructor(fieldName, options = {}) {
    const {required, nullable, default: default_} = options
    this.name = fieldName
    this.required = required == null ? true : Boolean(required)
    this.default = default_ == null ? null : default_
    this.nullable = nullable == null ? true : Boolean(nullable)
  }

  serialize(value, options) {
    if (!this.nullable && value == null) {
      throw new Error(`Field ${this.name} requires a non-null value`)
    }

    // Implement serializeNotNull() in subclasses
    return this.serializeNotNull(value, options)
  }

  serializeNoValue() {
    if (this.serializeNoValueAlt) {
      // Optionally implement serializeNoValueAlt() in subclasses
      const sData = this.serializeNoValueAlt()
      if (sData != null) return sData
    }

    if (this.required) {
      throw new Error(`Field ${this.name} requires a value, but none was given`)
    }

    return this.default
  }

  deserializeNoValue() {
    return this.default
  }
}
