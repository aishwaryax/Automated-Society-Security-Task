import os
files = os.listdir('./images')
names = []
for name in files:
    names.append(name[:-4])
print(names)
import csv 
data = []
for w in names:
    data.append([w, "9XX"]) 
file = open('./data.csv', 'w+', newline ='') 
with file:     
    write = csv.writer(file) 
    write.writerows(data) 


