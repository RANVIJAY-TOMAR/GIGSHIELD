# coding: utf-8
"""Quick logic-only unit test for GigShield AI - no Flask server needed."""

CITY_WEATHER = {
    "mumbai":    {"rainfall": 72, "aqi": 145, "condition": "Heavy Rain"},
    "delhi":     {"rainfall": 5,  "aqi": 380, "condition": "Severe Smog"},
    "bangalore": {"rainfall": 35, "aqi": 95,  "condition": "Light Drizzle"},
    "pune":      {"rainfall": 10, "aqi": 85,  "condition": "Clear Sky"},
    "ahmedabad": {"rainfall": 2,  "aqi": 310, "condition": "Heavy Smog"},
}

def run_risk_engine(weather, weekly_income):
    r, a = weather["rainfall"], weather["aqi"]
    high = r > 50 or a > 300
    pct  = 0.30 if high else 0.05
    return {
        "risk_level":  "HIGH" if high else "LOW",
        "payout_pct":  int(pct * 100),
        "payout":      round(weekly_income * pct, 2),
        "trigger_met": high,
    }

def run_fraud_detection(risk_level, weekly_income):
    flagged = risk_level == "HIGH" and weekly_income < 1000
    return {
        "fraud_risk": "HIGH" if flagged else "LOW",
        "flagged":    flagged,
    }

# Test Cases
cases = [
    ("mumbai",    5000, "HIGH", 1500.0),
    ("delhi",     4000, "HIGH", 1200.0),
    ("bangalore", 6000, "LOW",   300.0),
    ("pune",      3000, "LOW",   150.0),
    ("ahmedabad", 2000, "HIGH",  600.0),
]

print("=" * 65)
print("  GigShield AI - Core Logic Tests")
print("=" * 65)

all_passed = True
for city, income, expected_risk, expected_payout in cases:
    w = CITY_WEATHER[city]
    r = run_risk_engine(w, income)
    f = run_fraud_detection(r["risk_level"], income)

    ok = (r["risk_level"] == expected_risk and
          abs(r["payout"] - expected_payout) < 0.01)
    if not ok:
        all_passed = False

    status = "PASS" if ok else "FAIL"
    print(
        "[{}] {:<10}  Rain={:>3}mm  AQI={:>3}  Risk={:<4}  Payout=Rs {:>8,.0f} ({:>2}%)  Fraud={}".format(
            status, city.upper(),
            w["rainfall"], w["aqi"],
            r["risk_level"], r["payout"], r["payout_pct"],
            f["fraud_risk"]
        )
    )

print("=" * 65)
print("  Result:", "ALL TESTS PASSED [OK]" if all_passed else "SOME TESTS FAILED [FAIL]")
print("=" * 65)
