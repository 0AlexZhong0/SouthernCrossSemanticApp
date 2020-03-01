import * as React from "react";
import { Card, CardContent, Grid } from "@material-ui/core";

// Personal Info Form
import PersonalInfoForm from "../PersonalInfoForm/PersonalInfoForm";

// Custom components
import CustomButton from "Components/MedicalForm/Helpers/CustomButton";
import CustomCheckBox from "./Helpers/CustomCheckBox";
import FormHeaderLogo from "./Headers/FormHeaderLogo";
import Header from "./Headers/Header";

// Headers
import {
  initialConfirmConditionDescription,
  symptomsConfirmDescription,
  relatedConditionsConfirmDescription
} from "./descriptions";
import { handleCheckAction } from "types/medForm";

// core helper function
import {
  populateSymptoms,
  getInitialIssues,
  populateConditions
} from "utils/loadMedFormCheckBoxes";

// reducers
import { symsCondsMapReducer, conditionsArrayReducer } from "stores/medFormReducers";

// frontend styling
import "./MedicalForm.css";

import { PersonalInfoContext } from "contexts/PersonalInfoState";

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
          <Header text="Your Health Condition(s)" />
        </div>

        {/* Conditions and Symptoms card below */}
        <div className="cardMargin">
          <Grid container={true} alignItems="center" justify="center">
            <Grid item={true} xs={12} sm={12} md={12}>
              <Card>
                <CardContent>
                  <div className="formFont">
                    <h2 className="description">{initialConfirmConditionDescription}</h2>
                    <div className="centerInitIssue">
                      <div className="horizontallyCenterInitIssue">
                        {getInitialIssues(initIssues, handleOnCheck)}
                      </div>
                    </div>

                    {symptomsOfCondition && symptomsOfCondition.length > 0 ? (
                      <div>
                        <h2 className="description">{symptomsConfirmDescription}</h2>
                        {symptomsOfCondition.map((data, i) => {
                          const { conditionName, symptoms } = data;

                          return (
                            <div key={i}>
                              <strong>{`Symptoms of ${conditionName}`}</strong>
                              <br />
                              {symptoms.map((symptom, ind) => (
                                <CustomCheckBox
                                  displayText={symptom}
                                  isCondition={false}
                                  handleOnCheck={handleOnCheck}
                                  conditionName={conditionName}
                                  key={ind}
                                />
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    <br />

                    {relatedConditions && relatedConditions.length > 0 ? (
                      <div
                        style={{
                          flex: "1",
                          flexDirection: "column"
                        }}
                      >
                        <h2 className="description">{relatedConditionsConfirmDescription}</h2>
                        {relatedConditions.map((data, i) => {
                          const { conditionNames, selectedCondition } = data;

                          return conditionNames.length > 0 ? (
                            <div key={i}>
                              <strong>{`Related conditions below, based on your symptoms of ${selectedCondition}`}</strong>
                              <br />
                              {conditionNames.map((condition, ind) => (
                                <CustomCheckBox
                                  displayText={condition}
                                  isCondition={true}
                                  handleOnCheck={handleOnCheck}
                                  conditionName={condition}
                                  key={ind}
                                />
                              ))}
                            </div>
                          ) : (
                            <p key={i}>{`No related conditions of ${selectedCondition} found`}</p>
                          );
                        })}
                      </div>
                    ) : null}

                    <div className="button">
                      <CustomButton
                        loadComponent={() => {
                          populateSymptoms(conditionsArray, handleOnGetSymptomsOfCondition);
                        }}
                        title="Get Symptoms"
                      />
                      <br />
                      <br />
                      <CustomButton
                        loadComponent={() =>
                          populateConditions(
                            symsCondsMap,
                            conditionsArray,
                            handleOnGetRelatedConditions,
                            sex,
                            dob.year
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
  );
};

export default MedicalForm;
