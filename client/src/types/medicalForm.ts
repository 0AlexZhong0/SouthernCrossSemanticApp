export type symsCondMapType = { [key: string]: string[] }

export type handleCheckAction = (
  val: string,
  isCondition: boolean,
  conditionName?: string
) => void

export interface IIssue {
  Issue: { Accuracy: number; ID: number; Name: string }
}

export interface IResult extends IIssue {
  index: number
}

export interface symsMapDispatchActionType {
  type: string // how can I explicitly state what type of actions there are here
  payload?: { conditionName: string; symptom: string }
}
