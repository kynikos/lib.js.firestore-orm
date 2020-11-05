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
  const sData = docRef.schema.serialize(data)

  const res = await createFn(sData)

  await docRef.database.__hooks.afterCreatingDocument &&
    docRef.database.__hooks.afterCreatingDocument({
      document: docRef,
      sData,
      batch,
    })

  // TODO: Return the native WriteResult object in a custom class with the
  //       sData?
  // return res
  return sData
}


exports.deleteDocument = async function deleteDocument({
  docRef, precondition, batch, deleteFn,
}) {
  // TODO: Wrap the returned native WriteResult object in a custom class?
  const res = await deleteFn(precondition)

  await docRef.database.__hooks.afterDeletingDocument &&
    docRef.database.__hooks.afterDeletingDocument({
      document: docRef,
      batch,
    })

  return res
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

  const sData = docRef.schema.serialize(data, sOptions)

  const res = await setFn(sData, options)

  await docRef.database.__hooks.afterSettingDocument &&
    docRef.database.__hooks.afterSettingDocument({
      document: docRef,
      sData,
      batch,
    })

  // TODO: Return the native WriteResult object in a custom class with the
  //       sData?
  // return res
  return sData
}


exports.updateDocument = async function updateDocument({
  docRef, dataOrField, preconditionOrValues, batch, updateFn,
}) {
  // Use 'ignoreAllMissingFields' when updating, otherwise any unspecified
  // fields would be overwritten with their default values
  const sData = docRef.schema.serialize(dataOrField, {
    ignoreAllMissingFields: true,
    onlyTheseFields: false,
  })

  const res = await updateFn(sData, ...preconditionOrValues)

  await docRef.database.__hooks.afterUpdatingDocument &&
    docRef.database.__hooks.afterUpdatingDocument({
      document: docRef,
      sData,
      batch,
    })

  // TODO: Return the native WriteResult object in a custom class with the
  //       sData?
  // return res
  return sData
}
