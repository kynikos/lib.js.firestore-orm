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
      ? subReference.make(reference)
      : (typeof subReference === 'function'
        ? (...args) => subReference(...args, reference)
        : subReference
      )
  }

  return structure
}
