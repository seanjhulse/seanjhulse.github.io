from sklearn import tree
from sklearn import preprocessing
import csv
import numpy as np

# initialize some values
clf = tree.DecisionTreeClassifier()
le = preprocessing.LabelEncoder()
data = np.genfromtxt("../../big_data/adult.data", delimiter=",",dtype=None, encoding="utf8")

# create numeric labels for our string categories
categories = []
for row in data:
  row = list(row)
  if row[1] not in categories: categories.append(row[1])
  if row[3] not in categories: categories.append(row[3])
  if row[5] not in categories: categories.append(row[5])
  if row[6] not in categories: categories.append(row[6])
  if row[7] not in categories: categories.append(row[7])
  if row[8] not in categories: categories.append(row[8])
  if row[9] not in categories: categories.append(row[9])
  if row[13] not in categories: categories.append(row[13])

'''
Just some bad coding standards because I did this on a Friday night with a beer
in one hand and Family Guy in the background

Transform a row into a numerical vector thanks to the categorical pre-processing
of the data. We could do this statically and save a new CSV file with the data
having been processed, but what am I? A saint?

@params row a plain text version of the data in a tuple
@return {list} of each value transformed

'''
def transform_data(row):
  le.fit(categories)
  val0 = row[0]
  val1 = le.transform([row[1]])[0]
  val2 = row[2]
  val3 = le.transform([row[3]])[0]
  val4 = row[4]
  val5 = le.transform([row[5]])[0]
  val6 = le.transform([row[6]])[0]
  val7 = le.transform([row[7]])[0]
  val8 = le.transform([row[8]])[0]
  val9 = le.transform([row[9]])[0]
  val10 = row[10]
  val11 = row[11]
  val12 = row[12]
  val13 = le.transform([row[13]])[0]
  return [val0, val1, val2, val3, val4, val5, val6, val7, val8, val9, val10, val11, val12, val13]

'''
Generic function to test a row in our existing dataset to confirm our model
@param row_index
'''
def test_input(row_index):
  row = data[row_index]
  row = list(row)
  print(row)
  val = transform_data(row)
  prediction = clf.predict(np.matrix(val))
  log_prediction(prediction)

'''
Generic function to test a custom row of new data to test our model
@param vals list of values
'''
def custom_input(vals):
  print(vals)
  val = transform_data(vals)
  prediction = clf.predict(np.matrix(val))
  log_prediction(prediction)

'''
Logs the meaning of each value
@param prediction 0 / 1
'''
def log_prediction(prediction):
  if prediction:
    print("Under 50")
  else:
    print("Over 50")

X = []
Y = []
for row in data:
  row = list(row)
  val = transform_data(row)
  val14 = row[14]
  if(val14 == " <=50K"):
    val14 = 1
  else:
    val14 = 0

  X.append(val)
  Y.append([val14])

X = np.matrix(X)
Y = np.matrix(Y)

clf = clf.fit(X, Y)

# testing our model
test_input(8)
test_input(52)
test_input(157)
custom_input([28, ' Private', 77516, ' Bachelors', 14, ' Divorced', ' Tech-support', ' Unmarried', ' White', ' Male', 50000, 0, 40, ' United-States'])
custom_input([71, ' Self-emp-not-inc', 494223, ' Some-college', 10, ' Separated', ' Sales', ' Unmarried', ' Black', ' Male', 0, 0, 40, ' United-States'])