document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('search-input');
  const resultsDiv  = document.getElementById('results-div');
  const resultsGrid = document.getElementById('results-grid');
  const historyGrid = document.getElementById('history-grid');
  const filterDiv   = document.getElementById('filter-div');
  const searchContainer = document.querySelector('.searsh');
  const deleteHistoryBtn = document.getElementById('delete-history');

  let activeFilter = 'الكل';
  let isLoadingData = false; // لمنع التحميل المتكرر

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

  // ===== نسخ البيانات محليًا (فارغة في البداية) =====
  let localData = { الكل: [] };
  CATEGORIES.forEach(cat => { localData[cat] = []; });

  // ===== دالة لتحميل البيانات عند الحاجة =====
  async function ensureDataLoaded(category) {
    if (isLoadingData) return false;
    
    // إذا كانت البيانات موجودة بالفعل
    if (localData[category] && localData[category].length > 0) {
      return true;
    }
    
    isLoadingData = true;
    
    try {
      // عرض رسالة تحميل
      if (category === 'الكل') {
        resultsGrid.innerHTML = '<p class="no-results">جاري تحميل جميع البيانات...</p>';
      } else {
        resultsGrid.innerHTML = `<p class="no-results">جاري تحميل قسم ${category}...</p>`;
      }
      resultsDiv.classList.add('active');
      
      // تحميل البيانات من Proxy (Lazy Loading)
      const data = DATA[category];
      
      if (data && data.length > 0) {
        localData[category] = [...data];
        
        // إذا كان التحميل للكل، قم بتحديث باقي الأقسام أيضًا
        if (category === 'الكل') {
          CATEGORIES.forEach(cat => {
            if (DATA[cat] && DATA[cat].length > 0 && (!localData[cat] || localData[cat].length === 0)) {
              localData[cat] = [...DATA[cat]];
            }
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error);
      return false;
    } finally {
      isLoadingData = false;
    }
  }

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
          <imga><img src="${thumb}" alt="${v.title || 'فيديو'}" loading="lazy" /></imga>
          <div class="history-card-info">
            <div class="history-card-title">${v.title || 'فيديو'}</div>
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
  async function doSearch(q) {
    q = q.trim();
    if (!q) {
      resultsDiv.classList.remove('active');
      resultsGrid.innerHTML = '';
      return;
    }
    
    resultsDiv.classList.add('active');

    // التحقق من مطابقة النص مع اسم قسم (للانتقال المباشر)
    const catMatch = CATEGORIES.find(k => k === q);
    if (catMatch && activeFilter === 'الكل') {
      window.location.href = `section.html?cat=${encodeURIComponent(catMatch)}`;
      return;
    }

    // التأكد من تحميل البيانات قبل البحث
    const dataLoaded = await ensureDataLoaded(activeFilter);
    if (!dataLoaded && activeFilter !== 'الكل') {
      resultsGrid.innerHTML = '<p class="no-results">فشل تحميل البيانات. حاول مرة أخرى.</p>';
      return;
    }
    
    // إذا كان الفلتر "الكل" ولم يتم تحميل البيانات بعد
    if (activeFilter === 'الكل' && (!localData.الكل || localData.الكل.length === 0)) {
      await ensureDataLoaded('الكل');
    }

    const pool = activeFilter === 'الكل' ? localData.الكل : (localData[activeFilter] || []);
    
    if (!pool.length) {
      resultsGrid.innerHTML = '<p class="no-results">لا توجد بيانات متاحة</p>';
      return;
    }
    
    const results = pool.filter(v =>
      v.title && (v.title.includes(q) || v.category.includes(q))
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
          <imga><img src="${getYoutubeThumbnail(v.id)}" alt="${v.title || 'فيديو'}" loading="lazy" /></imga>
          <div class="vid-card-info">
            <div class="vid-card-title">${v.title || 'فيديو'}</div>
            <div class="vid-card-cat">${v.category}</div>
          </div>
        </a>`;
    }).join('');
  }

  // ربط حدث البحث مع تأخير بسيط لتحسين الأداء
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => doSearch(searchInput.value), 300);
  });

  // ===== FILTER ANCHORS (ديناميكي) =====
  filterDiv.addEventListener('click', async (e) => {
    const div = e.target.closest('div[data-cat]');
    if (!div) return;
  
    filterDiv.querySelectorAll('div[data-cat]').forEach(b => b.classList.remove('coco'));
    div.classList.add('coco');
  
    activeFilter = div.dataset.cat;
    updatePlaceholder();
    
    // تحميل بيانات القسم الجديد إذا لزم الأمر
    if (activeFilter !== 'الكل' && (!localData[activeFilter] || localData[activeFilter].length === 0)) {
      resultsGrid.innerHTML = '<p class="no-results">جاري تحميل القسم...</p>';
      resultsDiv.classList.add('active');
      await ensureDataLoaded(activeFilter);
    }
    
    doSearch(searchInput.value);
  });

  // ===== INIT =====
  renderHistory();
  updatePlaceholder();
  
  // تحميل الأقسام ذات الأولوية في الخلفية (بدون إزعاج المستخدم)
  setTimeout(async () => {
    const priorityCats = ["مشاري العفاسي", "عبد الباسط عبد الصمد", "ماهر المعيقلي"];
    for (const cat of priorityCats) {
      if (!localData[cat] || localData[cat].length === 0) {
        const data = DATA[cat];
        if (data && data.length) {
          localData[cat] = [...data];
        }
      }
    }
  }, 1000);
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
let blockNextClick = false; // ✅ جديد

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

// ✅ منع فتح الرابط بعد السحب (نقرة واحدة فقط)
document.addEventListener('click', function (e) {
  const link = e.target.closest('a, .cooo.x-btn');
  if (!link) return;

  if (blockNextClick) {
    e.preventDefault();
    e.stopPropagation();
    blockNextClick = false; // يسمح بالنقرات التالية
  }
}, true);

// =========================

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

  if (Math.abs(walk) > 5) {
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

  // ✅ إذا حصل سحب فعلي → امنع أول نقرة
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

// =========================

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
