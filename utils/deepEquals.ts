export function deepEquals(obj1: any, obj2: any): boolean {
  if (obj1 === undefined || obj2 === undefined) return false
  if (obj1 === null || obj2 === null) return true
  if (Array.isArray(obj1) != Array.isArray(obj2)) return false
  else if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length != obj2.length) return false
    return obj1.every((item: any, index: number) => {
      return deepEquals(item, obj2[index])
    })
  }
  return Object.keys(obj1).every((key) => {
    if (obj2[key] === undefined) {
      return false
    }
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      if (obj1[key].length != obj2[key].length) return false
      return obj1[key].every((item: any, index: number) => {
        return deepEquals(item, obj2[key][index])
      })
    }
    if (typeof (obj1[key]) == "object" && typeof (obj2[key] == "object")) {
      return deepEquals(obj1[key], obj2[key])
    }
    else {
      return obj1[key] === obj2[key]
    }
  })
}