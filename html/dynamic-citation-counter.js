document.addEventListener("DOMContentLoaded", () => {
  const citationCounter = document.getElementById("citations");
  const hindexCounter = document.getElementById("hindex");
  const i10indexCounter = document.getElementById("i10index");
  let count = 0;
  let hcount = 0;
  let i10count = 0;
  // end is the current number of citations (id="citations")
  const end = parseInt(citationCounter.innerText, 10);
  const hend = parseInt(hindexCounter.innerText, 10);
  const i10end = parseInt(i10indexCounter.innerText, 10);
  citationCounter.innerText = "0";
  hindexCounter.innerText = "0";
  i10indexCounter.innerText = "0";

  const counter = setInterval(() => {
    count++;
    citationCounter.innerText = count;
    if (count >= end) clearInterval(counter);
  }, 20);
  const hcounter = setInterval(() => {
    hcount++;
    hindexCounter.innerText = hcount;
    if (hcount >= hend) clearInterval(hcounter);
  }, 200);
  const i10counter = setInterval(() => {
    i10count++;
    i10indexCounter.innerText = i10count;
    if (i10count >= i10end) clearInterval(i10counter);
  }, 200);
});