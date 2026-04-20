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
  
  const startCounting = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
  
    const update = () => {
      const increment = target / 100;
    
      if (count < target) {
        count += increment;
        counter.innerText = Math.floor(count);
        requestAnimationFrame(update);
      } else {
        counter.innerText = target;
      }
    };
  
    update();
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target); // يمنع التكرار
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
});
