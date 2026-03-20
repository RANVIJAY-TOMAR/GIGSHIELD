from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# ─────────────────────────────────────────────
# Mock weather database (city → weather profile)
# ─────────────────────────────────────────────
CITY_WEATHER = {
    "mumbai":    {"rainfall": 72, "aqi": 145, "condition": "Heavy Rain"},
    "delhi":     {"rainfall": 5,  "aqi": 380, "condition": "Severe Smog"},
    "bangalore": {"rainfall": 35, "aqi": 95,  "condition": "Light Drizzle"},
    "hyderabad": {"rainfall": 20, "aqi": 130, "condition": "Partly Cloudy"},
    "chennai":   {"rainfall": 60, "aqi": 110, "condition": "Moderate Rain"},
    "kolkata":   {"rainfall": 80, "aqi": 200, "condition": "Heavy Rain"},
    "pune":      {"rainfall": 10, "aqi": 85,  "condition": "Clear Sky"},
    "ahmedabad": {"rainfall": 2,  "aqi": 310, "condition": "Heavy Smog"},
    "jaipur":    {"rainfall": 0,  "aqi": 260, "condition": "Dusty"},
    "lucknow":   {"rainfall": 15, "aqi": 340, "condition": "Moderate Smog"},
}

def get_weather(city: str) -> dict:
    key = city.strip().lower()
    if key in CITY_WEATHER:
        return CITY_WEATHER[key]
    # Unknown city → randomize slightly around moderate values
    rainfall = random.randint(0, 90)
    aqi      = random.randint(50, 400)
    conditions = ["Clear Sky", "Light Rain", "Moderate Rain", "Heavy Rain",
                  "Partly Cloudy", "Smoggy", "Very Smoggy"]
    return {
        "rainfall":  rainfall,
        "aqi":       aqi,
        "condition": random.choice(conditions),
    }

def run_risk_engine(weather: dict, weekly_income: float) -> dict:
    rainfall = weather["rainfall"]
    aqi      = weather["aqi"]

    if rainfall > 50 or aqi > 300:
        risk_level   = "HIGH"
        payout_pct   = 0.30
        risk_score   = min(100, int((rainfall / 100 * 50) + (aqi / 500 * 50)))
        trigger_met  = True
    else:
        risk_level   = "LOW"
        payout_pct   = 0.05
        risk_score   = max(10, int((rainfall / 100 * 50) + (aqi / 500 * 50)))
        trigger_met  = False

    predicted_loss  = round(weekly_income * payout_pct, 2)
    suggested_payout = predicted_loss

    return {
        "risk_level":        risk_level,
        "risk_score":        risk_score,
        "payout_percentage": int(payout_pct * 100),
        "predicted_loss":    predicted_loss,
        "suggested_payout":  suggested_payout,
        "trigger_met":       trigger_met,
        "auto_payout":       trigger_met,
    }

def run_fraud_detection(risk_level: str, weekly_income: float) -> dict:
    """
    Simulate fraud detection.
    If HIGH risk but income declared is suspiciously low (<₹1000/week),
    or randomly at 15% chance when risk is HIGH → mark fraud suspicious.
    """
    fraud_flag = False
    fraud_reason = "Normal activity pattern detected."

    if risk_level == "HIGH":
        if weekly_income < 1000:
            fraud_flag   = True
            fraud_reason = "Declared income unusually low during high-risk period."
        elif random.random() < 0.15:
            fraud_flag   = True
            fraud_reason = "Inactivity detected on platform during adverse weather event."

    return {
        "fraud_risk":   "HIGH" if fraud_flag else "LOW",
        "fraud_flagged": fraud_flag,
        "fraud_reason": fraud_reason,
    }

# ─────────────────────────────────────────────
# API Routes
# ─────────────────────────────────────────────
@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json(force=True)
    city          = data.get('city', 'Mumbai')
    weekly_income = float(data.get('weekly_income', 5000))

    weather  = get_weather(city)
    risk     = run_risk_engine(weather, weekly_income)
    fraud    = run_fraud_detection(risk['risk_level'], weekly_income)

    return jsonify({
        "city":          city.title(),
        "weekly_income": weekly_income,
        "weather":       weather,
        "risk":          risk,
        "fraud":         fraud,
    })

@app.route('/api/cities', methods=['GET'])
def cities():
    return jsonify(list(CITY_WEATHER.keys()))

# Serve frontend
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    print("=" * 55)
    print("  GigShield AI – Parametric Insurance Engine")
    print("  Running at http://localhost:5000")
    print("=" * 55)
    app.run(debug=True, port=5000)
