import * as React from "react";
import GetSymptomsButton from "Components/GetSymptomsButton";
import ConditionCheckBox from "Components/ConditionCheckBox";
import { diagnoseConditionsFromSymptoms ,getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"

interface IForm {
  symptom: string,
  conditions: JSX.Element[]
}

// run the localhost with chrome with this command to bypass cors
// google-chrome --disable-web-security --user-data-dir=~/.google-chrome-root or chrome
const App = (): JSX.Element => {
  // this block of code can migrate to a different file
  // need to make the state an JSON object soon, implement an interface with it
  // can refer back to the doc I saw yesterday  
  const [form, setForm] = React.useState<IForm>({
    symptom: "",
    conditions: []
  })

const populateSymptoms = (): void => {
    const issueId: number = getIssueId("Heart Attack")
    let conditions: any[] = []  // should be type of JSX.Element[]
    getIssueInfo(issueId).then((res: {PossibleSymptoms: string}) => {
      const possibleSyms: string[] = res.PossibleSymptoms.split(" ")
      const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(possibleSyms, "male", 1993)
      // use a map functions to populate the potential related issues and display more checkbox onto the page            
      diagnoseResult.then((result: any[]): void => {
        result.map((issue: {Issue: {Accuracy: number, ID: number, Name: string}}, index: number): void => {
          // conditions.push(<div>Hello World</div> )
          conditions.push(issue.Issue.Name)
        })
      })
      // Not sure why the array resets to be emptied
      // Work on this further
      console.log(conditions)
      console.log(conditions.length)
      setForm({symptom: res.PossibleSymptoms, conditions})      
    })
  }
  
  return (
    <React.Fragment>
      <GetSymptomsButton onClickLogMsg={populateSymptoms}/>
      <ConditionCheckBox  condition="Heart Attack" />
      <div>
        {form.symptom}
      </div>
    </React.Fragment>
  );
};

export default App;
