document.addEventListener("DOMContentLoaded", function () {
  const tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length === 0) return;

  let lastActive = null;

  const onScroll = () => {
    const midpoint = window.scrollY + window.innerHeight / 2;

    tocLinks.forEach(link => {
      const id = link.getAttribute("href").split("#")[1];
      const section = document.getElementById(id);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;

      if (top <= midpoint && bottom > midpoint) {
        if (lastActive) lastActive.classList.remove("active");
        link.classList.add("active");
        lastActive = link;
      }
    });
  };

  window.addEventListener("scroll", onScroll);
  onScroll();
});