document.addEventListener("DOMContentLoaded", () => {
  // Define total animation time (in milliseconds)
  const duration = 2000;

  // Collect all counters (id and target value)
  const counters = [
    { el: document.getElementById("citations"), value:  parseInt(document.getElementById("citations").innerText, 10) },
    { el: document.getElementById("hindex"), value: parseInt(document.getElementById("hindex").innerText, 10) },
    { el: document.getElementById("i10index"), value: parseInt(document.getElementById("i10index").innerText, 10) },
    { el: document.getElementById("most-cited"), value: parseInt(document.getElementById("most-cited").innerText, 10) },
  ];

  // Reset counters to 0
  counters.forEach(c => (c.el.innerText = "0"));

  // For each counter, compute how fast it should increment
  counters.forEach(({ el, value }) => {
    if (value === 0) return; // skip zeros

    const steps = value;
    const interval = duration / steps; // ensures all finish at same time
    let count = 0;

    const timer = setInterval(() => {
      count++;
      el.innerText = count;

      if (count >= value) clearInterval(timer);
    }, interval);
  });
});
