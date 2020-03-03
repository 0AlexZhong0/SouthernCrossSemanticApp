import pandas as pd
from flask import Flask, request
from flask_cors import CORS
import json

# data processing helper functions
from medic_api import medicApiClient

app = Flask(__name__)
CORS(app)


@app.route('/', methods=["POST", 'GET'])
def index():
    # considr moving the api logic to a different endpoint
    if request.method == "POST":
        payload = request.get_json()
        # name variables depending on if it's about issue or symptoms
        if payload["isIssue"]:
            df = medicApiClient.issues_df
            names = payload["issues"]
            index = "issue_ids"
        else:
            df = medicApiClient.symptoms_df
            names = payload["symptoms"]
            index = "symptom_ids"

        ids = medicApiClient._get_ids(df, names)
        data = json.dumps({index: ids})

        return data

    return "Index Page"


if __name__ == "__main__":
    # set default running on localhost
    app.run(port=8080)
