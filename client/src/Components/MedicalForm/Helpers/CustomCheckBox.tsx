import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

import { handleCheckAction } from "types/medForm"

interface IProps {
  text: string,
  isCondition: boolean,
  handleChecked: handleCheckAction
  handleUnchecked: handleCheckAction,
  conditionName?: string
}

const CustomCheckBox = (props: IProps): JSX.Element => {
  // also change the state so that the app knows what are the conditions that got populated
  const { text, isCondition, handleChecked, handleUnchecked, conditionName } = props
  const [isChecked, setIsChecked] = React.useState(false);
  const tickOrUntick = (): void => {
    if (isChecked) {
      setIsChecked(false);
      if (conditionName !== undefined) handleUnchecked(text, isCondition, conditionName)
      else handleUnchecked(text, isCondition)
    } else {
      setIsChecked(true);
      if (conditionName !== undefined) {
        handleChecked(text, isCondition, conditionName)        
      }
      else handleChecked(text, isCondition)      
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox checked={isChecked} onChange={tickOrUntick} style ={{color: "#008bce",}}/>
      }
      label={text}
    />
  );
};

export default CustomCheckBox;
