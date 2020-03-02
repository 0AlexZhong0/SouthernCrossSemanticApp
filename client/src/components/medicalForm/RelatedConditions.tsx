import * as React from "react";
import { handleCheckAction } from "types/medForm";
import { IRelatedConditionsOfSymptoms } from "./MedicalForm";
import { relatedConditionsConfirmDescription } from "./descriptions";
import CustomCheckBox from "./helpers/CustomCheckBox";

type IRelatedConditionsProps = {
  relatedConditions: IRelatedConditionsOfSymptoms[] | undefined;
  handleOnCheck: handleCheckAction;
};

const RelatedConditions = (props: IRelatedConditionsProps) => {
  const { relatedConditions, handleOnCheck } = props;

  return relatedConditions && relatedConditions.length > 0 ? (
    <div>
      <h2 className="description">{relatedConditionsConfirmDescription}</h2>
      {relatedConditions.map((data, i) => {
        const { conditionNames, selectedCondition } = data;

        return conditionNames.length > 0 ? (
          <div key={i}>
            <strong>{`Related conditions below, based on your symptoms of ${selectedCondition}`}</strong>
            <br />
            {conditionNames.map((condition, ind) => (
              <CustomCheckBox
                displayText={condition}
                isCondition={true}
                handleOnCheck={handleOnCheck}
                conditionName={condition}
                key={ind}
              />
            ))}
          </div>
        ) : (
          <p key={i}>{`No related conditions of ${selectedCondition} found`}</p>
        );
      })}
    </div>
  ) : null;
};

export default RelatedConditions;
