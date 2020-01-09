import * as React from "react"
import { Card, CardContent, Grid } from "@material-ui/core"

// Personal Info Form
import PersonalInfoForm from "../PersonalInfoForm/PersonalInfoForm"

// Custom components
import CustomButton from "Components/MedicalForm/Helpers/CustomButton"

import {
  initialConfirmConditionDescription,
  symptomsConfirmDescription,
  relatedConditionsConfirmDescription
} from "./actionInfoDisplay/descriptions"

// Headers
import FormHeaderLogo from "./Headers/FormHeaderLogo"
import Header from "./Headers/Header"

// core helper function
import {
  populateSymptoms,
  getInitialIssues,
  populateConditions
} from "util/loadMedFormCheckBoxes"

// reducers
import {
  symsCondsMapReducer,
  conditionsArrayReducer
} from "stores/medFormReducers"

// frontend styling
import "./MedicalForm.css"

// store the issues somewhere
const initIssues: string[] = [
  "Heart attack",
  "Hernia",
  "Abortion",
  "Urinary tract infection"
]

const MedicalForm = (): JSX.Element => {
  const [symsCondsMap, symsCondsMapDispatch] = React.useReducer(
    symsCondsMapReducer,
    {}
  )
  const [conditionsArray, condsArrDispatch] = React.useReducer(
    conditionsArrayReducer,
    []
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

  // FIXME: the symsCondsMap object indefinitely gets updated, figure out why
  // same with the conditionsArry object, it only works for the initial issues checkbox

  const handleChecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      condsArrDispatch({ type: "pushCondition", condition: conditionName! })
    } else {
      symsCondsMapDispatch({
        type: "pushSymptom",
        payload: { conditionName: conditionName!, symptom: val }
      })
    }
  }

  // FIXME: directly mutating the state

  const handleUnchecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      condsArrDispatch({ type: "removeCondition", condition: conditionName! })
    } else {
      symsCondsMapDispatch({
        type: "removeSymptom",
        payload: { conditionName: conditionName!, symptom: val }
      })
    }
  }

  // TODO: the two get conditions and symptoms buttons can be separated to distinct components
  // think about how to layer it out more distinctively
  return (
    <React.Fragment>
      <div className="formBody">
        {/* The logo is too big and odd when embedded in the chatbot interface  */}
        <FormHeaderLogo />
        <br />
        <br />
        <br />

        <div className="cardMargin">
          <Header text="Your Details" />
        </div>

        <PersonalInfoForm />

        <br />
        <br />

        <div className="cardMargin">          
          <Header text="Your Health Condition(s)"/>
        </div>

        {/* Conditions and Symptoms card below */}
        <div className="cardMargin">
          <Grid container={true} alignItems="center" justify="center">
            <Grid item={true} xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <div className="formFont">
                    <h2 className="description">
                      {initialConfirmConditionDescription}
                    </h2>
                    <div className="centerInitIssue">
                      <div className="horizontallyCenterInitIssue">
                        {getInitialIssues(
                          initIssues,
                          handleChecked,
                          handleUnchecked
                        )}
                      </div>
                    </div>
                    <br />
                    {symptomsCheckBoxes}
                    <br />
                    {symptomsAndConditions.length > 0 ? (
                      <h2 className="description">
                        {symptomsConfirmDescription}
                      </h2>
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
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
        <br />
        <br />
      </div>
    </React.Fragment>
  )
}

export default MedicalForm
