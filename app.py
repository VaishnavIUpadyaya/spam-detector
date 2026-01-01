from flask import Flask, request, jsonify
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
data = pd.read_csv("spam.csv", encoding="latin-1")[['v1','v2']]
data.columns = ['label', 'message']

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

data['clean_message'] = data['message'].apply(clean_text)

vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(data['clean_message'])
y = data['label'].map({'ham':0,'spam':1})

model = MultinomialNB()
model.fit(X, y)

suspicious_words = ['job','offer','hiring','vacancy','otp','password','verify','account','win','prize','lottery','salary']

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    message = data.get("message", "")
    clean_msg = clean_text(message)
    vector_msg = vectorizer.transform([clean_msg])
    
    prediction = model.predict(vector_msg)[0]
    proba = model.predict_proba(vector_msg)[0][1]
    rule_spam = any(word in clean_msg for word in suspicious_words)
    
    result = "SPAM" if prediction==1 or rule_spam or proba>0.6 else "NOT SPAM"
    matched_words = [word for word in suspicious_words if word in clean_msg]
    
    return jsonify({
        "result": result,
        "probability": round(proba*100,2),
        "matched_words": matched_words
    })

if __name__ == "__main__":
    app.run(debug=True)
