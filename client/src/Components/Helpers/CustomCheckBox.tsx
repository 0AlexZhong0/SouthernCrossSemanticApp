import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const CustomCheckBox = (props: { text: string, setValue:any}): JSX.Element => {
  // also change the state so that the app knows what are the conditions that got populated
  const [isChecked, setIsChecked] = React.useState(false);
 

  const tickOrUntick = (): void => {
    if (isChecked) {
      setIsChecked(false);
    } else {
      setIsChecked(true);
      props.setValue(props.text);
    }
  };
  
 
  return (
    // Populate checkboxes with all the possible conditions
    <FormControlLabel
      control={
        <Checkbox checked={isChecked} onChange={tickOrUntick} style ={{color: "#008bce", }}/>    
      }
      label={props.text}
    />
  );
};

export default CustomCheckBox;
