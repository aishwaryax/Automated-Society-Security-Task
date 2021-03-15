from playsound import playsound
import os
import tensorflow as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # or any {'0', '1', '2'}
from tensorflow import keras
from flask import Flask, request, send_from_directory, render_template, Response
import cv2
import json
from flask_cors import CORS
from tensorflow.python.keras.backend import set_session
import base64
from datetime import datetime
from datetime import date
import pytz 
import csv
import face_recognition
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
from numpy import load
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import Normalizer
from sklearn.svm import SVC
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from csv import writer 


outputFrame = None

facenet_model = load_model('./facenet_keras.h5')




UPLOADS_PATH = dirname(realpath(__file__)) + '/images/'


app = Flask(__name__)
CORS(app)



camera = cv2.VideoCapture(0)  # use 0 for web camera

def gen_frames():  # generate frame by frame from camera
    face_names = []
    face_locations = []
    process_this_frame = True
    while True:
        identity = "unknown"
        # Capture frame-by-frame
        success, frame = camera.read()  # read the camera frame
        if process_this_frame:
            face_locations = face_recognition.face_locations(frame)
            face_pixels = extract_face("./frame.jpg", required_size=(160, 160))
            face_embedding = get_embedding(facenet_model, face_pixels)
            samples = expand_dims(face_embedding, axis=0)
            model = load(open( "./model.pkl", 'rb'), allow_pickle=True) #SVC
            yhat_class = model.predict(samples)
            yhat_prob = model.predict_proba(samples)
            class_index = yhat_class[0]
            class_probability = yhat_prob[0,class_index] * 100
            out_encoder = LabelEncoder()
            out_encoder.classes_ = np.load('./classes.npy')
            predict_names = out_encoder.inverse_transform(yhat_class)
            identity = predict_names[0]
            probability = class_probability
            folder = './train/' + predict_names[0]
            file = folder + "/" + os.listdir(folder)[0]
            dist = np.linalg.norm(face_embedding-get_embedding(facenet_model, extract_face(file)))
            if (dist>10):
                identity = "unknown"
                proability = 100
                playsound('./error.mp3')
            else:
                proability = 100
                playsound('./msg.mp3')
            
            
            #here save data
            today = date.today()
            IST = pytz.timezone('Asia/Kolkata') 
            fileName = "./logs/" + str(today) + ".csv"
            datetime_ist = datetime.now(IST) 
            ct= str(datetime_ist.strftime('%Y:%m:%d %H:%M:%S %Z %z'))
            f = open("./temperature.txt", "r")
            temperature = f.read()
            f.close()
            if (float(temperature) > 38):
                playsound('./temp.mp3')
            data = [{'name': identity, 'probability': str(probability), 'temperature': temperature, 'timestamp': ct}]
            field_names = ['name', 'probability', 'temperature', 'timestamp']
            if (os.path.isfile("./logs/" + str(today) + ".csv")):
                with open(fileName, 'a', newline='') as csvfile:
                    writer = csv.DictWriter(csvfile, fieldnames = field_names)
                    writer.writerows(data)
            else:
                with open(fileName, 'w', newline='') as csvfile:
                    writer = csv.DictWriter(csvfile, fieldnames = field_names)
                    writer.writeheader()
                    writer.writerows(data)
               
            face_names.append(identity)
            
        process_this_frame = not process_this_frame
                
        for (top, right, bottom, left), name in zip(face_locations, face_names):
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name + " : " + str(probability), (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # concat frame one by one and show result


@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')




@app.route("/")
def index():
    print("here")
    return render_template("index.html")


@app.route('/register', methods=['POST'])
def register():
    os.mkdir("./train/" + request.form.get('name'))
    files = request.files.getlist("files")
    filename, file_extension = os.path.splitext(files[0].filename)
    files[0].save("./images/" + request.form.get('name') + file_extension)
    for file in files:
        file.save("./train/" + request.form.get('name') + "/" + file.filename)
    with open('./data.csv', 'a', newline='') as f_object: 
        writer_object = writer(f_object) 
        writer_object.writerow([request.form.get('name'), request.form.get('phone')]) 
        f_object.close()
    return json.dumps({"status": 200, "message" : "Picture uploaded! Please train the model"})



@app.route('/logs', methods=['POST'])
def give_logs():
    data = make_json("./logs/"+request.get_json()['date'][0:10]+".csv")
    if (len(data) == 0):
        return json.dumps({"error": "No logs present"})
    return json.dumps({"message": "logs sent", "data": data})

    


@app.route('/download', methods=['POST'])
def download_file():
    LOGS_PATH = dirname(realpath(__file__)) + '/logs/'
    data = make_json("./logs/"+request.get_json()['date'][0:10]+".csv")
    if (os.path.isfile("./logs/"+request.get_json()['date'][0:10]+".csv")):
        filename = request.get_json()['date'][0:10]+".csv"
        return send_from_directory(LOGS_PATH, filename)
    else:
        return json.dumps({"error": "No logs present"})


@app.route('/database', methods=['GET'])
def give_database():
    with open('./data.csv', mode='r') as infile:
        reader = csv.reader(infile)
        with open('./data_new.csv', mode='w') as outfile:
            writer = csv.writer(outfile)
            data_dict = {rows[0]:rows[1] for rows in reader}
    data = []
    print(data_dict)
    for x in os.listdir('./images'):
        data.append({'name': x[:-4], 'image': "http://127.0.0.1:5000/images/"+x, 'phone': data_dict[x[:-4]]})
    return json.dumps({"message": "data sent", "data": data})

@app.route('/images/<filename>')
def send_file(filename):
    print("here")
    return send_from_directory(UPLOADS_PATH, filename)



@app.route('/train', methods=['POST'])
def train():
    trainX, trainy = load_dataset('./train/')
    savez_compressed('./faces-dataset.npz', trainX, trainy)
    data = np.load('./faces-dataset.npz', allow_pickle = True)
    trainX, trainy, = data['arr_0'], data['arr_1']
    newTrainX = list()
    for face_pixels in trainX:
        embedding = get_embedding(facenet_model, face_pixels)
        newTrainX.append(embedding)
    newTrainX = asarray(newTrainX)
    newTestX = list()
    savez_compressed('./faces-embeddings.npz', newTrainX, trainy)
    data = load('./faces-embeddings.npz', allow_pickle = True)
    trainX, trainy = data['arr_0'], data['arr_1']
    in_encoder = Normalizer(norm='l2')
    trainX = in_encoder.transform(trainX)
    out_encoder = LabelEncoder()
    out_encoder.fit(trainy)
    trainy = out_encoder.transform(trainy)
    model = SVC(kernel='linear', probability=True)
    model.fit(trainX, trainy)
    yhat_train = model.predict(trainX)
    score_train = accuracy_score(trainy, yhat_train)
    message = "Accuracy: train=" + str(score_train*100)
    save_model_encoder()
    return json.dumps({"message": message })


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
  face_pixels = face_pixels.astype('float32')
  mean, std = face_pixels.mean(), face_pixels.std()
  face_pixels = (face_pixels - mean) / std
  samples = expand_dims(face_pixels, axis=0)
  yhat = model.predict(samples)
  return yhat[0]

def save_model_encoder ():
    data = load('./faces-embeddings.npz')
    trainX, trainy = data['arr_0'], data['arr_1']
    in_encoder = Normalizer(norm='l2')
    trainX = in_encoder.transform(trainX)
    out_encoder = LabelEncoder()
    out_encoder.fit(trainy)
    trainy = out_encoder.transform(trainy)
    model = SVC(kernel='linear', probability=True)
    model.fit(trainX, trainy)
    pickle.dump(model, open('./model.pkl', 'wb'))
    out_encoder.classes_ = np.load('./classes.npy')

def make_json(csvFilePath):
    data = []
    try:
        with open(csvFilePath, encoding='utf-8') as csvf:
            csvReader = csv.DictReader(csvf)
            for rows in csvReader:             
                data.append(rows)
    except:
        return []
    return data







if __name__ == "__main__":
    app.run(debug=True)