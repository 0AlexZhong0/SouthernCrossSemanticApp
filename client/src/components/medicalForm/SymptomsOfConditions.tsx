import * as React from "react";
import { ISymptomsOfCondition } from "./MedicalForm";
import { symptomsConfirmDescription } from "./descriptions";
import CustomCheckBox from "./helpers/CustomCheckBox";
import { handleCheckAction } from "types/medForm";

import "css/helperText.css";

type SymptomsOfConditionsProps = {
  symptomsOfCondition: ISymptomsOfCondition[] | undefined;
  handleOnCheck: handleCheckAction;
};

const SymptomsOfConditions = (props: SymptomsOfConditionsProps) => {
  const { symptomsOfCondition, handleOnCheck } = props;

  return symptomsOfCondition && symptomsOfCondition.length > 0 ? (
    <div>
      <p className="description">{symptomsConfirmDescription}</p>
      {symptomsOfCondition.map((data, i) => {
        const { conditionName, symptoms } = data;

        return (
          <div key={i}>
            <p className="sub-header">{`Symptoms of ${conditionName}`}</p>
            {symptoms.map((symptom, ind) => (
              <CustomCheckBox
                displayText={symptom}
                isCondition={false}
                handleOnCheck={handleOnCheck}
                conditionName={conditionName}
                key={ind}
              />
            ))}
          </div>
        );
      })}
    </div>
  ) : null;
};

export default SymptomsOfConditions;
