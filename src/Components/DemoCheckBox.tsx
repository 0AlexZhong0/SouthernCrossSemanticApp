import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const DemoCheckBox = (): JSX.Element => {
  const [isChecked, setIsChecked] = React.useState(true);
  const tickOrUntick = (): void => {
    if (isChecked) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  };

  return (
    // Populate checkboxes with all the possible conditions
    <FormControlLabel
      control={
        <Checkbox checked={isChecked} onChange={tickOrUntick} />    
      }
      label="Do you have asthma"
    />
  );
};

export default DemoCheckBox;
