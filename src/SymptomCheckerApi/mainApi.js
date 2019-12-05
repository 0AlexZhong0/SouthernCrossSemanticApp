// the function that I use to get the token is wrong
const getAccessToken = require("../auth/getAccessToken");
const requests = require("../SymptomCheckerApi/ApiUtilities/requests");
const BASE_URL = require("./ApiUtilities/baseUrl");

// here can be the place where you resolve all of the functions from
function getIssueInfo(issuedId) {
  const issueInfo = getAccessToken()
    .then(token => {            
      const issueInfoUri =
        BASE_URL +
        `/issues/${issuedId}/info?token=${token.Token}&format=json&language=en-gb`;
        console.log(issueInfoUri)
      // const issueInfoResult = requests(issueInfoUri);
      // return issueInfoResult;
    })
    .catch(err => console.log(err));
  
  issueInfo.then(res => console.log(res))
  return issueInfo;
}

getIssueInfo(59)
