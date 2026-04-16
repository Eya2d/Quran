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

// ===== LAZY LOAD DATA_RAW =====
let _rawLoaded = false;
let _rawLoadingPromise = null;

function _loadRaw() {
  if (_rawLoaded) return Promise.resolve();
  if (_rawLoadingPromise) return _rawLoadingPromise;

  _rawLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'Script/data-raw.js';
    script.onload = () => {
      _rawLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return _rawLoadingPromise;
}

// ===== getCategoryData — القسم المطلوب فقط =====
const _dataCache = {};

async function getCategoryData(cat) {
  if (_dataCache[cat]) return _dataCache[cat];

  // تحميل data-raw.js إن لم يكن محملاً
  await _loadRaw();

  // استخراج القسم المطلوب فقط من DATA_RAW
  const cache = getTitleCache();

  if (cat === 'الكل') {
    const all = CATEGORIES.flatMap(c =>
      (DATA_RAW[c] || [])
        .map(v => {
          const id = cleanVideoId(v.id);
          return id ? { id, category: c, title: cache[id] || "جاري التحميل..." } : null;
        })
        .filter(Boolean)
    );
    _dataCache['الكل'] = all;

    // تحرير DATA_RAW من الذاكرة بعد البناء
    _freeRaw();
    return all;
  }

  const raw = DATA_RAW[cat] || [];
  const result = raw
    .map(v => {
      const id = cleanVideoId(v.id);
      return id ? { id, category: cat, title: cache[id] || "جاري التحميل..." } : null;
    })
    .filter(Boolean);

  _dataCache[cat] = result;

  // تحرير DATA_RAW من الذاكرة بعد استخراج القسم
  _freeRaw();
  return result;
}

// إزالة DATA_RAW من الذاكرة بعد الاستخراج
function _freeRaw() {
  if (typeof DATA_RAW !== 'undefined') {
    try { window.DATA_RAW = null; } catch(_) {}
  }
}

// ===== DATA Proxy — للتوافق مع الكود القديم =====
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
