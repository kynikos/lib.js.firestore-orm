// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

module.exports = class Field {
  constructor(fieldName, options = {}) {
    const {
      required,
      nullable,
      default: default_,
      computeNoValue,
      computeNoValueOnly,
    } = options
    this.name = fieldName
    this.required = required == null ? true : Boolean(required)
    this.default = default_ == null ? null : default_
    this.nullable = nullable == null ? true : Boolean(nullable)
    this.computeNoValue = computeNoValue == null ? null : computeNoValue
    this.computeNoValueOnly = Boolean(computeNoValueOnly)
  }

  __serialize(value, options, data) {
    if (this.computeNoValueOnly) {
      throw new Error(`Field ${this.name} is computed dynamically, it rejects
        any explicitly assigned value`)
    }

    if (!this.nullable && value == null) {
      throw new Error(`Field ${this.name} requires a non-null value`)
    }

    // Implement serializeNotNull() in subclasses
    return this.serializeNotNull(value, options, data)
  }

  __serializeNoValue(options, data) {
    if (this.computeNoValue) {
      const sData = this.computeNoValue(options, data)
      if (sData != null) return sData
    }

    if (this.required) {
      throw new Error(`Field ${this.name} requires a value, but none was given`)
    }

    return this.default
  }

  __deserialize(value, options, data) {
    return this.deserialize ? this.deserialize(value) : value
  }

  __deserializeNoValue(options, data) {
    return this.default
  }
}
