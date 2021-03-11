# Import all the necessary files!
import os
import tensorflow as tf
from tensorflow import keras
from flask import Flask, request
import cv2
import json
import numpy as np
from flask_cors import CORS
from tensorflow.python.keras.backend import set_session
import base64
from datetime import datetime
from datetime import date
import pytz 
import csv
#
import pickle
import mtcnn
from os import listdir
from os.path import isdir
from PIL import Image
from matplotlib import pyplot
from numpy import savez_compressed
from numpy import asarray
from mtcnn.mtcnn import MTCNN
from os import listdir
from PIL import Image
from numpy import asarray
from matplotlib import pyplot
from mtcnn.mtcnn import MTCNN
import PIL.Image
import numpy as np
from keras.models import load_model
from numpy import load
from numpy import expand_dims
from numpy import asarray
from numpy import savez_compressed
from keras.models import load_model
from random import choice
from numpy import load
from numpy import expand_dims
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import Normalizer
from sklearn.svm import SVC
from matplotlib import pyplot





app = Flask(__name__)
CORS(app)

model = keras.models.load_model("facenet_keras.h5")

def img_to_encoding(path, model):
  img1 = cv2.imread(path, 1)
  img = img1[...,::-1]
  dim = (160, 160)
  # resize image
  if(img.shape != (160, 160, 3)):
    img = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
  x_train = np.array([img])
  model.call = tf.function(model.call)
  embedding = model.predict(x_train)
  return embedding

database = {}
import os
people = os.listdir('./images')
for w in people:
    database[w[0:-4]] = img_to_encoding("images/" + w, model)


def verify(image_path, identity, database, model):
    encoding = img_to_encoding(image_path, model)
    dist = np.linalg.norm(encoding-database[identity])
    if dist<5:
        print("It's " + str(identity) + ", welcome in!")
        match = True
    else:
        print("It's not " + str(identity) + ", please go away")
        match = False
    return dist, match

@app.route('/register', methods=['POST'])
def register():
    try:
        username = request.get_json()['username']
        img_data = request.get_json()['image64']
        with open('images/'+username+'.jpg', "wb") as fh:
            fh.write(base64.b64decode(img_data[22:]))
        path = 'images/'+username+'.jpg'

        global sess
        global graph
        with graph.as_default():
            set_session(sess)
            database[username] = img_to_encoding(path, model)    
        return json.dumps({"status": 200})
    except:
        return json.dumps({"status": 500})

def who_is_it(image_path, database, model):
    print(image_path)
    encoding = img_to_encoding(image_path, model)
    min_dist = 1000
    identity = ""
    # Loop over the database dictionary's names and encodings.
    for (name, db_enc) in database.items():
        dist = np.linalg.norm(encoding-db_enc)
        if dist<min_dist:
            min_dist = dist
            identity = name
    if min_dist > 5:
        identity = "unknown"
    return min_dist, identity

@app.route('/verify', methods=['POST'])
def change():
    img_data = request.get_json()['image64']
    img_name = str(datetime.timestamp(datetime.now()))
    with open('images/'+img_name+'.jpg', "wb") as fh:
        fh.write(base64.b64decode(img_data[22:]))
    path = 'images/'+img_name+'.jpg'
    min_dist, identity = who_is_it(path, database, model)
    os.remove(path)
    today = date.today()
    IST = pytz.timezone('Asia/Kolkata') 
    fileName = "./" + str(today) + ".csv"
    datetime_ist = datetime.now(IST) 
    ct= str(datetime_ist.strftime('%Y:%m:%d %H:%M:%S %Z %z'))
    if (os.path.isfile("./" + str(today) + ".csv")):
        with open(fileName, 'r') as f:
            reader= csv.DictReader(f)
            data= list(reader)
        data.append({'name': identity, 'timestamp': ct})
    else:
        data = [{'name': identity, 'timestamp': ct}]
    field_names = ['name', 'timestamp']   
    with open(fileName, 'w') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames = field_names) 
        writer.writeheader() 
        writer.writerows(data)

    if (identity == "unknown"):
        return json.dumps({"error": "unknown person. please register"})
    return json.dumps({"message": "person added into logs"})


def extract_face(filename, required_size=(160, 160)):
    	image = PIL.Image.open(filename)
	image = image.convert('RGB')
	pixels = asarray(image)
	detector = MTCNN()
	results = detector.detect_faces(pixels)
	x1, y1, width, height = results[0]['box']
	x1, y1 = abs(x1), abs(y1)
	x2, y2 = x1 + width, y1 + height
	face = pixels[y1:y2, x1:x2]
	image = PIL.Image.fromarray(face)
	image = image.resize(required_size)
	face_array = asarray(image)
	return face_array
def load_faces(directory):
	faces = list()
	for filename in listdir(directory):
		path = directory + filename
		face = extract_face(path)
		faces.append(face)
	return faces
def load_dataset(directory):
	X, y = list(), list()
	for subdir in listdir(directory):
		path = directory + subdir + '/'
		if not isdir(path):
			continue
		faces = load_faces(path)
		labels = [subdir for _ in range(len(faces))]
		X.extend(faces)
		y.extend(labels)
	return asarray(X), asarray(y)
def get_embedding(model, face_pixels):
  # scale pixel values
  face_pixels = face_pixels.astype('float32')
  # standardize pixel values across channels (global)
  mean, std = face_pixels.mean(), face_pixels.std()
  face_pixels = (face_pixels - mean) / std
  # transform face into one sample
  samples = expand_dims(face_pixels, axis=0)
  # make prediction to get embedding
  yhat = model.predict(samples)
  print(face_pixels.shape)
  return yhat[0]



if __name__ == "__main__":
    app.run(debug=True)