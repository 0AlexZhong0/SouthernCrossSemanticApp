### Account Setup and Credentials Replacement

Register for an account on (API Medic)[https://apimedic.com/]. Once finished, go to the `API KEYS` tab located on the top header bar, navigate into it. You should see your **Username** and **Password** after you expand `SandBox API Account`. Then in create an `.env` file with values:

```
REACT_APP_SANDBOX_USRNAME=YOUR_USERNAME_GOES_HERE
REACT_APP_SANDBOX_PASSWORD=YOUR_PASSWORD_GOES_HERE
```

### To run the project correctly

- After you have started the flask server (following the guide in `server/README.md`)
- run `npm start` as usual and the application should work

### Git WorkFlow

Make changes on `dev` or a separate `feature/...` branch, then commit and push. After that, create a PR, so that we can review each other's changes.
