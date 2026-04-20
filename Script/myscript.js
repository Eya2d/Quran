document.addEventListener("DOMContentLoaded", () => {
  
  // تخزين آخر عنصر تم النقر عليه في كل قائمة على حدة
  const lastClickedItems = new Map(); // Key: menu element, Value: last clicked item element

  // دالة للتمرير إلى عنصر معين مع مسافة 5px
  const scrollToElement = (element, menu) => {
    if (!element || !menu) return;

    const elementTop = element.offsetTop;
    const offset = 5;

    menu.scrollTo({
      top: elementTop - offset,
      behavior: "smooth"
    });
  };

  // دالة للتمرير إلى آخر عنصر تم النقر عليه في القائمة
  const scrollToLastClickedItem = (menu) => {
    const lastItem = lastClickedItems.get(menu);
    if (lastItem && menu.contains(lastItem)) {
      scrollToElement(lastItem, menu);
    }
  };

  // دالة لإرجاع الاسكرول للأعلى
  const resetMenuScroll = (menu) => {
    menu.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // دالة لفتح القائمة مع التمرير
  const openMenuWithScroll = (menu) => {
    document.querySelectorAll(".menu").forEach(m => {
      if (m !== menu) {
        m.classList.remove("active");
        resetMenuScroll(m); // ✅ تصفير القوائم الأخرى
      }
    });

    menu.classList.add("active");
    
    const lastItem = lastClickedItems.get(menu);
    if (lastItem && menu.contains(lastItem)) {
      setTimeout(() => {
        scrollToLastClickedItem(menu);
      }, 100);
    } else {
      menu.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  // ربط أزرار التوجل
  const bindToggleEvents = () => {
    document.querySelectorAll(".toggle").forEach(button => {
      if (button.hasAttribute('data-listener-bound')) return;
      button.setAttribute('data-listener-bound', 'true');

      const toggleMenu = (e) => {
        e.stopPropagation();
        let menu = button.nextElementSibling;

        if (menu && menu.classList.contains('menu')) {
          if (!menu.classList.contains('active')) {
            openMenuWithScroll(menu);
          } else {
            menu.classList.remove("active");
            resetMenuScroll(menu); // ✅ عند الإغلاق
          }
        }
      };

      button.addEventListener("click", toggleMenu);
    });
  };

  // ربط أحداث عناصر القائمة
  const bindMenuItemEvents = () => {
    document.querySelectorAll(".menu").forEach(menu => {
      const items = menu.querySelectorAll("*");
      items.forEach(item => {
        if (item.hasAttribute('data-item-bound')) return;
        item.setAttribute('data-item-bound', 'true');

        const handleItemClick = (e) => {
          // تخزين آخر عنصر تم النقر عليه
          lastClickedItems.set(menu, item);
          
          const parentMenu = item.closest('.menu');
          if (parentMenu) {
            parentMenu.classList.remove("active");
            resetMenuScroll(parentMenu); // ✅ تصفير بعد الإغلاق
          }
        };

        item.addEventListener("click", handleItemClick);
        item.addEventListener("touchstart", (e) => {
          e.stopPropagation();
        });
      });
    });
  };

  // مراقبة العناصر الجديدة
  const observeDynamicMenus = () => {
    bindToggleEvents();
    bindMenuItemEvents();

    const observer = new MutationObserver(() => {
      bindToggleEvents();
      bindMenuItemEvents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  observeDynamicMenus();

  // إغلاق القائمة عند الضغط خارجها (موبايل)
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.addEventListener("touchstart", (e) => {
      if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
        document.querySelectorAll(".menu").forEach(menu => {
          menu.classList.remove("active");
          resetMenuScroll(menu); // ✅ مهم
        });
      }
    });
  }

  // إغلاق القائمة عند الضغط خارجها (كمبيوتر)
  document.addEventListener("mousedown", (e) => {
    if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
      document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
        resetMenuScroll(menu); // ✅ مهم
      });
    }
  });

});
