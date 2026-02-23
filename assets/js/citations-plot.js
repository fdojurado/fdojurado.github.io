function generateCitationSparkline(item) {
  if (!item["citations-per-year"]) return "";

  const data = item["citations-per-year"];
  const years = Object.keys(data).sort();
  const citations = years.map((y) => data[y]);
  const maxCitations = Math.max(...citations);

  const points = citations
    .map((c, i) => {
      const x = i * (60 / (years.length - 1)); // width
      const y = 12 - (c / maxCitations) * 10;  // height scale
      return `${x},${y}`;
    })
    .join(" ");

  return `
  <div class="article-citations-per-year"
       style="margin-top:2px; display:flex; align-items:center; gap:4px;">
    <svg class="sparkline" width="60" height="14" viewBox="0 0 60 14"
         xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
      <polyline fill="none" stroke="#1a73e8" stroke-width="1.5"
                points="${points}" />
      <circle r="1.5" fill="#1a73e8" />
    </svg>
  </div>`;
}


// Run automatically when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // === Render sparklines ===
  document.querySelectorAll("[data-citations-per-year]").forEach((el) => {
    try {
      const data = JSON.parse(el.dataset.citationsPerYear);
      el.innerHTML = generateCitationSparkline({ "citations-per-year": data });
    } catch (e) {
      console.error("Invalid citation data:", e);
    }
  });

  // === Animate sparklines ===
  document.querySelectorAll(".sparkline").forEach((svg) => {
    const line = svg.querySelector("polyline");
    const circle = svg.querySelector("circle");
    if (!line || !circle) return;

    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;

    const duration = 1500;
    const delay = Math.random() * 200; // small random stagger

    // Animate the line
    line.animate(
      [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
      { duration, delay, easing: "ease-out", fill: "forwards" }
    );

    // Animate the dot
    circle.animate(
      [
        { offsetDistance: "0%" },
        { offsetDistance: "100%" }
      ],
      {
        duration,
        delay,
        easing: "ease-out",
        fill: "forwards"
      }
    );

    // Link circle motion to the polyline path
    circle.style.offsetPath = `path("${line.getAttribute("points")
      .split(" ")
      .map((p, i) => (i === 0 ? "M" + p : "L" + p))
      .join(" ")}")`;
  });

});
