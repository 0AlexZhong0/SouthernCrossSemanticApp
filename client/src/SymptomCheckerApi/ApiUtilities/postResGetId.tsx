import requests from "./requests"

// curently these settings do not work on mobile yet
// separate these things in another file
const MOBILE_DEV_MODE: boolean = false
const MY_IP_ADDRESS: string = "172.24.15.4"
const LOCAL_HOST: string = "127.0.0.1"
const HOST_ADDRESS: string = MOBILE_DEV_MODE ? MY_IP_ADDRESS : LOCAL_HOST

const postResGetId = (names: string[], isIssue: boolean): Promise<any> => {
  // uri can be flexible depending on if we deploy or not
  const uri: string = `http://${HOST_ADDRESS}:8080/`
  // triggers me, don't know how to assign the variable to the index of the JSON
  const payload: Object = isIssue
    ? { isIssue: isIssue, issues: names }
    : { isIssue: isIssue, symptoms: names }
  const init: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }

  const response: Promise<any> = requests(uri, init)
  return response
}

export default postResGetId
