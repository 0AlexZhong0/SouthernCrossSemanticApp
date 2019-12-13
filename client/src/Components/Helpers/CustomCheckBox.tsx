import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

interface IProps {
  text: string,
  isCondition: boolean,
  handleChecked: (val: string, isCondition: boolean) => void,
  handleUnchecked: (val: string, isCondition: boolean) => void
}

const CustomCheckBox = (props: IProps): JSX.Element => {
  // also change the state so that the app knows what are the conditions that got populated
  const { text, isCondition, handleChecked, handleUnchecked } = props
  const [isChecked, setIsChecked] = React.useState(false);
  const tickOrUntick = (): void => {
    if (isChecked) {
      setIsChecked(false);      
      handleUnchecked(text, isCondition)
    } else {
      setIsChecked(true);
      handleChecked(text, isCondition)
    }
  };

  return (
    // Populate checkboxes with all the possible conditions
    <FormControlLabel
      control={
        <Checkbox checked={isChecked} onChange={tickOrUntick} />
      }
      label={text}
    />
  );
};

export default CustomCheckBox;
