import * as React from "react";
import { Button } from "@material-ui/core";

interface ICustomButtonProps {
  loadComponent: () => void;
  title: string;
}

const CustomButton = (props: ICustomButtonProps): JSX.Element => {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#008bce", color: "white", marginBottom: "0.4rem" }}
      onClick={props.loadComponent}
    >
      {props.title}
    </Button>
  );
};

export default CustomButton;