import * as React from "react";
import { Card, CardContent, TextField, Grid } from "@material-ui/core";

import SexCheckBox from "./SexCheckBox";
import { PersonalInfoContext } from "contexts/PersonalInfoState";
import "./PersonalInfoForm.css";

const PersonalInfoForm = (): JSX.Element => {
  const { dob, setSex, setDob } = React.useContext(PersonalInfoContext);

  const handleOnDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDob({ ...dob, day: event.target.value });
  };

  const handleOnMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDob({ ...dob, month: event.target.value });
  };

  // need sex and year for diagnoseConditionsFromSymptoms function
  const handleOnYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDob({ ...dob, year: event.target.value });
  };

  const handleOnSexChecked = (gender: string): void => {
    setSex(gender);
  };

  const { day, month, year } = dob;

  return (
    <div className="cardMargin">
      <Grid container={true} alignItems="center" justify="center">
        <Grid item={true} xs={12} sm={12} md={12}>
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
                onChange={handleOnDayChange}
                value={day}
              />{" "}
              <TextField
                id="month-outlined-basic"
                label="month"
                variant="outlined"
                onChange={handleOnMonthChange}
                value={month}
              />{" "}
              <TextField
                id="year-outlined-basic"
                label="year"
                variant="outlined"
                onChange={handleOnYearChange}
                value={year}
              />
              <br />
              <h3 className="arialFont">Biological sex</h3>
              <SexCheckBox gender="Male" onCheck={handleOnSexChecked} />
              <SexCheckBox gender="Female" onCheck={handleOnSexChecked} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PersonalInfoForm;
