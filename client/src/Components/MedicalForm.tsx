import * as React from "react"
import CustomButton from "Components/Helpers/CustomButton"
import CustomCheckBox from "Components/Helpers/CustomCheckBox"
import {
  diagnoseConditionsFromSymptoms,
  getIds,
  getIssueInfo,
  IIdResponse
} from "SymptomCheckerApi/mainApi"

// To keep the code clean, think about how to separate the symptoms and the condtions logic
interface IIssue {
  Issue: { Accuracy: number; ID: number; Name: string }
}

interface IResult extends IIssue {
  index: number
}

interface ISymptomsAndConditions {
  conditionName: string
  symptomsCheckBoxes: JSX.Element[]
}

// can include these texts in a separate file
const ALL_APPLIES: string = "tick all that applies"
const initialConfirmConditionDescription: string = `Do you have any of the conditions below, ${ALL_APPLIES}`
const symptomsConfirmDescription: string = `Have you experienced any of these symptoms for the respective condition in the past 6 months, ${ALL_APPLIES}`

// store the issues somewhere
const issues: string[] = [
  "Heart attack",
  "Hernia",
  "Abortion",
  "Urinary tract infection"
]

// can include the helper functions in a separate file
// same with the ones defined inside MedicalForm
// helper functions
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

// These two components are very similar, can group them into one function
const ConditionNameAndRelatedSymptoms = (props: {
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

const ConditionNameAndRelatedConditions = (props: {
  conditionName: string
  conditionCheckBoxes: JSX.Element[]
}): JSX.Element => {
  const { conditionName, conditionCheckBoxes } = props
  const description: string = `Related conditions below, based on your symptoms of ${conditionName}`
  return (
    <div>
      <strong>{description}</strong>
      <br />
      {conditionCheckBoxes}
    </div>
  )
}

const MedicalForm = (): JSX.Element => {
  const [
    symptomsWithConditionAsKey,
    setsymptomsWithConditionAsKey
  ] = React.useState({} as { [key: string]: string[] })
  const [symptomsAndConditions, setSymptomsAndConditions] = React.useState(
    [] as JSX.Element[]
  )
  const [symptomsCheckBoxes, setSymptomsCheckBoxes] = React.useState(
    [] as JSX.Element[]
  )
  const [conditionsCheckBoxes, setConditionsCheckBoxes] = React.useState(
    [] as JSX.Element[]
  )
  const [symptomsArray, setsymptomsArray] = React.useState([] as string[])
  const [conditionsArray, setConditionsArray] = React.useState([] as string[])

  const removeOneElementFromArray = (array: any[], valToRemove: any): void => {
    const toRemoveIndex: number = array.indexOf(valToRemove)
    array.splice(toRemoveIndex, 1) // in-place function to remove one element only
  }

  const handleChecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      conditionsArray.push(val)
      setConditionsArray(conditionsArray)
    } else {
      symptomsArray.push(val)
      setsymptomsArray(symptomsArray)
      // assign the key an array with one symptom first, if the key is not in the object initially
      if (!(conditionName! in symptomsWithConditionAsKey))
        symptomsWithConditionAsKey[conditionName!] = [val]
      else symptomsWithConditionAsKey[conditionName!].push(val)
      setsymptomsWithConditionAsKey(symptomsWithConditionAsKey)
    }
  }

  const handleUnchecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      removeOneElementFromArray(conditionsArray, val)
      setConditionsArray(conditionsArray)
    } else {
      removeOneElementFromArray(symptomsArray, val)
      setsymptomsArray(symptomsArray)
      // last symptom left in the array, just delete the key in the object
      if (symptomsWithConditionAsKey[conditionName!].length === 1)
        delete symptomsWithConditionAsKey[conditionName!]
      else
        removeOneElementFromArray(
          symptomsWithConditionAsKey[conditionName!],
          val
        )
      setsymptomsWithConditionAsKey(symptomsWithConditionAsKey)
    }
  }

  const populateSymptoms = (conditions: string[]): void => {
    // handling when no condition is selected
    if (conditions.length === 0) {
      setSymptomsCheckBoxes([])
      setSymptomsAndConditions([])
      return
    }

    // dealing with mutiple issue_ids
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

            const symptomsCheckBoxes: JSX.Element[] = []
            const conditionName: string = conditions[index]

            possibleSyms.forEach((symptom: string, index: number): void => {
              const symptomsCheckBox: JSX.Element = (
                <CustomCheckBox
                  isCondition={false}
                  text={symptom}
                  key={symptom + `${index}`}
                  handleChecked={handleChecked}
                  handleUnchecked={handleUnchecked}
                  conditionName={conditionName}
                />
              )
              symptomsCheckBoxes.push(symptomsCheckBox)
            })

            const symptomsAndConditionName: JSX.Element = (
              <ConditionNameAndRelatedSymptoms
                key={conditionName + `${index}`}
                conditionName={conditionName}
                symptomsCheckBoxes={symptomsCheckBoxes}
              />
            )
            return symptomsAndConditionName
          }
        )
        symptomsOfAllIssues.push(symptomsInfo)
      })

      // A single promise that contains the iterable values of the array of promises
      Promise.all(
        symptomsOfAllIssues
      ).then((symsAndConds: JSX.Element[]): void =>
        setSymptomsAndConditions(symsAndConds)
      )
    })
  }

  const populateConditions = (): void => {
    // need the user to type in their personal information first
    // the sex and the year of birth
    const sex: string = "male"
    const yearOfBirth: number = 1993
    const relatedConditionsFromSymptoms: Promise<JSX.Element>[] = []
    Object.keys(symptomsWithConditionAsKey).forEach(
      (selectedCondition: string) => {
        const diagnoseResult: Promise<IResult[]> = diagnoseConditionsFromSymptoms(
          symptomsWithConditionAsKey[selectedCondition],
          sex,
          yearOfBirth
        )

        const relatedConditionPromise: Promise<JSX.Element> = diagnoseResult.then(
          (res: IResult[]): JSX.Element => {
            const conditionsCheckBoxes: JSX.Element[] = []
            // select the top three issue
            res.slice(0, 3).forEach((issue: IIssue, index: number): void => {
              const IssueName: string = issue.Issue.Name
              conditionsCheckBoxes.push(
                <CustomCheckBox
                  isCondition={true}
                  text={IssueName}
                  key={IssueName + `${index}`}
                  handleChecked={handleChecked}
                  handleUnchecked={handleUnchecked}
                />
              )
            })
            const relatedCondition: JSX.Element = (
              <ConditionNameAndRelatedConditions
                key={selectedCondition}
                conditionName={selectedCondition}
                conditionCheckBoxes={conditionsCheckBoxes}
              />
            )
            return relatedCondition
          }
        )
        relatedConditionsFromSymptoms.push(relatedConditionPromise)
      }
    )

    Promise.all(relatedConditionsFromSymptoms).then(
      (relatedConditions: JSX.Element[]): void => {
        setConditionsCheckBoxes(relatedConditions)
        setsymptomsArray([])
      }
    )
  }

  const getInitialIssues = (): JSX.Element[] => {
    const initIssues: JSX.Element[] = []
    issues.forEach((issue: string, index: number) => {
      initIssues.push(
        <div key={issue + `${index}`}>
          <CustomCheckBox
            isCondition={true}
            text={issue}
            handleChecked={handleChecked}
            handleUnchecked={handleUnchecked}
          />
          <br />
        </div>
      )
    })
    return initIssues
  }

  return (
    <React.Fragment>
      <h2>{initialConfirmConditionDescription}</h2>
      {getInitialIssues()}
      <CustomButton
        loadComponent={() => populateSymptoms(conditionsArray)}
        title="Get Symptoms"
      />
      <br />
      {symptomsCheckBoxes}
      {symptomsAndConditions.length > 0 ? (
        <h2>{symptomsConfirmDescription}</h2>
      ) : null}
      {symptomsAndConditions}
      <br />
      <CustomButton
        loadComponent={populateConditions}
        title="Get Related Conditions"
      />
      <br />
      {conditionsCheckBoxes}
    </React.Fragment>
  )
}

export default MedicalForm
