/* ─────────────────────────────────────────────────
   GigShield AI – Frontend Application Logic
───────────────────────────────────────────────── */

const API_BASE = 'http://localhost:5000';

// ──────────────────────────────────────
// FORM SUBMISSION & API CALL
// ──────────────────────────────────────
document.getElementById('analyzerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const city   = document.getElementById('city').value.trim();
  const income = parseFloat(document.getElementById('income').value);

  if (!city || !income || income <= 0) return;

  // Show loading state
  const btn     = document.getElementById('analyzeBtn');
  const spinner = document.getElementById('spinner');
  btn.disabled  = true;
  spinner.style.display = 'inline';
  document.querySelector('.btn-text').textContent = 'Analyzing…';

  try {
    const resp = await fetch(`${API_BASE}/api/analyze`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ city, weekly_income: income }),
    });

    if (!resp.ok) throw new Error('API Error');
    const data = await resp.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    alert('Could not connect to backend. Make sure Flask is running on port 5000.');
  } finally {
    btn.disabled = false;
    spinner.style.display = 'none';
    document.querySelector('.btn-text').textContent = 'Analyze My Risk';
  }
});

// ──────────────────────────────────────
// RENDER RESULTS
// ──────────────────────────────────────
function renderResults(data) {
  const { city, weather, risk, fraud } = data;

  // Show results area
  const area = document.getElementById('resultsArea');
  area.style.display = 'flex';
  area.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  renderWeather(city, weather);
  renderRisk(risk, weather);
  renderFraud(fraud);
}

function renderWeather(city, weather) {
  document.getElementById('wCity').textContent      = city;
  document.getElementById('wCondition').textContent = weather.condition;
  document.getElementById('wRainfall').textContent  = `${weather.rainfall} mm`;
  document.getElementById('wAqi').textContent       = `${weather.aqi} µg/m³`;

  // Weather icon
  const icon = getWeatherIcon(weather.condition);
  document.getElementById('weatherIcon').textContent = icon;
}

function getWeatherIcon(condition) {
  const c = condition.toLowerCase();
  if (c.includes('heavy rain'))  return '⛈️';
  if (c.includes('moderate rain')) return '🌧️';
  if (c.includes('light rain') || c.includes('drizzle')) return '🌦️';
  if (c.includes('smog') || c.includes('smogg')) return '🌫️';
  if (c.includes('dust'))        return '🌪️';
  if (c.includes('cloud'))       return '⛅';
  return '☀️';
}

function renderRisk(risk, weather) {
  // Badge
  const badge = document.getElementById('riskBadge');
  badge.textContent = `${risk.risk_level} RISK`;
  badge.className = `risk-level-badge ${risk.risk_level.toLowerCase()}`;

  // Bar
  document.getElementById('riskBarFill').style.width = `${risk.risk_score}%`;
  document.getElementById('riskScore').textContent   = risk.risk_score;

  // Values
  document.getElementById('incomeLoss').textContent    = `₹${risk.predicted_loss.toLocaleString('en-IN')}`;
  document.getElementById('suggestedPayout').textContent = `₹${risk.suggested_payout.toLocaleString('en-IN')}`;
  document.getElementById('payoutPct').textContent     = `${risk.payout_percentage}% of Weekly Income`;
  document.getElementById('triggerStatus').textContent = risk.trigger_met ? '🔴 TRIGGERED' : '🟢 Not Triggered';

  // Auto payout banner
  const banner = document.getElementById('payoutBanner');
  banner.style.display = risk.trigger_met ? 'flex' : 'none';

  // Trigger condition rows
  const rainMet = weather.rainfall > 50;
  const aqiMet  = weather.aqi > 300;

  const condRain = document.getElementById('condRain');
  condRain.className = `trigger-row ${rainMet ? 'met' : 'ok'}`;
  document.getElementById('condRainVal').textContent = `${weather.rainfall}mm ${rainMet ? '⬆ TRIGGERED' : '✓ OK'}`;

  const condAqi = document.getElementById('condAqi');
  condAqi.className = `trigger-row ${aqiMet ? 'met' : 'ok'}`;
  document.getElementById('condAqiVal').textContent = `${weather.aqi} ${aqiMet ? '⬆ TRIGGERED' : '✓ OK'}`;
}

function renderFraud(fraud) {
  const badge  = document.getElementById('fraudBadge');
  const dot    = document.getElementById('fraudDot');
  const lvl    = document.getElementById('fraudLevel');
  const reason = document.getElementById('fraudReason');

  lvl.textContent    = `Fraud Risk: ${fraud.fraud_risk}`;
  reason.textContent = fraud.fraud_reason;

  if (fraud.fraud_risk === 'HIGH') {
    dot.className = 'fraud-dot red';
  } else {
    dot.className = 'fraud-dot green';
  }

  // Update signal statuses
  const allOk   = !fraud.fraud_flagged;
  const signals = [
    { id: 'sig1Status', ok: allOk || Math.random() > 0.3 },
    { id: 'sig2Status', ok: true },
    { id: 'sig3Status', ok: allOk },
    { id: 'sig4Status', ok: allOk || Math.random() > 0.2 },
  ];

  signals.forEach(s => {
    const el = document.getElementById(s.id);
    if (fraud.fraud_risk === 'HIGH' && s.id === 'sig1Status' && !fraud.fraud_flagged) {
      // still evaluating
      el.textContent  = 'Evaluating';
      el.className    = 'sig-status check';
    } else if (s.ok) {
      el.textContent = '✓ Normal';
      el.className   = 'sig-status ok';
    } else {
      el.textContent = '⚠ Flagged';
      el.className   = 'sig-status warn';
    }
  });

  if (fraud.fraud_flagged) {
    document.getElementById('sig1Status').textContent = '⚠ Flagged';
    document.getElementById('sig1Status').className   = 'sig-status warn';
  }
}

// ──────────────────────────────────────
// PRICING PLAN SELECTION
// ──────────────────────────────────────
const PLANS = {
  basic: { name: 'Basic',  price: '₹99/week',  desc: 'Basic weather protection starts from next Monday.\nPayout: 15% of weekly income when rainfall > 50mm.' },
  pro:   { name: 'Pro',    price: '₹149/week', desc: 'Full weather + AQI protection starts from next Monday.\nPayout: 30% of weekly income on any trigger.' },
  elite: { name: 'Elite',  price: '₹199/week', desc: 'Maximum all-risk coverage starts from next Monday.\nPlus accident coverage & 24/7 priority support.' },
};

function selectPlan(planId) {
  const plan = PLANS[planId];

  // Modal
  document.getElementById('modalTitle').textContent = `${plan.name} Plan Selected! 🎉`;
  document.getElementById('modalBody').textContent  = `You've chosen the ${plan.name} plan at ${plan.price}.\n\n${plan.desc}`;
  document.getElementById('modalOverlay').style.display = 'flex';

  // Inline confirm
  document.getElementById('confirmPlanName').textContent = plan.name;
  const confirm = document.getElementById('planConfirm');
  confirm.style.display = 'flex';

  // Highlight selected card
  ['basic','pro','elite'].forEach(id => {
    const card = document.getElementById(`plan-${id}`);
    card.style.borderColor = id === planId ? 'var(--green)' : '';
    card.style.boxShadow   = id === planId ? '0 0 30px rgba(0,232,150,0.15)' : '';
  });
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

// ──────────────────────────────────────
// SCROLL REVEAL ANIMATION
// ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Add reveal class to section cards and steps
  document.querySelectorAll('.card, .step-card, .pricing-card').forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
