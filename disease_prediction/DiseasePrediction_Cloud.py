import pickle
import json
from flask import Flask, request

model_dtree = None
model_randfor = None
model_gnb = None

l1=['back_pain','constipation','abdominal_pain','diarrhoea','mild_fever','yellow_urine',
'yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach',
'swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation',
'redness_of_eyes','sinus_pressure','runny_nose','congestion','chest_pain','weakness_in_limbs',
'fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region','bloody_stool',
'irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs',
'swollen_blood_vessels','puffy_face_and_eyes','enlarged_thyroid','brittle_nails',
'swollen_extremeties','excessive_hunger','extra_marital_contacts','drying_and_tingling_lips',
'slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints',
'movement_stiffness','spinning_movements','loss_of_balance','unsteadiness',
'weakness_of_one_body_side','loss_of_smell','bladder_discomfort','foul_smell_of urine',
'continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)',
'depression','irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain',
'abnormal_menstruation','dischromic _patches','watering_from_eyes','increased_appetite','polyuria','family_history','mucoid_sputum',
'rusty_sputum','lack_of_concentration','visual_disturbances','receiving_blood_transfusion',
'receiving_unsterile_injections','coma','stomach_bleeding','distention_of_abdomen',
'history_of_alcohol_consumption','fluid_overload','blood_in_sputum','prominent_veins_on_calf',
'palpitations','painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling',
'silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister','red_sore_around_nose',
'yellow_crust_ooze']

disease=['Fungal infection','Allergy','GERD','Chronic cholestasis','Drug Reaction',
'Peptic ulcer diseae','AIDS','Diabetes','Gastroenteritis','Bronchial Asthma','Hypertension',
' Migraine','Cervical spondylosis',
'Paralysis (brain hemorrhage)','Jaundice','Malaria','Chicken pox','Dengue','Typhoid','hepatitis A',
'Hepatitis B','Hepatitis C','Hepatitis D','Hepatitis E','Alcoholic hepatitis','Tuberculosis',
'Common Cold','Pneumonia','Dimorphic hemmorhoids(piles)',
'Heartattack','Varicoseveins','Hypothyroidism','Hyperthyroidism','Hypoglycemia','Osteoarthristis',
'Arthritis','(vertigo) Paroymsal  Positional Vertigo','Acne','Urinary tract infection','Psoriasis',
'Impetigo']

app = Flask(__name__)

def load_model():
    global model_dtree
    global model_randfor
    global model_gnb

    model_dtree = pickle.load(open("model_dtree.pickle", "rb"))
    model_randfor = pickle.load(open("model_randfor.pickle", "rb"))
    model_gnb = pickle.load(open("model_gnb.pickle", "rb"))

def predict_model(symptoms, model):
    global l1
    global disease
    
    l2=[]
    for x in range(0,len(l1)):
        l2.append(0)

    for k in range(0,len(l1)):
        for z in symptoms:
            if(z==l1[k]):
                l2[k]=1
    
    inputtest = [l2]
    predict = model.predict(inputtest)
    predicted=predict[0]
    print(predicted)
    h='no'
    for a in range(0,len(disease)):
        if(predicted == a):
            h='yes'
            break

    if (h=='yes'):
        return disease[a]
    else:
        return 'unrecognizable'
    
def result(prediction_dtree, prediction_randfor, prediction_gnb):
    if prediction_dtree == prediction_randfor == prediction_gnb:
        return json.dumps(prediction_dtree)
    elif prediction_dtree == prediction_randfor or prediction_dtree == prediction_gnb:
        if prediction_dtree == prediction_randfor:
            return json.dumps([prediction_dtree, prediction_gnb])
        else:
            return json.dumps([prediction_dtree, prediction_randfor])
    elif prediction_randfor == prediction_gnb:
        return json.dumps([prediction_randfor, prediction_dtree])
    else:
        return json.dumps([prediction_dtree, prediction_randfor, prediction_gnb])
        
@app.route('/')
def home_endpoint():
    return 'Disease Prediction App'

@app.route('/predict', methods=['POST'])
def get_prediction():
    if request.method == 'POST':
        symptoms_dict = request.get_json()
        symptoms = symptoms_dict["symptoms"]
        print(symptoms)
        prediction_dtree = predict_model(symptoms, model_dtree)
        prediction_randfor = predict_model(symptoms, model_randfor)
        prediction_gnb = predict_model(symptoms, model_gnb)

        print(prediction_dtree+' '+prediction_randfor+' '+prediction_gnb)

    return result(prediction_dtree, prediction_randfor, prediction_gnb)

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=80)