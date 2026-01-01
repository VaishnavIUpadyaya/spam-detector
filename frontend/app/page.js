"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [probability, setProbability] = useState(0);
  const [timer, setTimer] = useState(null);

  const fetchProbability = async (msg) => {
    if (!msg.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      setProbability(data.probability);
      setResults([{ message: msg, ...data }, ...results.slice(0, 9)]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer) clearTimeout(timer);
    if (message.trim() === "") {
      setProbability(0);
      return;
    }

    const newTimer = setTimeout(() => {
      fetchProbability(message);
    }, 500);

    setTimer(newTimer);
    return () => clearTimeout(newTimer);
  }, [message]);

  const copyMessage = (msg) => {
    navigator.clipboard.writeText(msg);
    alert("Message copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-red-200 flex flex-col items-center p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Live Spam Detector 🔍</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        rows={5}
        className="w-full max-w-xl p-4 rounded-lg shadow-md resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      <div className="w-full max-w-xl h-6 bg-gray-300 rounded-full mt-4 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            probability > 60 ? "bg-red-500" : "bg-green-500"
          }`}
          animate={{ width: `${probability}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        ></motion.div>
      </div>
      <p className="mt-1 font-semibold text-gray-700">Spam Probability: {probability}%</p>

      <h2 className="text-2xl font-semibold mt-8 text-gray-700">History</h2>
      <div className="w-full max-w-2xl mt-4 space-y-4">
        {results.map((res, idx) => {
          const isSpam = res.result === "SPAM";
          return (
            <div
              key={idx}
              className={`p-4 rounded-lg shadow-md border-l-8 ${
                isSpam ? "border-red-600 bg-red-100" : "border-green-600 bg-green-100"
              }`}
            >
              <p className="mb-2"><strong>Message:</strong> {res.message}</p>
              <p><strong>Result:</strong> {res.result}</p>
              <p className="mb-2"><strong>Probability:</strong> {res.probability}%</p>

              {res.matched_words.length > 0 && (
                <p className="mb-2">
                  <strong>Suspicious words:</strong>{" "}
                  {res.matched_words.map((w,i) => (
                    <span key={i} className="px-2 py-1 bg-yellow-300 rounded-full text-sm mr-1">{w}</span>
                  ))}
                </p>
              )}

              <button
                onClick={() => copyMessage(res.message)}
                className="mt-2 px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
              >
                Copy Message
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
