import * as React from "react";
import CustomButton from "Components/Helpers/CustomButton";
import CustomCheckBox from "Components/Helpers/CustomCheckBox";
import { diagnoseConditionsFromSymptoms,getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"

// include all these code in a separate file called MedicalForm.tsx
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

// run the localhost with chrome with this command to bypass cors
// google-chrome --disable-web-security --user-data-dir=~/.google-chrome-root or chrome
const MedicalForm = (): JSX.Element => {
  const [form, setForm] = React.useState<IForm>({
    symptomsCheckBoxes: [],
    symptomsArray: [],
    conditions: []
  })
 

const populateSymptoms = (condition: string): void => {
    const issueId: number = getIssueId(condition)
    const symptomsCheckBoxes: JSX.Element[] = []
    getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {
      
      const possibleSyms: string[] = res.PossibleSymptoms.split(",")
      possibleSyms.forEach((symptom: string, index: number): void => {
        symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} />)
      })
      setForm({ symptomsCheckBoxes, symptomsArray : possibleSyms } as IForm)
    })
  
  }

  const populateConditions = (): void => {
    const conditions: JSX.Element[] = []

    // D: need to press "Get symptoms" first for form.symtoms to not be an empty array
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(form.symptomsArray, "male", 1993)
    
  
    // populate the potential related issues and display more checkbox onto the page            
    diagnoseResult.then((result: IResult[]): void => {
      result.forEach((issue: IIssue, index: number): void => {
        const IssueName: string = issue.Issue.Name
        conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} />)
      })
    setForm({ conditions } as IForm)
    })
  }
 
  const reset = (): void => {
    form.conditions = [];
    form.symptomsCheckBoxes = [];
    console.log("here")
  }



  return (
    <React.Fragment>
      <div>
      <CustomCheckBox text="Heart Attack" />
      <div>
      <CustomButton loadComponent={() => populateSymptoms("Heart Attack")} title="Get Symptoms"/>
      </div>
          <div>
              {form.symptomsCheckBoxes}
              <br></br>
              <CustomButton loadComponent={populateConditions} title="Get Conditions" />
              {form.conditions}
              {reset()}
            
          </div>
     </div>
      

     <br></br>

     <div>
      <CustomCheckBox text="Obstruction of a pulmonary artery" />
      <div>
      <CustomButton loadComponent={() => populateSymptoms("Obstruction of a pulmonary artery")} title="Get Symptoms"/>
      
      </div>
          <div>
              {form.symptomsCheckBoxes}
              <br></br>
              <CustomButton loadComponent={populateConditions} title="Get Conditions" />
              {form.conditions}
             
          </div>
     </div>

     <br></br>

     <div>
      <CustomCheckBox text="Coronary heart disease" />
      <div>
      <CustomButton loadComponent={() => populateSymptoms("Coronary heart disease")} title="Get Symptoms"/>
      
      </div>
          <div>
              {form.symptomsCheckBoxes}
             
              <br></br>
              <CustomButton loadComponent={populateConditions} title="Get Conditions" />
              {form.conditions}
              
          
          </div>
  
     </div>

    </React.Fragment>
  );
};

export default MedicalForm;
