import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomButton from "Components/Helpers/CustomButton";
import CustomCheckBox from "Components/Helpers/CustomCheckBox";
import { diagnoseConditionsFromSymptoms, getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"
import logo from "logo.jpg"
import TextField from "@material-ui/core/TextField";
import "./MedicalForm.css"

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
        symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} setValue = {setValue}/>)
      })
      setSymptomsCheckBoxes(symptomsCheckBoxes)
      setsymptomsArray(possibleSyms)
      setConditionsCheckBoxes([])
    })

  }

 const populateConditions = (): void => {
    const conditions: JSX.Element[] = []
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(symptomsArray, value, year)
    // populate the potential related issues and display more checkbox onto the page            
    diagnoseResult.then((result: IResult[]): void => {
      result.forEach((issue: IIssue, index: number): void => {
        const IssueName: string = issue.Issue.Name
        conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} setValue = {setSelectedConditions}/>)
       
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
  // D: At the moment checkboxes apart from gender and conditions have setvalue passed in as dont need the value yet
  const [value, setValue] = React.useState('');
  const [selectedConditions, setSelectedConditions] = React.useState('');

  const handledateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handlemonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
  };

  // D: Need year for diagnoseConditionsFromSymptoms function
  const handleyearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  
  return (
    <React.Fragment>
         <div className = "header"><img className = "headerlogo" src = {logo}/></div>
         <br></br>
         <Card className = "userdetails">
          <CardContent>
             <h3 className = "addmember">
                 Add member      
             </h3>

             <div className = "addname">
                 <div className = "addfirst">First name</div> 
                 <div className = "fill"/>
                 <TextField/>
                 <div className = "fill"/>
                 Surname <div className = "fill"/>
                 <TextField/>   
             </div>

             <br></br>
             
            <div>
                <div className = "adddob">DOB</div> 
                <div className = "fill"/>
            
                <TextField id="outlined-basic" label="day" variant="outlined" onChange = {handledateChange} value = {date} />
                {" "} 
                <TextField id="outlined-basic" label="month" variant="outlined" onChange = {handlemonthChange} value = {month}/>
                {" "} 
                <TextField id="outlined-basic" label="year" variant="outlined" onChange = {handleyearChange} value = {year}/>

            </div>
             
             <br></br>

             <div>
                 <div className = "addsex">Biological sex</div>
                 <div className = "fill"/>
                 <CustomCheckBox text="Male" setValue = {setValue}/>
                 <CustomCheckBox text="Female" setValue = {setValue}/>
                 
             </div>

        </CardContent>
      </Card>

      <div>
          <CustomCheckBox text="Heart Attack" setValue = {setValue}/>
          <div>
              <CustomButton loadComponent={() => populateSymptoms("Heart Attack")} title="Get Symptoms" />
              <br></br>
              {symptomsCheckBoxes}
              <br />
              <CustomButton loadComponent={populateConditions} title="Get Conditions" />
              <br></br>
              {conditionsCheckBoxes}
        </div>
      </div>

      <br />

      <div>
        <CustomCheckBox text="Obstruction of a pulmonary artery" setValue = {setValue}/>
        <div>
          <CustomButton loadComponent={() => populateSymptoms("Obstruction of a pulmonary artery")} title="Get Symptoms" />
          <br /><br />
          <CustomButton loadComponent={populateConditions} title="Get Conditions" />
        </div>
      </div>

      <br />
      <br />

      <div>
        <CustomCheckBox text="Coronary heart disease" setValue = {setValue}/>
        <div>
          <CustomButton loadComponent={() => populateSymptoms("Coronary heart disease")} title="Get Symptoms" />
          <br /><br />
          <CustomButton loadComponent={populateConditions} title="Get Conditions" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default MedicalForm;
