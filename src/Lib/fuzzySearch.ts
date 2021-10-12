import Fuse from 'fuse.js'

// const sampleData = Array(1000000)
//   .fill(0)
//   .map(() => {
//     return {
//       name: faker.name.firstName(0),
//     }
//   })

// const random = ['', 'Ron', 'Don', 'Swan', 'S', 'SA', '4837', 'fwiu', 'tyu', 'uu']

export const fuzzySearch = (list: any[], text: string, options: Fuse.IFuseOptions<any>) => {
  const fuse = new Fuse(list, options)
  return fuse.search(text).map((l) => l.item)
}
