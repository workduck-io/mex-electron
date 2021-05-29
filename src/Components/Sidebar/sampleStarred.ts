import { BlockTree } from '../../Types/tree';

const starred: BlockTree = {
  title: 'Starred',
  id: '__Starred__',
  path: '__Starred__',
  icon: 'starred',
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
      ],
    },
  ],
};
export default starred;
