import * as React from "react";

import {
  getIssueInfo,
  getIds,
  diagnoseConditionsFromSymptoms,
  InvalidFlaskResponseError
} from "SymptomCheckerApi/mainApi";
import CustomCheckBox from "Components/MedicalForm/Helpers/CustomCheckBox";

// types
import { IResult, symsCondMapType, handleCheckAction } from "types/medForm";
import { InvalidCredentialError } from "auth/getAccessToken";
import {
  ISymptomsOfCondition,
  IRelatedConditionsOfSymptoms
} from "Components/MedicalForm/MedicalForm";

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

export const getInitialIssues = (
  issues: string[],
  handleOnCheck: handleCheckAction
): JSX.Element[] =>
  issues.map((issue: string, index: number) => (
    <CustomCheckBox
      key={issue + `${index}`}
      isCondition={true}
      conditionName={issue}
      displayText={issue}
      handleOnCheck={handleOnCheck}
    />
  ));

const getSymptomsOfAllConditions = (conditions: string[], issueIds: number[]) => {
  const symptoms = issueIds.map(async (issueId: number, index: number) => {
    try {
      const possibleSymptoms: string[] = formatSymptomsAndGetArray(
        (await getIssueInfo(issueId)).PossibleSymptoms
      );
      const conditionName: string = conditions[index];

      return { symptoms: possibleSymptoms, conditionName };
    } catch (e) {
      // two throw statements so the program will stop executing the map function and no undefined objects are returned
      if (e instanceof InvalidCredentialError) {
        console.log(`Gracefully handled ${e.message}`);
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
    const ids = await getIds(conditions, isIssue);
    const symptomsOfAllIssues = await Promise.all(
      getSymptomsOfAllConditions(conditions, ids.issue_ids!)
    );

    onGetSymptomsOfConditions(symptomsOfAllIssues);
  } catch (e) {
    if (e instanceof InvalidFlaskResponseError) alert(e.message);
    else throw e;
  }
};

export const populateConditions = (
  symptomsWithConditionAsKey: symsCondMapType,
  conditionsArray: string[],
  onGetRelatedConditions: (relatedConds: IRelatedConditionsOfSymptoms[]) => void,
  sex: string,
  yearOfBirth: string | number
): void => {
  if (sex === "" || yearOfBirth === "" || yearOfBirth < 0) {
    alert("Make sure the form is filled out properly");
    return;
  }

  console.log(yearOfBirth);
  const noDuplicateIssueNameChecker: string[] = [];

  /**
   * An iteration, for each condition (i.e Heart Attack), pass the selected symptoms to the
   * diagnose API to generate related conditions
   */
  const relatedConditionsFromSymptoms: Promise<IRelatedConditionsOfSymptoms>[] = Object.keys(
    symptomsWithConditionAsKey
  ).map(async (selectedCondition: string) => {
    const diagnoseResult: IResult[] = await diagnoseConditionsFromSymptoms(
      symptomsWithConditionAsKey[selectedCondition],
      sex.toLowerCase(),
      yearOfBirth
    );

    // select the top three issue
    const relatedConditions = diagnoseResult
      .slice(0, 3)
      .map(res => res.Issue.Name)
      .filter(
        condition =>
          condition !== selectedCondition &&
          !conditionsArray.includes(condition) &&
          !noDuplicateIssueNameChecker.includes(condition)
      );

    noDuplicateIssueNameChecker.concat(relatedConditions);

    return { conditionNames: relatedConditions, selectedCondition };
  });

  Promise.all(relatedConditionsFromSymptoms).then(relatedConditions =>
    onGetRelatedConditions(relatedConditions)
  );
};
