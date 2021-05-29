import { BlockTree } from '../../Types/tree';
// npm install --save-dev @iconify/react @iconify-icons/ri

const sampleTree: BlockTree = {
  title: 'Tree',
  id: 'root',
  path: 'root',
  icon: 'tree',
  children: [
    {
      title: '@',
      id: '@',
      path: '@',
      children: [],
    },
    {
      title: 'Pursuits',
      id: 'pursuit',
      path: 'pursuit',
      children: [
        {
          title: 'chess',
          id: 'pursuits.chess',
          path: 'pursuits.chess',
          children: [],
        },
        {
          title: 'Painting',
          id: 'pursuits.painting',
          path: 'pursuits.painting',
          children: [],
        },
      ],
    },
    {
      title: 'Library',
      id: 'lib',
      path: 'lib',
      children: [
        {
          title: 'Books',
          id: 'lib.books',
          path: 'lib.books',
          children: [
            {
              title: 'The Night',
              id: 'lib.books.the-night',
              path: 'lib.books.the-night',
              children: [],
            },
            {
              title: 'Once Upon a Time',
              id: 'lib.books.once-upon-a-time',
              path: 'lib.books.once-upon-a-time',
              children: [
                {
                  title: 'chapters',
                  id: 'lib.books.once-upon-a-time.chapters',
                  path: 'lib.books.once-upon-a-time.chapters',
                  children: [],
                },
                {
                  title: 'quotes',
                  id: 'lib.books.once-upon-a-time.quotes',
                  path: 'lib.books.once-upon-a-time.quotes',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          title: 'Series',
          id: 'lib.series',
          path: 'lib.series',
          children: [
            {
              title: 'Alma Matters',
              id: 'lib.series.alma-matters',
              path: 'lib.series.alma-matters',
              children: [],
            },
            {
              title: 'Yes Minister',
              id: 'lib.yes-minister',
              path: 'lib.yes-minister',
              children: [
                {
                  title: 'Chess',
                  id: 'lib.yes-minister.chess',
                  path: 'lib.yes-minister.chess',
                  children: [],
                },
                {
                  title: 'Painting',
                  id: 'lib.yes-minister.painting',
                  path: 'lib.yes-minister.painting',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
export default sampleTree;
