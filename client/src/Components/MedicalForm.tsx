import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomButton from "Components/Helpers/CustomButton";
import CustomCheckBox from "Components/Helpers/CustomCheckBox";
import { diagnoseConditionsFromSymptoms, getIssueId, getIssueInfo } from "SymptomCheckerApi/mainApi"
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
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
        symptomsCheckBoxes.push(<CustomCheckBox text={symptom} key={symptom + `${index}`} />)
      })
      setSymptomsCheckBoxes(symptomsCheckBoxes)
      setsymptomsArray(possibleSyms)
      setConditionsCheckBoxes([])
    })

  }

  const populateConditions = (): void => {
    const conditions: JSX.Element[] = []
    const diagnoseResult: Promise<any> = diagnoseConditionsFromSymptoms(symptomsArray, "male", 1993)
    // populate the potential related issues and display more checkbox onto the page            
    diagnoseResult.then((result: IResult[]): void => {
      result.forEach((issue: IIssue, index: number): void => {
        const IssueName: string = issue.Issue.Name
        conditions.push(<CustomCheckBox text={IssueName} key={IssueName + `${index}`} />)
      })
      setConditionsCheckBoxes(conditions)
      setSymptomsCheckBoxes([])
    })
  }

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
                <FormControl>
                    <Select>
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        </Select>
                </FormControl>
                {" "}
                <FormControl>
                    <Select>
                        <MenuItem value={0}>0</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        </Select>
                </FormControl>
                 {" "}
                 dd
                 {" "}
                 <FormControl>
                    <Select>
                        <MenuItem value={0}>1</MenuItem>
                        <MenuItem value={1}>2</MenuItem>
                        <MenuItem value={2}>3</MenuItem>
                        <MenuItem value={3}>4</MenuItem>
                        <MenuItem value={4}>5</MenuItem>
                        <MenuItem value={5}>6</MenuItem>
                        <MenuItem value={6}>7</MenuItem>
                        <MenuItem value={7}>8</MenuItem>
                        <MenuItem value={8}>9</MenuItem>
                        <MenuItem value={9}>10</MenuItem>
                        <MenuItem value={10}>11</MenuItem>
                        <MenuItem value={11}>12</MenuItem>
                        </Select>
                </FormControl>
                 {" "}
                 mm
                 {" "}
                 <FormControl>
                    <Select>
                        <MenuItem value={0}>1</MenuItem>
                        <MenuItem value={1}>2</MenuItem>
                    </Select>
                </FormControl>
                {" "}
                <FormControl>
                    <Select>
                        <MenuItem value={0}>1</MenuItem>
                        <MenuItem value={1}>2</MenuItem>
                        <MenuItem value={2}>3</MenuItem>
                        <MenuItem value={3}>4</MenuItem>
                        <MenuItem value={4}>5</MenuItem>
                        <MenuItem value={5}>6</MenuItem>
                        <MenuItem value={6}>7</MenuItem>
                        <MenuItem value={7}>8</MenuItem>
                        <MenuItem value={8}>9</MenuItem>
                        </Select>
                </FormControl>
                {" "}
                <FormControl>
                    <Select>
                        <MenuItem value={0}>1</MenuItem>
                        <MenuItem value={1}>2</MenuItem>
                        <MenuItem value={2}>3</MenuItem>
                        <MenuItem value={3}>4</MenuItem>
                        <MenuItem value={4}>5</MenuItem>
                        <MenuItem value={5}>6</MenuItem>
                        <MenuItem value={6}>7</MenuItem>
                        <MenuItem value={7}>8</MenuItem>
                        <MenuItem value={8}>9</MenuItem>
                        </Select>
                </FormControl>
                {" "}
                <FormControl>
                    <Select>
                        <MenuItem value={0}>1</MenuItem>
                        <MenuItem value={1}>2</MenuItem>
                        <MenuItem value={2}>3</MenuItem>
                        <MenuItem value={3}>4</MenuItem>
                        <MenuItem value={4}>5</MenuItem>
                        <MenuItem value={5}>6</MenuItem>
                        <MenuItem value={6}>7</MenuItem>
                        <MenuItem value={7}>8</MenuItem>
                        <MenuItem value={8}>9</MenuItem>
                        </Select>
                </FormControl>
                 {" "}
             </div>
             
             <br></br>

             <div>
                 Biological sex
                 {" "}
                 <CustomCheckBox text="Male" />
                 <CustomCheckBox text="Female" />
             </div>

        </CardContent>
      </Card>
      <div>
        <CustomCheckBox text="Heart Attack" />
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
        <CustomCheckBox text="Obstruction of a pulmonary artery" />
        <div>
          <CustomButton loadComponent={() => populateSymptoms("Obstruction of a pulmonary artery")} title="Get Symptoms" />
          <br />
          <CustomButton loadComponent={populateConditions} title="Get Conditions" />

        </div>
      </div>

      <br />
      <br />

      <div>
        <CustomCheckBox text="Coronary heart disease" />
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
