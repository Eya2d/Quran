document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('search-input');
  const resultsDiv  = document.getElementById('results-div');
  const resultsGrid = document.getElementById('results-grid');
  const historyGrid = document.getElementById('history-grid');
  const filterDiv   = document.getElementById('filter-div');
  const searchContainer = document.querySelector('.searsh');
  const deleteHistoryBtn = document.getElementById('delete-history');

  let activeFilter = 'الكل';

  // Function to update placeholder based on active filter
  function updatePlaceholder() {
    if (activeFilter === 'الكل') {
      searchInput.placeholder = 'إبحث بالنص او بالقسم...';
    } else {
      searchInput.placeholder = `إبحث في قسم ${activeFilter}...`;
    }
  }

  // ===== بناء قائمة الفلتر ديناميكيًا =====
  filterDiv.innerHTML = `<a data-cat="الكل" class="coco">الكل</a>`;
  CATEGORIES.forEach(cat => {
    const a = document.createElement('a');
    a.dataset.cat = cat;
    a.textContent = cat;
    filterDiv.appendChild(a);
  });

  // ===== نسخ البيانات محليًا =====
  let localData = { الكل: [...DATA.الكل] };
  CATEGORIES.forEach(cat => { localData[cat] = [...(DATA[cat] || [])]; });

  // ===== RENDER HISTORY =====
  function renderHistory() {
    const history = getWatchHistory();
    if (!history.length) {
      historyGrid.innerHTML = '<p class="empty-history">لم تشاهد أي فيديو بعد</p>';
      return;
    }
    historyGrid.innerHTML = history.map(v => {
      const safeV = JSON.stringify(v).replace(/"/g, '&quot;');
      const thumb = getYoutubeThumbnail(v.id);
      const cat   = encodeURIComponent(v.category);
      const ago   = timeAgo(v.watchedAt);
      return `
        <a class="cooo x-btn" href="watch.html?id=${v.id}&cat=${cat}"
           onclick="addToWatchHistory(${safeV})">
          <imga><img src="${thumb}" alt="${v.title}" loading="lazy" /></imga>
          <div class="history-card-info">
            <div class="history-card-title">${v.title}</div>
            <span class="history-time">${ago}</span>
          </div>
        </a>`;
    }).join('');
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
  function doSearch(q) {
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

    const pool = activeFilter === 'الكل' ? localData.الكل : (localData[activeFilter] || []);
    const results = pool.filter(v =>
      v.title.includes(q) || v.category.includes(q)
    ).slice(0, 10);

    if (!results.length) {
      resultsGrid.innerHTML = '<p class="no-results">لا توجد نتائج مطابقة</p>';
      return;
    }

    resultsGrid.innerHTML = results.map(v => {
      const safeV = JSON.stringify(v).replace(/"/g, '&quot;');
      const cat   = encodeURIComponent(v.category);
      return `
        <a class="coopp" href="watch.html?id=${v.id}&cat=${cat}"
           onclick="addToWatchHistory(${safeV})">
          <imga><img src="${getYoutubeThumbnail(v.id)}" alt="${v.title}" loading="lazy" /></imga>
          <div class="vid-card-info">
            <div class="vid-card-title">${v.title}</div>
            <div class="vid-card-cat">${v.category}</div>
          </div>
        </a>`;
    }).join('');
  }

  searchInput.addEventListener('input', () => doSearch(searchInput.value));

  // ===== FILTER ANCHORS (ديناميكي) =====
  filterDiv.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cat]');
    if (!a) return;
    e.preventDefault();

    filterDiv.querySelectorAll('a[data-cat]').forEach(b => b.classList.remove('coco'));
    a.classList.add('coco');

    activeFilter = a.dataset.cat;
    
    // Update placeholder when filter changes
    updatePlaceholder();
    
    doSearch(searchInput.value);
  });

  // ===== INIT =====
  renderHistory();
  
  // Set initial placeholder
  updatePlaceholder();

  enrichVideos(DATA.الكل).then(enriched => {
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
let dragDistance = 0; // ✅ جديد

// بداية السحب
container.addEventListener('touchstart', startDrag);
container.addEventListener('mousedown', startDrag);

// أثناء السحب
window.addEventListener('touchmove', moveDrag);
window.addEventListener('mousemove', moveDrag);

// نهاية السحب
window.addEventListener('touchend', endDrag);
window.addEventListener('mouseup', endDrag);
window.addEventListener('mouseleave', endDrag);

// منع فتح الرابط بعد السحب
document.addEventListener('click', function (e) {
  const link = e.target.closest('a, .cooo.x-btn');
  if (!link) return;

  if (blockNextClick) {
    e.preventDefault();
    e.stopPropagation();
    blockNextClick = false;
  }
}, true);

// =========================

function startDrag(e) {
  if (e.button === 2) return;

  isDown = true;
  hasMoved = false;
  isDragging = false;
  dragDistance = 0; // ✅ تصفير

  isTouchDevice = e.type === 'touchstart';

  if (e.touches) {
    startX = e.touches[0].pageX - container.offsetLeft;
  } else {
    startX = e.pageX - container.offsetLeft;
    e.preventDefault();
  }

  scrollLeft = container.scrollLeft;
  dragDirection = null;

  container.style.cursor = 'grabbing';
  document.body.style.userSelect = 'none';
}

// =========================

function moveDrag(e) {
  if (!isDown) return;

  let currentX;
  if (e.touches) {
    currentX = e.touches[0].pageX - container.offsetLeft;
  } else {
    currentX = e.pageX - container.offsetLeft;
  }

  const walk = (currentX - startX) * 1.2;

  // ✅ حساب المسافة الفعلية للسحب
  dragDistance = Math.abs(currentX - startX);

  if (dragDistance > 5) {
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

  if (hasMoved || isDragging) {
    blockNextClick = true;
  }

  // ✅ نسبة 30%
  const threshold = container.offsetWidth * 0.3;

  if (isTouchDevice || e.type === 'touchend') {
    setTimeout(() => {

      if (dragDistance > threshold) {
        snapToNext(); // 🔥 جديد
      } else {
        snapToClosest();
      }

      setTimeout(() => {
        hasMoved = false;
        isDragging = false;
      }, 300);

    }, 10);
  } else {
    setTimeout(() => {
      hasMoved = false;
      isDragging = false;
    }, 100);
  }
}

// =========================

// 🔥 الانتقال للعنصر التالي حسب الاتجاه
function snapToNext() {
  const items = Array.from(container.querySelectorAll('.cooo.x-btn'));
  if (items.length === 0) return;

  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.left + (containerRect.width / 2);

  let currentIndex = 0;
  let minDistance = Infinity;

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(center - containerCenter);
    if (dist < minDistance) {
      minDistance = dist;
      currentIndex = index;
    }
  });

  let targetIndex = currentIndex;

  if (dragDirection === 'left') {
    targetIndex = Math.min(currentIndex + 1, items.length - 1);
  } else if (dragDirection === 'right') {
    targetIndex = Math.max(currentIndex - 1, 0);
  }

  scrollToItem(items[targetIndex]);
}

// =========================

// نفس القديمة
function snapToClosest() {
  const items = Array.from(container.querySelectorAll('.cooo.x-btn'));
  if (items.length === 0) return;

  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.left + (containerRect.width / 2);

  let targetItem = null;
  let minDistance = Infinity;

  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const dist = Math.abs(center - containerCenter);
    if (dist < minDistance) {
      minDistance = dist;
      targetItem = item;
    }
  });

  if (targetItem) scrollToItem(targetItem);
}

// =========================

// دالة التمرير الموحدة
function scrollToItem(item) {
  const rect = item.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const itemCenter = rect.left + rect.width / 2;
  const containerCenter = containerRect.left + containerRect.width / 2;

  const offset = container.scrollLeft + (itemCenter - containerCenter);

  container.scrollTo({
    left: offset,
    behavior: 'smooth'
  });
}

// =========================

let lastScrollLeft = 0;
container.addEventListener('scroll', () => {
  if (isDown && isTouchDevice) {
    const currentScrollLeft = container.scrollLeft;
    if (currentScrollLeft > lastScrollLeft) dragDirection = 'right';
    else if (currentScrollLeft < lastScrollLeft) dragDirection = 'left';
    lastScrollLeft = currentScrollLeft;
  }
});

// =========================

// منع سحب الصور
container.addEventListener('dragstart', (e) => {
  if (isDown || hasMoved || isDragging) {
    e.preventDefault();
    return false;
  }
});

container.style.cursor = 'grab';

// منع كليك يمين أثناء السحب
container.addEventListener('contextmenu', (e) => {
  if (isDown || isDragging) {
    e.preventDefault();
    return false;
  }
});
