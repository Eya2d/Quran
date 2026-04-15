// ===== قائمة الأقسام =====
const CATEGORIES = [
  "مشاري العفاسي",
  "عبد الباسط عبد الصمد",
  "محمد صديق المنشاوي",
  "ماهر المعيقلي",
  "سعد الغامدي",
  "أحمد العجمي",
  "عبد الرحمن السديس",
  "فارس عباد",
  "هاني الرفاعي",
  "ياسر الدوسري",
  "ناصر القطامي",
  "إدريس أبكر",
  "خالد الجليل",
  "محمد أيوب",
  "علي جابر",
  "صلاح البدير",
  "بندر بليلة",
  "إسلام صبحي",
  "أبو بكر الشاطري",
  "عبد الله بصفر"
];

// ===== FETCH & PARSE — قسم واحد فقط من النص =====
// يجلب data-raw.js كنص خام ويستخرج القسم المطلوب بدون تنفيذ JS
let _rawText = null;
let _rawFetchPromise = null;

function _fetchRawText() {
  if (_rawText) return Promise.resolve(_rawText);
  if (_rawFetchPromise) return _rawFetchPromise;
  _rawFetchPromise = fetch('Script/data-raw.js')
    .then(r => r.text())
    .then(t => { _rawText = t; return t; });
  return _rawFetchPromise;
}

function _extractCatFromText(text, cat) {
  // تحديد بداية القسم
  const startKey = `"${cat}": [`;
  const startIdx = text.indexOf(startKey);
  if (startIdx === -1) return [];

  // تتبع الأقواس لإيجاد نهاية المصفوفة
  const arrStart = text.indexOf('[', startIdx);
  let depth = 0, i = arrStart;
  while (i < text.length) {
    if (text[i] === '[') depth++;
    else if (text[i] === ']') { depth--; if (depth === 0) { i++; break; } }
    i++;
  }

  // استخراج IDs بـ regex بسيط
  const arrText = text.slice(arrStart, i);
  const cache = getTitleCache();
  const ids = [];
  const idRegex = /\{\s*id:\s*"([^"]+)"/g;
  let m;
  while ((m = idRegex.exec(arrText)) !== null) {
    const cleanId = m[1].split('&')[0].split('?')[0].trim();
    if (cleanId) ids.push({
      id: cleanId,
      category: cat,
      title: cache[cleanId] || "جاري التحميل..."
    });
  }
  return ids;
}

// ===== getCategoryData — الدالة الرئيسية =====
// تجلب النص مرة واحدة فقط، ثم تستخرج القسم المطلوب من الذاكرة
const _dataCache = {};

async function getCategoryData(cat) {
  if (_dataCache[cat]) return _dataCache[cat];

  const text = await _fetchRawText();

  if (cat === 'الكل') {
    const all = CATEGORIES.flatMap(c => _extractCatFromText(text, c));
    _dataCache['الكل'] = all;
    return all;
  }

  const result = _extractCatFromText(text, cat);
  _dataCache[cat] = result;
  return result;
}

// ===== DATA Proxy — للتوافق مع الكود القديم =====
// يعمل فقط بعد getCategoryData (أي بعد التحميل)
const DATA = new Proxy({}, {
  get(_, prop) {
    if (_dataCache[prop] !== undefined) return _dataCache[prop];
    return undefined;
  },
  set(_, prop, value) {
    _dataCache[prop] = value;
    return true;
  },
  has(_, prop) {
    return prop === 'الكل' || CATEGORIES.includes(prop);
  }
});

// ===== CLEAN VIDEO ID =====
function cleanVideoId(id) {
  if (!id) return "";
  return id.split('&')[0].split('?')[0].trim();
}

// ===== TITLE CACHE =====
const TITLE_CACHE_KEY = "yt_title_cache_v1";

function getTitleCache() {
  try { return JSON.parse(localStorage.getItem(TITLE_CACHE_KEY) || "{}"); }
  catch { return {}; }
}
function saveTitleCache(cache) {
  try { localStorage.setItem(TITLE_CACHE_KEY, JSON.stringify(cache)); }
  catch {}
}

// ===== FETCH TITLE =====
async function fetchVideoTitle(id) {
  const cleanId = cleanVideoId(id);
  if (!cleanId) return null;

  const cache = getTitleCache();
  if (cache[cleanId]) return cache[cleanId];

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${cleanId}&format=json`
    );
    if (!res.ok) throw new Error();
    const d = await res.json();
    const title = d.title || cleanId;
    const c = getTitleCache();
    c[cleanId] = title;
    saveTitleCache(c);
    return title;
  } catch {
    return cleanId;
  }
}

// ===== ENRICH VIDEOS =====
async function enrichVideos(videos) {
  const cache = getTitleCache();
  const validVideos = videos.filter(v => cleanVideoId(v.id));
  const missing = validVideos.filter(v => !cache[cleanVideoId(v.id)]);
  const BATCH = 6;
  for (let i = 0; i < missing.length; i += BATCH) {
    await Promise.all(missing.slice(i, i + BATCH).map(v => fetchVideoTitle(v.id)));
  }
  const updated = getTitleCache();
  return videos.map(v => ({
    ...v,
    id: cleanVideoId(v.id),
    title: updated[cleanVideoId(v.id)] || v.title || cleanVideoId(v.id)
  }));
}

// ===== WATCH HISTORY =====
function getWatchHistory() {
  try { return JSON.parse(localStorage.getItem("watchHistory") || "[]"); }
  catch { return []; }
}

function addToWatchHistory(video) {
  if (!video.id) return;
  let h = getWatchHistory();
  h = h.filter(v => v.id !== video.id);
  h.unshift({ ...video, watchedAt: Date.now() });
  h = h.slice(0, 5);
  localStorage.setItem("watchHistory", JSON.stringify(h));
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  const m = Math.floor(s / 60), hr = Math.floor(m / 60),
        d = Math.floor(hr / 24), w = Math.floor(d / 7), mo = Math.floor(d / 30);
  if (mo > 0) return `منذ ${mo} شهر`;
  if (w  > 0) return `منذ ${w} أسبوع`;
  if (d  > 0) return `منذ ${d} يوم`;
  if (hr > 0) return `منذ ${hr} ساعة`;
  if (m  > 0) return `منذ ${m} دقيقة`;
  return "منذ لحظات";
}

function getYoutubeThumbnail(id) {
  const cleanId = cleanVideoId(id);
  if (!cleanId) return "";
  return `https://img.youtube.com/vi/${cleanId}/mqdefault.jpg`;
}
