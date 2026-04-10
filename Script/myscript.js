document.addEventListener("DOMContentLoaded", () => {
  
  // دالة لتمرير الصفحة إلى الأعلى
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // حركة ناعمة، يمكنك إزالتها إن أردت فورياً
    });
  };

  // دالة لفتح القائمة مع التمرير للأعلى
  const openMenuWithScroll = (menu) => {
    // إغلاق القوائم الأخرى أولاً
    document.querySelectorAll(".menu").forEach(m => {
      if (m !== menu) m.classList.remove("active");
    });

    // فتح القائمة
    menu.classList.add("active");

    // التمرير إلى أعلى الصفحة
    scrollToTop();
  };

  // دالة ربط الأحداث بعناصر toggle
  const bindToggleEvents = () => {
    document.querySelectorAll(".toggle").forEach(button => {
      // تجنب ربط الحدث أكثر من مرة
      if (button.hasAttribute('data-listener-bound')) return;
      button.setAttribute('data-listener-bound', 'true');

      const toggleMenu = (e) => {
        e.stopPropagation();
        let menu = button.nextElementSibling;

        if (menu && menu.classList.contains('menu')) {
          // إذا كانت القائمة مغلقة، نفتحها مع التمرير للأعلى
          if (!menu.classList.contains('active')) {
            openMenuWithScroll(menu);
          } else {
            // إذا كانت مفتوحة، نغلقها فقط
            menu.classList.remove("active");
          }
        }
      };

      button.addEventListener("click", toggleMenu);
    });
  };

  // ربط الأحداث بالعناصر الحالية والمستقبلية
  const observeDynamicMenus = () => {
    // ربط العناصر الحالية
    bindToggleEvents();

    // مراقبة الإضافات الجديدة في DOM
    const observer = new MutationObserver(() => {
      bindToggleEvents();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // بدء المراقبة وربط الأحداث
  observeDynamicMenus();

  // إغلاق القائمة باللمس خارجها
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.addEventListener("touchstart", (e) => {
      if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
        document.querySelectorAll(".menu").forEach(menu => {
          menu.classList.remove("active");
        });
      }
    });
  }

  // إغلاق القائمة بالضغط على الكمبيوتر
  document.addEventListener("mousedown", (e) => {
    if (!e.target.closest('.toggle') && !e.target.closest('.menu')) {
      document.querySelectorAll(".menu").forEach(menu => {
        menu.classList.remove("active");
      });
    }
  });

  // عند النقر على رابط داخل القائمة، أغلق القائمة
  const bindLinkEvents = () => {
    document.querySelectorAll(".menu a").forEach(link => {
      if (link.hasAttribute('data-link-bound')) return;
      link.setAttribute('data-link-bound', 'true');

      link.addEventListener("click", (e) => {
        const menu = link.closest('.menu');
        if (menu) menu.classList.remove("active");
      });

      link.addEventListener("touchstart", (e) => {
        e.stopPropagation();
      });
    });
  };

  // ربط أحداث الروابط مع المراقبة الديناميكية
  bindLinkEvents();
  const linkObserver = new MutationObserver(() => {
    bindLinkEvents();
  });
  linkObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

});