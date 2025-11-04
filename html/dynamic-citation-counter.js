document.addEventListener("DOMContentLoaded", () => {
  const duration = 2000; // total animation time in ms

  // === COUNTER ANIMATION ===
  const counters = [
    { el: document.getElementById("citations"), value: parseInt(document.getElementById("citations").innerText, 10) },
    { el: document.getElementById("hindex"), value: parseInt(document.getElementById("hindex").innerText, 10) },
    { el: document.getElementById("i10index"), value: parseInt(document.getElementById("i10index").innerText, 10) },
    { el: document.getElementById("most-cited"), value: parseInt(document.getElementById("most-cited").innerText, 10) },
  ];

  // Reset counters
  counters.forEach(c => (c.el.innerText = "0"));

  // Animate with requestAnimationFrame for smoothness
  const startTime = performance.now();
  function animate(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    counters.forEach(({ el, value }) => {
      el.innerText = Math.floor(value * progress).toLocaleString();
    });
    if (progress < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // === SVG LINE ANIMATION ===
  const svg = document.querySelector(".citations-growth polyline");
  if (svg) {
    const totalLength = svg.getTotalLength();

    // Start hidden
    svg.style.strokeDasharray = totalLength;
    svg.style.strokeDashoffset = totalLength;

    // Animate line draw
    svg.animate(
      [
        { strokeDashoffset: totalLength },
        { strokeDashoffset: 0 }
      ],
      {
        duration: duration,
        easing: "ease-out",
        fill: "forwards"
      }
    );
  }
});
