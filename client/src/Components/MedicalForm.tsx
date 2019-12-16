import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomButton from "Components/Helpers/CustomButton";
import CustomCheckBox from "Components/Helpers/CustomCheckBox";
import { diagnoseConditionsFromSymptoms, getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"
import TextField from "@material-ui/core/TextField";

interface IIssue {
  Issue: { Accuracy: number, ID: number, Name: string }
}

interface IResult extends IIssue {
  index: number
}

// run the localhost with chrome with this command to bypass cors
// chrome --disable-web-security --user-data-dir="~/.google-chrome-root"
const MedicalForm = (): JSX.Element => {
  const [symptomsCheckBoxes, setSymptomsCheckBoxes] = React.useState([] as JSX.Element[])
  const [conditionsCheckBoxes, setConditionsCheckBoxes] = React.useState([] as JSX.Element[])
  const [symptomsArray, setsymptomsArray] = React.useState([] as string[])

  const populateSymptoms = (condition: string): void => {
    const issueId: number = getIssueId(condition)
    const symptomsCheckBoxes: JSX.Element[] = []
    getIssueInfo(issueId).then((res: { PossibleSymptoms: string }) => {

      const possibleSyms: string[] = res.PossibleSymptoms.split(",")
      possibleSyms.forEach((symptom: string, index: number): void => {
        symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} value = ""/>)
      })
      setSymptomsCheckBoxes(symptomsCheckBoxes)
      setsymptomsArray(possibleSyms)
      setConditionsCheckBoxes([])
    })

  }

 const populateConditions = (): void => {
    const conditions: JSX.Element[] = []
    console.log({gender});
    console.log(year);
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(symptomsArray, "male", year)
    // populate the potential related issues and display more checkbox onto the page            
    diagnoseResult.then((result: IResult[]): void => {
      result.forEach((issue: IIssue, index: number): void => {
        const IssueName: string = issue.Issue.Name
        conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} value = ""/>)
      })
      setConditionsCheckBoxes(conditions)
      setSymptomsCheckBoxes([])
    })
  }

  // D: changed select drop down to text field as cumbersome with 6 drop downs but can revert later 
  //    need to implement error mechanisms later if time permits
 
  const [date, setDate] = React.useState('');  
  const [month, setMonth] = React.useState('');  
  const [year, setYear] = React.useState('');

  const [gender, setGender] = React.useState('');

  const handledateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handlemonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  // Need year for diagnoseConditionsFromSymptoms function
  const handleyearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };


  console.log("parent",{gender})

 
  
return (
    <React.Fragment>
         <Card className = "userdetails">
          <CardContent>
             <h3>
                 Add member      
             </h3>

             <div>
                 First name {" "} 
                 <TextField/>
                 {" "}
                 Surname {" "} 
                 <TextField/>   
             </div>

             <br></br>
            
            <div>
            DOB {" "} 
            
            <TextField id="outlined-basic" label="d" variant="outlined" onChange = {handledateChange} value = {date} />
            {" "} 
            <TextField id="outlined-basic" label="m" variant="outlined" onChange = {handlemonthChange} value = {month}/>
            {" "} 
            <TextField id="outlined-basic" label="y" variant="outlined" onChange = {handleyearChange} value = {year}/>

            </div>
             
             <br></br>

             <div>
                 Biological sex
                 {" "}
                 <CustomCheckBox text="Male" value = {gender}/>
                 <CustomCheckBox text="Female" value = {setGender}/>
                 
             </div>

        </CardContent>
      </Card>
      <div>
        <CustomCheckBox text="Heart Attack" value = ""/>
        <div>
          <CustomButton loadComponent={() => populateSymptoms("Heart Attack")} title="Get Symptoms" />
          {symptomsCheckBoxes}
          <br />
          <CustomButton loadComponent={populateConditions} title="Get Conditions" />
          {conditionsCheckBoxes}

        </div>
      </div>

      <br />

      <div>
        <CustomCheckBox text="Obstruction of a pulmonary artery" value = ""/>
        <div>
          <CustomButton loadComponent={() => populateSymptoms("Obstruction of a pulmonary artery")} title="Get Symptoms" />
          <br />
          <CustomButton loadComponent={populateConditions} title="Get Conditions" />

        </div>
      </div>

      <br />
      <br />

      <div>
        <CustomCheckBox text="Coronary heart disease" value = ""/>
        <div>
          <CustomButton loadComponent={() => populateSymptoms("Coronary heart disease")} title="Get Symptoms" />
          <br />
          <CustomButton loadComponent={populateConditions} title="Get Conditions" />

        </div>
      </div>
    </React.Fragment>
  );
};

export default MedicalForm;
