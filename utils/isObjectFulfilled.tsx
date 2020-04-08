const isObjectFulfilled = (obj: Record<string, any>) =>
  obj && Object.values(obj).every(Boolean)

export default isObjectFulfilled
