export const capitalize = (str: string) => {
  return str[0].toUpperCase() + str.slice(1)
}

export const camelCase = (str: string) => {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
