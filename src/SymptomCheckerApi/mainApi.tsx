import { HEALTH_BASE_URL } from "SymptomCheckerApi/ApiUtilities/requests";
import getAccessToken from "auth/getAccessToken";
import requests from "SymptomCheckerApi/ApiUtilities/requests";

// here can be the place where you resolve all of the functions from

// hard-coded functions session, perhaps do not need to export all these functions
// think of a way to encompass all the functions written below
// heart attack example
export const getIssueId = (issue: string): number => {
  return 87
}

export const getSymptomIds = (symptoms: string[]): number[] => {
  const symptomIds: number[] = [29, 144, 17]  // select the top three of 
  return symptomIds
}


// token required session
export const getIssueInfo = (issuedId: number): Promise<any> => {
  const issueInfo = getAccessToken()
    .then((token: {Token: string}) => {
      const issueInfoUri =
        HEALTH_BASE_URL +
        `/issues/${issuedId}/info?token=${token.Token}&format=json&language=en-gb`;
      const issueInfoResult = requests(issueInfoUri);
      return issueInfoResult;
    })
    .catch(err => console.log(err));

  return issueInfo;
};

export const diagnoseConditionsFromSymptoms = (symptoms: string[], sex: string, year_of_birth: number | string): Promise<any> =>  {
  const symptomIds = getSymptomIds(symptoms)
  const diagnosis = getAccessToken().then((token: {Token: string}) => {
    const diagnoseUri: string = HEALTH_BASE_URL +  `/diagnosis?symptoms=[${symptomIds}]&gender=${sex}&year_of_birth=${year_of_birth}&token=${token.Token}&format=json&language=en-gb`
    const relatedSymptoms = requests(diagnoseUri)
    
    return relatedSymptoms
  })
   
  return diagnosis
}

