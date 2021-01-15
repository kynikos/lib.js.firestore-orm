// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE

const {CREATE, SET, UPDATE} = require('../index')
const {ALLOW, IGNORE, USE_DEFAULT, CALL_DEFAULT, CALL_DEFAULT_ALWAYS, ABORT} =
  require('./index')

// TODO: Support excluding fields from indexes, and verifying or regenerating
//       firestore.indexes.json automatically


module.exports = class Field {
  constructor(fieldName, options = {}) {
    // TODO: For the moment only allow field names of the "simple" format
    //       (https://firebase.google.com/docs/firestore/quotas#limits)
    //       because otherwise I would need to support FieldPath objects in
    //       other places, for example in DocumentReference's set() and update()
    if (!(/^[a-zA-Z_][0-9a-zA-Z_]*$/u).test(fieldName)) {
      throw new Error('Field names must match /^[a-zA-Z_][0-9a-zA-Z_]*$/')
    }

    const {
      nullable,
      onWrite = ALLOW,
      onCreate,
      onSet,
      onUpdate,
      onWriteNil = ABORT,
      onCreateNil,
      onSetNil,
      onUpdateNil,
      writeNilIf,
      defaultWrite = null,
      onRead = ALLOW,
      onReadNil = USE_DEFAULT,
      readNilIf,
      defaultRead = null,
      // TODO: Implement FieldValue and in particular FieldValue.delete()
      //       https://firebase.google.com/docs/firestore/manage-data/delete-data#fields
      //       Also implement an 'allowDelete' option to possibly disable field
      //       deletion Do not call it 'onDelete' (akin to 'onCreate' etc.)
      //       because the on* options refer to actions performed on the whole
      //       document, while this refers to the delete action performed on
      //       this specific field, not the whole document
      // allowDelete: true,
    } = options

    this.name = fieldName
    this.nullable = nullable == null ? true : Boolean(nullable)

    const {
      onCreate: vOnCreate,
      onSet: vOnSet,
      onUpdate: vOnUpdate,
    } = validateOnOptions(
      {onCreate, onSet, onUpdate},
      {
        ALLOW,
        IGNORE,
        // USE_DEFAULT is disallowed
        // CALL_DEFAULT is disallowed
        // CALL_DEFAULT_ALWAYS is disallowed
        ABORT,
      },
      onWrite,
    )

    this.__writeAction = new Map([
      [false, ALLOW],
      [CREATE, vOnCreate],
      [SET, vOnSet],
      [UPDATE, vOnUpdate],
    ])

    const {
      onCreateNil: vOnCreateNil,
      onSetNil: vOnSetNil,
      onUpdateNil: vOnUpdateNil,
    } = validateOnOptions(
      {onCreateNil, onSetNil, onUpdateNil},
      {
        // ALLOW is disallowed
        IGNORE,
        USE_DEFAULT,
        CALL_DEFAULT,
        CALL_DEFAULT_ALWAYS,
        ABORT,
      },
      onWriteNil,
    )

    this.__writeNilAction = new Map([
      [false, IGNORE],
      [CREATE, vOnCreateNil],
      [SET, vOnSetNil],
      [UPDATE, vOnUpdateNil],
    ])

    this.writeNilIf = writeNilIf
    this.defaultWrite = defaultWrite

    const {onRead: vOnRead} = validateOnOptions(
      {onRead},
      {
        ALLOW,
        IGNORE,
        // USE_DEFAULT is disallowed
        // CALL_DEFAULT is disallowed
        // CALL_DEFAULT_ALWAYS is disallowed
        ABORT,
      },
      ALLOW,
    )

    this.__readAction = vOnRead

    const {onReadNil: vOnReadNil} = validateOnOptions(
      {onReadNil},
      {
        // ALLOW is disallowed
        IGNORE,
        USE_DEFAULT,
        CALL_DEFAULT,
        CALL_DEFAULT_ALWAYS,
        ABORT,
      },
      USE_DEFAULT,
    )

    this.__readNilAction = vOnReadNil
    this.readNilIf = readNilIf
    this.defaultRead = defaultRead
  }

  __shouldSerialize(value, options, data) {
    const {
      writeMode = false,
    } = options

    const writeAction = this.__writeAction.get(writeMode)

    if (writeAction === ABORT) {
      throw new Error(`Field ${this.name} is configured to reject any ` +
        'explicitly assigned value')
    }

    if (writeAction === IGNORE) return false

    if (writeAction === ALLOW) return true

    throw new Error(`Unexpected writeMode: ${writeMode}`)
  }

  __serialize(value, options, data) {
    if (value == null) {
      if (this.nullable) {
        return this.serializeNull(value, options, data)
      }
      throw new Error(`Field ${this.name} requires a non-null value`)
    }

    // Possibly implement serializeNotNull() in subclasses
    return this.serializeNotNull(value, options, data)
  }

  // eslint-disable-next-line class-methods-use-this
  serializeNull(value, options, data) {
    // Let subclasses implement their own serializeNull()
    return null
  }

  // eslint-disable-next-line class-methods-use-this
  serializeNotNull(value, options, data) {
    // Let subclasses implement their own serializeNotNull()
    return value
  }

  __shouldSerializeNoValue(options, data) {
    const {
      writeMode = false,
      processMissingFields = true,
    } = options

    const writeNilAction = this.__writeNilAction.get(writeMode)

    if (writeNilAction === IGNORE) return false

    if (writeNilAction === CALL_DEFAULT_ALWAYS) return true

    if (
      this.writeNilIf
        ? this.writeNilIf(data, options)
        : processMissingFields
    ) {
      if (writeNilAction === ABORT) {
        throw new Error(
          `Field ${this.name} requires a value, but none was given`)
      }

      return [USE_DEFAULT, CALL_DEFAULT].includes(writeNilAction)
    }

    return false
  }

  __serializeNoValue(options, data) {
    const {
      writeMode = false,
    } = options

    const writeNilAction = this.__writeNilAction.get(writeMode)

    if (writeNilAction === USE_DEFAULT) {
      return this.defaultWrite
    }

    // CALL_DEFAULT, CALL_DEFAULT_ALWAYS
    const cValue = this.defaultWrite(data, options)
    return this.__serialize(cValue, options, data)
  }

  __shouldDeserialize(value, options, data) {
    if (this.__readAction === ABORT) {
      throw new Error(`Field ${this.name} is configured to reject reading ` +
        'its value')
    }

    if (this.__readAction === IGNORE) return false

    // this.__readAction === ALLOW
    return true
  }

  __deserialize(value, options, data) {
    // Possibly implement deserialize() in subclasses
    return this.deserialize(value, options, data)
  }

  // eslint-disable-next-line class-methods-use-this
  deserialize(value, options, data) {
    // Let subclasses implement their own deserialize()
    return value
  }

  __shouldDeserializeNoValue(options, data) {
    const {
      processMissingFields = false,
    } = options

    if (this.__readNilAction === IGNORE) return false

    if (this.__readNilAction === CALL_DEFAULT_ALWAYS) return true

    if (
      this.readNilIf
        ? this.readNilIf(data, options)
        : processMissingFields
    ) {
      if (this.__readNilAction === ABORT) {
        throw new Error(
          `Field ${this.name} requires a value, but none is stored`)
      }

      return [USE_DEFAULT, CALL_DEFAULT].includes(this.__readNilAction)
    }

    return false
  }

  __deserializeNoValue(options, data) {
    if (this.__readNilAction === USE_DEFAULT) {
      return this.defaultRead
    }

    // CALL_DEFAULT, CALL_DEFAULT_ALWAYS
    const cValue = this.defaultRead(data, options)
    return this.__deserialize(cValue, options, data)
  }
}


function validateOnOptions(options, allowedValues, default_) {
  return Object.entries(options).reduce((acc, [name, value]) => {
    let cValue = value
    if (value == null) cValue = default_
    if (!Object.values(allowedValues).includes(cValue)) {
      throw new Error(`'${name}' must be one of ${
        Object.keys(allowedValues).join(', ')}`)
    }
    acc[name] = cValue
    return acc
  }, {})
}
