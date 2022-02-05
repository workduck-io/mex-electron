/**
 * ## Order of transformations
 *
 * Each value function recieves the old object value.
 *
 * 1. Add
 * 2. Update
 * 2. Move
 * 3. Delete
 *
 */

import { FileData } from '../types/data'
import { mog } from './lib/helper'
import testdata from './ruddhi_mex.json'

type getValuefn = (obj?: any) => string

interface Add {
  key: string
  // Get the value for the new key, the old obj is passed as well as the data.
  value: getValuefn
}

interface Move {
  from: string
  to: string
  // If not provided, old value is used
  value?: getValuefn
}

interface Update {
  key: string
  value: getValuefn
}

interface GeneralTransform {
  add?: Add[]
  // Can also be used to update a value
  update?: Update[]
  // Can also be used to update a value
  move?: Move[]
  // Array of keys to be deleted
  delete?: string[]
}

// These are applied to the elements (Object) of the array
interface ArrayTransform extends GeneralTransform {
  type: 'ArrayTransform'
}

// These are applied to the value (Object) of the keys
interface ObjectTransform extends GeneralTransform {
  type: 'ObjectTransform'
}

// These are applied to the value (Object) of the keys
interface CustomTransform extends GeneralTransform {
  type: 'Custom'
  custom: string
}

// // These are applied to the array of values (Object) of the keys
// interface ArrayedObjectTransform extends GeneralTransform {
//   type: 'ArrayedObjectTransform'
// }

interface VersionTransformation {
  // Version of mex.
  // Keeps incrementing transforms till it reaches the version for the update
  version: string

  // The keys on which transforms will be applied
  keys?: Record<string, ArrayTransform | ObjectTransform | CustomTransform>
}

export const Transformations: () => VersionTransformation = () => {
  const ilinks: ArrayTransform = {
    type: 'ArrayTransform',
    add: [],
    delete: ['text', 'value'],
    move: [
      { from: 'key', to: 'path' },
      { from: 'uid', to: 'nodeid' }
    ]
  }
  return {
    version: 'v0.7.0',
    keys: {
      ilinks,
      linkCache: {
        type: 'Custom',
        custom: 'ArrayedObjectTransform',
        add: [],
        delete: [],
        move: [
          {
            from: 'uid',
            to: 'nodeid'
          }
        ]
      },
      tags: {
        type: 'ArrayTransform',
        add: [],
        delete: ['key', 'text'],
        move: [],
        update: [{ key: 'value', value: (tag) => tag.key }]
      },

      archive: ilinks
    }
  }
}

export const applyAddTransform = (ob: any, t: Add[]): any => {
  return {
    ...ob,
    ...t.reduce((p, c) => ({ ...p, [c.key]: c.value(ob) }), {})
  }
}

export const applyDeleteTransform = (ob: any, t: string[]): any => {
  const newOb = { ...ob }
  t.forEach((s) => {
    delete newOb[s]
  })
  return newOb
}

export const applyMoveTransform = (ob: any, t: Move[]): any => {
  const newOb = { ...ob }
  t.forEach((s) => {
    newOb[s.to] = s.value !== undefined ? s.value(ob) : newOb[s.from]
    delete newOb[s.from]
  })
  // console.log('\n\n\nMoving: ', JSON.stringify({ ob, t }, null, 2))
  return newOb
}

export const applyUpdateTransform = (ob: any, t: Update[]) => {
  const newOb = { ...ob }
  t.forEach((u) => {
    newOb[u.key] = u.value(ob)
  })
  return newOb
}

export const applyGeneralTransform = (ob: any, t: GeneralTransform) => {
  const afterAdd = t.add ? applyAddTransform(ob, t.add) : ob
  const afterUpdate = t.update ? applyUpdateTransform(afterAdd, t.update) : ob
  const afterMove = t.move ? applyMoveTransform(afterUpdate, t.move) : ob
  const afterDelete = t.delete ? applyDeleteTransform(afterMove, t.delete) : ob
  return afterDelete
}

export const applyArrayTransformation = (a: any[], t: ArrayTransform): any[] => {
  const newa = a.map((ob) => applyGeneralTransform(ob, t))
  return newa
}

export const applyObjectTransform = (rec: Record<string, any>, t: ObjectTransform) => {
  return Object.entries(rec).reduce((p, c) => {
    const [k, v] = c
    console.log('\n\n\nObjectified Transform: ', JSON.stringify({ rec, c, k, v }, null, 2))
    return {
      ...p,
      [k]: applyGeneralTransform(v, t)
    }
  }, {})
}

export const applyArrayedObjectTransform = (rec: Record<string, Array<any>>, t: CustomTransform) => {
  return Object.entries(rec).reduce((p, c) => {
    const [k, v] = c
    console.log('\n\n\nObjectified Transform: ', JSON.stringify({ rec, c, k, v }, null, 2))
    return {
      ...p,
      [k]: v.map((ob) => applyGeneralTransform(ob, t))
    }
  }, {})
}

export const applyTransform = (d: any, t: VersionTransformation): any => {
  const newD = { ...d }
  Object.entries(t.keys).map(([k, t]) => {
    switch (t.type) {
      case 'ArrayTransform': {
        newD[k] = applyArrayTransformation(d[k], t)
        break
      }
      case 'ObjectTransform': {
        break
      }
      case 'Custom': {
        switch (t.custom) {
          case 'ArrayedObjectTransform': {
            newD[k] = applyArrayedObjectTransform(d[k], t)
          }
        }
        break
      }
    }
  })
  return newD
}

export const testTransforms = () => {
  const t = Transformations()
  const tdata = applyTransform(testdata, t)

  console.log('Hellow', JSON.stringify({ testdata, tdata }, null, 2))
  // mog('We are transforming', )
}

testTransforms()
