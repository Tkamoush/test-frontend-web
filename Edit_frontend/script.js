/* ===========================================================
   script.js — Full rewrite (modular, defensive, translation-aware)
   - Language switching (applyLanguage emits 'languageChanged')
   - Theme switching
   - Temp nav links from side menu (no duplicates)
   - Active link highlighting (green + underline via .active-green)
   - Upload page logic (csv/images) + ensure upload buttons green in dark
   - Chat module (UI only, placeholder backend)
   - Prediction/history rendering with translations
   - Safe Chart initializers
   =========================================================== */

/* -------------------- TRANSLATIONS -------------------- */
const translations = {
  en: {
    home: "Home", dataset: "Dataset", analysis: "Analysis", prediction: "Prediction", about: "About",
    about_title: "Ecosense – Plant Health Classification",
    about_desc: "Project to monitor soil & plant conditions and predict health using ML (KNN, MLP).",
    team: "Team", team_1: "Amr Khalid — AI Engineer", team_2: "Mohamed Gamal — AI Engineer",
    team_3: "Tyam Mohamed — Frontend Developer", team_4: "Ahmed Khalil — UI/UX Designer",
    team_5: "Wahba Ahmed — Flutter Developer", team_6: "Mahmoud Mansour — Backend Developer",
    objectives: "Objectives", obj_1: "Collect sensor data (soil moisture, temp, humidity, NPK, chlorophyll).",
    obj_2: "Train ML models for Healthy / Moderate Stress / High Stress.", obj_3: "Provide analytics for farmers & researchers.",
    supervisor: "Supervisor", supervisor_name: "Supervisor Name",
    "Input sensors": "Input sensors", "Soil Moisture (%)": "Soil Moisture (%)",
    "Ambient Temp (°C)": "Ambient Temp (°C)", "Soil Temp (°C)": "Soil Temp (°C)",
    "Humidity (%)": "Humidity (%)", "Nitrogen (N)": "Nitrogen (N)", "Phosphorus (P)": "Phosphorus (P)",
    "Potassium (K)": "Potassium (K)", "Chlorophyll": "Chlorophyll",
    "Predict Now": "Predict Now", "Retry": "Retry", "Last Predictions": "Last Predictions",
    "Prediction complete ✓": "Prediction complete ✓", "Batch Predict (CSV)": "Batch Predict (CSV)",
    "Upload CSV": "Upload CSV", "Predict CSV": "Predict CSV", "Download Results": "Download Results",
    "No file": "No file", "Rows:": "Rows:", "Cols:": "Cols:",
    "Plant in good condition": "Plant in good condition", "Healthy": "Healthy",
    "Plant looks good": "Plant looks good", "Confidence:": "Confidence:", "Status:": "Status:",
    "Total Plants": "Total Plants",
    "healthy_plants": "Healthy Plants", "under_stress": "Under Stress", "diseased_plants": "Diseased Plants",
    "Visualization Area (placeholder)": "Visualization Area (placeholder)",
    "Insights": "Insights", "Analyze New Data": "Analyze New Data",
    "View": "View", "Filter": "Filter", "All": "All",
    "Under Stress": "Under Stress", "Diseased": "Diseased",
    "Date": "Date", "Confidence": "Confidence", "Moisture": "Moisture", "Temp": "Temp",
    "Upload Dataset": "Upload Dataset", "No image": "No image", "Send": "Send"
  },
  ar: {
    home: "الرئيسية", dataset: "البيانات", analysis: "التحليل", prediction: "التنبؤ", about: "حول",
    about_title: "Ecosense – تصنيف صحة النبات",
    about_desc: "مشروع لمراقبة حالة التربة والنبات والتنبؤ بحالته باستخدام خوارزميات تعلم الآلة (KNN, MLP).",
    team: "الفريق", team_1: "عمرو خالد — مهندس ذكاء اصطناعي", team_2: "محمد جمال — مهندس ذكاء اصطناعي",
    team_3: "تيام محمد — مطور واجهات أمامية", team_4: "أحمد خليل — مصمم UI/UX",
    team_5: "وهبة أحمد — مطور Flutter", team_6: "محمود منصور — مطور واجهات خلفية",
    objectives: "الأهداف", obj_1: "جمع بيانات الحساسات (رطوبة التربة، الحرارة، الرطوبة، NPK، الكلوروفيل).",
    obj_2: "تدريب نماذج تعلم آلة للحالات: سليم / إجهاد متوسط / إجهاد عالي.", obj_3: "توفير تحليلات للمزارعين والباحثين.",
    supervisor: "المشرف", supervisor_name: "اسم المشرف",
    "Input sensors": "قيم الحساسات", "Soil Moisture (%)": "رطوبة التربة (%)",
    "Ambient Temp (°C)": "درجة الحرارة المحيطة (°C)", "Soil Temp (°C)": "درجة حرارة التربة (°C)",
    "Humidity (%)": "الرطوبة (%)", "Nitrogen (N)": "النيتروجين (N)", "Phosphorus (P)": "الفوسفور (P)",
    "Potassium (K)": "البوتاسيوم (K)", "Chlorophyll": "الكلوروفيل",
    "Predict Now": "تنبؤ الآن", "Retry": "إعادة المحاولة", "Last Predictions": "آخر التنبؤات",
    "Prediction complete ✓": "اكتمل التنبؤ ✓", "Batch Predict (CSV)": "تنبؤ من ملف CSV",
    "Upload CSV": "رفع CSV", "Predict CSV": "تنبؤ CSV", "Download Results": "تحميل النتائج",
    "No file": "لا يوجد ملف", "Rows:": "الصفوف:", "Cols:": "الأعمدة:",
    "Plant in good condition": "النبات بحالة جيدة", "Healthy": "سليم",
    "Plant looks good": "النبات يبدو جيدًا", "Confidence:": "نسبة الثقة:", "Status:": "الحالة:",
    "Total Plants": "إجمالي النباتات",
    "healthy_plants": "النباتات السليمة", "under_stress": "تحت الضغط", "diseased_plants": "النباتات المريضة",
    "Visualization Area (placeholder)": "منطقة العرض (نموذج)",
    "Insights": "ملاحظات", "Analyze New Data": "تحليل بيانات جديدة",
    "View": "عرض", "Filter": "تصفية", "All": "الكل",
    "Under Stress": "تحت الضغط", "Diseased": "مريض",
    "Date": "التاريخ", "Confidence": "الثقة", "Moisture": "الرطوبة", "Temp": "درجة الحرارة",
    "Upload Dataset": "رفع البيانات", "No image": "لا توجد صورة", "Send": "إرسال"
  }
};

/* -------------------- HELPERS -------------------- */
function safeQ(selector, parent=document){ try { return parent.querySelector(selector); } catch(e) { return null; } }
function safeQAll(selector, parent=document){ try { return Array.from(parent.querySelectorAll(selector)); } catch(e) { return []; } }
function isEl(o){ return o && o.nodeType === 1; }
function on(el, ev, fn){ if(!el) return; el.addEventListener(ev, fn); }
function setText(el, txt){ if(!el) return; el.textContent = txt; }

/* -------------------- LANGUAGE -------------------- */
function applyLanguage(lang){
  try{
    const htmlEl = document.getElementById("htmlElement");
    if(htmlEl) htmlEl.lang = lang;
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

    // data-key -> translations map
    safeQAll("[data-key]").forEach(el=>{
      const key = el.getAttribute("data-key");
      if(key && translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
    });

    // data-en / data-ar attributes
    safeQAll("[data-en][data-ar]").forEach(el=>{
      const text = (lang === "ar") ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if(text !== null){
        if(el.tagName.toLowerCase()==="input" || el.tagName.toLowerCase()==="textarea") el.placeholder = text;
        else el.textContent = text;
      }
    });

    // placeholders attributes (explicit)
    safeQAll("[data-en-placeholder][data-ar-placeholder]").forEach(inp=>{
      const ph = (lang === "ar") ? inp.getAttribute("data-ar-placeholder") : inp.getAttribute("data-en-placeholder");
      if(ph !== null) inp.placeholder = ph;
    });

    // some static ids for CSV area
    const csvStatus = document.getElementById("csvStatusText");
    if(csvStatus) csvStatus.textContent = translations[lang]["No file"] || (lang==="ar" ? "لا يوجد ملف" : "No file");

    const csvRows = document.getElementById("csvRows");
    if(csvRows) csvRows.textContent = (translations[lang]["Rows:"] || "Rows:") + " -";

    const csvCols = document.getElementById("csvCols");
    if(csvCols) csvCols.textContent = (translations[lang]["Cols:"] || "Cols:") + " -";

    // update lang button icon (if exists)
    const langBtn = document.getElementById("langBtn");
    if(langBtn){
      langBtn.innerHTML = (lang === "ar") ? '<i class="fa-solid fa-globe-asia"></i>' : '<i class="fa-solid fa-globe"></i>';
    }

    // update suggestions / any other page-specific UI that needs translations via an event
    localStorage.setItem("siteLang", lang);

    // emit a custom event so other modules can react (e.g., temp nav link translation)
    const ev = new CustomEvent("languageChanged", { detail: { lang } });
    document.dispatchEvent(ev);

  }catch(e){
    console.error("applyLanguage:", e);
  }
}

/* -------------------- THEME -------------------- */
function setTheme(theme){
  try{
    if(theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    const themeBtn = document.getElementById("themeBtn");
    if(themeBtn){
      themeBtn.innerHTML = document.documentElement.classList.contains("dark") ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    }
    localStorage.setItem("siteTheme", theme);

    // run dark-mode style fixers
    ensureUploadButtonsGreenOnDark();
  }catch(e){ console.error(e); }
}

/* -------------------- UTILS: numeric parse -------------------- */
function toNum(v){
  if(v === null || v === undefined) return NaN;
  const n = parseFloat(String(v).replace(/[^\d\.\-]/g,''));
  return isNaN(n) ? NaN : n;
}

/* -------------------- SIMPLE HEURISTIC EVALUATOR -------------------- */
function evaluatePlant(values){
  const sm = toNum(values.Soil_Moisture);
  const hum = toNum(values.Humidity);
  const chl = toNum(values.Chlorophyll_Content);
  const N = toNum(values.Nitrogen_Level);
  const P = toNum(values.Phosphorus_Level);
  const K = toNum(values.Potassium_Level);

  let score = 50;
  if(!isNaN(sm)){
    if(sm >= 40 && sm <= 70) score += 15;
    else if((sm >= 30 && sm < 40) || (sm > 70 && sm <= 80)) score += 6;
    else score -= 10;
  }
  if(!isNaN(chl)){
    if(chl >= 40) score += 18;
    else if(chl >= 25) score += 6;
    else score -= 12;
  }
  if(!isNaN(hum)){
    if(hum >= 40 && hum <= 75) score += 8;
    else score -= 6;
  }
  if(!isNaN(N) && N > 5) score += 4;
  if(!isNaN(P) && P > 3) score += 3;
  if(!isNaN(K) && K > 10) score += 3;

  score = Math.max(2, Math.min(98, score));
  let label = "Under Stress";
  if(score >= 72) label = "Healthy";
  else if(score <= 40) label = "Diseased";
  return { label, conf: Math.round(score) };
}

/* -------------------- UPDATE RESULT UI -------------------- */
function updateResultUI(statusObj, lang){
  const labelKey = statusObj.label;
  const conf = statusObj.conf || 0;
  const statusLabelEl = document.getElementById("statusLabel");
  const statusTextEl = document.getElementById("statusText");
  const statusDot = document.getElementById("statusDot");
  const statusTag = document.getElementById("statusTag");
  const resultDesc = document.getElementById("resultDesc");
  const resultConf = document.getElementById("resultConf");

  let color = "#36a542";
  let tagText = translations[lang]["Plant in good condition"] || "Plant in good condition";
  let shortLabel = translations[lang][labelKey] || labelKey;
  let desc = translations[lang]["Plant looks good"] || "Plant looks good";

  if(labelKey === "Healthy"){ color="#36a542"; tagText = (lang==="ar")? "النبات بحالة جيدة": "Plant in good condition"; desc = (lang==="ar")? "النبات يبدو جيدًا":"Plant looks good"; }
  else if(labelKey === "Under Stress"){ color="#f4b400"; tagText = (lang==="ar")? "النبات تحت ضغط":"Plant under stress"; desc = (lang==="ar")? "النبات يحتاج رعاية":"Plant needs attention"; }
  else if(labelKey === "Diseased"){ color="#d32f2f"; tagText = (lang==="ar")? "النبات مريض":"Plant diseased"; desc = (lang==="ar")? "النبات يحتاج علاج فوري":"Plant needs immediate care"; }

  // apply to UI if present
  const stem = document.getElementById("stem"), bud = document.getElementById("bud"),
        leafL = document.getElementById("leafL"), leafR = document.getElementById("leafR"),
        pot = document.getElementById("pot");

  if(stem) stem.setAttribute("fill", color);
  if(bud) bud.setAttribute("fill", color);
  if(leafL) leafL.setAttribute("stroke", color);
  if(leafR) leafR.setAttribute("stroke", color);
  if(pot) pot.setAttribute("fill", "#8B5E3C");

  if(statusLabelEl) statusLabelEl.textContent = shortLabel;
  if(statusTextEl) statusTextEl.textContent = tagText;
  if(statusDot) statusDot.style.background = color;
  if(resultDesc) resultDesc.textContent = desc;
  if(resultConf) resultConf.textContent = (lang==="ar" ? "نسبة الثقة: " : "Confidence: ") + conf + "%";
  if(statusTag){ statusTag.style.background = color; statusTag.style.color = "#fff"; }
}

/* -------------------- READ VALUES FOR EVAL -------------------- */
function readValuesForEval(){
  const sm = document.getElementById("i_soil");
  const amb = document.getElementById("i_ambient");
  const sTemp = document.getElementById("i_soiltemp");
  const hum = document.getElementById("i_humidity");
  const nit = document.getElementById("i_nitrogen");
  const phos = document.getElementById("i_phosphorus");
  const pot = document.getElementById("i_potassium");
  const chl = document.getElementById("i_chlorophyll");
  if(!sm && !amb && !sTemp && !hum && !nit && !phos && !pot && !chl) return null;
  return {
    Soil_Moisture: sm ? sm.value : undefined,
    Ambient_Temperature: amb ? amb.value : undefined,
    Soil_Temperature: sTemp ? sTemp.value : undefined,
    Humidity: hum ? hum.value : undefined,
    Nitrogen_Level: nit ? nit.value : undefined,
    Phosphorus_Level: phos ? phos.value : undefined,
    Potassium_Level: pot ? pot.value : undefined,
    Chlorophyll_Content: chl ? chl.value : undefined
  };
}

/* -------------------- SAFE CHART INITS -------------------- */
function initPlantChartIfAny(){
  const ctxEl = document.getElementById("plantChart");
  if(!ctxEl) return;
  if(typeof Chart === "undefined") return;
  if(window._plantChart) window._plantChart.destroy();
  window._plantChart = new Chart(ctxEl.getContext("2d"), {
    type: "pie",
    data: { labels: ["Healthy","Under Stress","Diseased"], datasets:[{ data:[68,22,10], backgroundColor:["#4CAF50","#F4B400","#D32F2F"] }]},
    options:{ responsive:true, plugins:{ legend:{ position:"right" } } }
  });
}

(function initSensorOutputChart(){
  const canvas = document.getElementById("sensorOutputChart");
  if(!canvas) return;
  if(typeof Chart === "undefined") return;
  try{
    if(window._sensorOutput) window._sensorOutput.destroy();
    window._sensorOutput = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
        datasets:[{
          label: "Sensor Output",
          data: [41,43,40,45,42,47,44],
          borderColor:"#36a542",
          backgroundColor:"rgba(54,165,66,0.12)",
          tension:0.25, pointRadius:3
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:false } } }
    });
  }catch(e){ console.warn("sensor chart init failed", e); }
})();

/* -------------------- DOMContentLoaded MAIN -------------------- */
document.addEventListener("DOMContentLoaded", ()=>{

  // restore settings
  const savedLang = localStorage.getItem("siteLang") || "en";
  applyLanguage(savedLang);
  const savedTheme = localStorage.getItem("siteTheme") || "light";
  setTheme(savedTheme);

  initPlantChartIfAny();

  // show menu/lang/theme buttons (defensive)
  const mb = document.getElementById("menuBtn"); if(mb) { mb.style.visibility="visible"; mb.style.opacity=1; }
  const langBtn = document.getElementById("langBtn");
  if(langBtn){
    on(langBtn,"click", ()=>{
      const cur = localStorage.getItem("siteLang") || "en";
      const next = (cur === "en") ? "ar" : "en";
      applyLanguage(next);
      // re-evaluate dynamic UIs
      const lv = readValuesForEval();
      if(lv){ const st = evaluatePlant(lv); updateResultUI(st, next); }
      // refresh history table if exists
      if(typeof window.refreshHistoryTable === "function") window.refreshHistoryTable(next);
      // update temp nav translation
      updateTempPageTranslation();
    });
    langBtn.style.visibility = "visible";
  }

  const themeBtn = document.getElementById("themeBtn");
  if(themeBtn){
    on(themeBtn,"click", ()=>{
      const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      setTheme(currentTheme === "dark" ? "light" : "dark");
    });
    themeBtn.style.visibility = "visible";
  }

  // side menu open/close
  const sideMenu = document.getElementById("sideMenu");
  const closeMenuEl = document.getElementById("closeMenu");
  const overlay = document.getElementById("menuOverlay");
  function openMenu(){ if(sideMenu) sideMenu.classList.add("open"); if(overlay) overlay.classList.add("show"); }
  function closeMenu(){ if(sideMenu) sideMenu.classList.remove("open"); if(overlay) overlay.classList.remove("show"); }
  if(document.getElementById("menuBtn")) on(document.getElementById("menuBtn"), "click", openMenu);
  if(closeMenuEl) on(closeMenuEl, "click", closeMenu);
  if(overlay) on(overlay, "click", closeMenu);

  // attach menu items → create temp nav link when clicked (prevents duplicate)
  (function attachMenuToNav(){
    const navLinks = document.getElementById("navLinks");
    const menuItems = safeQAll(".menu-item");
    if(!navLinks || !menuItems.length) return;
    menuItems.forEach(item=>{
      on(item, "click", ()=>{
        const page = item.getAttribute("data-page");
        if(!page) return;
        // remove old temp
        const old = navLinks.querySelector(".temp-page");
        if(old) old.remove();

        // don't create temp if nav already contains link to page (non-temp)
        const exists = navLinks.querySelector(`a[href="${page}"]`);
        if(exists && !exists.classList.contains("temp-page")) {
          // still navigate
          closeMenu();
          window.location.href = page;
          return;
        }

        // create link
        const newLink = document.createElement("a");
        newLink.classList.add("temp-page");
        newLink.href = page;
        const nameEn = item.getAttribute("data-en") || item.textContent.trim();
        const nameAr = item.getAttribute("data-ar") || nameEn;
        const lang = document.documentElement.lang === "ar" ? "ar" : "en";
        newLink.setAttribute("data-en", nameEn);
        newLink.setAttribute("data-ar", nameAr);
        newLink.textContent = (lang === "ar") ? nameAr : nameEn;

        // insert after home
        const home = navLinks.querySelector('a[href="index.html"]');
        if(home) home.insertAdjacentElement("afterend", newLink);
        else navLinks.appendChild(newLink);

        // ensure visible
        newLink.style.display = "inline-flex"; newLink.style.visibility = "visible";

        // close menu and navigate
        closeMenu();
        window.location.href = page;
      });
    });
  })();

  // ensure nav is visible
  const navLinksEl = document.getElementById("navLinks");
  if(navLinksEl) navLinksEl.style.visibility = "visible";

  // init small UI pieces: pills, CSV handlers, predict handlers, dashboard, history
  initAnalysisPills();
  attachCsvAndUploadLogic();
  attachPredictHandlers();
  initDashboardSafe();
  initPredictionResultUI();

  // refresh active nav highlight
  setTimeout(()=> setActiveNavHighlight(), 120);
}); // DOMContentLoaded end

/* -------------------- ACTIVE NAV HIGHLIGHT (GREEN + underline) -------------------- */
function setActiveNavHighlight(){
  try{
    const current = window.location.pathname.split("/").pop() || "index.html";
    safeQAll("#navLinks a").forEach(a=>{
      if(a.getAttribute("href") === current) a.classList.add("active-green");
      else a.classList.remove("active-green");
    });
  }catch(e){}
}

/* -------------------- UPDATE TEMP NAV TRANSLATION -------------------- */
function updateTempPageTranslation(){
  const temp = document.querySelector(".temp-page");
  if(!temp) return;
  const currentPage = temp.getAttribute("href");
  const menuItem = document.querySelector(`.menu-item[data-page="${currentPage}"]`);
  if(!menuItem) return;
  const nameEn = menuItem.getAttribute("data-en");
  const nameAr = menuItem.getAttribute("data-ar");
  const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
  temp.textContent = (lang === "ar") ? nameAr : nameEn;
}

/* -------------------- ANALYSIS pills placeholder behavior -------------------- */
function initAnalysisPills(){
  const chartButtons = safeQAll(".pill");
  const vizNote = document.querySelector(".viz-note");
  if(!chartButtons.length) return;
  chartButtons.forEach(btn=>{
    on(btn, "click", ()=>{
      chartButtons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const type = btn.dataset.chart;
      const lang = localStorage.getItem("siteLang") || "en";
      if(!vizNote) return;
      if(type === "hist") vizNote.textContent = (lang === "ar") ? "عرض الهستوجرام (نموذج)" : "Histogram view selected (placeholder)";
      else if(type === "heat") vizNote.textContent = (lang === "ar") ? "عرض خريطة الارتباط (نموذج)" : "Heatmap view selected (placeholder)";
      else if(type === "box") vizNote.textContent = (lang === "ar") ? "عرض صندوق القيم (نموذج)" : "Boxplot view selected (placeholder)";
    });
  });
}

/* -------------------- CSV / UPLOAD PAGE LOGIC -------------------- */
function attachCsvAndUploadLogic(){
  // if neither upload dropzones exist -> exit early
  const csvDrop = document.getElementById("csvDrop");
  const imgDrop = document.getElementById("imgDrop");
  if(!csvDrop && !imgDrop) return;

  // CSV input
  const csvInput = document.createElement("input"); csvInput.type="file"; csvInput.accept=".csv,text/csv"; csvInput.style.display="none"; document.body.appendChild(csvInput);
  const browseCsvBtn = document.getElementById("browseCsvBtn");
  const csvPreviewHead = document.getElementById("csvPreviewHead");
  const csvPreviewBody = document.querySelector("#csvPreviewTable tbody");
  const csvStatusText = document.getElementById("csvStatusText");
  const csvRowsEl = document.getElementById("csvRows");
  const csvColsEl = document.getElementById("csvCols");

  function parseCSV(text){
    return text.split(/\r?\n/).filter(r=>r.trim()!=="").map(r=>r.split(",").map(c=>c.replace(/^["']|["']$/g,'').trim()));
  }
  function renderCSVPreview(rows){
    if(!csvPreviewHead || !csvPreviewBody) return;
    csvPreviewHead.innerHTML = ""; csvPreviewBody.innerHTML = "";
    if(!rows || rows.length===0) return;
    const header = rows[0];
    header.forEach(h=>{ const th = document.createElement("th"); th.textContent = h; csvPreviewHead.appendChild(th); });
    const max = Math.min(3, rows.length-1);
    for(let i=1;i<=max;i++){
      const tr = document.createElement("tr");
      rows[i].forEach(cell=>{ const td = document.createElement("td"); td.textContent = cell; tr.appendChild(td); });
      csvPreviewBody.appendChild(tr);
    }
  }

  csvInput.addEventListener("change", (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = ev=>{
      const rows = parseCSV(ev.target.result);
      window.__uploadedCSV = rows;
      renderCSVPreview(rows);
      if(csvStatusText) csvStatusText.textContent = f.name;
      if(csvRowsEl) csvRowsEl.textContent = Math.max(0, rows.length-1);
      if(csvColsEl) csvColsEl.textContent = (rows[0] ? rows[0].length : '-');
    };
    reader.readAsText(f);
  });
  if(browseCsvBtn) on(browseCsvBtn, "click", ()=> csvInput.click());

  // CSV drag/drop
  ["dragenter","dragover"].forEach(ev=>{ if(csvDrop) csvDrop.addEventListener(ev, prevent); });
  ["dragleave","drop"].forEach(ev=>{ if(csvDrop) csvDrop.addEventListener(ev, (e)=>{ prevent(e); csvDrop.classList.remove("dragover"); }); });
  if(csvDrop) {
    csvDrop.addEventListener("drop", (e)=>{
      prevent(e);
      const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if(!f) return;
      csvInput.files = e.dataTransfer.files;
      const reader = new FileReader();
      reader.onload = ev=>{
        const rows = parseCSV(ev.target.result);
        window.__uploadedCSV = rows;
        renderCSVPreview(rows);
        if(csvStatusText) csvStatusText.textContent = f.name;
        if(csvRowsEl) csvRowsEl.textContent = Math.max(0, rows.length-1);
        if(csvColsEl) csvColsEl.textContent = (rows[0] ? rows[0].length : '-');
      };
      reader.readAsText(f);
    });
  }

  // Image input & thumbs
  const imgInput = document.createElement("input"); imgInput.type="file"; imgInput.accept="image/*"; imgInput.multiple=true; imgInput.style.display="none"; document.body.appendChild(imgInput);
  const browseImgBtn = document.getElementById("browseImgBtn");
  const thumbs = document.getElementById("thumbs");
  let imagesList = [];
  function renderThumbs(){
    if(!thumbs) return;
    thumbs.innerHTML = "";
    imagesList.forEach((it, idx)=>{
      const div = document.createElement("div"); div.className="thumb";
      const img = document.createElement("img"); img.src = it.url; img.alt = it.name;
      const rem = document.createElement("div"); rem.className="remove"; rem.innerHTML="&times;"; rem.title="Remove";
      rem.addEventListener("click", ()=>{ imagesList.splice(idx,1); renderThumbs(); });
      div.appendChild(img); div.appendChild(rem); thumbs.appendChild(div);
    });
  }
  if(browseImgBtn) on(browseImgBtn, "click", ()=> imgInput.click());
  imgInput.addEventListener("change", (e)=>{
    const files = Array.from(e.target.files).slice(0,10);
    files.forEach(f=>{
      const reader = new FileReader();
      reader.onload = ev=>{
        imagesList.push({ name: f.name, url: ev.target.result });
        renderThumbs();
      };
      reader.readAsDataURL(f);
    });
  });
  // image drop
  ["dragenter","dragover"].forEach(ev=>{ if(imgDrop) imgDrop.addEventListener(ev, (e)=>{ prevent(e); imgDrop.classList.add("dragover"); }); });
  ["dragleave","drop"].forEach(ev=>{ if(imgDrop) imgDrop.addEventListener(ev, (e)=>{ prevent(e); imgDrop.classList.remove("dragover"); }); });
  if(imgDrop) {
    imgDrop.addEventListener("drop", (e)=>{
      prevent(e);
      const files = Array.from(e.dataTransfer.files).filter(f=>/^image\//.test(f.type)).slice(0,10);
      files.forEach(f=>{
        const reader = new FileReader();
        reader.onload = ev=>{
          imagesList.push({ name: f.name, url: ev.target.result });
          renderThumbs();
        };
        reader.readAsDataURL(f);
      });
    });
  }

  // ensure upload buttons green in dark mode
  ensureUploadButtonsGreenOnDark();

  // expose small prevent function used above
  function prevent(e){ e.preventDefault(); e.stopPropagation(); }
}

/* -------------------- ENSURE UPLOAD BUTTONS GREEN ON DARK -------------------- */
function ensureUploadButtonsGreenOnDark(){
  const els = document.querySelectorAll(".btn.small.upload-btn, .btn.primary, .btn.primary.outline");
  els.forEach(el=>{
    if(document.documentElement.classList.contains("dark")){
      el.style.background = "#36a542";
      el.style.color = "#fff";
      // if outlined, keep border
      if(el.classList.contains("outline")) { el.style.background = "transparent"; el.style.borderColor = "#36a542"; el.style.color = "#36a542"; }
    } else {
      el.style.background = ""; el.style.color = ""; el.style.borderColor = "";
    }
  });
}

/* -------------------- PREDICT HANDLERS -------------------- */
function attachPredictHandlers(){
  const predictCsvBtn = document.getElementById("predictCsvBtn");
  const predictImgsBtn = document.getElementById("predictImgsBtn");
  if(predictCsvBtn){
    on(predictCsvBtn, "click", ()=>{
      const rows = window.__uploadedCSV;
      const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
      if(!rows || rows.length <= 1){ alert((lang==="ar") ? "لا يوجد ملف CSV صالح للمعاينة" : "No CSV file loaded"); return; }
      // simple simulated flow
      const original = (lang === "ar") ? "تم التنبؤ" : "Predicted";
      predictCsvBtn.textContent = original;
      setTimeout(()=>{ predictCsvBtn.textContent = (lang === "ar") ? "تنبؤ من CSV" : "Predict CSV"; }, 2200);
      document.querySelector(".csv-preview-card")?.scrollIntoView({ behavior: "smooth" });
    });
  }
  if(predictImgsBtn){
    on(predictImgsBtn, "click", ()=>{
      const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
      const thumbs = document.getElementById("thumbs");
      const present = thumbs && thumbs.children && thumbs.children.length > 0;
      if(!present){ alert((lang==="ar") ? "لا توجد صور مرفوعة" : "No images uploaded"); return; }
      predictImgsBtn.textContent = (lang === "ar") ? "تم التنبؤ" : "Predicted";
      setTimeout(()=>{ predictImgsBtn.textContent = (lang === "ar") ? "تنبؤ من الصور" : "Predict Images"; }, 2200);
    });
  }
}




/* -------------------- INIT PREDICTION RESULT UI DEFAULT -------------------- */
function initPredictionResultUI(){
  const langNow = localStorage.getItem("siteLang") || "en";
  const initVals = readValuesForEval();
  if(initVals){ const st = evaluatePlant(initVals); updateResultUI(st, langNow); }
  else updateResultUI({ label: "Healthy", conf: 92 }, langNow);
}

/* -------------------- DASHBOARD SAFE INIT -------------------- */
function initDashboardSafe(){
  const trendCanvas = document.getElementById("trendChart");
  const sensorCanvas = document.getElementById("sensorChart");
  const tableBody = document.querySelector("#recentTable tbody");
  if(!trendCanvas || !sensorCanvas || !tableBody) return;

  // mock data
  const mockData = {
    plants_monitored: 240, sensors_online: 18, ai_accuracy: 93, alerts_today: 5,
    healthTrend: {
      labels: Array.from({length:30},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(29-i)); return d.toISOString().slice(0,10);} ),
      healthy: Array.from({length:30}, ()=>60+Math.round(Math.random()*15)),
      stress: Array.from({length:30}, ()=>20+Math.round(Math.random()*10)),
      diseased: Array.from({length:30}, ()=>5+Math.round(Math.random()*4))
    },
    sensorPerformance: { labels:["Soil Moisture","Air Temp","Soil Temp","Humidity"], values:[78,65,55,72] },
    recentPredictions:[
      { date:"2025-11-23", status:"Healthy", conf:92, moisture:"41%", temp:"24°C" },
      { date:"2025-11-22", status:"Under Stress", conf:80, moisture:"35%", temp:"27°C" },
      { date:"2025-11-21", status:"Diseased", conf:60, moisture:"18%", temp:"30°C" }
    ]
  };

  // set stats if exist
  ["plantsMon","sensorsOnline","aiAccuracy","alertsToday"].forEach(id=>{
    const el = document.getElementById(id);
    if(el){
      if(id === "aiAccuracy") el.textContent = mockData.ai_accuracy + "%";
      else el.textContent = mockData[id.replace(/([A-Z])/g,'_$1').toLowerCase()] || mockData[id];
    }
  });

  // charts
  try{
    if(typeof Chart !== "undefined"){
      if(window.trendChart) window.trendChart.destroy();
      window.trendChart = new Chart(trendCanvas.getContext("2d"), {
        type: "line",
        data: {
          labels: mockData.healthTrend.labels,
          datasets: [
            { label:"Healthy", data: mockData.healthTrend.healthy, borderColor:"#36a542", backgroundColor:"rgba(54,165,66,0.08)", tension:0.3, pointRadius:0 },
            { label:"Under Stress", data: mockData.healthTrend.stress, borderColor:"#f4b400", backgroundColor:"rgba(244,180,0,0.08)", tension:0.3, pointRadius:0 },
            { label:"Diseased", data: mockData.healthTrend.diseased, borderColor:"#d32f2f", backgroundColor:"rgba(211,47,47,0.08)", tension:0.3, pointRadius:0 }
          ]
        },
        options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"top" }}, scales:{ x:{ display:false }, y:{ beginAtZero:true } } }
      });
      if(window.sensorChart) window.sensorChart.destroy();
      window.sensorChart = new Chart(sensorCanvas.getContext("2d"), {
        type: "bar",
        data: { labels: mockData.sensorPerformance.labels, datasets:[{ label:"Sensor Performance", data: mockData.sensorPerformance.values, backgroundColor:"#7aa6f4" }]},
        options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ beginAtZero:true } } }
      });
    }
  }catch(e){ console.warn("dashboard charts error", e); }

  // table
  tableBody.innerHTML = "";
  mockData.recentPredictions.forEach(row=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.date}</td><td>${row.status}</td><td>${row.conf}%</td><td>${row.moisture}</td><td>${row.temp}</td>`;
    tableBody.appendChild(tr);
  });
}

/* -------------------- HISTORY MODULE (defensive + translated) -------------------- */
(function historyModule(){
  const tableBody = document.getElementById("historyTableBody");
  if(!tableBody) return;

  let historyData = [
    { date:"2025-11-21 14:22", result:"Healthy", confidence:92, moisture:"41%", temp:"24°C", img:"images/sample.jpg", sensor:"Sensor #03" },
    { date:"2025-11-20 10:10", result:"Under Stress", confidence:77, moisture:"29%", temp:"27°C", img:"images/sample.jpg", sensor:"Sensor #07" },
    { date:"2025-11-19 18:45", result:"Diseased", confidence:61, moisture:"15%", temp:"31°C", img:"images/sample.jpg", sensor:"Sensor #01" }
  ];

  function translateStatus(status, lang){
    if(!translations[lang]) return status;
    const key = (status||"").trim();
    if(translations[lang][key]) return translations[lang][key];
    if(key.toLowerCase().includes("healthy")) return translations[lang]["Healthy"] || key;
    if(key.toLowerCase().includes("stress")) return translations[lang]["Under Stress"] || key;
    if(key.toLowerCase().includes("diseas")) return translations[lang]["Diseased"] || key;
    return key;
  }

  function renderRow(row, idx){
    const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
    const st = translateStatus(row.result, lang);
    const colorClass = row.result === "Healthy" ? "green-text" : (row.result === "Under Stress" ? "yellow-text" : "red-text");
    const viewText = translations[lang]["View"] || (lang==="ar"? "عرض": "View");
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td class="${colorClass}">${st}</td>
      <td>${row.confidence}%</td>
      <td>${row.moisture}</td>
      <td>${row.temp}</td>
      <td><button class="img-btn" type="button" data-src="${row.img}">img</button></td>
      <td>${row.sensor}</td>
      <td><button class="view-btn" type="button" data-index="${idx}">${viewText}</button></td>
    `;
    return tr;
  }

  function loadHistory(data){
    tableBody.innerHTML = "";
    data.forEach((r,i)=> tableBody.appendChild(renderRow(r,i)));
    // bind actions
    tableBody.querySelectorAll(".img-btn").forEach(b=> on(b,"click", ()=> window.open(b.getAttribute("data-src"), "Image", "width=600,height=600")));
    tableBody.querySelectorAll(".view-btn").forEach(b=> on(b,"click", ()=> {
      const idx = parseInt(b.getAttribute("data-index"),10);
      if(isNaN(idx)) return;
      try{ localStorage.setItem("selectedPrediction", JSON.stringify(historyData[idx])); }catch(e){}
      window.location.href = "view.html";
    }));
  }

  loadHistory(historyData);

  window.refreshHistoryTable = function(lang){
    loadHistory(historyData);
  };

  // filters (if exist)
  const applyFilterBtn = document.getElementById("applyFilter");
  const filterDate = document.getElementById("filterDate");
  const filterStatus = document.getElementById("filterStatus");
  const filterConf = document.getElementById("filterConf");

  (function prepareFilters(){
    const lang = localStorage.getItem("siteLang") || "en";
    if(filterStatus){
      filterStatus.innerHTML = "";
      const addOpt = (val, en, ar) => { const o = document.createElement("option"); o.value = val; o.textContent = (lang === "ar") ? ar : en; filterStatus.appendChild(o); };
      addOpt("", translations[lang]["All"] || (lang==="ar" ? "الكل" : "All"), translations[lang]["All"] || (lang==="ar" ? "الكل" : "All"));
      addOpt("Healthy", translations[lang]["Healthy"] || "Healthy", translations["ar"]["Healthy"]);
      addOpt("Under Stress", translations[lang]["Under Stress"] || "Under Stress", translations["ar"]["Under Stress"]);
      addOpt("Diseased", translations[lang]["Diseased"] || "Diseased", translations["ar"]["Diseased"]);
    }
  })();

  if(applyFilterBtn) on(applyFilterBtn, "click", ()=>{
    let filtered = historyData.slice();
    const dateVal = filterDate ? filterDate.value : "";
    const statusVal = filterStatus ? filterStatus.value : "";
    const confVal = filterConf ? filterConf.value : "";
    if(dateVal) filtered = filtered.filter(r => r.date.startsWith(dateVal));
    if(statusVal) filtered = filtered.filter(r => r.result === statusVal);
    if(confVal) filtered = filtered.filter(r => r.confidence >= parseInt(confVal,10));
    loadHistory(filtered);
  });

})();

/* -------------------- UNIVERSAL TEMP NAV INSERT (ON PAGE LOAD) -------------------- */
(function insertTempNavForCurrentPage(){
  const navLinks = document.getElementById("navLinks");
  if(!navLinks) return;

  let currentPage = window.location.pathname.split("/").pop().toLowerCase();
  if(!currentPage) currentPage = "index.html";

  // remove any prior temp
  const old = navLinks.querySelector(".temp-page");
  if(old) old.remove();

  // if nav already has a (real) link for this page -> do nothing
  const exists = navLinks.querySelector(`a[href="${currentPage}"]`);
  if(exists && !exists.classList.contains("temp-page")) return;

  // find menu item
  const menuItem = document.querySelector(`.menu-item[data-page="${currentPage}"]`);
  if(!menuItem){
    // console.warn("menu item for page not found:", currentPage);
    return;
  }

  const nameEn = menuItem.getAttribute("data-en") || menuItem.textContent.trim();
  const nameAr = menuItem.getAttribute("data-ar") || nameEn;
  const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
  const label = (lang === "ar") ? nameAr : nameEn;

  const tempLink = document.createElement("a");
  tempLink.classList.add("temp-page");
  tempLink.href = currentPage;
  tempLink.textContent = label;

  const home = navLinks.querySelector('a[href="index.html"]');
  if(home) home.insertAdjacentElement("afterend", tempLink);
  else navLinks.appendChild(tempLink);

  // ensure translation updates when language changes
  document.addEventListener("languageChanged", updateTempPageTranslation);
})();

/* -------------------- SET ACTIVE NAV (green) -------------------- */
(function setActiveNavOnLoad(){
  try{
    const current = window.location.pathname.split("/").pop() || "index.html";
    safeQAll("#navLinks a").forEach(a=>{
      if(a.getAttribute("href") === current) a.classList.add("active-green");
      else a.classList.remove("active-green");
    });
  }catch(e){}
})();

/* -------------------- CHAT MODULE (UI) -------------------- */
(function initChatModule(){
  function ready(cb){ if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb); else cb(); }
  ready(()=>{

    const chatWindow = document.getElementById("chatWindow");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");
    const uploadImageBtn = document.getElementById("uploadImageBtn");
    const imgPreview = document.getElementById("imgPreview");
    if(!chatWindow || !chatInput || !sendBtn) return;

    // hidden file input for chat images
    const chatImageInput = document.createElement("input"); chatImageInput.type="file"; chatImageInput.accept="image/*"; chatImageInput.style.display="none"; document.body.appendChild(chatImageInput);

    function escHtml(s){ if(!s) return ""; return String(s).replace(/[&<>"'`]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;',"`":'&#96;'}[c])); }

    function addMessage({who='ai', text='', meta='', imageSrc=null}){
      const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
      const wrapper = document.createElement("div");
      wrapper.className = 'msg ' + (who === 'user' ? 'user' : 'ai');
      wrapper.dir = (lang === 'ar') ? 'rtl' : 'ltr';
      let inner = '';
      if(imageSrc) inner += `<div class="msg-image"><img src="${escHtml(imageSrc)}" alt="attachment" style="max-width:240px;border-radius:8px;display:block" /></div>`;
      inner += `<div class="msg-text">${escHtml(text)}</div>`;
      if(meta) inner += `<span class="msg-meta">${escHtml(meta)}</span>`;
      wrapper.innerHTML = inner;
      chatWindow.appendChild(wrapper);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function showTyping(show){
      // optional: create simple typing indicator
      let el = document.getElementById("typingIndicator");
      if(!el){
        el = document.createElement("div"); el.id="typingIndicator"; el.className="typing"; el.textContent = "...";
        chatWindow.appendChild(el);
      }
      el.style.display = show ? "flex" : "none";
    }

    async function getAIReply({text, image}){
      showTyping(true);
      try{
        await new Promise(r=> setTimeout(r, 700 + Math.random()*900));
        const t = (text || "").toLowerCase();
        let reply = "I couldn't diagnose from that. Please upload a clear close-up of the affected leaf.";
        if(text && (t.includes("brown") || t.includes("yellow") || t.includes("spots"))) reply = "Sounds like possible nutrient deficiency or fungal issue. Upload a leaf image and I'll analyze.";
        else if(text && t.includes("wilt")) reply = "Wilting often means water/stress related — check soil moisture and root health.";
        else if(text && text.trim().length < 4 && image) reply = "Thanks for the image — I detect yellowing on leaf edges (possible nutrient imbalance).";
        else if(text && text.trim().length > 8) reply = "Thanks — based on that info, I recommend checking soil moisture and sunlight exposure.";
        const confidence = 70 + Math.floor(Math.random()*25);
        return { reply, confidence };
      } finally { showTyping(false); }
    }

    async function handleSend(){
      const text = chatInput.value && chatInput.value.trim();
      const file = chatImageInput.files && chatImageInput.files[0] ? chatImageInput.files[0] : null;
      if(!text && !file) return;
      if(text) addMessage({ who:'user', text, meta:(localStorage.getItem("siteLang")==="ar") ? "أنت" : "You" });
      if(file){
        const url = URL.createObjectURL(file);
        addMessage({ who:'user', text: text || '', imageSrc: url, meta:(localStorage.getItem("siteLang")==="ar") ? "أنت" : "You" });
      }
      chatInput.value = "";
      if(imgPreview) imgPreview.innerHTML = `<span>${(localStorage.getItem("siteLang")==="ar") ? translations["ar"]["No image"] : translations["en"]["No image"]}</span>`;
      if(chatImageInput) chatImageInput.value = "";

      const { reply, confidence } = await getAIReply({ text, image: file });
      const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
      const metaText = (lang === 'ar') ? `النظام — ثقة ${confidence}%` : `AI — confidence ${confidence}%`;
      addMessage({ who:'ai', text: reply, meta: metaText });
    }

    on(sendBtn, "click", handleSend);
    on(chatInput, "keydown", (e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); handleSend(); } });

    // wire up upload image button & file input
    on(uploadImageBtn,"click", ()=> chatImageInput.click());
    on(chatImageInput,"change", (ev)=>{
      const f = ev.target.files[0]; if(!f) return;
      const url = URL.createObjectURL(f);
      if(imgPreview) imgPreview.innerHTML = `<img src="${url}" alt="preview" />`;
    });

    // welcome message
    (function welcome(){
      const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
      const welcomeText = (lang === "ar") ? "أهلاً! اسأل عن حالة النبات أو ارفع صورة." : "Hi — ask about your plant or upload an image.";
      addMessage({ who:'ai', text: welcomeText, meta: (lang==='ar') ? 'النظام' : 'AI' });
    })();

  }); // ready
})(); // end chat module

/* -------------------- small utility: run on languageChanged to update temp label & other bits -------------------- */
document.addEventListener("languageChanged", ()=>{
  updateTempPageTranslation();
  // re-apply upload page localized texts if present
  try{
    const lang = localStorage.getItem("siteLang") || document.documentElement.lang || "en";
    safeQAll("[data-en][data-ar]").forEach(el=>{
      const txt = (lang === "ar") ? el.getAttribute("data-ar") : el.getAttribute("data-en");
      if(txt !== null){
        if(el.tagName.toLowerCase()==="input"||el.tagName.toLowerCase()==="textarea") el.placeholder = txt;
        else el.textContent = txt;
      }
    });
  }catch(e){}
});

/* ===========================================================
   End of script.js
   =========================================================== */


   /* ================== Plant Report page init (append to script.js) ================== */
(function initPlantReportPage() {
  // wait for DOM ready if needed
  function ready(cb) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  }

  ready(function () {
    // defensive: only run on plant-report page
    const isReport = window.location.pathname.split('/').pop().toLowerCase() === 'plant-report.html';
    if (!isReport) return;

    // 1) ensure temp nav link translation updated when language changed
    function updateTempLink() {
      const navLinks = document.getElementById('navLinks');
      if (!navLinks) return;
      const temp = navLinks.querySelector('.temp-page');
      if (!temp) return;
      const href = temp.getAttribute('href');
      const menuItem = document.querySelector(`.menu-item[data-page="${href}"]`);
      if (!menuItem) return;
      const lang = localStorage.getItem('siteLang') || document.documentElement.lang || 'en';
      temp.textContent = (lang === 'ar') ? (menuItem.getAttribute('data-ar') || menuItem.textContent) : (menuItem.getAttribute('data-en') || menuItem.textContent);
    }

    

    // attach event to update temp link text
    document.addEventListener('languageChanged', updateTempLink);
    updateTempLink();

    // 2) localize static content on this page
    const siteLang = localStorage.getItem('siteLang') || document.documentElement.lang || 'en';
    if (typeof applyLanguage === 'function') applyLanguage(siteLang);

    // 3) init small doughnut/line chart
    const ctx = document.getElementById('plantReportChart');
    if (ctx && typeof Chart !== 'undefined') {
      try {
        if (window.plantReportChart) window.plantReportChart.destroy();
        // Example: stacked area showing counts (mock data)
        window.plantReportChart = new Chart(ctx.getContext('2d'), {
          type: 'line',
          data: {
            labels: Array.from({length:30},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(29-i)); return d.toISOString().slice(0,10); }),
            datasets: [
              { label: (siteLang === 'ar' ? 'سليم' : 'Healthy'), data: Array.from({length:30},()=>60 + Math.round(Math.random()*15)), fill:true, borderColor:'#36a542', tension:0.25, pointRadius:0, backgroundColor:'rgba(54,165,66,0.08)' },
              { label: (siteLang === 'ar' ? 'تحت الضغط' : 'Under Stress'), data: Array.from({length:30},()=>20 + Math.round(Math.random()*10)), fill:true, borderColor:'#f4b400', tension:0.25, pointRadius:0, backgroundColor:'rgba(244,180,0,0.06)' },
              { label: (siteLang === 'ar' ? 'مريض' : 'Diseased'), data: Array.from({length:30},()=>5 + Math.round(Math.random()*4)), fill:true, borderColor:'#d32f2f', tension:0.25, pointRadius:0, backgroundColor:'rgba(211,47,47,0.05)' }
            ]
          },
          options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position: 'top' } }, scales:{ x:{ display:false }, y:{ beginAtZero:true } } }
        });
      } catch(e){ console.warn('plant report chart error', e); }
    }

    // 4) ensure the temporary nav link is inserted after Home (if not already)
    (function ensureTempNav() {
      const navLinks = document.getElementById('navLinks');
      if (!navLinks) return;
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      // remove any existing temp to avoid duplicates
      const existingTemp = navLinks.querySelector('.temp-page');
      if (existingTemp) existingTemp.remove();
      // only add if there's no static anchor for this page
      if (!navLinks.querySelector(`a[href="${currentPage}"]`)) {
        const menuItem = document.querySelector(`.menu-item[data-page="${currentPage}"]`);
        if (!menuItem) return;
        const en = menuItem.getAttribute('data-en') || menuItem.textContent;
        const ar = menuItem.getAttribute('data-ar') || en;
        const lang = localStorage.getItem('siteLang') || document.documentElement.lang || 'en';
        const a = document.createElement('a');
        a.href = currentPage;
        a.classList.add('temp-page');
        a.textContent = (lang === 'ar') ? ar : en;
        const home = navLinks.querySelector('a[href="index.html"]');
        if (home) home.insertAdjacentElement('afterend', a); else navLinks.appendChild(a);
      }
      // highlight active-green on the matching link
      document.querySelectorAll('#navLinks a').forEach(a=>{
        if (a.getAttribute('href') === currentPage) a.classList.add('active-green');
        else a.classList.remove('active-green');
      });
    })();

    // 5) placeholder: receive image from server later — keep placeholder ready
    // (This simply keeps the box until server pushes actual URL)
    const reportImage = document.getElementById('reportImage');
    if (reportImage) {
      // keep inner hint; later your backend can do:
      // document.getElementById('reportImage').innerHTML = `<img src="URL_FROM_SERVER" alt="plant">`
      reportImage.setAttribute('aria-live','polite');
    }

    // done init
    console.log('Plant Report page initialized ✔');
  });
})();


/* PROFILE PAGE AUTO TRANSLATE */
(function () {
  const lang = localStorage.getItem("siteLang") || "en";
  applyLanguage(lang);
})();

/* ===================== PROFILE PAGE TEMP NAV (correct) ===================== */
(function () {
    const nav = document.getElementById("navLinks");
    if (!nav) return;

    // نسحب اسم الملف الحالي
    let currentPage = window.location.pathname.split("/").pop().toLowerCase();
    if (!currentPage) currentPage = "index.html";

    // لو مش على البروفايل → نشيل أي temp-page تخصها
    if (currentPage !== "profile.html") {
        const old = nav.querySelector(`a.temp-page[href="profile.html"]`);
        if (old) old.remove();
        return;
    }

    // لو احنا في البروفايل → نضيف temp-page
    if (!nav.querySelector(`a[href="profile.html"]`)) {

        const temp = document.createElement("a");
        temp.href = "profile.html";
        temp.classList.add("temp-page");

        const nameEn = "Profile";
        const nameAr = "الملف الشخصي";
        const lang = localStorage.getItem("siteLang") || "en";

        temp.textContent = (lang === "ar") ? nameAr : nameEn;

        const home = nav.querySelector('a[href="index.html"]');
        if (home) home.insertAdjacentElement("afterend", temp);
        else nav.appendChild(temp);
    }

    // تفعيل هايلايت اللون الأخضر
    document.querySelectorAll("#navLinks a").forEach(a => {
        if (a.getAttribute("href") === "profile.html") a.classList.add("active-green");
        else a.classList.remove("active-green");
    });
})();

/* =====================
   PROFILE PAGE BUTTONS
   ===================== */

document.addEventListener("DOMContentLoaded", () => {
  
  const editBtn = document.querySelector('.profile-actions .primary');
  const logoutBtn = document.querySelector('.profile-actions .danger');
  
  const modal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const saveBtn = document.getElementById("saveProfile");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      modal.style.display = "flex";

      // تحميل البيانات الحالية
      document.getElementById("editName").value = "User Name";
      document.getElementById("editEmail").value = "user@email.com";
      document.getElementById("editPass").value = "";
    });
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }


  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const name = document.getElementById("editName").value;
      const email = document.getElementById("editEmail").value;

      // تحديث الواجهة مباشرة
      document.querySelector(".profile-info h3").textContent = name;
      document.querySelector(".profile-info p").textContent = email;

      modal.style.display = "none";
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});



/* ===================== SIGNUP PAGE ===================== */
if (window.location.pathname.includes("signup.html")) {
    document.getElementById("signupBtn")?.addEventListener("click", () => {

        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const pass = signupPassword.value.trim();

        if (!name || !email || !pass) {
            alert("Please fill all fields");
            return;
        }

        alert("Account created successfully!");
        window.location.href = "login.html";
    });
}

/* ===================== RESET PASSWORD ===================== */
if (window.location.pathname.includes("reset.html")) {
    document.getElementById("resetBtn")?.addEventListener("click", () => {

        const email = resetEmail.value.trim();
        if (!email) {
            alert("Enter your email");
            return;
        }

        alert("Reset link sent!");
        window.location.href = "login.html";
    });
}

/* ===================== LOGIN PAGE ===================== */
if (window.location.pathname.includes("login.html")) {
    document.getElementById("loginBtn")?.addEventListener("click", () => {
        const email = loginEmail.value.trim();
        const pass = loginPassword.value.trim();

        if (!email || !pass) {
            alert("Please enter email & password");
            return;
        }

        alert("Login successful!");
        window.location.href = "profile.html"; // يفتح صفحة البروفايل
    });
}

/* =======================================================
   ADMIN PAGE — TEMPORARY NAVBAR LINK (CORRECT VERSION)
   ======================================================= */

(function () {

    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "admin.html") return; // ONLY admin page

    const navLinks = document.getElementById("navLinks");
    if (!navLinks) return;

    // قبل أي حاجة: شيل أي temp link قديم
    const oldTemp = navLinks.querySelector(".temp-page");
    if (oldTemp) oldTemp.remove();

    // لو الصفحة موجودة أصلاً في النافبار → خلاص متعملش حاجة
    const exists = navLinks.querySelector(`a[href="${currentPage}"]`);
    if (exists && !exists.classList.contains("temp-page")) return;

    // هات بيانات الترجمة من السايد منيو
    const menuItem = document.querySelector(`.menu-item[data-page="${currentPage}"]`);
    if (!menuItem) return;

    const lang = localStorage.getItem("siteLang") || "en";
    const label = lang === "ar"
        ? menuItem.getAttribute("data-ar")
        : menuItem.getAttribute("data-en");

    // اعمل لينك مؤقت
    const temp = document.createElement("a");
    temp.classList.add("temp-page");
    temp.href = currentPage;
    temp.textContent = label;

    // دخل اللينك بعد الـ Home
    const home = navLinks.querySelector(`a[href="index.html"]`);
    if (home) home.insertAdjacentElement("afterend", temp);

})();
/* =======================================================
   ADMIN PAGE — ACTIVE GREEN STYLE
   ======================================================= */

(function () {
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "admin.html") return;

    document.querySelectorAll("#navLinks a").forEach(a => {
        if (a.getAttribute("href") === currentPage) {
            a.classList.add("active-green");
        }
    });
})();


/* ===================== PREDICTION PAGE ===================== */

/* ===================== PREDICTION PAGE (FIXED) ===================== */
if (window.location.pathname.includes("prediction.html")) {

  const predictBtn = document.getElementById("predictNowBtn");
  const retryBtn = document.getElementById("retryBtn");
  const lastBtn = document.getElementById("lastPredBtn");

  predictBtn?.addEventListener("click", () => {

    // اقرأ القيم من الفورم
    const values = readValuesForEval();
    if (!values) return;

    // اعمل التقييم
    const result = evaluatePlant(values);

    // اللغة الحالية
    const lang = localStorage.getItem("siteLang") || "en";

    // حدّث الواجهة (الكلمة + اللون + الأيقونة)
    updateResultUI(result, lang);

    // اظهار تم التنبؤ
    document.getElementById("doneText")?.style.setProperty("display", "block");
  });

  retryBtn?.addEventListener("click", () => {
    document.querySelectorAll("#leftCard input").forEach(input => {
      input.value = "";
    });

    document.getElementById("doneText")?.style.setProperty("display", "none");
  });

  lastBtn?.addEventListener("click", () => {
    alert("Last predictions feature coming soon");
  });
}

/* ===================== CSV PREDICTION ===================== */
if (window.location.pathname.includes("prediction.html")) {

  const uploadBtn = document.getElementById("uploadCsvBtn");
  const predictCsvBtn = document.getElementById("predictCsvBtn");
  const downloadCsvBtn = document.getElementById("downloadCsvBtn");

  const statusText = document.getElementById("csvStatusText");
  const rowsText = document.getElementById("csvRows");
  const colsText = document.getElementById("csvCols");

  // hidden input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".csv";

  // Upload CSV
  uploadBtn?.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    if (!fileInput.files.length) return;

    statusText.textContent = "File loaded";
    rowsText.textContent = "10";
    colsText.textContent = "5";
  });

  // Predict CSV
  predictCsvBtn?.addEventListener("click", () => {
    alert("CSV prediction done successfully");
  });

  // Download results
  downloadCsvBtn?.addEventListener("click", () => {
    const blob = new Blob(["Prediction Results"], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "prediction_results.csv";
    a.click();
  });

}
