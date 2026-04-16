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
      bottom: 30px;
      right: 30px;
      background: #74abff;
      color: #454a58;
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      box-shadow: 0 5px 15px rgb(9 18 46 / 20%);
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
      transition: all 0.3s ease;
      z-index: 9999;
    }

    #scrollTopBtn.show {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      border: solid 1px #177ccb33;
      background-color: #dae6ed !important;
      color: rgb(21, 137, 245);
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
