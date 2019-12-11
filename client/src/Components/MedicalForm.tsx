import * as React from "react";
import CustomButton from "Components/Helpers/CustomButton";
import CustomCheckBox from "Components/Helpers/CustomCheckBox";
import { diagnoseConditionsFromSymptoms, getIds, getIssueInfo, IIdResponse } from "SymptomCheckerApi/mainApi"

interface IForm {
  symptomsCheckBoxes: JSX.Element[],
  conditions: JSX.Element[],
  symptomsArray: string[],
}

interface IIssue {
  Issue: { Accuracy: number, ID: number, Name: string }
}

interface IResult extends IIssue {
  index: number
}

const generateRandomInt = (min: number, max: number): number => {
  const minimum: number = Math.floor(min)
  const maximum: number = Math.ceil(max)
  const randomInt: number = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  return randomInt
}

// store the issues somewhere
// populate a random issue each time the page is refreshed
const issues: string[] = ['Heart attack', 'Hernia', "Abortion", "Urinary tract infection"]
const randomNum: number = generateRandomInt(0, issues.length - 1)
const issue: string = issues[randomNum]

const MedicalForm = (): JSX.Element => {
  // best practice is create each state with the useState function once respectively
  const [form, setForm] = React.useState<IForm>({
    symptomsCheckBoxes: [],
    symptomsArray: [],
    conditions: []
  })

  const populateSymptoms = (condition: string[]): void => {
    // the naming conventions inside this function confuses me
    const isIssue: boolean = true  // still hard-coded
    const flaskResponse: Promise<any> = getIds(condition, isIssue)
    const symptomsCheckBoxes: JSX.Element[] = []
    flaskResponse.then((res: IIdResponse) => {
      const issue_ids: number[] = res.issue_ids!  // non-null assertion
      const issueId: number = issue_ids[0] // currently only getting one issue at a time

      getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {
        // very inefficent way of sorting the words
        // have something like "unconciousness, short" as one symptom in the list of symptoms
        // want to keep as a whole, instead of splitting it to "unconciousness" and " short" separately
        const initSyms: string = res.PossibleSymptoms.replace(", ", ";")
        const initSymsArr: string[] = initSyms.split(",")
        const possibleSyms: string[] = []
        initSymsArr.forEach((sym: string): void => {
          if(sym.includes(";")) sym = sym.replace(";", ", ")
          possibleSyms.push(sym)
        })

        possibleSyms.forEach((symptom: string, index: number): void => {
          symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} />)
        })

        setForm({ symptomsCheckBoxes, symptomsArray: possibleSyms } as IForm)
      })
    })
  }

  const populateConditions = (): void => {
    const conditions: JSX.Element[] = []
    // need the user to type in their personal information first
    // the sex and the year of birth
    // it breaks when the issue is heart attack
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(form.symptomsArray, "male", 1993)
    // populate the potential related issues and display more checkbox onto the page            
    diagnoseResult.then((res: IResult[]): void => {
      // select the top three issue
      res.slice(0, 3).forEach((issue: IIssue, index: number): void => {
        const IssueName: string = issue.Issue.Name
        conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} />)
      })
      setForm({ conditions } as IForm)
    })
  }

  return (
    <React.Fragment>
      <CustomCheckBox text={issue} />
      <CustomButton loadComponent={() => populateSymptoms([issue])} title="Get Symptoms" />
      {form.symptomsCheckBoxes}
      <CustomButton loadComponent={populateConditions} title="Get Conditions" />
      {form.conditions}
    </React.Fragment>
  );
};

export default MedicalForm;
