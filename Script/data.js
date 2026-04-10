// ===== DATA =====
// فقط IDs بدون عناوين — تُجلب تلقائياً من YouTube oEmbed
const DATA_RAW = {
  "مشاري العفاسي": [
    { id: "JFJDsmO1Yjk&list", category: "مشاري العفاسي" },
    { id: "Zrovi_d3WQQ&list", category: "مشاري العفاسي" },
    { id: "pyj9FW9fQ7Y&list", category: "مشاري العفاسي" },
    { id: "YVZhSvxbZrc&list", category: "مشاري العفاسي" },
    { id: "3KsdiYsKSQA&list", category: "مشاري العفاسي" },
    { id: "3Uw2RbUfwsM&list", category: "مشاري العفاسي" },
    { id: "tqE_AmepCT4&list", category: "مشاري العفاسي" },
    { id: "OEaTS_Q_28Y&list", category: "مشاري العفاسي" },
    { id: "iPl_NVXvznU&list", category: "مشاري العفاسي" },
    { id: "ToF0gpJFn5o&list", category: "مشاري العفاسي" },
    { id: "AFckiMfJtic&list", category: "مشاري العفاسي" },
    { id: "wPyk7C5wMa8&list", category: "مشاري العفاسي" },
    { id: "v84GDcDUUvY&list", category: "مشاري العفاسي" },
    { id: "IILNhV0y4sA&list", category: "مشاري العفاسي" },
    { id: "SK8fYriIrTw&list", category: "مشاري العفاسي" },
    { id: "Ev5oQyqFT9c&list", category: "مشاري العفاسي" },
    { id: "Pb62zKNo7Hc&list", category: "مشاري العفاسي" },
    { id: "ArM9kZXM-eI&list", category: "مشاري العفاسي" },
    { id: "TOv2VbsHtYQ&list", category: "مشاري العفاسي" },
    { id: "IlC8SnzCbAA&list", category: "مشاري العفاسي" },
    { id: "jN7wuZTlvug&list", category: "مشاري العفاسي" },
    { id: "4aFSwBRGWe8&list", category: "مشاري العفاسي" },
    { id: "_NCG7ZYHdmE&list", category: "مشاري العفاسي" },
    { id: "L_uxwDeLFqw&list", category: "مشاري العفاسي" },
    { id: "GFyoyMD_l3w&list", category: "مشاري العفاسي" },
    { id: "juSYtdn2fX8&list", category: "مشاري العفاسي" },
    { id: "k_d2hkSNT3g&list", category: "مشاري العفاسي" },
    { id: "30CVCRXAsXs&list", category: "مشاري العفاسي" },
    { id: "eiqGUmNJF7M&list", category: "مشاري العفاسي" },
    { id: "krrPH43k3Ys&list", category: "مشاري العفاسي" },
    { id: "dEJbV_ru7S4&list", category: "مشاري العفاسي" },
    { id: "320gzbsmF-g&list", category: "مشاري العفاسي" },
    { id: "pBqYlZ1e-JM&list", category: "مشاري العفاسي" },
    { id: "167pU1gkQ-s&list", category: "مشاري العفاسي" },
    { id: "GefpTcWvpdQ&list", category: "مشاري العفاسي" },
    { id: "iuW_LFaNIjU&list", category: "مشاري العفاسي" },
    { id: "DI2_KF6QUy4&list", category: "مشاري العفاسي" },
    { id: "9gpk_eurUag&list", category: "مشاري العفاسي" },
    { id: "NxYCrFTN45M&list", category: "مشاري العفاسي" },
    { id: "AUFxDPi4TUE&list", category: "مشاري العفاسي" },
    { id: "6NV8ly32ueg&list", category: "مشاري العفاسي" },
    { id: "vuyHEQKg3bg&list", category: "مشاري العفاسي" },
    { id: "eUatnrlS3iU&list", category: "مشاري العفاسي" },
    { id: "V57HAqzwbbY&list", category: "مشاري العفاسي" },
    { id: "ByMYO_p1VLw&list", category: "مشاري العفاسي" },
    { id: "4lvjTYz36MY&list", category: "مشاري العفاسي" },
    { id: "PW-q-fqyCCw&list", category: "مشاري العفاسي" },
    { id: "VewPMR0G1dI&list", category: "مشاري العفاسي" },
    { id: "M9wYQNCcm80&list", category: "مشاري العفاسي" },
    { id: "a1U-k4T3H_U&list", category: "مشاري العفاسي" },
    { id: "MCmq9x1iprw&list", category: "مشاري العفاسي" },
    { id: "FNs3UTXARJE&list", category: "مشاري العفاسي" },
    { id: "a1QfuQpx90U&list", category: "مشاري العفاسي" },
    { id: "HPbI2ZaxMTc&list", category: "مشاري العفاسي" },
    { id: "GWGWwnFjTnk&list", category: "مشاري العفاسي" },
    { id: "Uohs4WQP2ik&list", category: "مشاري العفاسي" },
    { id: "L0xfItStMnk&list", category: "مشاري العفاسي" },
    { id: "bLvfF161Hiw&list", category: "مشاري العفاسي" },
    { id: "wJuLEQVM1cc&list", category: "مشاري العفاسي" },
    { id: "u_6NfVYxk6I&list", category: "مشاري العفاسي" },
    { id: "2ZKX0E6KdhQ&list", category: "مشاري العفاسي" },
    { id: "B65aKC8PHos&list", category: "مشاري العفاسي" },
    { id: "dG-mGcjK3Xc&list", category: "مشاري العفاسي" },
    { id: "HKLNBF8ooQg&list", category: "مشاري العفاسي" },
    { id: "HdGWKfJKRKs&list", category: "مشاري العفاسي" },
    { id: "qh1dIfnMyRA&list", category: "مشاري العفاسي" },
    { id: "3kiZv_CXoc4&list", category: "مشاري العفاسي" },
    { id: "4rYSnPsuP4s&list", category: "مشاري العفاسي" },
    { id: "1KpPfYFd2zE&list", category: "مشاري العفاسي" },
    { id: "LIcUWTA_b7U&list", category: "مشاري العفاسي" },
    { id: "yuRShVQKwU4&list", category: "مشاري العفاسي" },
    { id: "yO6zaniz_2c&list", category: "مشاري العفاسي" },
    { id: "yevEesJf9Qw&list", category: "مشاري العفاسي" },
    { id: "ryiuXQutVLk&list", category: "مشاري العفاسي" },
    { id: "TASASMWBj50&list", category: "مشاري العفاسي" },
    { id: "E0D9pFck21c&list", category: "مشاري العفاسي" },
    { id: "8cUdhjmF1fo&list", category: "مشاري العفاسي" },
    { id: "f7yaXpTYCO4&list", category: "مشاري العفاسي" },
    { id: "BJn1l2P2R4c&list", category: "مشاري العفاسي" },
    { id: "2tzCsVQUHsg&list", category: "مشاري العفاسي" },
    { id: "tKWr_lbZu9g&list", category: "مشاري العفاسي" },
    { id: "Xof4XD3zksQ&list", category: "مشاري العفاسي" },
    { id: "-Bn4y_Y5ISo&list", category: "مشاري العفاسي" },
    { id: "wfy6xVB3QX0&list", category: "مشاري العفاسي" },
    { id: "Tx_jQoBqY-s&list", category: "مشاري العفاسي" },
    { id: "anA3rx_Kk2s&list", category: "مشاري العفاسي" },
    { id: "mrkWan4r2_8&list", category: "مشاري العفاسي" },
    { id: "bhOjdNE-ZcM&list", category: "مشاري العفاسي" },
    { id: "ZwOdb0RapyQ&list", category: "مشاري العفاسي" },
    { id: "WKRVv8IJzLE&list", category: "مشاري العفاسي" },
    { id: "aMP3UjP_HaI&list", category: "مشاري العفاسي" },
    { id: "LfSOBj97_2w&list", category: "مشاري العفاسي" },
    { id: "ZbOTxVIv92U&list", category: "مشاري العفاسي" },
    { id: "exXfG-3ET-Q&list", category: "مشاري العفاسي" },
    { id: "t71nVrwexo0&list", category: "مشاري العفاسي" },
    { id: "lch1NAYfUcg&list", category: "مشاري العفاسي" },
    { id: "XYmqfyH3Ivc&list", category: "مشاري العفاسي" },
    { id: "8n3rPyshkYM&list", category: "مشاري العفاسي" },
    { id: "m7x2PCED88M&list", category: "مشاري العفاسي" },
    { id: "F4EVNadUfWk&list", category: "مشاري العفاسي" },
    { id: "Hdg-nv_kSEo&list", category: "مشاري العفاسي" },
    { id: "_nsNRZxEltk&list", category: "مشاري العفاسي" },
    { id: "86edI1cEwHo&list", category: "مشاري العفاسي" },
    { id: "a5DLKSCOCAA&list", category: "مشاري العفاسي" },
    { id: "8ulaQOsGn8g&list", category: "مشاري العفاسي" },
    { id: "jPIUyywawps&list", category: "مشاري العفاسي" },
    { id: "zRdkRoSl7cQ&list", category: "مشاري العفاسي" },
    { id: "jIWOR-6XJMk&list", category: "مشاري العفاسي" },
    { id: "SQnYg7RskF8&list", category: "مشاري العفاسي" },
    { id: "AzlK9dwyrog&list", category: "مشاري العفاسي" },
    { id: "C3KXRuo1AXY&list", category: "مشاري العفاسي" },
    { id: "23cs89pp2BI&list", category: "مشاري العفاسي" },
    { id: "rcgk7kIGN7M&list", category: "مشاري العفاسي" },
    { id: "9wZ4EXVD1xg&list", category: "مشاري العفاسي" },
  ],
  "عبد الباسط عبد الصمد": [
    { id: "", category: "عبد الباسط عبد الصمد" },
  ],
  "محمد صديق المنشاوي": [
    { id: "", category: "محمد صديق المنشاوي" },
  ],
  "ماهر المعيقلي": [
    { id: "", category: "ماهر المعيقلي" },
  ],
  "سعد الغامدي": [
    { id: "", category: "سعد الغامدي" },
  ],
  "أحمد العجمي": [
    { id: "", category: "أحمد العجمي" },
  ],
  "عبد الرحمن السديس": [
    { id: "", category: "عبد الرحمن السديس" },
  ],
  "فارس عباد": [
    { id: "", category: "فارس عباد" },
  ],
  "هاني الرفاعي": [
    { id: "", category: "هاني الرفاعي" },
  ],
};

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
];

// دمج الكل
DATA_RAW.الكل = CATEGORIES.flatMap(cat => DATA_RAW[cat] || []);

// ===== CLEAN VIDEO ID =====
// يزيل أي بارامترات زائدة مثل &list=... أو ?si=... ويبقي الـ ID النظيف فقط
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

  if (!cleanId) {
    console.warn("❌ ID فاضي تم تجاهله");
    return null;
  }

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

  const validVideos = videos.filter(v => {
    if (!cleanVideoId(v.id)) {
      console.warn("❌ فيديو بدون ID:", v);
      return false;
    }
    return true;
  });

  const missing = validVideos.filter(v => !cache[cleanVideoId(v.id)]);

  const BATCH = 6;
  for (let i = 0; i < missing.length; i += BATCH) {
    await Promise.all(
      missing.slice(i, i + BATCH).map(v => fetchVideoTitle(v.id))
    );
  }

  const updated = getTitleCache();

  return videos.map(v => ({
    ...v,
    id: cleanVideoId(v.id),
    title: updated[cleanVideoId(v.id)] || v.title || cleanVideoId(v.id)
  }));
}

// ===== DATA =====
const DATA = { الكل: [] };

CATEGORIES.forEach(cat => {
  DATA[cat] = (DATA_RAW[cat] || [])
    .filter(v => cleanVideoId(v.id) !== "")
    .map(v => ({
      ...v,
      id: cleanVideoId(v.id),
      title: getTitleCache()[cleanVideoId(v.id)] || "جاري التحميل..."
    }));
});

DATA.الكل = CATEGORIES.flatMap(cat => DATA[cat]);

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