// following the typed arguments for fetch
const requests = (uri: string, init?: RequestInit | undefined) => {
  // default is a GET request
  const response = fetch(uri, init)
    .then(res => {
      if (!res.ok) {
        throw Error(`Response ${res.statusText}`);
      } else {
        return res.json();
      }
    })
    .catch(err => {
      console.log(`The error is ${err}`);
      return undefined;
    });

  return response;
};

// change the endpoint to the real ones
export const AUTH_BASE_URL = "https://sandbox-authservice.priaid.ch";
export const HEALTH_BASE_URL = "https://sandbox-healthservice.priaid.ch";

export default requests;
