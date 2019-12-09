// import * as React from "react";
// import CustomButton from "Components/CustomButton";
// import CustomCheckBox from "Components/CustomCheckBox";
// import { diagnoseConditionsFromSymptoms, getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"
// import { Button } from "@material-ui/core";

// // include all these code in a separate file called MedicalForm.tsx
// interface IForm {
//   symptomsCheckBoxes: JSX.Element[],
//   conditions: JSX.Element[],
//   symptomsArray: string[],
// }

// interface IIssue {
//   Issue: { Accuracy: number, ID: number, Name: string }
// }

// interface IResult extends IIssue {
//   index: number
// }

// // run the localhost with chrome with this command to bypass cors
// // google-chrome --disable-web-security --user-data-dir=~/.google-chrome-root or chrome
// const App = (): JSX.Element => {
//   const [form, setForm] = React.useState<IForm>({
//     symptomsCheckBoxes: [],
//     symptomsArray: [],
//     conditions: []
//   })

//   // keep it as a legacy or a reference
//   // const populateSymptomsAndCondtions = (condition: string): void => {
//   //   const issueId: number = getIssueId(condition)
//   //   const conditions: JSX.Element[] = []
//   //   const symptomsCheckBoxes: JSX.Element[] = []

//   //   getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {
//   //     const possibleSyms: string[] = res.PossibleSymptoms.split(",")
//   //     const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(possibleSyms, "male", 1993)
//   //     // populate the potential related issues and display more checkbox onto the page            
//   //     diagnoseResult.then((result: IResult[]): void => {
//   //       result.forEach((issue: IIssue, index: number): void => {
//   //         const IssueName: string = issue.Issue.Name
//   //         conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} />)
//   //       })

//   //       possibleSyms.forEach((symptom: string, index: number): void => {
//   //         symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} />)
//   //       });
//   //       setForm({ symptomsCheckBoxes, conditions } as IForm)
//   //     })
//   //   })
//   // }

//   const populateSymptoms = (condition: string): void => {
//     const issueId: number = getIssueId(condition)
//     const symptomsCheckBoxes: JSX.Element[] = []

//     getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {
//       const possibleSyms: string[] = res.PossibleSymptoms.split(",")
//       possibleSyms.forEach((symptom: string, index: number): void => {
//         symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} />)
//       })

//       setForm({ symptomsCheckBoxes, symptomsArray: possibleSyms } as IForm)
//     })
//   }

//   const populateConditions = (): void => {
//     const conditions: JSX.Element[] = []    
//     const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(form.symptomsArray, "male", 1993)
//     // populate the potential related issues and display more checkbox onto the page            
//     diagnoseResult.then((result: IResult[]): void => {
//       result.forEach((issue: IIssue, index: number): void => {
//         const IssueName: string = issue.Issue.Name
//         conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} />)
//       })
//     setForm({ conditions } as IForm)
//     })
//   }

//   return (
//     <React.Fragment>
//       <CustomCheckBox text="Heart Attack" />
//       <CustomButton loadComponent={() => populateSymptoms("Heart Attack")} title="Get Symptoms"/>
//       <div>
//         <h4> Symptoms </h4>
//         {form.symptomsCheckBoxes}
//         <h4> Conditions </h4>
//         <CustomButton loadComponent={populateConditions} title="Get Conditions" />
//         {form.conditions}
//       </div>
//     </React.Fragment>
//   );
// };

// export default App;

import * as React from 'react'
import MedicalForm from 'Components/MedicalForm'

const App = (): JSX.Element => {

  return <MedicalForm />
}

export default App

