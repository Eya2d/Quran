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

container.addEventListener('touchstart', startDrag);
container.addEventListener('mousedown', startDrag);

window.addEventListener('touchmove', moveDrag);
window.addEventListener('mousemove', moveDrag);

window.addEventListener('touchend', endDrag);
window.addEventListener('mouseup', endDrag);
window.addEventListener('mouseleave', endDrag);

document.addEventListener('click', function (e) {
  const link = e.target.closest('a, .cooo.x-btn');
  if (!link) return;

  if (blockNextClick) {
    e.preventDefault();
    e.stopPropagation();
    blockNextClick = false;
  }
}, true);

function startDrag(e) {
  if (e.button === 2) return;

  isDown = true;
  hasMoved = false;
  isDragging = false;

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

function moveDrag(e) {
  if (!isDown) return;

  let currentX;
  if (e.touches) {
    currentX = e.touches[0].pageX - container.offsetLeft;
  } else {
    currentX = e.pageX - container.offsetLeft;
  }

  const walk = (currentX - startX) * 1.2;

  if (Math.abs(walk) > 5) {
    hasMoved = true;
    isDragging = true;
  }

  if (walk > 2) dragDirection = 'right';
  else if (walk < -2) dragDirection = 'left';

  if (e.cancelable) e.preventDefault();

  container.scrollLeft = scrollLeft - walk;
}

function endDrag(e) {
  if (!isDown) return;

  isDown = false;

  container.style.cursor = 'grab';
  document.body.style.userSelect = '';

  if (hasMoved || isDragging) {
    blockNextClick = true;
  }

  if (isTouchDevice || e.type === 'touchend') {
    setTimeout(() => {
      snapToClosest();

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

function snapToClosest() {
  const items = Array.from(container.querySelectorAll('.cooo.x-btn'));
  if (items.length === 0) return;

  const containerStyle = getComputedStyle(container);
  const containerPaddingLeft = parseFloat(containerStyle.paddingLeft);
  const containerPaddingRight = parseFloat(containerStyle.paddingRight);

  const containerRect = container.getBoundingClientRect();
  const containerCenter = containerRect.left + (containerRect.width / 2);

  let targetItem = null;

  if (dragDirection === 'left') {
    let minLeftDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.left - (containerRect.left + containerPaddingLeft));
      if (distance < minLeftDistance) {
        minLeftDistance = distance;
        targetItem = item;
      }
    });
  } else if (dragDirection === 'right') {
    let minRightDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.right - (containerRect.right - containerPaddingRight));
      if (distance < minRightDistance) {
        minRightDistance = distance;
        targetItem = item;
      }
    });
  } else {
    let minCenterDistance = Infinity;
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + (rect.width / 2);
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < minCenterDistance) {
        minCenterDistance = distance;
        targetItem = item;
      }
    });
  }

  if (targetItem) {
    const targetRect = targetItem.getBoundingClientRect();
    const itemIndex = items.indexOf(targetItem);
    const isFirst = itemIndex === 0;
    const isLast = itemIndex === items.length - 1;

    let scrollOffset;

    if (isFirst) {
      scrollOffset = container.scrollLeft + (targetRect.left - containerRect.left) - containerPaddingLeft;
    } else if (isLast) {
      scrollOffset = container.scrollLeft + (targetRect.right - containerRect.right) + containerPaddingRight;
    } else {
      const targetCenter = targetRect.left + (targetRect.width / 2);
      const containerCenterOffset = containerRect.left + (containerRect.width / 2);
      scrollOffset = container.scrollLeft + (targetCenter - containerCenterOffset);
    }

    container.scrollTo({
      left: scrollOffset,
      behavior: 'smooth'
    });
  }
}

let lastScrollLeft = 0;
container.addEventListener('scroll', () => {
  if (isDown && isTouchDevice) {
    const currentScrollLeft = container.scrollLeft;
    if (currentScrollLeft > lastScrollLeft) dragDirection = 'right';
    else if (currentScrollLeft < lastScrollLeft) dragDirection = 'left';
    lastScrollLeft = currentScrollLeft;
  }
});

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
