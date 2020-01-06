import * as React from "react"
import { Card, CardContent, TextField } from "@material-ui/core"

import SexCheckBox from "./SexCheckBox"

const PersonalInfoForm = (): JSX.Element => {
const [date, setDate] = React.useState("")
  const [month, setMonth] = React.useState("")
  const [year, setYear] = React.useState("")  
  const [sex, setSex] = React.useState("")

  const handledateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value)
  }

  const handlemonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value)
  }

  // D: Need year for diagnoseConditionsFromSymptoms function
  const handleyearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value)
  }

  const handleOnSexChecked = (gender: string): void => {
    setSex(gender)
  }
  
  return (
    <Card>
      <CardContent>
        <h2 className="arialFont">Personal Information</h2>
        <TextField label="First name" />
        <div className="fill" />
        <TextField label="Surname" />
        <div className="fill" />
        <br />
        <h3 className="arialFont">Date of Birth</h3>
        <TextField
          id="date-outlined-basic"
          label="day"
          variant="outlined"
          onChange={handledateChange}
          value={date}
        />{" "}
        <TextField
          id="month-outlined-basic"
          label="month"
          variant="outlined"
          onChange={handlemonthChange}
          value={month}
        />{" "}
        <TextField
          id="year-outlined-basic"
          label="year"
          variant="outlined"
          onChange={handleyearChange}
          value={year}
        />
        <br />
        <h3 className="arialFont">Biological sex</h3>
        <SexCheckBox gender="Male" onCheck={handleOnSexChecked} />
        <SexCheckBox gender="Female" onCheck={handleOnSexChecked} />
      </CardContent>
    </Card>
  )
}

export default PersonalInfoForm
