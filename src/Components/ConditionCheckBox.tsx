import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const ConditionCheckBox = (props: { condition: string }): JSX.Element => {
  const [isChecked, setIsChecked] = React.useState(false);
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
      label={props.condition}
    />
  );
};

export default ConditionCheckBox;
