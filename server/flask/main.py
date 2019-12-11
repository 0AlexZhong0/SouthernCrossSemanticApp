import pandas as pd
from flask import Flask, request
import json

from medic_api import get_ids, issues_df, symptoms_df

app = Flask(__name__)

@app.route('/', methods=["POST", 'GET'])
def index():
	# considr moving the api logic to a different endpoint
	if request.method == "POST":		
		payload = request.get_json()
		# name variables depending on if it's about issue
		if payload["isIssue"]:
			df = issues_df
			names = payload["issues"]
			index = "issue_ids"			
		else:
			df = symptoms_df
			names = payload["symptoms"]
			index = "symptom_ids"
		print(f"names are {names}")
		print(f"index is {index}")
		ids = get_ids(df, names)
		data = {index: ids}

		return json.dumps(data)

	return "Flask index page here"  # return the issue_id of those symptoms here

if __name__ == "__main__":
	app.run(debug=True, port=8080)
