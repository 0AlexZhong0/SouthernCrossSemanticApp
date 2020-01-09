import {
  symsCondMapType,
  symsMapDispatchActionType,
  condsArrDispatchActionType
} from "types/medForm"

// FIXME: not sure if this is the best way to update a dictionary object
export const symsCondsMapReducer = (
  mapState: symsCondMapType = {},
  action: symsMapDispatchActionType
) => {
  // FIXME: don't think it is a good practice doing conditional statements here, gets the job done so far
  const conditionName: string = action.payload!.conditionName
  const symptom: string = action.payload!.symptom
  switch (action.type) {
    case "pushSymptom":
      if (!(conditionName in mapState))
        return { ...mapState, [conditionName]: [symptom] }
      else
        return {
          ...mapState,
          [conditionName]: [...mapState[conditionName], symptom]
        }
    case "removeSymptom":
      if (mapState[conditionName].length === 1) {
        const cloneMap = {...mapState}
        delete cloneMap[conditionName]
        return cloneMap
      }
      else
        return {
          ...mapState,
          [conditionName]: [
            ...mapState[conditionName].filter((sym: string) => sym !== symptom)
          ]
        }
    default:
      return mapState
  }
}

export const conditionsArrayReducer = (
  condsArrState: string[],
  action: condsArrDispatchActionType
) => {
  switch (action.type) {
    case "pushCondition":
      return [...condsArrState, action.condition]
    case "removeCondition":
      return [...condsArrState].filter(
        (cond: string) => cond !== action.condition
      )
    default:
      return condsArrState
  }
}
