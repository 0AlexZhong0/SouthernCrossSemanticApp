import { HEALTH_BASE_URL } from "SymptomCheckerApi/ApiUtilities/requests";
import getAccessToken from "auth/getAccessToken";
import requests from "SymptomCheckerApi/ApiUtilities/requests";
import postResGetId from "SymptomCheckerApi/ApiUtilities/postResGetId"

export interface IIdResponse {
  issue_ids?: number[],
  symptom_ids?: number[]
}

export const getIds = (names: string[], isIssue: boolean): Promise<any> => {
  const flaskResponse: Promise<any> = postResGetId(names, isIssue).then((res: IIdResponse) => res)
  return flaskResponse
}

export const getSymptomIds = (symptoms: string[]): number[] => {
  const symptomIds: number[] = [29, 144, 17]  // select the top three of the symptoms
  return symptomIds
}

// token required session
// deals with only one issue at the moment
export const getIssueInfo = (issuedId: number): Promise<any> => {
  const issueInfo = getAccessToken()
    .then((token: { Token: string }) => {
      const issueInfoUri =
        HEALTH_BASE_URL +
        `/issues/${issuedId}/info?token=${token.Token}&format=json&language=en-gb`;
      const issueInfoResult = requests(issueInfoUri);
      return issueInfoResult;

    })    
  return issueInfo;
};

export const diagnoseConditionsFromSymptoms = (symptoms: string[], sex: string, year_of_birth: number | string): Promise<any> => {
    const isIssue: boolean = false
  const flaskResponse: Promise<any> = getIds(symptoms, isIssue)

   const diagnosisRes: Promise<any> = flaskResponse.then((res: IIdResponse) => {
    const symptomIds: number[] = res.symptom_ids!  // non-null assertion
    const diagnosis: Promise<any> = getAccessToken().then((token: { Token: string }) => {
      const diagnoseUri: string = HEALTH_BASE_URL + `/diagnosis?symptoms=[${symptomIds}]&gender=${sex}&year_of_birth=${year_of_birth}&token=${token.Token}&format=json&language=en-gb`
      const relatedConditions: Promise<any> = requests(diagnoseUri)
      return relatedConditions
    })
    
    return diagnosis
  })
  
  return diagnosisRes
}


