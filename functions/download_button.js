import { stage } from "./setup_canvas.js";

const dlButton = document.getElementById("dlButton");

dlButton.addEventListener("mouseover", function () {
  if (!dlButton.disabled) {
    dlButton.style.backgroundColor = "#1d4ed8";
    dlButton.style.cursor = "pointer";
    dlButton.style.transform = "scale(1.05)";
  } else {
    dlButton.style.cursor = "not-allowed";
  }
});

dlButton.addEventListener("mouseout", function () {
  if (!dlButton.disabled) {
    dlButton.style.backgroundColor = "#000000";
    dlButton.style.transform = "scale(1)";
  }
});

dlButton.addEventListener("click", () => {
  const dataURL = stage.toDataURL({ pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = "diagram.png";
  link.href = dataURL;
  link.click();
});
