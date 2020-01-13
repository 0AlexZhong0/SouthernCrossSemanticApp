### Account Setup and Credentials Replacement
Register for an account on (API Medic)[https://apimedic.com/]. Once finished, go to the `API KEYS` tab located on the top header bar, navigate into it. Expand `SandBox API Account`, in `client\src\auth\getAccessToken.tsx`, use the values of your Username and Password for `api_key` and `secret_key` respectively.

### To run the project correctly
- After you have started the flask server (following the guide in `server/README.md`)
- run `npm start` as usual and the application should work

### Git WorkFlow
Make changes on `dev` or a separate `feature/...` branch, then commit and push. After that, create a PR, so that we can review each other's changes.
