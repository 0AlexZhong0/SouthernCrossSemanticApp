import * as React from "react"

import {
  IIdResponse,
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

export const populateSymptoms = (
  conditions: string[],
  handleSymptomsCheckboxes: React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  handleSymptomsAndConditions: React.Dispatch<
    React.SetStateAction<JSX.Element[]>
  >,
  handleChecked: handleCheckAction,
  handleUnchecked: handleCheckAction
): void => {
  if (conditions.length === 0) {
    // causes inifinite re-render loop at the start
    // handleSymptomsCheckboxes([])
    // handleSymptomsAndConditions([])
    return
  }

  const isIssue: boolean = true
  const flaskResponse: Promise<any> = getIds(conditions, isIssue)
  const symptomsOfAllIssues: Promise<JSX.Element>[] = []
  flaskResponse.then((res: IIdResponse) => {
    const issue_ids: number[] = res.issue_ids! // non-null assertion

    issue_ids.forEach((issueId: number, index: number) => {
      /**
       * Aggregate the promise returned by getIssueInfo into an array
       * The promise returns a JSX.Element which has the name of the
       * condition and the related symptoms
       */
      const symptomsInfo: Promise<JSX.Element> = getIssueInfo(issueId).then(
        (res: { PossibleSymptoms: string }) => {
          const possibleSyms: string[] = formatSymptomsAndGetArray(
            res.PossibleSymptoms
          )

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

          const symptomsAndConditionName: JSX.Element = (
            <ConditionNameAndRelatedSymptoms
              key={conditionName + `${index}`}
              conditionName={conditionName}
              symptomsCheckBoxes={sympsCheckBoxes}
            />
          )

          return symptomsAndConditionName
        }
      )

      symptomsOfAllIssues.push(symptomsInfo)
    })

    // A single promise that contains the iterable values of the array of promises
    Promise.all(symptomsOfAllIssues).then((symsAndConds: JSX.Element[]): void =>
      handleSymptomsAndConditions(symsAndConds)
    )
  })
}

// infinite loop, page does not render for some reasons
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

  const relatedConditionsFromSymptoms: Promise<JSX.Element>[] = []
  const noDuplicateIssueNameChecker: string[] = []
  /**
   * An iteration, for each condition (i.e Heart Attack), pass the selected symptoms to the
   * diagnose API to generate related conditions
   */
  Object.keys(symptomsWithConditionAsKey).forEach(
    (selectedCondition: string) => {
      // FIXME: sex and birth year hard-coded
      const diagnoseResult: Promise<IResult[]> = diagnoseConditionsFromSymptoms(
        symptomsWithConditionAsKey[selectedCondition],
        "male",
        2001
      )

      const relatedConditionPromise: Promise<JSX.Element> = diagnoseResult.then(
        (res: IResult[]): JSX.Element => {
          const condsCheckBoxes: JSX.Element[] = []
          // select the top three issue
          res.slice(0, 3).forEach((issue: IIssue, index: number): void => {
            const IssueName: string = issue.Issue.Name
            /**
             * only push in the condition if it is not duplicate
             * checking:
             * 1. if the related condition has the same name as the condition
             * 2. if it is a already populated condition (a condition that is on the form)
             */
            if (
              IssueName !== selectedCondition &&
              !noDuplicateIssueNameChecker.includes(IssueName) &&
              !conditionsArray.includes(IssueName)
            ) {
              condsCheckBoxes.push(
                <CustomCheckBox
                  isCondition={true}
                  text={IssueName}
                  conditionName={IssueName}
                  key={IssueName + `${index}`}
                  handleChecked={handleChecked}
                  handleUnchecked={handleUnchecked}
                />
              )

              noDuplicateIssueNameChecker.push(IssueName)
            } else {
              // do nothing at this stage
            }
          })

          // no related condtions have been found according to the symptoms of the selected conditions
          if (condsCheckBoxes.length === 0) {
            const noRelatedConditions: JSX.Element = (
              <ConditionNameWithNoRelatedConditions
                key={selectedCondition}
                conditionName={selectedCondition}
              />
            )
            return noRelatedConditions
          } else {
            const relatedCondition: JSX.Element = (
              <ConditionNameAndRelatedConditions
                key={selectedCondition}
                conditionName={selectedCondition}
                conditionCheckBoxes={condsCheckBoxes}
              />
            )
            return relatedCondition
          }
        }
      )
      relatedConditionsFromSymptoms.push(relatedConditionPromise)
    }
  )

  Promise.all(relatedConditionsFromSymptoms).then(
    (relatedConditions: JSX.Element[]): void => {
      handleConditionsCheckBoxes(relatedConditions)
    }
  )
}
