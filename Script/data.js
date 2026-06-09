// ===== قائمة الأقسام =====
const CATEGORIES = [
"كل القراء",
"تلاوات خاشعة",
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
"عبد الله بصفر",
"محمود خليل الحصري",
"محمد جبريل",
"سعود الشريم",
"عبد الله عواد الجهني",
"محمد محمود الطبلاوي",
"إبراهيم الأخضر",
"عبد الرشيد صوفي",
"مصطفى إسماعيل",
"محمود علي البنا",
"علي الحذيفي",
"عبد الولي الأركاني",
"صالح بوخاطر",
"عبد العزيز الزهراني",
"محمد المحيسني",
"حسن صالح",
];

// ===== خريطة ملفات الأقسام =====
const DATA_CHUNK_MAP = {
  "مشاري العفاسي":          "Datat/data-afasi.js",
  "عبد الباسط عبد الصمد":  "Datat/data-abdulbasit.js",
  "محمد صديق المنشاوي":     "Datat/data-minshawi.js",
  "ماهر المعيقلي":           "Datat/data-muaiqly.js",
  "سعد الغامدي":             "Datat/data-ghamdi.js",
  "أحمد العجمي":             "Datat/data-ajami.js",
  "عبد الرحمن السديس":      "Datat/data-sudais.js",
  "فارس عباد":               "Datat/data-faris.js",
  "هاني الرفاعي":            "Datat/data-rifai.js",
  "ياسر الدوسري":            "Datat/data-dosari.js",
  "ناصر القطامي":            "Datat/data-qatami.js",
  "إدريس أبكر":              "Datat/data-abkar.js",
  "خالد الجليل":             "Datat/data-jalil.js",
  "محمد أيوب":               "Datat/data-ayoub.js",
  "علي جابر":                "Datat/data-jaber.js",
  "صلاح البدير":             "Datat/data-budayr.js",
  "بندر بليلة":              "Datat/data-blayla.js",
  "إسلام صبحي":              "Datat/data-sobhi.js",
  "أبو بكر الشاطري":         "Datat/data-shatri.js",
  "عبد الله بصفر":           "Datat/data-basfar.js",
  "محمود خليل الحصري":       "Datat/data-husary.js",
  "محمد جبريل":              "Datat/data-jibreel.js",
  "سعود الشريم":             "Datat/data-shuraim.js",
  "عبد الله عواد الجهني":    "Datat/data-juhani.js",
  "محمد محمود الطبلاوي":     "Datat/data-tablawi.js",
  "إبراهيم الأخضر":          "Datat/data-akhdar.js",
  "عبد الرشيد صوفي":         "Datat/data-sufi.js",
  "مصطفى إسماعيل":           "Datat/data-ismail.js",
  "محمود علي البنا":          "Datat/data-banna.js",
  "علي الحذيفي":             "Datat/data-hudhaifi.js",
  "عبد الولي الأركاني":      "Datat/data-arkani.js",
  "صالح بوخاطر":             "Datat/data-bukhatar.js",
  "عبد العزيز الزهراني":     "Datat/data-zahrani.js",
  "محمد المحيسني":            "Datat/data-muhaisini.js",
  "حسن صالح":               "Datat/data-hassan.js",
  "تلاوات خاشعة":            "Datat/data-khashia.js",
  "كل القراء":               "Datat/data-allreaders.js",
};

// ===== تحميل chunk واحد =====
const _chunkLoaded  = {};   // cat → true
const _chunkLoading = {};   // cat → Promise

function _loadChunk(cat) {
  if (_chunkLoaded[cat])  return Promise.resolve();
  if (_chunkLoading[cat]) return _chunkLoading[cat];

  const src = DATA_CHUNK_MAP[cat];
  if (!src) return Promise.resolve();

  _chunkLoading[cat] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload  = () => { _chunkLoaded[cat] = true; resolve(); };
    // ✅ إصلاح: عند فشل التحميل نحل الـ promise بدل رفضها لتجنب توقف باقي الأقسام
    s.onerror = () => { _chunkLoaded[cat] = true; resolve(); };
    document.head.appendChild(s);
  });

  return _chunkLoading[cat];
}

// ===== تحميل كل الأقسام بالتسلسل مع 1ms تأخير بين كل ملف =====
let _allLoading = false;
let _allLoaded  = false;
let _allPromise = null;

function _loadAllChunks() {
  if (_allLoaded)  return Promise.resolve();
  if (_allPromise) return _allPromise;
  _allLoading = true;

  _allPromise = (async () => {
    for (const cat of CATEGORIES) {
      if (!DATA_CHUNK_MAP[cat]) continue;
      await _loadChunk(cat);
      await new Promise(r => setTimeout(r, 1));
    }
    _allLoaded  = true;
    _allLoading = false;
  })();

  return _allPromise;
}

// ===== قراءة بيانات قسم من window.DATA_CHUNK =====
// ✅ إصلاح: دالة مركزية تضمن القراءة الصحيحة من window.DATA_CHUNK
function _getRawData(cat) {
  if (!window.DATA_CHUNK) return [];
  const raw = window.DATA_CHUNK[cat];
  if (!Array.isArray(raw)) return [];
  return raw;
}

// ===== getCategoryData =====
const _dataCache = {};

async function getCategoryData(cat) {
  // ✅ إصلاح: استخدام hasOwnProperty بدل التحقق من القيمة مباشرة
  // لأن [] (مصفوفة فارغة) تساوي false وكانت تُعيد التحميل في كل مرة
  if (Object.prototype.hasOwnProperty.call(_dataCache, cat)) return _dataCache[cat];

  if (cat === 'الكل') {
    await _loadAllChunks();
    const cache = getTitleCache();
    const all = CATEGORIES.flatMap(c => {
      return _getRawData(c).map(v => {
        const id = cleanVideoId(v.id);
        return id ? { id, category: c, title: cache[id] || "جاري التحميل..." } : null;
      }).filter(Boolean);
    });
    _dataCache['الكل'] = all;
    return all;
  }

  // تحميل قسم واحد فقط
  await _loadChunk(cat);
  const cache = getTitleCache();
  // ✅ إصلاح: استخدام _getRawData بدل window.DATA_CHUNK مباشرة
  const result = _getRawData(cat).map(v => {
    const id = cleanVideoId(v.id);
    return id ? { id, category: cat, title: cache[id] || "جاري التحميل..." } : null;
  }).filter(Boolean);

  _dataCache[cat] = result;
  return result;
}

// ===== DATA Proxy — للتوافق مع الكود القديم =====
const DATA = new Proxy({}, {
  get(_, prop) {
    if (Object.prototype.hasOwnProperty.call(_dataCache, prop)) return _dataCache[prop];
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
  const cleanId = cleanVideoId(video.id);
  const cache = getTitleCache();
  const title = cache[cleanId] || video.title || cleanId;
  let h = getWatchHistory();
  h = h.filter(v => v.id !== cleanId);
  h.unshift({ ...video, id: cleanId, title, watchedAt: Date.now() });
  h = h.slice(0, 5);
  localStorage.setItem("watchHistory", JSON.stringify(h));
}

function updateWatchHistoryTitle(id, title) {
  const cleanId = cleanVideoId(id);
  let h = getWatchHistory();
  let changed = false;
  h = h.map(v => {
    if (v.id === cleanId && v.title !== title) { changed = true; return { ...v, title }; }
    return v;
  });
  if (changed) localStorage.setItem("watchHistory", JSON.stringify(h));
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

// ===== FAVORITES =====
const FAVORITES_KEY       = "yt_favorites_v1";
const FAVORITES_BADGE_KEY = "yt_favorites_new_count";

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); }
  catch { return []; }
}

function isFavorite(id) {
  const cleanId = cleanVideoId(id);
  return getFavorites().some(v => v.id === cleanId);
}

function addToFavorites(video) {
  if (!video.id) return;
  const cleanId = cleanVideoId(video.id);
  let favs = getFavorites();
  if (favs.some(v => v.id === cleanId)) return;
  favs.unshift({ ...video, id: cleanId, savedAt: Date.now() });
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  const current = parseInt(localStorage.getItem(FAVORITES_BADGE_KEY) || "0", 10);
  localStorage.setItem(FAVORITES_BADGE_KEY, String(current + 1));
  updateFavBadge();
}

function removeFromFavorites(id) {
  const cleanId = cleanVideoId(id);
  let favs = getFavorites().filter(v => v.id !== cleanId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  const current = parseInt(localStorage.getItem(FAVORITES_BADGE_KEY) || "0", 10);
  if (current > 0) {
    localStorage.setItem(FAVORITES_BADGE_KEY, String(current - 1));
    updateFavBadge();
  }
}

function toggleFavorite(video) {
  const cleanId = cleanVideoId(video.id);
  if (isFavorite(cleanId)) { removeFromFavorites(cleanId); return false; }
  else                      { addToFavorites(video);        return true;  }
}

function clearFavoritesBadge() {
  localStorage.setItem(FAVORITES_BADGE_KEY, "0");
  updateFavBadge();
}

function updateFavBadge() {
  const badge = document.querySelector("header .Toggle xx");
  if (!badge) return;
  const count = parseInt(localStorage.getItem(FAVORITES_BADGE_KEY) || "0", 10);
  badge.textContent = "";
  badge.style.display = count > 0 ? "block" : "none";
}
