import json
import pandas as pd

with open("mock_data/issues_sandbox.json") as issues: 
    issues_df = pd.DataFrame(json.load(issues))

with open("mock_data/symptoms_sandbox.json") as symptoms: 
	symptoms_df = pd.DataFrame(json.load(symptoms))

def get_ids(df, names):
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

if __name__ == "__main__":
    # test the functions here
    names = ['Shortness of breath', 'Chest pain', 'Chest tightness', 'Vomiting', 'Weight gain', 'Palpitations', 'Cold sweats', 'Tiredness', 'Going black before the eyes', 'Nausea']
    ids = get_ids(symptoms_df, names)
    print(ids)
    