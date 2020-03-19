const isObjectFulfilled = obj => obj && Object.values(obj).every(Boolean)

export default isObjectFulfilled
