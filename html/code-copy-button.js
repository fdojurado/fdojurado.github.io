document.addEventListener("DOMContentLoaded", () => {
  const copyButtons = document.querySelectorAll(".code-copy-button");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preElement = button.closest("pre");
      const codeElement = preElement.querySelector("code");
      if (codeElement) {
        const codeText = codeElement.innerText;

        navigator.clipboard
          .writeText(codeText)
          .then(() => {
            // Optionally, you can give user feedback that the text has been copied
            button.innerHTML = "Copied!";
            setTimeout(() => {
              button.innerHTML = "<i class='bi'></i>";
            }, 2000);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      }
    });
  });
});
