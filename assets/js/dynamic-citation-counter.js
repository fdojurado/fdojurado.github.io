document.addEventListener("DOMContentLoaded", () => {
  const duration = 2000; // total animation time in ms

  // === COUNTER ANIMATION ===
  const counters = [
    { el: document.getElementById("citations"), value: parseInt(document.getElementById("citations")?.innerText || 0, 10) },
    { el: document.getElementById("hindex"), value: parseInt(document.getElementById("hindex")?.innerText || 0, 10) },
    { el: document.getElementById("i10index"), value: parseInt(document.getElementById("i10index")?.innerText || 0, 10) },
    { el: document.getElementById("most-cited"), value: parseInt(document.getElementById("most-cited")?.innerText || 0, 10) },
  ];

  counters.forEach(c => { if (c.el) c.el.innerText = "0"; });

  const startTime = performance.now();
  function animateCounters(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    counters.forEach(({ el, value }) => {
      if (el) el.innerText = Math.floor(value * progress).toLocaleString();
    });
    if (progress < 1) requestAnimationFrame(animateCounters);
  }
  requestAnimationFrame(animateCounters);

  // === MAIN CITATION-GROWTH SVG ANIMATION ===
  const line = document.querySelector(".citations-growth polyline");
  if (line) {
    const svg = line.closest("svg");
    const length = line.getTotalLength();

    // Line animation setup
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;

    line.animate(
      [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
      { duration, easing: "ease-out", fill: "forwards" }
    );

    // Create moving dot
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "2.5");
    circle.setAttribute("fill", "#1a73e8");
    svg.appendChild(circle); // drawn last → always on top

    // Build path string from points
    const pathData = line.getAttribute("points")
      .split(" ")
      .map((p, i) => (i === 0 ? "M" + p : "L" + p))
      .join(" ");

    // Apply offset-path so dot follows the polyline
    circle.style.offsetPath = `path("${pathData}")`;
    circle.style.offsetRotate = "0deg";

    // Animate the circle motion
    circle.animate(
      [{ offsetDistance: "0%" }, { offsetDistance: "100%" }],
      { duration, easing: "ease-out", fill: "forwards" }
    );
  }

  // === SPARKLINES (citations-per-year) ===
  document.querySelectorAll("[data-citations-per-year]").forEach((el) => {
    try {
      const data = JSON.parse(el.dataset.citationsPerYear);
      el.innerHTML = generateCitationSparkline({ "citations-per-year": data });

      const svg = el.querySelector("svg");
      const sparkline = svg.querySelector("polyline");
      const circle = svg.querySelector("circle");
      if (!sparkline || !circle) return;

      const length = sparkline.getTotalLength();
      sparkline.style.strokeDasharray = length;
      sparkline.style.strokeDashoffset = length;

      const delay = Math.random() * 200;

      // Animate line
      sparkline.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        { duration, delay, easing: "ease-out", fill: "forwards" }
      );

      // Animate dot motion
      const pathData = sparkline.getAttribute("points")
        .split(" ")
        .map((p, i) => (i === 0 ? "M" + p : "L" + p))
        .join(" ");

      circle.style.offsetPath = `path("${pathData}")`;
      circle.style.offsetRotate = "0deg";

      circle.animate(
        [{ offsetDistance: "0%" }, { offsetDistance: "100%" }],
        { duration, delay, easing: "ease-out", fill: "forwards" }
      );
    } catch (e) {
      console.error("Invalid citation data:", e);
    }
  });
});
