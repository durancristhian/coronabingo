const isObjectFulfilled = (obj: Object) =>
  obj && Object.values(obj).every(Boolean)

export default isObjectFulfilled
