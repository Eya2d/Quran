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

// ===== DATA_RAW الرئيسي (للصفحة الرئيسية فقط) =====
let _rawLoaded = false;
let _rawLoadingPromise = null;
let MAIN_DATA_RAW = null;

// ===== تخزين بيانات الأقسام المحملة =====
const _chunksCache = {};

// ===== تحميل DATA_RAW الرئيسي (لـ index.html فقط) =====
function _loadMainRaw() {
  if (_rawLoaded) return Promise.resolve();
  if (_rawLoadingPromise) return _rawLoadingPromise;

  const isDelayedPage = location.pathname.includes('section') ||
                        location.pathname.includes('favorites') ||
                        location.pathname.includes('Favorites') ||
                        location.pathname.endsWith('index.html') ||
                        location.pathname.endsWith('/') ||
                        location.pathname === '';

  _rawLoadingPromise = new Promise((resolve, reject) => {
    function doLoad() {
      const script = document.createElement('script');
      script.src = 'Script/data-raw.js';
      script.onload = () => {
        _rawLoaded = true;
        MAIN_DATA_RAW = window.DATA_RAW;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    }

    if (isDelayedPage) {
      if (document.readyState === 'complete') {
        setTimeout(doLoad, 1);
      } else {
        window.addEventListener('load', () => setTimeout(doLoad, 1), { once: true });
      }
    } else {
      doLoad();
    }
  });

  return _rawLoadingPromise;
}

// ===== تحميل ملف قسم فردي =====
async function _loadChunk(cat) {
  if (_chunksCache[cat]) return _chunksCache[cat];
  
  const chunkPath = DATA_CHUNK_MAP[cat];
  if (!chunkPath) {
    console.warn(`لا يوجد ملف مخصص للقسم: ${cat}`);
    return null;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = chunkPath;
    script.onload = () => {
      // المتغير المتوقع في الملفات هو DATA_CHUNK
      if (window.DATA_CHUNK) {
        _chunksCache[cat] = window.DATA_CHUNK;
        window.DATA_CHUNK = null; // تنظيف
        resolve(_chunksCache[cat]);
      } else {
        reject(new Error(`الملف ${chunkPath} لم يُصدر DATA_CHUNK`));
      }
    };
    script.onerror = () => reject(new Error(`فشل تحميل ${chunkPath}`));
    document.head.appendChild(script);
  });
}

// ===== الحصول على بيانات قسم معين =====
const _dataCache = {};

async function getCategoryData(cat) {
  // التحقق من وجود البيانات في الكاش
  if (_dataCache[cat]) return _dataCache[cat];

  // صفحة المشاهدة أو section أو favorites: تحميل الملف المخصص
  const isWatchPage = location.pathname.includes('watch.html');
  const isSectionPage = location.pathname.includes('section.html');
  const isFavoritesPage = location.pathname.includes('favorites.html');
  
  // الأقسام الخاصة (كل القراء، تلاوات خاشعة) تأتي من main أو مخصصة
  const isSpecialCat = cat === 'كل القراء' || cat === 'تلاوات خاشعة';

  // حالة 1: صفحة رئيسية (index) - نستخدم DATA_RAW الرئيسي
  if (!isWatchPage && !isSectionPage && !isFavoritesPage) {
    await _loadMainRaw();
    if (!MAIN_DATA_RAW) return [];
    
    if (cat === 'كل القراء') {
      const all = CATEGORIES.flatMap(c =>
        (MAIN_DATA_RAW[c] || [])
          .map(v => {
            const id = cleanVideoId(v.id);
            return id ? { id, category: c, title: getTitleCache()[id] || "جاري التحميل..." } : null;
          })
          .filter(Boolean)
      );
      _dataCache['كل القراء'] = all;
      return all;
    }
    
    const raw = MAIN_DATA_RAW[cat] || [];
    const result = raw
      .map(v => {
        const id = cleanVideoId(v.id);
        return id ? { id, category: cat, title: getTitleCache()[id] || "جاري التحميل..." } : null;
      })
      .filter(Boolean);
    _dataCache[cat] = result;
    return result;
  }
  
  // حالة 2: صفحات section, favorites, watch - نستخدم الملفات المجزأة
  // للأقسام الخاصة نستخدم main raw
  if (isSpecialCat) {
    await _loadMainRaw();
    if (!MAIN_DATA_RAW) return [];
    
    if (cat === 'كل القراء') {
      const all = CATEGORIES.flatMap(c =>
        (MAIN_DATA_RAW[c] || [])
          .map(v => {
            const id = cleanVideoId(v.id);
            return id ? { id, category: c, title: getTitleCache()[id] || "جاري التحميل..." } : null;
          })
          .filter(Boolean)
      );
      _dataCache['كل القراء'] = all;
      return all;
    }
    
    const raw = MAIN_DATA_RAW[cat] || [];
    const result = raw
      .map(v => {
        const id = cleanVideoId(v.id);
        return id ? { id, category: cat, title: getTitleCache()[id] || "جاري التحميل..." } : null;
      })
      .filter(Boolean);
    _dataCache[cat] = result;
    return result;
  }
  
  // للأقسام العادية: تحميل الملف المخصص
  try {
    const chunkData = await _loadChunk(cat);
    if (!chunkData || !chunkData.videos) {
      console.warn(`لا توجد بيانات للقسم: ${cat}`);
      return [];
    }
    
    const result = chunkData.videos
      .map(v => {
        const id = cleanVideoId(v.id);
        return id ? { id, category: cat, title: getTitleCache()[id] || v.title || "جاري التحميل..." } : null;
      })
      .filter(Boolean);
    
    _dataCache[cat] = result;
    return result;
  } catch (err) {
    console.error(`خطأ في تحميل القسم ${cat}:`, err);
    return [];
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
    if (v.id === cleanId && v.title !== title) {
      changed = true;
      return { ...v, title };
    }
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
const FAVORITES_KEY = "yt_favorites_v1";
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
    const updated = current - 1;
    localStorage.setItem(FAVORITES_BADGE_KEY, String(updated));
    updateFavBadge();
  }
}

function toggleFavorite(video) {
  const cleanId = cleanVideoId(video.id);
  if (isFavorite(cleanId)) {
    removeFromFavorites(cleanId);
    return false;
  } else {
    addToFavorites(video);
    return true;
  }
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
