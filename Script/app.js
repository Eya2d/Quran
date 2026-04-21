document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("a").forEach(link => {

    link.addEventListener("dragstart", e => e.preventDefault());

    link.addEventListener("contextmenu", e => e.preventDefault());

    link.addEventListener("mousedown", e => {
      if (e.button === 0) e.preventDefault(); // زر الماوس
    });

  });

});


document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  });

});


document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("contextmenu", (e) => {
    
    // إذا العنصر رابط <a>
    if (e.target.closest("a")) {
      e.preventDefault();
    }

  });

});








(function () {

  // إنشاء الزر
  const btn = document.createElement("button");
  btn.id = "scrollTopBtn";
  btn.innerHTML = '<ion-icon name="chevron-up-outline"></ion-icon>';
  document.body.appendChild(btn);

  // إنشاء الستايل داخل السكربت
  const style = document.createElement("style");
  style.innerHTML = `
    #scrollTopBtn {
      position: fixed;
      bottom: 40px;
      right: 40px;
      background: #fff;
      color: rgb(21, 137, 245);
      border: solid 1px #177ccb33;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      box-shadow: 0 5px 15px rgb(9 18 46 / 20%);
      opacity: 0;
      transform: translateX(20px);
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 9999;
    }

    #scrollTopBtn.show {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
  `;
  document.head.appendChild(style);

  // إظهار / إخفاء الزر
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  // عند الضغط
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

})();









document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.count');

  const formatNumber = (num) => {
    return Math.floor(num).toLocaleString(); // ✅ إضافة الفواصل
  };

  const startCounting = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;

    const update = () => {
      const increment = target / 100;

      if (count < target) {
        count += increment;
        counter.innerText = formatNumber(count); // ✅ استخدام التنسيق
        requestAnimationFrame(update);
      } else {
        counter.innerText = formatNumber(target); // ✅ النهاية
      }
    };

    update();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });
});


document.addEventListener("contextmenu", function(e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});









document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

  const STORAGE_KEY = "site-theme";

  // ✅ تطبيق الوضع المحفوظ
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme === "dark-mode") {
    body.classList.add("dark-mode");
  }

  // ✅ تحديث الأيقونة
  const updateIcon = () => {
    if (!icon) return;

    if (body.classList.contains("dark-mode")) {
      icon.setAttribute("name", "sunny-outline"); // شمس
    } else {
      icon.setAttribute("name", "moon-outline"); // قمر
    }
  };

  updateIcon();

  // ✅ أنيميشن
  const animateIcon = () => {
    if (!icon) return;

    icon.classList.add("icon-pop");
    setTimeout(() => {
      icon.classList.remove("icon-pop");
    }, 300);
  };

  // ✅ تبديل الوضع
  const toggleTheme = () => {

    if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      localStorage.setItem(STORAGE_KEY, "light-mode");
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem(STORAGE_KEY, "dark-mode");
    }

    updateIcon();
    animateIcon();
  };

  // ✅ تشغيل فقط لو الزر موجود
  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleTheme);
  }

});
