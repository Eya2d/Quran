document.addEventListener("DOMContentLoaded", () => {
  
  // دالة لتمرير الصفحة إلى الأعلى
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // دالة لفتح القائمة مع التمرير للأعلى
  const openMenuWithScroll = (menu) => {
    document.querySelectorAll(".menu").forEach(m => {
      if (m !== menu) m.classList.remove("active");
    });

    menu.classList.add("active");
    scrollToTop();
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
          }
        }
      };

      button.addEventListener("click", toggleMenu);
    });
  };

  // مراقبة العناصر الجديدة
  const observeDynamicMenus = () => {
    bindToggleEvents();

    const observer = new MutationObserver(() => {
      bindToggleEvents();
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
        });
      }
    });
  }

  // إغلاق القائمة عند الضغط خارجها (كمبيوتر)
  document.addEventListener("mousedown", (e) => {
    if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
      document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
      });
    }
  });

  // ⭐ التعديل هنا: إغلاق القائمة عند الضغط على أي عنصر داخلها
  const bindMenuItemEvents = () => {
    document.querySelectorAll(".menu *").forEach(item => {
      if (item.hasAttribute('data-item-bound')) return;
      item.setAttribute('data-item-bound', 'true');

      item.addEventListener("click", (e) => {
        const menu = item.closest('.menu');
        if (menu) menu.classList.remove("active");
      });

      item.addEventListener("touchstart", (e) => {
        e.stopPropagation();
      });
    });
  };

  bindMenuItemEvents();

  const itemObserver = new MutationObserver(() => {
    bindMenuItemEvents();
  });

  itemObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

});
