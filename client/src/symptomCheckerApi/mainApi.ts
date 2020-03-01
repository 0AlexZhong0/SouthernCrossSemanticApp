import { HEALTH_BASE_URL } from "symptomCheckerApi/utils/requests";
import { getAccessToken, InvalidCredentialError } from "auth/getAccessToken";
import requests from "symptomCheckerApi/utils/requests";
import postResGetId from "symptomCheckerApi/utils/postResGetId";
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

export const diagnoseConditionsFromSymptoms = async (
  symptoms: string[],
  sex: string,
  yearOfBirth: number | string
) => {
  const isIssue: boolean = false;
  const flaskResponse = await getIds(symptoms, isIssue);

  const symptomIds = flaskResponse.symptom_ids;
  const accessToken = (await getAccessToken()).Token;
  const diagnoseUri: string =
    HEALTH_BASE_URL +
    `/diagnosis?symptoms=[${symptomIds}]&gender=${sex}&year_of_birth=${yearOfBirth}&token=${accessToken}&format=json&language=en-gb`;
  const relatedConditions = requests(diagnoseUri);

  return relatedConditions;
};
