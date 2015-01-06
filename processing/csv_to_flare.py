import json, pandas as pd

def cluster(df):
    result = []
    
    for k,g in df.groupby(df.columns[0]):
        group_rows = g.drop(df.columns[0],1) 
        if len(g.columns) == 2: 
            result.append({"name": g[g.columns[0]].values[0],"value": int(g[g.columns[1]].values[0]),"size": int(g[g.columns[1]].values[0])})
        else:
            result.append({"name": k,"children":cluster(group_rows)})
    
    return result

def csv_to_flare(csvfilename, cols_to_keep):
	in_file = csvfilename
	df = pd.io.parsers.read_csv(in_file)

	dummies = []

	df2 = df[[col for col in cols_to_keep if col not in dummies]]
	df2 = df2.fillna(0)

	r = cluster(df2)

	j = json.dumps({"name" : "flare", "children" : r },indent=2)

	out_file = csvfilename[:-4]+".json"
	f = open(out_file, 'w')
	f.write(j)
	f.close() 


csv_to_flare('ca_per_capita_consumption.csv', ["cat","label","value"])



