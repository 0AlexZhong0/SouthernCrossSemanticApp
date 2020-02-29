import * as React from "react";
import { Button } from "@material-ui/core";

interface IProps {
  loadComponent: () => void;
  title: string;
}

const CustomButton = (props: IProps): JSX.Element => {
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#008bce", color: "white" }}
      onClick={props.loadComponent}
    >
      {props.title}
    </Button>
  );
};

export default CustomButton;
