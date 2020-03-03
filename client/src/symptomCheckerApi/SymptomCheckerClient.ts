import { getAccessToken, InvalidCredentialError } from "auth/getAccessToken";
import requests, { HEALTH_BASE_URL } from "symptomCheckerApi/utils/requests";
import postResGetId from "symptomCheckerApi/utils/postResGetId";
import { MyError } from "utils/MyError";

export interface IIdFromFlask {
  issue_ids?: number[];
  symptom_ids?: number[];
}

export class InvalidFlaskResponseError extends MyError {}

class SymptomCheckerClient {
  private token: string | undefined;

  constructor() {
    this._loadAccessToken().then(token => this.setToken(token));
  }

  public _loadAccessToken = async () => {
    try {
      const token = (await getAccessToken()).Token;

      return token;
    } catch (e) {
      if (e instanceof InvalidCredentialError) alert(e.message);
      throw e;
    }
  };

  // FIXME: are there any circumstances where isIssue is false?
  public _getIds = async (names: string[], isIssue: boolean) => {
    const idsFromFlask: IIdFromFlask = await postResGetId(names, isIssue);

    if (!idsFromFlask)
      throw new InvalidFlaskResponseError(
        "Invalid flask response, check if the server has started or the conditions array may be invalid"
      );

    return idsFromFlask;
  };

  public _getIssueInfo = async (issueId: number) => {
    const issueInfoUri =
      HEALTH_BASE_URL + `/issues/${issueId}/info?token=${this.token}&format=json&language=en-gb`;
    const issueInfo = await requests(issueInfoUri);

    return issueInfo;
  };

  public _getSymptomsRelatedConditions = async (
    symptoms: string[],
    sex: string,
    yearOfBirth: number | string
  ) => {
    const isIssue: boolean = false;
    const flaskResponse = await this._getIds(symptoms, isIssue);

    const symptomIds = flaskResponse.symptom_ids;

    const diagnoseUri: string =
      HEALTH_BASE_URL +
      `/diagnosis?symptoms=[${symptomIds}]&gender=${sex}&year_of_birth=${yearOfBirth}&token=${this.token}&format=json&language=en-gb`;
    const relatedConditions = requests(diagnoseUri);

    return relatedConditions;
  };

  private setToken = (accessToken: string) => {
    this.token = accessToken;
  };
}

export const symptomCheckerClient = new SymptomCheckerClient();

export default SymptomCheckerClient;
