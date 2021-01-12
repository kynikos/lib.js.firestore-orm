// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


module.exports = class _Schema {
  constructor(...fields) {
    this.fields = fields.reduce((acc, field) => {
      if (field.name in acc) {
        throw new Error(`Duplicated field name: ${field.name}`)
      }
      acc[field.name] = field
      return acc
    }, {})
  }

  __iterateFields({
    data, shouldHandleFound, handleFound, shouldHandleNotFound, handleNotFound,
    onlyTheseFields, ignoreExtraneousFields,
  }) {
    const cData = {...data}

    const sData = Object.values(this.fields).reduce(
      (acc, field) => {
        if (field.name in cData) {
          const value = cData[field.name]
          if (shouldHandleFound(field, value)) {
            acc[field.name] = handleFound(field, value)
          }
          delete cData[field.name]
        } else if (
          shouldHandleNotFound(field) &&
          // TODO: Support FieldPath objects in onlyTheseFields, but note that
          //       for the moment I'm restricting all field names to be of the
          //       "simple" format in _Field.js ([a-zA-Z_][0-9a-zA-Z_]*), so
          //       using FieldPath shouldn't be necessary; there are other
          //       places where FieldPath should be supported, but it would be
          //       harder; for example in DocumentReference's set() and update()
          //       https://firebase.google.com/docs/firestore/quotas#limits
          (!onlyTheseFields || onlyTheseFields.includes(field.name))
        ) {
          acc[field.name] = handleNotFound(field)
        }
        return acc
      },
      {},
    )

    if (!ignoreExtraneousFields && Object.keys(cData).length > 0) {
      throw new Error(`Extraneous field names: ${
        Object.keys(cData).join(', ')}`)
    }

    return sData
  }

  serialize(data, options = {}) {
    const {
      onlyTheseFields = false,
      ignoreExtraneousFields = false,
    } = options

    return this.__iterateFields({
      data,
      shouldHandleFound: (field, value) => {
        return field.__shouldSerialize(value, options, data)
      },
      handleFound: (field, value) => {
        // Do pass *all* the options to __serialize(), i.e. do not
        // filter 'processMissingFields' etc. out because nested FieldSchema
        // instances may use them aagin
        return field.__serialize(value, options, data)
      },
      shouldHandleNotFound: (field) => {
        return field.__shouldSerializeNoValue(options, data)
      },
      handleNotFound: ((field) => {
        // Do pass *all* the options to __serializeNoValue(), i.e. do not
        // filter 'processMissingFields' etc. out because nested FieldSchema
        // instances may use them aagin
        return field.__serializeNoValue(options, data)
      }),
      onlyTheseFields,
      ignoreExtraneousFields,
    })
  }

  deserialize(data, options = {}) {
    const {
      onlyTheseFields = false,
      ignoreExtraneousFields = false,
    } = options

    return this.__iterateFields({
      data,
      shouldHandleFound: (field, value) => {
        return field.__shouldDeserialize(value, options, data)
      },
      handleFound: (field, value) => {
        // Do pass *all* the options to __deserialize(), i.e. do not
        // filter 'processMissingFields' etc. out because nested FieldSchema
        // instances may use them aagin
        return field.__deserialize(value, options, data)
      },
      shouldHandleNotFound: (field) => {
        return field.__shouldDeserializeNoValue(options, data)
      },
      handleNotFound: ((field) => {
        // Do pass *all* the options to __deserializeNoValue(), i.e. do not
        // filter 'processMissingFields' etc. out because nested FieldSchema
        // instances may use them aagin
        return field.__deserializeNoValue(options, data)
      }),
      onlyTheseFields,
      ignoreExtraneousFields,
    })
  }

  deserializeField(fieldName, value, data, options) {
    return this.fields[fieldName].__deserialize(value, options, data)
  }
}
