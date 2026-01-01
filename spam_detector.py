import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score

data = pd.read_csv("spam.csv", encoding="latin-1")

data = data[['v1', 'v2']]
data.columns = ['label', 'message']

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text

data['clean_message'] = data['message'].apply(clean_text)

vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(data['clean_message'])

y = data['label'].map({'ham': 0, 'spam': 1})

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = MultinomialNB()
model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, model.predict(X_test))
print("Model Accuracy:", accuracy)

suspicious_words = [
    'job', 'offer', 'hiring', 'interview', 'vacancy',
    'work from home', 'salary', 'company','click','here'
]

while True:
    user_msg = input("\nEnter a message (or type 'exit'): ")
    if user_msg.lower() == 'exit':
        break

    clean_msg = clean_text(user_msg)
    vector_msg = vectorizer.transform([clean_msg])
    prediction = model.predict(vector_msg)

    message_lower = user_msg.lower()
    rule_spam = any(word in message_lower for word in suspicious_words) and len(message_lower.split()) <= 4

    if prediction[0] == 1 or rule_spam:
        print("🚫 SPAM MESSAGE")
    else:
        print("✅ NOT SPAM")
