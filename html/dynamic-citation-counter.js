document.addEventListener("DOMContentLoaded", () => {
  const citationCounter = document.getElementById("citations");
  let count = 0;
  // end is the current number of citations (id="citations")
  const end = parseInt(citationCounter.innerText, 10);
  citationCounter.innerText = "0";

  const counter = setInterval(() => {
    count++;
    citationCounter.innerText = count;
    if (count >= end) clearInterval(counter);
  }, 20);
});