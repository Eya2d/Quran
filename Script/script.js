document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('search-input');
  const resultsDiv  = document.getElementById('results-div');
  const resultsGrid = document.getElementById('results-grid');
  const historyGrid = document.getElementById('history-grid');
  const filterDiv   = document.getElementById('filter-div');
  const searchContainer = document.querySelector('.searsh');
  const deleteHistoryBtn = document.getElementById('delete-history');

  let activeFilter = 'الكل';

  // ===== دالة التخليط العشوائي =====
  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Function to update placeholder based on active filter
  function updatePlaceholder() {
    if (activeFilter === 'الكل') {
      searchInput.placeholder = 'إبحث بالنص او بالقسم...';
    } else {
      searchInput.placeholder = `إبحث في قسم ${activeFilter}...`;
    }
  }

  // ===== بناء قائمة الفلتر ديناميكيًا =====
  filterDiv.innerHTML = `<div data-cat="الكل" class="coco">الكل</div>`;
  CATEGORIES.forEach(cat => {
    const div = document.createElement('div');
    div.dataset.cat = cat;
    div.textContent = cat;
    filterDiv.appendChild(div);
  });

  // ===== localData — يُحمَّل lazy عند أول تفاعل مع البحث =====
  let localData = null;
  let dataReady = false;
  let enrichDone = false;

  async function ensureData() {
    if (dataReady) return;
    const all = await getCategoryData('الكل');
    localData = { الكل: [...all] };
    CATEGORIES.forEach(cat => {
      localData[cat] = all.filter(v => v.category === cat);
    });
    dataReady = true;

    if (!enrichDone) {
      enrichDone = true;
      enrichVideos(localData.الكل).then(enriched => {
        localData.الكل = enriched;
        enriched.forEach(v => {
          CATEGORIES.forEach(cat => {
            if (!localData[cat]) return;
            const idx = localData[cat].findIndex(d => d.id === v.id);
            if (idx !== -1) localData[cat][idx].title = v.title;
          });
        });
        if (searchInput.value.trim()) doSearch(searchInput.value);
      });
    }
  }

  // ===== PRE-LOAD عند أول لمس/focus لصندوق البحث =====
  // إذا لم تكن البيانات جاهزة: يظهر "جاري التحميل..." ويُمنع الفوكس حتى ينتهي التحميل
  let _loadingForFocus = false;

  async function handleSearchFocus(e) {
    if (dataReady) return; // البيانات جاهزة، لا حاجة لشيء

    // منع الفوكس الفعلي على الخانة
    e.preventDefault();
    searchInput.blur();

    if (_loadingForFocus) return; // تحميل جارٍ بالفعل
    _loadingForFocus = true;

    // إظهار div النتائج بكلمة "جاري التحميل..."
    resultsDiv.classList.add('active');
    resultsGrid.innerHTML = '<p class="no-results direction" style="opacity:.5">جاري تحميل البيانات...</p>';

    // تعطيل الخانة بصرياً أثناء التحميل
    searchInput.disabled = true;
    searchInput.style.opacity = '0.5';
    searchInput.style.cursor = 'wait';

    await ensureData();

    // إعادة تفعيل الخانة بعد اكتمال التحميل
    searchInput.disabled = false;
    searchInput.style.opacity = '';
    searchInput.style.cursor = '';
    _loadingForFocus = false;

    // إخفاء "جاري التحميل..." إذا لم يكن هناك نص
    if (!searchInput.value.trim()) {
      resultsDiv.classList.remove('active');
      resultsGrid.innerHTML = '';
    }

    // تفعيل الفوكس تلقائياً بعد انتهاء التحميل
    searchInput.focus();
  }

  searchInput.addEventListener('mousedown', handleSearchFocus);
  searchInput.addEventListener('touchstart', handleSearchFocus, { passive: false });

  // ===== RENDER HISTORY =====
  function renderHistory() {
    const history = getWatchHistory();
    if (!history.length) {
      historyGrid.innerHTML = '<p class="empty-history">لم تشاهد أي فيديو بعد</p>';
      return;
    }

    // أولاً: اعرض العناوين المتاحة (cache أو المخزّنة)
    const cache = getTitleCache();
    history.forEach(v => {
      const cleanId = cleanVideoId(v.id);
      if (cache[cleanId]) v.title = cache[cleanId];
    });

    historyGrid.innerHTML = history.map(v => {
      const cleanId = cleanVideoId(v.id);
      const safeV = JSON.stringify(v).replace(/"/g, '&quot;');
      const thumb = getYoutubeThumbnail(cleanId);
      const cat   = encodeURIComponent(v.category);
      const ago   = timeAgo(v.watchedAt);
      return `
        <div class="cooo x-btn" tabindex="0" id="hist-${cleanId}" onclick="addToWatchHistory(${safeV}); window.location.href='watch.html?id=${cleanId}&cat=${cat}'">
          <imga><img src="${thumb}" alt="${v.title}" loading="lazy" /></imga>
          <div class="history-card-info">
            <div class="history-card-title" id="hist-title-${cleanId}">${v.title}</div>
            <span class="history-time">${ago}</span>
          </div>
        </div>`;
    }).join('');

    // ثانياً: جلب العناوين الناقصة من oEmbed وتحديث الـ DOM
    const missing = history.filter(v => !cache[cleanVideoId(v.id)]);
    if (missing.length) {
      enrichVideos(missing).then(enriched => {
        enriched.forEach(v => {
          const el = document.getElementById('hist-title-' + v.id);
          if (el && v.title && v.title !== v.id) {
            el.textContent = v.title;
            // تحديث watchHistory بالعنوان الصحيح
            updateWatchHistoryTitle(v.id, v.title);
          }
        });
      });
    }
  }

  // ===== CLEAR HISTORY =====
  deleteHistoryBtn.addEventListener('click', () => {
    const history = getWatchHistory();
    if (!history.length) return;

    const confirmed = confirm('هل تريد حذف سجل المشاهدة؟');
    if (!confirmed) return;

    localStorage.removeItem('watchHistory');
    historyGrid.innerHTML = '<p class="empty-history">لم تشاهد أي فيديو بعد</p>';
  });

  // ===== HIDE SEARCH ON OUTSIDE CLICK =====
  document.addEventListener('click', (e) => {
    if (searchContainer && !searchContainer.contains(e.target)) {
      resultsDiv.classList.remove('active');
      resultsGrid.innerHTML = '';
    }
  });

  // ===== SEARCH =====
  async function doSearch(q) {
    q = q.trim();
    if (!q) {
      resultsDiv.classList.remove('active');
      resultsGrid.innerHTML = '';
      return;
    }
    resultsDiv.classList.add('active');

    const catMatch = CATEGORIES.find(k => k === q);
    if (catMatch && activeFilter === 'الكل') {
      window.location.href = `section.html?cat=${encodeURIComponent(catMatch)}`;
      return;
    }

    if (!dataReady) {
      resultsGrid.innerHTML = '<p class="no-results direction" style="opacity:.5">جاري التحميل...</p>';
      await ensureData();
      if (searchInput.value.trim() !== q) return;
    }

    const pool = activeFilter === 'الكل' ? localData.الكل : (localData[activeFilter] || []);

    const matched = pool.filter(v =>
      v.title.includes(q) || v.category.includes(q)
    );

    const results = shuffleArray(matched).slice(0, 10);

    if (!results.length) {
      resultsGrid.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة</p>';
      return;
    }

    // استبدال <a href> بـ <div onclick> في نتائج البحث
    resultsGrid.innerHTML = results.map(v => {
      const safeV = JSON.stringify(v).replace(/"/g, '&quot;');
      const cat   = encodeURIComponent(v.category);
      return `
        <div class="coopp" tabindex="0" onclick="addToWatchHistory(${safeV}); window.location.href='watch.html?id=${v.id}&cat=${cat}'">
          <imga><img src="${getYoutubeThumbnail(v.id)}" alt="${v.title}" loading="lazy" /></imga>
          <div class="vid-card-info">
            <div class="vid-card-title">${v.title}</div>
            <div class="vid-card-cat">${v.category}</div>
          </div>
        </div>`;
    }).join('');
  }

  searchInput.addEventListener('input', () => doSearch(searchInput.value));

  // ===== FILTER ANCHORS (ديناميكي) =====
  filterDiv.addEventListener('click', (e) => {
    const div = e.target.closest('div[data-cat]');
    if (!div) return;
  
    filterDiv.querySelectorAll('div[data-cat]').forEach(b => b.classList.remove('coco'));
    div.classList.add('coco');
  
    activeFilter = div.dataset.cat;
    
    updatePlaceholder();
    
    doSearch(searchInput.value);
  });

  // ===== INIT =====
  renderHistory();
  updatePlaceholder();
});


// --------------------------------------------------------------------------------------------

const container = document.querySelector('.scroll-container');

let isDown = false;
let startX;
let scrollLeft;
let dragDirection = null;
let isTouchDevice = false;
let hasMoved = false;
let isDragging = false;
let blockNextClick = false;

let velocity = 0;
let lastX = 0;
let lastTime = 0;

container.addEventListener('touchstart', startDrag, { passive: true });
container.addEventListener('mousedown', startDrag);

window.addEventListener('touchmove', moveDrag, { passive: false });
window.addEventListener('mousemove', moveDrag);

window.addEventListener('touchend', endDrag);
window.addEventListener('mouseup', endDrag);
window.addEventListener('mouseleave', endDrag);

// =========================
// ✅ إصلاح مشكلة double click
document.addEventListener('click', function (e) {
  const link = e.target.closest('.cooo.x-btn');
  if (!link) return;

  if (!blockNextClick) return;

  blockNextClick = false;

  e.preventDefault();
  e.stopPropagation();
}, true);

// =========================

function startDrag(e) {
  if (e.button === 2) return;

  isDown = true;
  hasMoved = false;
  isDragging = false;

  isTouchDevice = e.type === 'touchstart';

  const x = e.touches ? e.touches[0].pageX : e.pageX;

  startX = x - container.offsetLeft;
  lastX = x;
  lastTime = performance.now();

  scrollLeft = container.scrollLeft;
  dragDirection = null;

  velocity = 0;

  container.style.cursor = 'grabbing';
  document.body.style.userSelect = 'none';
}

// =========================

function moveDrag(e) {
  if (!isDown) return;

  const x = e.touches ? e.touches[0].pageX : e.pageX;

  const currentX = x - container.offsetLeft;
  const walk = (currentX - startX);

  const now = performance.now();
  const dt = now - lastTime;

  if (dt > 0) {
    velocity = (x - lastX) / dt;
    lastTime = now;
    lastX = x;
  }

  if (Math.abs(walk) > 3) {
    hasMoved = true;
    isDragging = true;
  }

  if (walk > 2) dragDirection = 'right';
  else if (walk < -2) dragDirection = 'left';

  if (e.cancelable) e.preventDefault();

  container.scrollLeft = scrollLeft - walk;
}

// =========================

function endDrag(e) {
  if (!isDown) return;

  isDown = false;

  container.style.cursor = 'grab';
  document.body.style.userSelect = '';

  // =========================
  // ✅ منع click فقط إذا كان سحب حقيقي
  if (hasMoved && Math.abs(scrollLeft - container.scrollLeft) > 5) {
    blockNextClick = true;

    // ⏱️ مهم: إعادة التفعيل بسرعة لتجنب تعطيل الروابط
    setTimeout(() => {
      blockNextClick = false;
    }, 200);
  }

  // =========================
  // Snap فقط في اللمس
  if (isTouchDevice) {
    requestAnimationFrame(() => {
      snapToClosestImproved();
    });
  }

  setTimeout(() => {
    hasMoved = false;
    isDragging = false;
  }, 150);
}

// =========================
// SNAP
function snapToClosestImproved() {
  const items = Array.from(container.querySelectorAll('.cooo.x-btn'));
  if (!items.length) return;

  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.left + containerRect.width / 2;

  let closestItem = null;
  let closestDistance = Infinity;

  for (const item of items) {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;

    const distance = Math.abs(itemCenter - containerCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  }

  if (!closestItem) return;

  const rect = closestItem.getBoundingClientRect();
  const itemCenter = rect.left + rect.width / 2;

  const offset = itemCenter - containerCenter;
  const targetScroll = container.scrollLeft + offset;

  smoothScrollTo(container, targetScroll, 500);
}

// =========================

function smoothScrollTo(el, target, duration = 400) {
  const start = el.scrollLeft;
  const change = target - start;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const ease = 1 - Math.pow(1 - progress, 3);

    el.scrollLeft = start + change * ease;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

// =========================

let lastScrollLeft = 0;

container.addEventListener('scroll', () => {
  if (isDown && isTouchDevice) {
    const current = container.scrollLeft;

    if (current > lastScrollLeft) dragDirection = 'right';
    else if (current < lastScrollLeft) dragDirection = 'left';

    lastScrollLeft = current;
  }
});

// =========================

container.addEventListener('dragstart', (e) => {
  if (isDown || hasMoved || isDragging) {
    e.preventDefault();
    return false;
  }
});

container.style.cursor = 'grab';

container.addEventListener('contextmenu', (e) => {
  if (isDown || isDragging) {
    e.preventDefault();
    return false;
  }
});
