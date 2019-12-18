import * as React from "react";
import { Checkbox, FormControlLabel, Card, CardContent, TextField } from "@material-ui/core";

// Custom components
import CustomButton from "Components/Helpers/CustomButton";
import CustomCheckBox from "Components/Helpers/CustomCheckBox";

// core api functions
import {
  diagnoseConditionsFromSymptoms,
  getIds,
  getIssueInfo,
  IIdResponse
} from "SymptomCheckerApi/mainApi"

// frontend styling
import logo from "logo.jpg"
import "./MedicalForm.css"

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
const symptomsConfirmDescription: string = `Have you experienced these symptoms for the respective condition in the past 6 months, ${ALL_APPLIES}`
const relatedConditionsConfirmDescription: string = `Do you have these related conditions , ${ALL_APPLIES}`

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

// The components below are very similar, can group them into one function
const ConditionNameAndRelatedSymptoms = (props: {
  conditionName: string
  symptomsCheckBoxes: JSX.Element[]
}): JSX.Element => {
  const { conditionName, symptomsCheckBoxes } = props
  const description: string = `Symptoms of ${conditionName}`
  return (
    <div>
      <strong>{description}</strong>
      <br />
      {symptomsCheckBoxes}
    </div>
  )
}

const ConditionNameAndRelatedConditions = (props: {
  conditionName: string
  conditionCheckBoxes: JSX.Element[]
}): JSX.Element => {
  const { conditionName, conditionCheckBoxes } = props
  const description: string = `Related conditions below, based on your symptoms of ${conditionName}`
  return (
    <div>
      <strong>{description}</strong>
      <br />
      {conditionCheckBoxes}
    </div>
  )
}

const ConditionNameWithNoRelatedConditions = (props: {
  conditionName: string
}): JSX.Element => {
  const description: string = `No related conditions to ${props.conditionName} found`
  return <h3>{description}</h3>
}

const SexCheckBox = (props: { sex: string, onTick: () => void }): JSX.Element => {
  const { sex, onTick } = props
  return <FormControlLabel 
    control={
      <Checkbox checked={false} onChange={onTick} />
    }
    label={sex}
  />
}

const MedicalForm = (): JSX.Element => {
  // Separate the DOB card into a separate component
  // D: changed select drop down to text field as cumbersome with 6 drop downs but can revert later 
  // need to implement error mechanisms later if time permits
  const [date, setDate] = React.useState('');  
  const [month, setMonth] = React.useState('');  
  const [year, setYear] = React.useState('');
  // D: At the moment checkboxes apart from gender and conditions have setvalue passed in as dont need the value yet
  const [value, setValue] = React.useState('');

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

  const [
    symptomsWithConditionAsKey,
    setsymptomsWithConditionAsKey
  ] = React.useState({} as { [key: string]: string[] })
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

  const handleChecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      conditionsArray.push(val)
      setConditionsArray(conditionsArray)
    } else {
      symptomsArray.push(val)
      setsymptomsArray(symptomsArray)
      // assign the key an array with one symptom first, if the key is not in the object initially
      if (!(conditionName! in symptomsWithConditionAsKey))
        symptomsWithConditionAsKey[conditionName!] = [val]
      else symptomsWithConditionAsKey[conditionName!].push(val)
      setsymptomsWithConditionAsKey(symptomsWithConditionAsKey)
    }
  }

  const handleUnchecked = (
    val: string,
    isCondition: boolean,
    conditionName?: string
  ): void => {
    if (isCondition) {
      removeOneElementFromArray(conditionsArray, val)
      setConditionsArray(conditionsArray)
    } else {
      removeOneElementFromArray(symptomsArray, val)
      setsymptomsArray(symptomsArray)
      // last symptom left in the array, just delete the key in the object
      if (symptomsWithConditionAsKey[conditionName!].length === 1)
        delete symptomsWithConditionAsKey[conditionName!]
      else
        removeOneElementFromArray(
          symptomsWithConditionAsKey[conditionName!],
          val
        )
      setsymptomsWithConditionAsKey(symptomsWithConditionAsKey)
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
            const conditionName: string = conditions[index]

            possibleSyms.forEach((symptom: string, index: number): void => {
              const symptomsCheckBox: JSX.Element = (
                <CustomCheckBox
                  isCondition={false}
                  text={symptom}
                  key={symptom + `${index}`}
                  handleChecked={handleChecked}
                  handleUnchecked={handleUnchecked}
                  conditionName={conditionName}
                />
              )
              symptomsCheckBoxes.push(symptomsCheckBox)
            })

            const symptomsAndConditionName: JSX.Element = (
              <ConditionNameAndRelatedSymptoms
                key={conditionName + `${index}`}
                conditionName={conditionName}
                symptomsCheckBoxes={symptomsCheckBoxes}
              />
            )
            return symptomsAndConditionName
          }
        )
        symptomsOfAllIssues.push(symptomsInfo)
      })

      // A single promise that contains the iterable values of the array of promises
      Promise.all(
        symptomsOfAllIssues
      ).then((symsAndConds: JSX.Element[]): void =>
        setSymptomsAndConditions(symsAndConds)
      )
    })
  }

  const populateConditions = (): void => {
    // need the user to type in their personal information first
    // the sex and the year of birth
    const sex: string = "male"
    const yearOfBirth: number = 1993
    const relatedConditionsFromSymptoms: Promise<JSX.Element>[] = []
    const noDuplicateIssueNameChecker: string[] = []
    /**
     * An iteration, for each condition (i.e Heart Attack), pass the selected symptoms to the
     * diagnose API to generate related conditions
     */
    Object.keys(symptomsWithConditionAsKey).forEach(
      (selectedCondition: string) => {
        const diagnoseResult: Promise<IResult[]> = diagnoseConditionsFromSymptoms(
          symptomsWithConditionAsKey[selectedCondition],
          sex,
          yearOfBirth
        )

        const relatedConditionPromise: Promise<JSX.Element> = diagnoseResult.then(
          (res: IResult[]): JSX.Element => {
            const conditionsCheckBoxes: JSX.Element[] = []
            // select the top three issue
            res.slice(0, 3).forEach((issue: IIssue, index: number): void => {
              const IssueName: string = issue.Issue.Name
              /**
               * only push in the condition if it is not duplicate
               * checking: 
               * 1. if the related condition has the same name as the condition
               * 2. if it is a already populated condition (a condition that is on the form)
               */
              if (
                IssueName !== selectedCondition &&
                !noDuplicateIssueNameChecker.includes(IssueName) &&
                !conditionsArray.includes(IssueName)
              ) {
                conditionsCheckBoxes.push(
                  <CustomCheckBox
                    isCondition={true}
                    text={IssueName}
                    key={IssueName + `${index}`}
                    handleChecked={handleChecked}
                    handleUnchecked={handleUnchecked}
                  />
                )

                noDuplicateIssueNameChecker.push(IssueName)
              } else {
                // do nothing at this stage
              }
            })
            // no related condtions have been found according to the symptoms of the selected conditions
            if (conditionsCheckBoxes.length === 0) {
              const noRelatedConditions: JSX.Element = (
                <ConditionNameWithNoRelatedConditions
                  key={selectedCondition}
                  conditionName={selectedCondition}
                />
              )
              return noRelatedConditions
            } else {
              const relatedCondition: JSX.Element = (
                <ConditionNameAndRelatedConditions
                  key={selectedCondition}
                  conditionName={selectedCondition}
                  conditionCheckBoxes={conditionsCheckBoxes}
                />
              )
              return relatedCondition
            }
          }
        )
        relatedConditionsFromSymptoms.push(relatedConditionPromise)
      }
    )

    Promise.all(relatedConditionsFromSymptoms).then(
      (relatedConditions: JSX.Element[]): void => {
        setConditionsCheckBoxes(relatedConditions)
        setsymptomsArray([])
      }
    )
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

  // can refactor the conditional rendering below
  // change it to a loadComponent similar type of functions
  return (
    <React.Fragment>
      {/** Card Component Here */}
      <div className = "header"><img className = "headerlogo" src = {logo}/></div>
         <br></br>
         <Card className = "userdetails">
          <CardContent>
             <h2 className = "addmember">
                 Add member      
             </h2>
             <br/>
             <div className = "addname">
                 <div className = "addfirst">First name</div> 
                 <div className = "fill"/>
                 <TextField/>
                 <div className = "fill"/>
                 Surname <div className = "fill"/>
                 <TextField/>   
             </div>
             <br />
            <br />         
            <div className = "adddmy">
                <div className = "adddob">DOB</div> 
                <div className = "fill"/>
                {/** make this a cus */}
                <TextField id="outlined-basic" label="day" variant="outlined" onChange = {handledateChange} value = {date} />
                {" "} 
                <TextField id="outlined-basic" label="month" variant="outlined" onChange = {handlemonthChange} value = {month}/>
                {" "} 
                <TextField id="outlined-basic" label="year" variant="outlined" onChange = {handleyearChange} value = {year}/>
            </div>            
             <br />
             <div className = "addgender">
                 <div className = "addsex">Biological sex</div>
                 <div className = "fill"/>
                 {/** Make these two fields functionable later */}
                 <SexCheckBox sex="Male" onTick={() => console.log("Male here")}/>
                 <SexCheckBox sex="Female" onTick={() => console.log("Female here")}/>
             </div>
        </CardContent>
      </Card>
      
      <br/>

      <Card className = "userquestions">
      <CardContent>
      <h2 className = "intialconditiondescription">{initialConfirmConditionDescription}</h2>
      <div className = "initialissue">{getInitialIssues()}</div>    
      <br />
      {symptomsCheckBoxes}
      <br />
      {symptomsAndConditions.length > 0 ? (
        <h2 className = "intialconditiondescription">{symptomsConfirmDescription}</h2>
      ) : null}
      {symptomsAndConditions}
      <br />
      {conditionsCheckBoxes.length > 0 ? (
        <h2 className = "intialconditiondescription">{relatedConditionsConfirmDescription}</h2>
      ) : null}
      {conditionsCheckBoxes}
      <div className = "button">
      <CustomButton
        loadComponent={() => populateSymptoms(conditionsArray)}
        title="Get Symptoms"
      />
      </div>
      <br />
      <div className = "button">
      <CustomButton
        loadComponent={populateConditions}
        title="Get Related Conditions"
      />
      </div>
      </CardContent>
      </Card>
      <br />
    </React.Fragment>
  )
}

export default MedicalForm
