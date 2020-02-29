import * as React from "react";

import {
  getIssueInfo,
  getIds,
  diagnoseConditionsFromSymptoms,
  InvalidFlaskResponseError
} from "SymptomCheckerApi/mainApi";
import CustomCheckBox from "Components/MedicalForm/Helpers/CustomCheckBox";
import {
  ConditionNameAndRelatedSymptoms,
  ConditionNameWithNoRelatedConditions,
  ConditionNameAndRelatedConditions
} from "Components/MedicalForm/actionInfoDisplay/actionInfoDisplay";
import { IResult, IIssue, symsCondMapType, handleCheckAction } from "types/medForm";
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

const getSymptomsOfAllIssues = (conditions: string[], issueIds: number[]) => {
  const symptoms: ISymptomsOfCondition[] = [];
  issueIds.forEach(async (issueId: number, index: number) => {
    try {
      const possibleSymptoms: string[] = formatSymptomsAndGetArray(
        (await getIssueInfo(issueId)).PossibleSymptoms
      );
      const conditionName: string = conditions[index];
      symptoms.push({ symptoms: possibleSymptoms, conditionName });
    } catch (e) {
      if (e instanceof InvalidCredentialError) console.log(`Gracefully handled ${e.message}`);
      else throw e;
    }
  });

  return symptoms;
};

export const populateSymptoms = async (
  conditions: string[],
  onGetSymptomsOfConditions: (conditionSymptomns: ISymptomsOfCondition[]) => void,
  handleOnCheck: handleCheckAction
) => {
  if (conditions.length === 0) {
    return;
  }

  const isIssue: boolean = true;

  try {
    const ids = await getIds(conditions, isIssue);
    const symptomsOfAllIssues = getSymptomsOfAllIssues(conditions, ids.issue_ids!);

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
  handleOnCheck: handleCheckAction
): void => {
  // FIXME: have not yet figured out how to handle the error in my existing promise
  // if (sex === "" || year === "") {
  //   alert("Make sure the form is filled out properly")
  //   return
  // }

  const noDuplicateIssueNameChecker: string[] = [];

  /**
   * An iteration, for each condition (i.e Heart Attack), pass the selected symptoms to the
   * diagnose API to generate related conditions
   */
  const relatedConditionsFromSymptoms: Promise<IRelatedConditionsOfSymptoms>[] = Object.keys(
    symptomsWithConditionAsKey
  ).map(async (selectedCondition: string) => {
    // FIXME: hard-coded sex and birth year
    const diagnoseResult: IResult[] = await diagnoseConditionsFromSymptoms(
      symptomsWithConditionAsKey[selectedCondition],
      "male",
      2001
    );

    // select the top three issue
    const relatedConditions = diagnoseResult
      .slice(0, 3)
      .map(res => res.Issue.Name)
      .filter(condition => condition !== selectedCondition && !conditionsArray.includes(condition));

    return { conditionNames: relatedConditions, selectedCondition };
  });

  Promise.all(relatedConditionsFromSymptoms).then(relatedConditions =>
    onGetRelatedConditions(relatedConditions)
  );
};
