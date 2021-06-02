import TreeNode from '../../Types/tree';

const sampleRCTree: TreeNode[] = [
  {
    title: '@',
    id: '@',
    key: '@',
    path: '@',
    mex_icon: undefined,
    children: [],
  },
  {
    title: 'Pursuits',
    id: 'pursuits',
    key: 'pursuits',
    path: 'pursuits',
    mex_icon: 'pursuits',
    children: [
      {
        title: 'chess',
        id: 'pursuits.chess',
        key: 'pursuits.chess',
        path: 'pursuits.chess',
        mex_icon: undefined,
        children: [],
      },
      {
        title: 'Painting',
        id: 'pursuits.painting',
        key: 'pursuits.painting',
        path: 'pursuits.painting',
        mex_icon: undefined,
        children: [],
      },
    ],
  },
  {
    title: 'Library',
    id: 'lib',
    key: 'lib',
    path: 'lib',
    mex_icon: undefined,
    children: [
      {
        title: 'Books',
        id: 'lib.books',
        key: 'lib.books',
        path: 'lib.books',
        mex_icon: undefined,
        children: [
          {
            title: 'The Night',
            id: 'lib.books.the-night',
            key: 'lib.books.the-night',
            path: 'lib.books.the-night',
            mex_icon: undefined,
            children: [],
          },
          {
            title: 'Once Upon a Time',
            id: 'lib.books.once-upon-a-time',
            key: 'lib.books.once-upon-a-time',
            path: 'lib.books.once-upon-a-time',
            mex_icon: undefined,
            children: [
              {
                title: 'chapters',
                id: 'lib.books.once-upon-a-time.chapters',
                key: 'lib.books.once-upon-a-time.chapters',
                path: 'lib.books.once-upon-a-time.chapters',
                mex_icon: undefined,
                children: [],
              },
              {
                title: 'quotes',
                id: 'lib.books.once-upon-a-time.quotes',
                key: 'lib.books.once-upon-a-time.quotes',
                path: 'lib.books.once-upon-a-time.quotes',
                mex_icon: undefined,
                children: [],
              },
            ],
          },
        ],
      },
      {
        title: 'Series',
        id: 'lib.series',
        key: 'lib.series',
        path: 'lib.series',
        mex_icon: undefined,
        children: [
          {
            title: 'Alma Matters',
            id: 'lib.series.alma-matters',
            key: 'lib.series.alma-matters',
            path: 'lib.series.alma-matters',
            mex_icon: undefined,
            children: [],
          },
          {
            title: 'Yes Minister',
            id: 'lib.series.yes-minister',
            key: 'lib.series.yes-minister',
            path: 'lib.series.yes-minister',
            mex_icon: undefined,
            children: [
              {
                title: 'Chess',
                id: 'lib.series.yes-minister.chess',
                key: 'lib.series.yes-minister.chess',
                path: 'lib.series.yes-minister.chess',
                mex_icon: undefined,
                children: [],
              },
              {
                title: 'Painting',
                id: 'lib.series.yes-minister.painting',
                key: 'lib.series.yes-minister.painting',
                path: 'lib.series.yes-minister.painting',
                mex_icon: undefined,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default sampleRCTree;
