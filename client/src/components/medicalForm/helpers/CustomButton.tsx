import * as React from "react";
import { Button } from "@material-ui/core";

interface ICustomButtonProps {
  onClick: () => void;
  title: string;
}

const CustomButton = (props: ICustomButtonProps): JSX.Element => {
  return (
    <Button
      variant="contained"
      style={{
        backgroundColor: "#008bce",
        color: "white",
        marginBottom: "0.6rem",
        fontSize: "calc(0.75rem + 0.4vw)"
      }}
      onClick={props.onClick}
    >
      {props.title}
    </Button>
  );
};

export default CustomButton;
