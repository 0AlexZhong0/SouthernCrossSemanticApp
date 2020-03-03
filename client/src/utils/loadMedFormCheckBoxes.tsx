import * as React from "react";

import { InvalidFlaskResponseError, symptomCheckerClient } from "symptomCheckerApi/SymptomCheckerClient";
import CustomCheckBox from "components/medicalForm/helpers/CustomCheckBox";

// types
import { IResult, SymsCondMapType, handleCheckAction } from "types/medForm";
import { InvalidCredentialError } from "auth/getAccessToken";
import { ISymptomsOfCondition, IRelatedConditionsOfSymptoms } from "components/medicalForm/MedicalForm";

import "css/initIssues.css";

/**
 * TODO:
 * - the getter functions below can be improved as it is iterating through the state object on every api call
 */

// think about the possible ways of converting the code below using a reducer
const formatSymptomsAndGetArray = (possibleSymptoms: string): string[] => {
  // very inefficent way of sorting the words
  // have something like "unconciousness, short" as one symptom in the list of symptoms
  // want to keep as a whole, instead of splitting it to "unconciousness" and " short" separately
  const possibleSyms: string[] = [];
  const initSyms: string = possibleSymptoms.replace(", ", ";");
  const initSymsArr: string[] = initSyms.split(",");
  initSymsArr.forEach((sym: string): void => {
    if (sym.includes(";")) sym = sym.replace(";", ", ");
    possibleSyms.push(sym);
  });

  return possibleSyms;
};

export const InitialIssues = (props: { issues: string[]; handleOnCheck: handleCheckAction }): JSX.Element => (
  <div className="init-issues-container">
    {props.issues.map((issue: string, index: number) => (
      <CustomCheckBox
        key={issue + `${index}`}
        isCondition={true}
        conditionName={issue}
        displayText={issue}
        handleOnCheck={props.handleOnCheck}
      />
    ))}
  </div>
);

const getSymptomsOfAllConditions = (conditions: string[], issueIds: number[]) => {
  const symptoms = issueIds.map(async (issueId: number, index: number) => {
    try {
      // check if it is valid first
      const getIssueInfoRes = await symptomCheckerClient._getIssueInfo(issueId);
      const possibleSymptoms: string[] = formatSymptomsAndGetArray(getIssueInfoRes.PossibleSymptoms);

      const conditionName: string = conditions[index];

      return { symptoms: possibleSymptoms, conditionName };
    } catch (e) {
      // two throw statements so the program will stop executing the map function and no undefined objects are returned
      if (e instanceof InvalidCredentialError) {
        console.log(`Handling ${e.message}`);
        throw e;
      } else throw e;
    }
  });

  return symptoms;
};

export const populateSymptoms = async (
  conditions: string[],
  onGetSymptomsOfConditions: (conditionSymptomns: ISymptomsOfCondition[]) => void
) => {
  if (conditions.length === 0) {
    return;
  }

  const isIssue: boolean = true;

  try {
    const ids = await symptomCheckerClient._getIds(conditions, isIssue);
    const symptomsOfAllIssues = await Promise.all(getSymptomsOfAllConditions(conditions, ids.issue_ids!));

    onGetSymptomsOfConditions(symptomsOfAllIssues);
  } catch (e) {
    if (e instanceof InvalidFlaskResponseError) alert(e.message);
    else throw e;
  }
};

export const populateConditions = (
  symptomsConditionMap: SymsCondMapType,
  conditionsArray: string[],
  onGetRelatedConditions: (relatedConds: IRelatedConditionsOfSymptoms[]) => void,
  sex: string,
  yearOfBirth: string | number
): void => {
  if (sex === "") {
    alert("Please enter your gender for accurate results");
    return;
  }

  if (yearOfBirth === "" || yearOfBirth < 0) {
    alert("Please enter your date of birth for accurate results");
    return;
  }

  /**
   * An iteration, for each condition (i.e Heart Attack), pass the selected symptoms to the
   * diagnose API to generate related conditions
   */
  const relatedConditionsFromSymptoms: Promise<IRelatedConditionsOfSymptoms>[] = Object.keys(symptomsConditionMap).map(
    async (selectedCondition: string) => {
      const diagnoseResult: IResult[] = await symptomCheckerClient._getSymptomsRelatedConditions(
        symptomsConditionMap[selectedCondition],
        sex.toLowerCase(),
        yearOfBirth
      );

      // FIXME: some of the selected conditions will display duplicate related conditions
      // select the top three issue
      const relatedConditions = diagnoseResult
        .slice(0, 3)
        .map(res => res.Issue.Name)
        .filter(condition => condition !== selectedCondition && !conditionsArray.includes(condition));

      return { conditionNames: relatedConditions, selectedCondition };
    }
  );

  Promise.all(relatedConditionsFromSymptoms).then(relatedConditions => onGetRelatedConditions(relatedConditions));
};
