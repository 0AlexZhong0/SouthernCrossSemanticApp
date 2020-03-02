import * as React from "react";
import { Card, CardContent, Grid } from "@material-ui/core";

// Personal Info Form
import PersonalInfoForm from "../personalInfoForm/PersonalInfoForm";

// Custom components
import FormHeaderLogo from "./headers/FormHeaderLogo";
import Header from "./headers/Header";

// core helper function
import {
  populateSymptoms,
  getInitialIssues,
  populateConditions
} from "utils/loadMedFormCheckBoxes";

import { initialConfirmConditionDescription } from "./descriptions";
import { handleCheckAction } from "types/medForm";

// reducers
import { symsCondsMapReducer, conditionsArrayReducer } from "stores/medFormReducers";

// frontend styling
import "./medicalForm.css";

import { PersonalInfoContext } from "contexts/PersonalInfoState";
import SymptomsOfConditions from "./SymptomsOfConditions";
import RelatedConditions from "./RelatedConditions";
import CTAButtonsGroup from "./CTAButtonsGroup";

export type ISymptomsOfCondition = {
  symptoms: string[];
  conditionName: string;
};

export type IRelatedConditionsOfSymptoms = {
  conditionNames: string[];
  selectedCondition: string;
};

// store the issues somewhere
const initIssues: string[] = ["Heart attack", "Hernia", "Kidney stones", "Urinary tract infection"];

const MedicalForm = (): JSX.Element => {
  // FIXME: the symsCondsMap object indefinitely gets updated, figure out why
  // same with the conditionsArry object, it only works for the initial issues checkbox
  const [symsCondsMap, symsCondsMapDispatch] = React.useReducer(symsCondsMapReducer, {});
  const [conditionsArray, condsArrDispatch] = React.useReducer(conditionsArrayReducer, []);

  const [symptomsOfCondition, setSymptomsOfCondition] = React.useState<ISymptomsOfCondition[]>();
  const [relatedConditions, setRelatedConditions] = React.useState<
    IRelatedConditionsOfSymptoms[]
  >();

  const { sex, dob } = React.useContext(PersonalInfoContext);

  const handleOnCheck: handleCheckAction = (symptom, isCondition, conditionName, type) => {
    if (type === "push") {
      if (isCondition) condsArrDispatch({ type: "pushCondition", condition: conditionName });
      else
        symsCondsMapDispatch({
          type: "pushSymptom",
          payload: { conditionName, symptom }
        });
    } else {
      if (isCondition) condsArrDispatch({ type: "removeCondition", condition: conditionName });
      else
        symsCondsMapDispatch({
          type: "removeSymptom",
          payload: { conditionName, symptom }
        });
    }
  };

  const handleOnGetSymptomsOfCondition = (conditionSymptomns: ISymptomsOfCondition[]) =>
    setSymptomsOfCondition(conditionSymptomns);

  const handleOnGetRelatedConditions = (relatedConds: IRelatedConditionsOfSymptoms[]) =>
    setRelatedConditions(relatedConds);

  return (
    <div className="backgroundImg">
      {/* The logo is too big and odd when embedded in the chatbot interface  */}
      {/* <FormHeaderLogo /> */}

      <Header text="Your Details" />
      <PersonalInfoForm />
      <Header text="Your Health Condition(s)" />

      {/* Conditions and Symptoms card below */}
      <Grid
        className="conditions-and-symptoms-container"
        container={true}
        alignItems="center"
        justify="center"
      >
        <Grid item={true} xs={12} sm={12} md={12}>
          <Card>
            <CardContent>
              <div>
                <h2 className="description">{initialConfirmConditionDescription}</h2>
                <div className="centerInitIssue">{getInitialIssues(initIssues, handleOnCheck)}</div>

                <SymptomsOfConditions
                  symptomsOfCondition={symptomsOfCondition}
                  handleOnCheck={handleOnCheck}
                />

                <RelatedConditions
                  relatedConditions={relatedConditions}
                  handleOnCheck={handleOnCheck}
                />

                <CTAButtonsGroup
                  populateSymptoms={() => {
                    populateSymptoms(conditionsArray, handleOnGetSymptomsOfCondition);
                  }}
                  populateRelatedConditions={() =>
                    populateConditions(
                      symsCondsMap,
                      conditionsArray,
                      handleOnGetRelatedConditions,
                      sex,
                      dob.year
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default MedicalForm;
