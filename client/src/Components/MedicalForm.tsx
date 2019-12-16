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
const relatedConditionDescription: string = `Here are some of the related conditions we have found, do you have any, ${ALL_APPLIES}`

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

// Generate an integer within the range inclusively
// const generateRandomInt = (min: number, max: number): number => {
//   const minimum: number = Math.floor(min)
//   const maximum: number = Math.ceil(max)
//   const randomInt: number =
//     Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
//   return randomInt
// }

// populate a random issue each time the page is refreshed
// const randomNum: number = generateRandomInt(0, issues.length - 1)
// const issue: string = issues[randomNum]

const MedicalForm = (): JSX.Element => {
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

  const handleChecked = (val: string, isCondition: boolean): void => {
    if (isCondition) {
      conditionsArray.push(val)
      setConditionsArray(conditionsArray)
    } else {
      symptomsArray.push(val)
      setsymptomsArray(symptomsArray)
    }
  }

  const handleUnchecked = (val: string, isCondition: boolean): void => {
    if (isCondition) {
      removeOneElementFromArray(conditionsArray, val)
      setConditionsArray(conditionsArray)
    } else {
      removeOneElementFromArray(symptomsArray, val)
      setsymptomsArray(symptomsArray)
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
            possibleSyms.forEach((symptom: string, index: number): void => {
              const symptomsCheckBox: JSX.Element = (
                <CustomCheckBox
                  isCondition={false}
                  text={symptom}
                  key={symptom + `${index}`}
                  handleChecked={handleChecked}
                  handleUnchecked={handleUnchecked}
                />
              )
              symptomsCheckBoxes.push(symptomsCheckBox)
            })

            const conditionName: string = conditions[index]
            const symptomsAndConditionName: JSX.Element = (
              <div key={conditionName}>
                {conditionName}
                <br />
                {symptomsCheckBoxes}
              </div>
            )

            return symptomsAndConditionName
          }
        )
        symptomsOfAllIssues.push(symptomsInfo)
      })

      // A single promise that contains the iterable values of the array of promises
      Promise.all(symptomsOfAllIssues).then((symsAndConds: JSX.Element[]): void =>
        setSymptomsAndConditions(symsAndConds)        
      )
    })
  }

  const populateConditions = (): void => {
    const conditionsCheckBoxes: JSX.Element[] = []
    // need the user to type in their personal information first
    // the sex and the year of birth
    const sex: string = "male"
    const yearOfBirth: number = 1993
    console.log(`Array of symptoms is ${symptomsArray}`)
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(
      symptomsArray,
      sex,
      yearOfBirth
    )
    // populate the potential related issues and display more checkbox onto the page
    diagnoseResult.then((res: IResult[]): void => {
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
      setConditionsCheckBoxes(conditionsCheckBoxes)
      setsymptomsArray([])
      setSymptomsCheckBoxes([])
    })
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
      {/** A checkbox for the initial condition */}
      {/* <CustomCheckBox
        isCondition={true}
        text={issue}
        handleChecked={handleChecked}
        handleUnchecked={handleUnchecked}
      />
      <br /> */}
      <h2>{initialConfirmConditionDescription}</h2>
      {getInitialIssues()}
      <CustomButton
        loadComponent={() => populateSymptoms(conditionsArray)}
        title="Get Symptoms"
      />
      <br />
      {symptomsCheckBoxes}
      {symptomsAndConditions.length > 0 ? <h2>{symptomsConfirmDescription}</h2> : null}
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
