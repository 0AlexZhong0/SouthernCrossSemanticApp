import * as React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import { PersonalInfoContext } from "contexts/PersonalInfoState";

import "css/helperText.css";

const MALE = "Male";
const FEMALE = "Female";

const SexCheckBoxes = (props: { onCheck: (gender: string) => void }): JSX.Element => {
  const { sex } = React.useContext(PersonalInfoContext);
  const { onCheck } = props;

  const handleChecked = (gender: string): void => {
    if (sex === gender) onCheck("");
    else onCheck(gender);
  };

  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={sex === MALE} onChange={() => handleChecked(MALE)} style={{ color: "#008bce" }} />}
        label={<p className="checkbox-text">{MALE}</p>}
      />
      <FormControlLabel
        control={
          <Checkbox checked={sex === FEMALE} onChange={() => handleChecked(FEMALE)} style={{ color: "#008bce" }} />
        }
        label={<p className="checkbox-text">{FEMALE}</p>}
      />
    </div>
  );
};

export default SexCheckBoxes;
