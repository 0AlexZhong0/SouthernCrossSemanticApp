import * as React from "react"

// The components below are very similar, can group them into one function
export const ConditionNameAndRelatedSymptoms = (props: {
  conditionName: string
  symptomsCheckBoxes: JSX.Element[]
}): JSX.Element => {
  const { conditionName, symptomsCheckBoxes } = props
  const description: string = `Symptoms of ${conditionName}`
  return (
    <div>
      <strong>{description}</strong>
      <br />
      {symptomsCheckBoxes}
    </div>
  )
}

export const ConditionNameAndRelatedConditions = (props: {
  conditionName: string
  conditionCheckBoxes: JSX.Element[]
}): JSX.Element => {
  const { conditionName, conditionCheckBoxes } = props
  const description: string = `Related conditions below, based on your symptoms of ${conditionName}`
  return (
    <div>
      <h3>{description}</h3>
      <br />
      {conditionCheckBoxes}
    </div>
  )
}

export const ConditionNameWithNoRelatedConditions = (props: {
  conditionName: string
}): JSX.Element => {
  const description: string = `No related conditions to ${props.conditionName} found`
  return <h3>{description}</h3>
}
