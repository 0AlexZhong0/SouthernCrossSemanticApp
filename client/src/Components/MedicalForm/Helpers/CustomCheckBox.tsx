import * as React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

import { handleCheckAction } from "types/medForm";

interface ICustomCheckBoxProps {
  displayText: string;
  isCondition: boolean;
  handleOnCheck: handleCheckAction;
  conditionName: string;
}

const CustomCheckBox = (props: ICustomCheckBoxProps): JSX.Element => {
  // also change the state so that the app knows what are the conditions that got populated
  const { displayText, isCondition, handleOnCheck, conditionName } = props;
  const [isChecked, setIsChecked] = React.useState(false);

  const handleOnCheckBoxChange = (): void => {
    if (isChecked) {
      setIsChecked(false);
      handleOnCheck(displayText, isCondition, conditionName, "push");
    } else {
      setIsChecked(true);
      handleOnCheck(displayText, isCondition, conditionName, "remove");
    }
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={isChecked}
          onChange={handleOnCheckBoxChange}
          style={{ color: "#008bce" }}
        />
      }
      label={displayText}
    />
  );
};

export default CustomCheckBox;
