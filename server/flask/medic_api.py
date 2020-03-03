import json
import pandas as pd

import os

# not sure if this is the best place to set environment variables, but will leave it as is
os.environ["FLASK_ENV"] = "production"
is_prod = os.environ["FLASK_ENV"] == "production"


class MedicApiClient:
    def __init__(self):
        self._load_issues_df()
        self._load_symptoms_df()

    # TODO: need to handle file not found error here
    def _load_issues_df(self):
        issues_data_path = "data/real/issues.json" if is_prod else "data/mock/issues_sandbox.json"
        with open(issues_data_path) as issues:
            issues_df = pd.DataFrame(json.load(issues))
            self.set_issues_df(issues_df)

    def _load_symptoms_df(self):
        symptoms_data_path = "data/real/symptoms.json" if is_prod else "data/mock/symptoms_sandbox.json"
        with open(symptoms_data_path) as symptoms:
            symptoms_df = pd.DataFrame(json.load(symptoms))
            self.set_symptoms_df(symptoms_df)

    def set_issues_df(self, issues_df):
        self.issues_df = issues_df

    def set_symptoms_df(self, symptoms_df):
        self.symptoms_df = symptoms_df

    def _get_ids(self, df, names):
        """
        find the corresponding id of the issue
        @param: df: pandas.DataFrame;  a dataframe which contains all id's and the name of the issues
        @param: names: string[];  depending on how many issues/symptoms the client is interested in
        @return: ids: int[]
        """
        # check if any of the values in the names variable in the Name column
        main_mask = df.Name.isin(names)
        ids = []  # ids match with the order of the issues
        names_in_df = df[main_mask]
        for name in names:
            mask = names_in_df.Name == name
            id = names_in_df[mask].ID.iloc[0]
            ids.append(int(id))

        return ids


medicApiClient = MedicApiClient()
