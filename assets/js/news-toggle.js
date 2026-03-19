document.addEventListener("DOMContentLoaded", function () {
  var listing = document.getElementById("news-listing");
  var toggle  = document.getElementById("news-toggle");
  if (!listing || !toggle) return;

  toggle.addEventListener("click", function (e) {
    e.preventDefault();
    var collapsed = listing.classList.toggle("news-listing--collapsed");
    toggle.textContent = collapsed ? "See all news ↓" : "Show less ↑";
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });
});