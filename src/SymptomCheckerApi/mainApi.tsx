// the function that I use to get the token is wrong

import { BASE_URL } from "SymptomCheckerApi/ApiUtilities/requests";
import getAccessToken from "auth/getAccessToken";
import requests from "SymptomCheckerApi/ApiUtilities/requests";

// here can be the place where you resolve all of the functions from
const getIssueInfo = (issuedId: number): Promise<any> => {
  const issueInfo = getAccessToken()
    .then(token => {
      const issueInfoUri =
        BASE_URL +
        `/issues/${issuedId}/info?token=${token.Token}&format=json&language=en-gb`;
      const issueInfoResult = requests(issueInfoUri);
      return issueInfoResult;
    })
    .catch(err => console.log(err));

  return issueInfo;
};

export default getIssueInfo;
