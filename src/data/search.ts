export enum indexNames {
  'node' = 'node',
  'snippet' = 'snippet',
  'archive' = 'archive'
}

export const indexKeys: Record<indexNames, string[]> = {
  [indexNames.node]: ['title.cfg', 'title.ctx', 'title.map', 'text.cfg', 'text.ctx', 'text.map', 'reg', 'store', 'tag'],
  [indexNames.archive]: [
    'title.cfg',
    'title.ctx',
    'title.map',
    'text.cfg',
    'text.ctx',
    'text.map',
    'reg',
    'store',
    'tag'
  ],
  [indexNames.snippet]: [
    'title.cfg',
    'title.ctx',
    'title.map',
    'text.cfg',
    'text.ctx',
    'text.map',
    'reg',
    'store',
    'tag'
  ]
}

export const diskIndex: Record<indexNames, any> = {
  node: {},
  snippet: {},
  archive: {}
}
