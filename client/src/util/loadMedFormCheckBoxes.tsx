import * as React from "react"

import {
  getIssueInfo,
  getIds,
  diagnoseConditionsFromSymptoms
} from "SymptomCheckerApi/mainApi"
import CustomCheckBox from "Components/MedicalForm/Helpers/CustomCheckBox"
import {
  ConditionNameAndRelatedSymptoms,
  ConditionNameWithNoRelatedConditions,
  ConditionNameAndRelatedConditions
} from "Components/MedicalForm/actionInfoDisplay/actionInfoDisplay"
import {
  IResult,
  IIssue,
  symsCondMapType,
  handleCheckAction
} from "types/medForm"

// think about the possible ways of converting the code below using a reducer
const formatSymptomsAndGetArray = (possibleSymptoms: string): string[] => {
  // very inefficent way of sorting the words
  // have something like "unconciousness, short" as one symptom in the list of symptoms
  // want to keep as a whole, instead of splitting it to "unconciousness" and " short" separately
  const possibleSyms: string[] = []
  const initSyms: string = possibleSymptoms.replace(", ", ";")
  const initSymsArr: string[] = initSyms.split(",")
  initSymsArr.forEach((sym: string): void => {
    if (sym.includes(";")) sym = sym.replace(";", ", ")
    possibleSyms.push(sym)
  })
  return possibleSyms
}

export const getInitialIssues = (
  issues: string[],
  handleChecked: handleCheckAction,
  handleUnchecked: handleCheckAction
): JSX.Element[] =>
  issues.map((issue: string, index: number) => (
    <CustomCheckBox
      key={issue + `${index}`}
      isCondition={true}
      conditionName={issue}
      text={issue}
      handleChecked={handleChecked}
      handleUnchecked={handleUnchecked}
    />
  ))

export const populateSymptoms = async (
  conditions: string[],
  handleSymptomsCheckboxes: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  handleSymptomsAndConditions: React.Dispatch<
    React.SetStateAction<JSX.Element[]>
  >,
  handleChecked: handleCheckAction,
  handleUnchecked: handleCheckAction
) => {
  if (conditions.length === 0) {
    // causes inifinite re-render loop at the start
    // handleSymptomsCheckboxes([])
    // handleSymptomsAndConditions([])
    return
  }

  const isIssue: boolean = true
  const issue_ids: number[] = (await getIds(conditions, isIssue)).issue_ids!

  const symptomsOfAllIssues: Promise<JSX.Element>[] = issue_ids.map(
    async (issueId: number, index: number) => {
      /**
       * Aggregate the promise returned by getIssueInfo into an array
       * The promise returns a JSX.Element which has the name of the
       * condition and the related symptoms
       */
      const possibleSymptoms: string = (await getIssueInfo(issueId))
        .PossibleSymptoms

      const possibleSyms: string[] = formatSymptomsAndGetArray(possibleSymptoms)

      const conditionName: string = conditions[index]
      const sympsCheckBoxes: JSX.Element[] = possibleSyms.map(
        (sym: string, index: number) => (
          <CustomCheckBox
            isCondition={false}
            text={sym}
            key={sym + `${index}`}
            handleChecked={handleChecked}
            handleUnchecked={handleUnchecked}
            conditionName={conditionName}
          />
        )
      )

      return (
        <ConditionNameAndRelatedSymptoms
          key={conditionName + `${index}`}
          conditionName={conditionName}
          symptomsCheckBoxes={sympsCheckBoxes}
        />
      )
    }
  )

  await Promise.all(symptomsOfAllIssues).then((res: JSX.Element[]) =>
    handleSymptomsAndConditions(res)
  )
}

export const populateConditions = (
  symptomsWithConditionAsKey: symsCondMapType,
  conditionsArray: string[],
  handleConditionsCheckBoxes: React.Dispatch<
    React.SetStateAction<JSX.Element[]>
  >,
  handleChecked: handleCheckAction,
  handleUnchecked: handleCheckAction
): void => {
  // FIXME: have not yet figured out how to handle the error in my existing promise
  // if (sex === "" || year === "") {
  //   alert("Make sure the form is filled out properly")
  //   return
  // }

  // const relatedConditionsFromSymptoms: Promise<JSX.Element>[] = []
  const noDuplicateIssueNameChecker: string[] = []
  /**
   * An iteration, for each condition (i.e Heart Attack), pass the selected symptoms to the
   * diagnose API to generate related conditions
   */
  const relatedConditionsFromSymptoms: Promise<JSX.Element>[] = Object.keys(
    symptomsWithConditionAsKey
  ).map(async (selectedCondition: string) => {
    // FIXME: hard-coded sex and birth year
    const diagnoseResult: IResult[] = await diagnoseConditionsFromSymptoms(
      symptomsWithConditionAsKey[selectedCondition],
      "male",
      2001
    )

    const condsCheckBoxes: JSX.Element[] = []
    // select the top three issue
    diagnoseResult.slice(0, 3).forEach((issue: IIssue, index: number): void => {
      const issueName: string = issue.Issue.Name
      /**
       * only push the condition if it is not duplicate
       * checking:
       * 1. if the related condition has the same name as the condition
       * 2. if it is a already populated condition (a condition that is on the form)
       */
      if (
        issueName !== selectedCondition &&
        !noDuplicateIssueNameChecker.includes(issueName) &&
        !conditionsArray.includes(issueName)
      ) {
        condsCheckBoxes.push(
          <CustomCheckBox
            isCondition={true}
            text={issueName}
            conditionName={issueName}
            key={issueName + `${index}`}
            handleChecked={handleChecked}
            handleUnchecked={handleUnchecked}
          />
        )

        noDuplicateIssueNameChecker.push(issueName)
      } else {
        // do nothing at this stage
      }
    })

    // no related condtions have been found according to the
    // symptoms of the selected conditions
    if (condsCheckBoxes.length === 0)
      return (
        <ConditionNameWithNoRelatedConditions
          key={selectedCondition}
          conditionName={selectedCondition}
        />
      )
    // related conditions found
    else
      return (
        <ConditionNameAndRelatedConditions
          key={selectedCondition}
          conditionName={selectedCondition}
          conditionCheckBoxes={condsCheckBoxes}
        />
      )
  })

  Promise.all(relatedConditionsFromSymptoms).then(
    (relatedConditions: JSX.Element[]): void => {
      handleConditionsCheckBoxes(relatedConditions)
    }
  )
}
