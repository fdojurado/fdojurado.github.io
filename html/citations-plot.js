// citations-plot.js

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
      <svg width="60" height="14" viewBox="0 0 60 14"
           xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
        <polyline fill="none" stroke="#1a73e8" stroke-width="1.5"
                  points="${points}" />
      </svg>
    </div>`;
}

// Run automatically when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Find all elements that should display a sparkline
  document.querySelectorAll("[data-citations-per-year]").forEach((el) => {
    try {
      const data = JSON.parse(el.dataset.citationsPerYear);
      el.innerHTML = generateCitationSparkline({ "citations-per-year": data });
    } catch (e) {
      console.error("Invalid citation data:", e);
    }
  });
});
