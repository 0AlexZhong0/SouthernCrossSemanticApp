import * as React from "react";
import { handleCheckAction } from "types/medForm";
import { IRelatedConditionsOfSymptoms } from "./MedicalForm";
import { relatedConditionsConfirmDescription } from "./descriptions";
import CustomCheckBox from "./helpers/CustomCheckBox";

import "css/helperText.css";

type IRelatedConditionsProps = {
  relatedConditions: IRelatedConditionsOfSymptoms[] | undefined;
  handleOnCheck: handleCheckAction;
};

const RelatedConditions = (props: IRelatedConditionsProps) => {
  const { relatedConditions, handleOnCheck } = props;

  return relatedConditions && relatedConditions.length > 0 ? (
    <div>
      <p className="description">{relatedConditionsConfirmDescription}</p>
      {relatedConditions.map((data, i) => {
        const { conditionNames, selectedCondition } = data;

        return conditionNames.length > 0 ? (
          <div key={i}>
            <p className="sub-header">{`Related conditions below, based on your symptoms of ${selectedCondition}`}</p>
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
          <p
            className="sub-header"
            key={i}
          >{`No related conditions of ${selectedCondition} found`}</p>
        );
      })}
    </div>
  ) : null;
};

export default RelatedConditions;
