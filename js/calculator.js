/* ==========================================================================
   AeaJay Energia - solar savings estimator

   IMPORTANT
   Every number used by this calculator lives in the CONFIG block below.
   When Alan provides his real pricing and generation figures, edit CONFIG
   only. Do not change the functions underneath.

   The output is a rough guide, not a quote. It is meant to get someone
   interested enough to book a site visit.
   ========================================================================== */

var CONFIG = {

  /* Average effective tariff in rupees per unit (kWh).
     KSEB residential slabs are progressive, so a household on a high bill
     pays a higher average rate than one on a low bill. These are rough
     blended rates by segment. Replace with Alan's figures when available. */
  tariff: {
    residential: 7.0,
    commercial: 8.5,
    industrial: 7.5
  },

  /* Units generated per kW of installed capacity per day, averaged across
     the year for Kerala. Accounts for monsoon months pulling the average
     down. Commonly quoted between 3.5 and 4.5. */
  unitsPerKwPerDay: 4.0,

  /* Installed cost in rupees per kW before subsidy. Typically falls as
     system size increases. */
  costPerKw: {
    residential: 60000,
    commercial: 52000,
    industrial: 45000
  },

  /* PM Surya Ghar central subsidy, residential only.
     2024 structure: Rs 30,000 per kW for the first 2 kW, Rs 18,000 for the
     third kW, capped at Rs 78,000 total. Verify current rates before quoting. */
  subsidy: {
    enabled: true,
    firstTwoKwPerKw: 30000,
    thirdKwPerKw: 18000,
    cap: 78000
  },

  /* Share of the current bill a correctly sized system is expected to
     offset. Not 100 percent because of fixed charges, night usage and
     seasonal variation. */
  offsetRatio: {
    residential: 0.90,
    commercial: 0.75,
    industrial: 0.70
  },

  /* System sizing bounds in kW */
  minSize: 1,
  maxSize: 500,

  /* Days per month used in the unit conversion */
  daysPerMonth: 30
};

/* --------------------------------------------------------------------------
   Formatting helpers
   -------------------------------------------------------------------------- */

/* Indian digit grouping: 1,02,000 rather than 102,000 */
function formatRupees(value) {
  var n = Math.round(value);
  return 'Rs ' + n.toLocaleString('en-IN');
}

function formatSize(kw) {
  var rounded = Math.round(kw * 2) / 2;
  if (rounded < CONFIG.minSize) rounded = CONFIG.minSize;
  var text = rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
  return text + ' kW';
}

function formatPayback(years) {
  if (!isFinite(years) || years <= 0) return 'Not available';
  if (years < 1) {
    var months = Math.round(years * 12);
    return months + (months === 1 ? ' month' : ' months');
  }
  return years.toFixed(1) + ' years';
}

/* --------------------------------------------------------------------------
   Core estimate
   -------------------------------------------------------------------------- */

function estimate(bill, type) {
  if (!CONFIG.tariff[type]) type = 'residential';

  var tariff = CONFIG.tariff[type];
  var costPerKw = CONFIG.costPerKw[type];
  var offset = CONFIG.offsetRatio[type];

  /* Monthly units consumed */
  var monthlyUnits = bill / tariff;

  /* Units the system needs to generate each day to cover that consumption */
  var dailyUnitsNeeded = monthlyUnits / CONFIG.daysPerMonth;

  /* Required capacity */
  var rawSize = dailyUnitsNeeded / CONFIG.unitsPerKwPerDay;
  var size = Math.round(rawSize * 2) / 2;
  if (size < CONFIG.minSize) size = CONFIG.minSize;
  if (size > CONFIG.maxSize) size = CONFIG.maxSize;

  /* Gross cost */
  var grossCost = size * costPerKw;

  /* Subsidy, residential only */
  var subsidy = 0;
  if (CONFIG.subsidy.enabled && type === 'residential') {
    var s = CONFIG.subsidy;
    if (size <= 2) {
      subsidy = size * s.firstTwoKwPerKw;
    } else if (size < 3) {
      subsidy = (2 * s.firstTwoKwPerKw) + ((size - 2) * s.thirdKwPerKw);
    } else {
      subsidy = (2 * s.firstTwoKwPerKw) + s.thirdKwPerKw;
    }
    if (subsidy > s.cap) subsidy = s.cap;
  }

  var netCost = grossCost - subsidy;
  if (netCost < 0) netCost = 0;

  /* Monthly saving */
  var monthlySaving = bill * offset;
  var annualSaving = monthlySaving * 12;

  /* Payback */
  var payback = annualSaving > 0 ? netCost / annualSaving : Infinity;

  return {
    size: size,
    grossCost: grossCost,
    subsidy: subsidy,
    netCost: netCost,
    monthlySaving: monthlySaving,
    annualSaving: annualSaving,
    payback: payback,
    hasSubsidy: subsidy > 0
  };
}

/* --------------------------------------------------------------------------
   Wire up the UI
   -------------------------------------------------------------------------- */

(function () {
  var billInput = document.getElementById('bill-input');
  var billSlider = document.getElementById('bill-slider');
  var note = document.getElementById('calc-note');

  var outSize = document.getElementById('out-size');
  var outSaving = document.getElementById('out-saving');
  var outCost = document.getElementById('out-cost');
  var outPayback = document.getElementById('out-payback');

  if (!billInput || !billSlider || !outSize) return;

  var typeInputs = document.querySelectorAll('input[name="ptype"]');

  var BASE_NOTE = 'Estimates only. Actual figures depend on your roof, shading, consumption pattern and current subsidy rates.';

  function currentType() {
    for (var i = 0; i < typeInputs.length; i++) {
      if (typeInputs[i].checked) return typeInputs[i].value;
    }
    return 'residential';
  }

  function clampBill(value) {
    var n = parseFloat(value);
    if (isNaN(n) || n < 0) n = 0;
    var min = parseFloat(billInput.min) || 500;
    var max = parseFloat(billInput.max) || 500000;
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
  }

  /* Fills the slider track up to the thumb. Purely cosmetic. */
  function paintSlider() {
    var min = parseFloat(billSlider.min);
    var max = parseFloat(billSlider.max);
    var val = parseFloat(billSlider.value);
    var pct = ((val - min) / (max - min)) * 100;
    billSlider.style.setProperty('--fill', pct + '%');
  }

  function render() {
    var bill = clampBill(billInput.value);
    var type = currentType();
    var r = estimate(bill, type);

    outSize.textContent = formatSize(r.size);
    outSaving.textContent = formatRupees(r.monthlySaving);
    outCost.textContent = formatRupees(r.netCost);
    outPayback.textContent = formatPayback(r.payback);

    if (r.hasSubsidy) {
      outCost.classList.add('is-gold');
      note.textContent = 'Includes an estimated PM Surya Ghar subsidy of ' + formatRupees(r.subsidy) + '. ' + BASE_NOTE;
    } else {
      outCost.classList.remove('is-gold');
      note.textContent = type === 'residential'
        ? BASE_NOTE
        : 'Central residential subsidy does not apply to this category. ' + BASE_NOTE;
    }

    paintSlider();
  }

  /* Keep the number input and the slider in step */
  billInput.addEventListener('input', function () {
    var v = parseFloat(billInput.value);
    if (!isNaN(v)) {
      var sMin = parseFloat(billSlider.min);
      var sMax = parseFloat(billSlider.max);
      billSlider.value = Math.min(Math.max(v, sMin), sMax);
    }
    render();
  });

  billInput.addEventListener('blur', function () {
    billInput.value = clampBill(billInput.value);
    render();
  });

  billSlider.addEventListener('input', function () {
    billInput.value = billSlider.value;
    render();
  });

  for (var i = 0; i < typeInputs.length; i++) {
    typeInputs[i].addEventListener('change', render);
  }

  render();
})();
