export function deepEquals(obj1: any, obj2: any): boolean {
  if (!obj1 || !obj2) return false
  return Object.keys(obj1).every((key) => {
    if (obj2[key] === undefined) return false;
    if (typeof (obj1[key]) == "object" && typeof (obj2[key] == "object")) {
      return deepEquals(obj1[key], obj2[key])
    }
    else {
      return obj1[key] === obj2[key]
    }
  })
}