import * as React from "react"
import CustomButton from "Components/Helpers/CustomButton"
import CustomCheckBox from "Components/Helpers/CustomCheckBox"
import {
  diagnoseConditionsFromSymptoms,
  getIds,
  getIssueInfo,
  IIdResponse
} from "SymptomCheckerApi/mainApi"

interface IIssue {
  Issue: { Accuracy: number; ID: number; Name: string }
}

interface IResult extends IIssue {
  index: number
}

const generateRandomInt = (min: number, max: number): number => {
  const minimum: number = Math.floor(min)
  const maximum: number = Math.ceil(max)
  const randomInt: number =
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  return randomInt
}

// store the issues somewhere
// populate a random issue each time the page is refreshed
const issues: string[] = [
  "Heart attack",
  "Hernia",
  "Abortion",
  "Urinary tract infection"
]
const randomNum: number = generateRandomInt(0, issues.length - 1)
const issue: string = issues[randomNum]

const MedicalForm = (): JSX.Element => {
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

  const populateSymptoms = (condition: string[]): void => {
    // the naming conventions inside this function confuses me
    const isIssue: boolean = true
    const flaskResponse: Promise<any> = getIds(condition, isIssue)
    const symptomsCheckBoxes: JSX.Element[] = []
    flaskResponse.then((res: IIdResponse) => {
      const issue_ids: number[] = res.issue_ids! // non-null assertion
      const issueId: number = issue_ids[0] // currently only getting one issue at a time

      getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {
        // very inefficent way of sorting the words
        // have something like "unconciousness, short" as one symptom in the list of symptoms
        // want to keep as a whole, instead of splitting it to "unconciousness" and " short" separately
        const initSyms: string = res.PossibleSymptoms.replace(", ", ";")
        const initSymsArr: string[] = initSyms.split(",")
        const possibleSyms: string[] = []
        initSymsArr.forEach((sym: string): void => {
          if (sym.includes(";")) sym = sym.replace(";", ", ")
          possibleSyms.push(sym)
        })

        possibleSyms.forEach((symptom: string, index: number): void => {
          symptomsCheckBoxes.push(
            <CustomCheckBox
              isCondition={false}
              text={symptom}
              key={symptom + `${index}`}
              handleChecked={handleChecked}
              handleUnchecked={handleUnchecked}
            />
          )
        })

        setSymptomsCheckBoxes(symptomsCheckBoxes)
        setConditionsCheckBoxes([])
      }).catch((err: Response) => setSymptomsCheckBoxes([]))  // handling no condition is selected
    })
  }

  const populateConditions = (): void => {
    const conditionsCheckBoxes: JSX.Element[] = []
    // need the user to type in their personal information first
    // the sex and the year of birth
    const sex: string = "male"
    const yearOfBirth: number = 1993
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(
      // the argument parameter that I passed in here is key, this should be all checked values
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
      setSymptomsCheckBoxes([])
    })
  }

  return (
    <React.Fragment>
      <CustomCheckBox
        isCondition={true}
        text={issue}
        handleChecked={handleChecked}
        handleUnchecked={handleUnchecked}
      />
      <br />
      <CustomButton
        loadComponent={() => populateSymptoms(conditionsArray)}
        title="Get Symptoms"
      />
      <br />
      {symptomsCheckBoxes}
      <br />
      <CustomButton loadComponent={populateConditions} title="Get Conditions" />
      <br />
      {conditionsCheckBoxes}
    </React.Fragment>
  )
}

export default MedicalForm
