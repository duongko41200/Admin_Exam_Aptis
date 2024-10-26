const removeEmptyProperties = (obj: { [key: string]: string | number }) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key]
    }
  })
  return obj
}

export default removeEmptyProperties
