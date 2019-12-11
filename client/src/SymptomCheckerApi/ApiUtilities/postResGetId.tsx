import requests from './requests'

const postResGetId = (names: string[], isIssue: boolean): Promise<any> => {
    // uri can be flexible depending on if we deploy or not
    const uri: string = "http://127.0.0.1:8080/"
    // triggers me, don't know how to assign the variable to the index of the JSON
    const payload: Object = isIssue ? { isIssue: isIssue, issues: names } : { isIssue: isIssue, symptoms: names }
    const init: RequestInit = {
        method: "POST", headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },        
        body: JSON.stringify(payload)
    }

    const response: Promise<any> = requests(uri, init)
    return response
}

export default postResGetId
