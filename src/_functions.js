// This file is part of firestore-orm
// Copyright (C) 2020-present Dario Giovannetti <dev@dariogiovannetti.net>
// Licensed under MIT
// https://github.com/kynikos/lib.js.firestore-orm/blob/master/LICENSE


exports.makeStructure = function makeStructure(
  reference,
  subStructure,
  SubRefClass,
) {
  if (subStructure == null) return null

  const structure = {}

  for (const [subRefName, subReference] of Object.entries(subStructure)) {
    structure[subRefName] = subReference instanceof SubRefClass
      ? subReference.__install(reference).structure
      : (typeof subReference === 'function'
        ? (...args) => subReference(...args, reference)
        : subReference
      )
  }

  return structure
}


exports.createDocument = async function createDocument({
  docRef, data, batch, createFn,
}) {
  const serializedData = docRef.schema.serialize(data)

  const beforeData = docRef.database.__hooks.beforeCreatingDocument &&
    await docRef.database.__hooks.beforeCreatingDocument({
      document: docRef,
      serializedData,
      batch,
    })

  const writeResult = await createFn(serializedData)

  docRef.database.__hooks.afterCreatingDocument &&
    await docRef.database.__hooks.afterCreatingDocument({
      document: docRef,
      beforeData,
      serializedData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class with
  //       the serializedData?
  // return writeResult
  return serializedData
}


exports.deleteDocument = async function deleteDocument({
  docRef, precondition, batch, deleteFn,
}) {
  const beforeData = docRef.database.__hooks.beforeDeletingDocument &&
    await docRef.database.__hooks.beforeDeletingDocument({
      document: docRef,
      batch,
    })

  const writeResult = await deleteFn(precondition)

  docRef.database.__hooks.afterDeletingDocument &&
    await docRef.database.__hooks.afterDeletingDocument({
      document: docRef,
      beforeData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class?
  return writeResult
}


exports.setDocument = async function setDocument({
  docRef, data, options, batch, setFn,
}) {
  let sOptions

  if (
    !options ||
    // XOR
    ((options.merge == null) === (options.mergeFields == null))
  ) {
    throw new Error("set() must explicitly specify either the 'merge' " +
      "or the 'mergeFields' option, not both or neither")
  } else if (options.mergeFields == null) {
    sOptions = {
      ignoreAllMissingFields: options.merge,
      onlyTheseFields: false,
    }
  } else {
    sOptions = {
      ignoreAllMissingFields: false,
      onlyTheseFields: options.mergeFields,
    }
  }

  const serializedData = docRef.schema.serialize(data, sOptions)

  const beforeData = docRef.database.__hooks.beforeSettingDocument &&
    await docRef.database.__hooks.beforeSettingDocument({
      document: docRef,
      serializedData,
      batch,
    })

  const writeResult = await setFn(serializedData, options)

  docRef.database.__hooks.afterSettingDocument &&
    await docRef.database.__hooks.afterSettingDocument({
      document: docRef,
      beforeData,
      serializedData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class with
  //       the serializedData?
  // return writeResult
  return serializedData
}


exports.updateDocument = async function updateDocument({
  docRef, dataOrField, preconditionOrValues, batch, updateFn,
}) {
  // Use 'ignoreAllMissingFields' when updating, otherwise any unspecified
  // fields would be overwritten with their default values
  const serializedData = docRef.schema.serialize(dataOrField, {
    ignoreAllMissingFields: true,
    onlyTheseFields: false,
  })

  const beforeData = docRef.database.__hooks.beforeUpdatingDocument &&
    await docRef.database.__hooks.beforeUpdatingDocument({
      document: docRef,
      serializedData,
      batch,
    })

  const writeResult = await updateFn(serializedData, ...preconditionOrValues)

  docRef.database.__hooks.afterUpdatingDocument &&
    await docRef.database.__hooks.afterUpdatingDocument({
      document: docRef,
      beforeData,
      serializedData,
      writeResult,
      batch,
    })

  // TODO: Return the native WriteResult object wrapped in a custom class with
  //       the serializedData?
  // return writeResult
  return serializedData
}
