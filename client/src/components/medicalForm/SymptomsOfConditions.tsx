import * as React from "react";
import { ISymptomsOfCondition } from "./MedicalForm";
import { symptomsConfirmDescription } from "./descriptions";
import CustomCheckBox from "./helpers/CustomCheckBox";
import { handleCheckAction } from "types/medForm";

type SymptomsOfConditionsProps = {
  symptomsOfCondition: ISymptomsOfCondition[] | undefined;
  handleOnCheck: handleCheckAction;
};

const SymptomsOfConditions = (props: SymptomsOfConditionsProps) => {
  const { symptomsOfCondition, handleOnCheck } = props;

  return symptomsOfCondition && symptomsOfCondition.length > 0 ? (
    <div>
      <h2 className="description">{symptomsConfirmDescription}</h2>
      {symptomsOfCondition.map((data, i) => {
        const { conditionName, symptoms } = data;

        return (
          <div key={i}>
            <strong>{`Symptoms of ${conditionName}`}</strong>
            <br />
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
