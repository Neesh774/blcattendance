export function deepEquals(obj1: any, obj2: any): boolean {
  if (obj1 === undefined || obj2 === undefined) return false
  if (obj1 === null || obj2 === null) return true
  return Object.keys(obj1).every((key) => {
    if (obj2[key] === undefined) {
      return false
    }
    if (typeof (obj1[key]) == "object" && typeof (obj2[key] == "object")) {
      return deepEquals(obj1[key], obj2[key])
    }
    else {
      return obj1[key] === obj2[key]
    }
  })
}