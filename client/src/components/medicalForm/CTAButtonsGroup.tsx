import * as React from "react";
import CustomButton from "./helpers/CustomButton";
import "css//ctaBtnsGroup.css";

type CTAButtonsGroupProps = {
  populateSymptoms: () => void;
  populateRelatedConditions: () => void;
  onSubmit: () => void;
};

const CTAButtonsGroup = (props: CTAButtonsGroupProps) => {
  const { populateSymptoms, populateRelatedConditions, onSubmit } = props;

  return (
    <div className="btns-group-container">
      <CustomButton onClick={populateSymptoms} title="Get Symptoms" />
      <CustomButton onClick={populateRelatedConditions} title="Get Related Conditions" />
      <CustomButton onClick={onSubmit} title="Submit" />
    </div>
  );
};

export default CTAButtonsGroup;
