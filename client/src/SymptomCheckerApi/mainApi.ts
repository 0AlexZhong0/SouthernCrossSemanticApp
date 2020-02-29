import { HEALTH_BASE_URL } from "SymptomCheckerApi/ApiUtilities/requests";
import { getAccessToken, InvalidCredentialError } from "auth/getAccessToken";
import requests from "SymptomCheckerApi/ApiUtilities/requests";
import postResGetId from "SymptomCheckerApi/ApiUtilities/postResGetId";
import { MyError } from "utils/MyError";

export interface IIdFromFlask {
  issue_ids?: number[];
  symptom_ids?: number[];
}

export class InvalidFlaskResponseError extends MyError {}

// potential errors: invalid names, server has not started yet
export const getIds = async (names: string[], isIssue: boolean) => {
  const idsFromFlask: IIdFromFlask = await postResGetId(names, isIssue);

  if (!idsFromFlask)
    throw new InvalidFlaskResponseError(
      "Invalid flask response, check if the server has started or the conditions array may be invalid"
    );

  return idsFromFlask;
};

// token required session
// deals with only one issue at the moment
export const getIssueInfo = async (issuedId: number): Promise<any> => {
  try {
    const token = (await getAccessToken()).Token;
    const issueInfoUri =
      HEALTH_BASE_URL + `/issues/${issuedId}/info?token=${token}&format=json&language=en-gb`;
    const issueInfo = await requests(issueInfoUri);

    return issueInfo;
  } catch (e) {
    if (e instanceof InvalidCredentialError) alert(e.message);
    throw e;
  }
};

export const diagnoseConditionsFromSymptoms = (
  symptoms: string[],
  sex: string,
  year_of_birth: number | string
): Promise<any> => {
  const isIssue: boolean = false;
  const flaskResponse: Promise<any> = getIds(symptoms, isIssue);

  const diagnosisRes: Promise<any> = flaskResponse.then((res: IIdFromFlask) => {
    const symptomIds: number[] = res.symptom_ids!; // non-null assertion
    const diagnosis: Promise<any> = getAccessToken().then((token: { Token: string }) => {
      const diagnoseUri: string =
        HEALTH_BASE_URL +
        `/diagnosis?symptoms=[${symptomIds}]&gender=${sex}&year_of_birth=${year_of_birth}&token=${token.Token}&format=json&language=en-gb`;
      const relatedConditions: Promise<any> = requests(diagnoseUri);
      return relatedConditions;
    });

    return diagnosis;
  });

  return diagnosisRes;
};
