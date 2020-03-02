import * as React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

import "css/helperText.css";

const SexCheckBox = (props: { gender: string; onCheck: (gender: string) => void }): JSX.Element => {
  const [checked, setChecked] = React.useState(false);
  const { gender, onCheck } = props;

  const handleChecked = (): void => {
    if (checked) {
      onCheck("");
      setChecked(false);
    } else {
      onCheck(gender);
      setChecked(true);
    }
  };

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChecked} style={{ color: "#008bce" }} />}
      label={<p className="checkbox-text">{gender}</p>}
    />
  );
};

export default SexCheckBox;
