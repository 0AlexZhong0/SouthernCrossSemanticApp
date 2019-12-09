const requests = (
  uri: string,
  methods: Object = { method: "GET", headers: { "Access-Control-Allow-Origin": "*" } }
  // methods: Object = { method: "GET"} // Daphne: overcome fetch blocked by COR policy remove access control
): Promise<Response> => {
  // default is a GET request
  const apiPromise = fetch(uri, methods)
    .then(
      (res: Response): Response => {
        if (!res.ok) {
          throw Error(res.statusText);
        } else {
          return res;
        }
      }
    )
    .then(
      (result: Response): Promise<any> => {
        return result.json();
      }
    )
    .catch((err: Response): void => console.log(`The error is ${err}`));

  return apiPromise;
};

export const AUTH_BASE_URL = "https://sandbox-authservice.priaid.ch";
export const HEALTH_BASE_URL = "https://sandbox-healthservice.priaid.ch"
export default requests;
