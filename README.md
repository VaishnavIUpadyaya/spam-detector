# Spam Detector (Flask + Next.js)

A real-time spam message detector using Python ML (Naive Bayes) in Flask and a Next.js frontend.

## Features

- Live spam detection as you type
- Animated probability bar
- Suspicious word highlights
- Message history
- Copy message button

## Setup

### Backend (Flask)

1. Install dependencies:
   pip install pandas scikit-learn flask flask-cors
2. Run Flask:
python app.py

- Flask runs at http://127.0.0.1:5000

### Frontend (Next.js)

1. Install dependencies:
   npm install
   npm install framer-motion
2. Run frontend:
npm run dev

- Next.js runs at http://localhost:3000

## Usage

1. Open frontend in browser.
2. Type a message.
3. View live spam probability, result, and suspicious words.
4. Copy messages or check message history.
