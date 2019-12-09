import * as React from "react";
import GetSymptomsButton from "Components/GetSymptomsButton";
import CustomCheckBox from "Components/CustomCheckBox";
import { diagnoseConditionsFromSymptoms, getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"

interface IForm {
  symptoms: JSX.Element[],
  conditions: JSX.Element[]
}

interface IIssue {
  Issue: { Accuracy: number, ID: number, Name: string }
}

interface IResult extends IIssue {
  index: number
}

// run the localhost with chrome with this command to bypass cors
// google-chrome --disable-web-security --user-data-dir=~/.google-chrome-root or chrome
const App = (): JSX.Element => {
  // this block of code can migrate to a different file
  const [form, setForm] = React.useState<IForm>({
    symptoms: [],
    conditions: []
  })

  const populateSymptoms = (): void => {
    const issueId: number = getIssueId("Heart Attack")
    let conditions: JSX.Element[] = []
    getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {
      const possibleSyms: string[] = res.PossibleSymptoms.split(",")
      const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(possibleSyms, "male", 1993)
      // populate the potential related issues and display more checkbox onto the page            
      diagnoseResult.then((result: IResult[]): void => {
        result.forEach((issue: IIssue, index: number): void => {
          const IssueName: string = issue.Issue.Name
          conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} />)
        })
        const symptoms: JSX.Element[] = []        

        possibleSyms.forEach((symptom: string, index: number): void => {
          symptoms.push(<CustomCheckBox text={symptom} key={symptom + `${index}`}/>)
        });
        setForm({ symptoms, conditions })
      })
    })
  }

  return (
    <React.Fragment>
      <GetSymptomsButton onClickLogMsg={populateSymptoms} />
      <CustomCheckBox text="Heart Attack" />
      <div>
        <h4> Symptoms </h4>
        {form.symptoms}
        <h4> Conditions </h4>
        {form.conditions}
      </div>
    </React.Fragment>
  );
};

export default App;
