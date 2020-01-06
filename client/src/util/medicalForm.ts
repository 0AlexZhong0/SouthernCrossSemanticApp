export const removeOneElementFromArray = (
  array: any[],
  valToRemove: any
): void => {
  const toRemoveIndex: number = array.indexOf(valToRemove)
  array.splice(toRemoveIndex, 1) // in-place function to remove one element only
}

const fetchSymptomsInfo = (): void => {}
