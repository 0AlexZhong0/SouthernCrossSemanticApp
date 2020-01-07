import * as React from "react"
import { Card, CardContent } from "@material-ui/core"

// Personal Info Form
import PersonalInfoForm from "../PersonalInfoForm/PersonalInfoForm"

// Custom components
import CustomButton from "Components/MedicalForm/Helpers/CustomButton"

import {
  initialConfirmConditionDescription,
  symptomsConfirmDescription,
  relatedConditionsConfirmDescription
} from "./actionInfoDisplay/descriptions"

// core helper function
import {
  populateSymptoms,
  getInitialIssues,
  populateConditions
} from "util/medicalForm"

// core types
import { symsMapDispatchActionType, symsCondMapType } from "types/medicalForm"

// frontend styling
import logo from "logo.jpg"
import "./MedicalForm.css"

// store the issues somewhere
const initIssues: string[] = [
  "Heart attack",
  "Hernia",
  "Abortion",
  "Urinary tract infection"
]

const initsymsCondsMap: symsCondMapType = {}

// TODO: use reducer to update the symsCondsMap object
// FIXME: not sure if this is the best way to update a dictionary object
const symsCondsMapReducer = (
  state: symsCondMapType,
  action: symsMapDispatchActionType
) => {
  const conditionName: string = action.payload!.conditionName
  const symptom: string = action.payload!.symptom
  switch (action.type) {
    case "addFirstSymptom":
      console.log("Add first ...")
      console.log(Object.assign({}, state, { [conditionName]: [symptom] }))
      return Object.assign({}, state, { [conditionName]: [symptom] })
    case "pushSymptom":
      console.log("Pushing ...")
      console.log(
        Object.assign({}, state, {
          [conditionName]: [...state[conditionName], symptom]
        })
      )
      return Object.assign({}, state, {
        [conditionName]: [...state[conditionName], symptom]
      })
    case "removeSymptom":
      return Object.assign({}, state, {
        [conditionName]: [...state[conditionName]].filter(
          (sym: string) => sym !== symptom
        )
      })
    case "reset":
      return {}
    default:
      return state
  }
}

const MedicalForm = (): JSX.Element => {
  // FIXME: I am basically directly mutating all the state objects below
  const [symsCondsMap, symsCondsMapDispatch] = React.useReducer(
    symsCondsMapReducer,
    initsymsCondsMap
  )
  const [symptomsAndConditions, setSymptomsAndConditions] = React.useState(
    [] as JSX.Element[]
  )
  const [symptomsCheckBoxes, setSymptomsCheckBoxes] = React.useState(
    [] as JSX.Element[]
  )
  const [conditionsCheckBoxes, setConditionsCheckBoxes] = React.useState(
    [] as JSX.Element[]
  )
  const [conditionsArray, setConditionsArray] = React.useState([] as string[])

  // FIXME: the symsCondsMap object indefinitely gets updated, figure out why
  const handleChecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      setConditionsArray([...conditionsArray, val])
    } else {
      // assign the key an array with one symptom first, if the key is not in the object initially
      if (!(conditionName! in symsCondsMap))
        symsCondsMapDispatch({
          type: "addFirstSymptom",
          payload: { conditionName: conditionName!, symptom: val }
        })
      else
        symsCondsMapDispatch({
          type: "pushSymptom",
          payload: { conditionName: conditionName!, symptom: val }
        })
    }

    console.log(`conditionsArray is ${JSON.stringify(conditionsArray)}`)
    console.log(`symsCondsMap is ${JSON.stringify(symsCondsMap)}`)
  }

  // FIXME: directly mutating the state
  const handleUnchecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      setConditionsArray(
        [...conditionsArray].filter((condition: string) => condition !== val)
      )
    } else {
      if (symsCondsMap[conditionName!].length === 1)
        // last symptom left in the array, reset the object
        symsCondsMapDispatch({ type: "reset" })
      else {
        symsCondsMapDispatch({
          type: "removeSymptom",
          payload: { conditionName: conditionName!, symptom: val }
        })
      }
    }
  }

  // can refactor the conditional rendering below
  // change it to a loadComponent similar type of functions
  return (
    <React.Fragment>
      {/* The logo is too big and odd when embedded in the chatbot interface  */}
      <img className="headerLogo" src={logo} alt="SouthernCross Logo" />
      <br />
      <PersonalInfoForm />
      <br />

      {/* Conditions and Symptoms card below */}
      <Card>
        <CardContent>
          <h2 className="description">{initialConfirmConditionDescription}</h2>
          <div className="horizontallyCenterInitIssue">
            {getInitialIssues(initIssues, handleChecked, handleUnchecked)}
          </div>
          <br />
          {symptomsCheckBoxes}
          <br />
          {symptomsAndConditions.length > 0 ? (
            <h2 className="description">{symptomsConfirmDescription}</h2>
          ) : null}
          {symptomsAndConditions}
          <br />
          {conditionsCheckBoxes.length > 0 ? (
            <h2 className="description">
              {relatedConditionsConfirmDescription}
            </h2>
          ) : null}
          {conditionsCheckBoxes}
          <div className="button">
            <CustomButton
              loadComponent={() =>
                populateSymptoms(
                  conditionsArray,
                  setSymptomsCheckBoxes,
                  setSymptomsAndConditions,
                  handleChecked,
                  handleUnchecked
                )
              }
              title="Get Symptoms"
            />
            <br />
            <br />
            <CustomButton
              loadComponent={() =>
                populateConditions(
                  symsCondsMap,
                  conditionsArray,
                  setConditionsCheckBoxes,
                  handleChecked,
                  handleUnchecked
                )
              }
              title="Get Related Conditions"
            />
          </div>
        </CardContent>
      </Card>
      <br />
    </React.Fragment>
  )
}

export default MedicalForm
