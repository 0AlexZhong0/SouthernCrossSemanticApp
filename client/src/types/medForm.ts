export type SymsCondMapType = { [condition: string]: string[] };

export type handleCheckAction = (
  val: string,
  isCondition: boolean,
  conditionName: string,
  type: "remove" | "push"
) => void;

export interface IIssue {
  Issue: { Accuracy: number; ID: number; Name: string };
}

export interface IResult extends IIssue {
  index: number;
}

export interface symsMapDispatchActionType {
  type: "pushSymptom" | "removeSymptom" | "reset";
  payload: { conditionName: string; symptom: string };
}

export interface condsArrDispatchActionType {
  type: "pushCondition" | "removeCondition" | "reset";
  condition: string;
}
