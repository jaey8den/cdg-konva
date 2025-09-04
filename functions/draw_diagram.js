import { layer } from "./setup_canvas.js";
import { cleanString } from "./clean_string.js";
import { patternsMap } from "./patterns.js";

const generateBtn = document.getElementById("generateBtn");
const diagramInput = document.getElementById("diagramInput");
const dlButton = document.getElementById("dlButton");

generateBtn.addEventListener("click", async () => {
  console.log("Button pressed.");

  // Check if user input empty
  const userInput = diagramInput.value;
  if (!userInput) {
    // Clear previous drawing
    layer.destroyChildren();
    // Message if empty
    document.getElementById("messageArea").textContent =
      "Please enter a description.";
    return;
  } else {
    // Message if not
    document.getElementById("messageArea").textContent = "";
  }

  try {
    // Clean user input
    const clean_input = cleanString(userInput);
    console.log(clean_input);
    // Clear previous drawing
    layer.destroyChildren();
    // Draw grey background
    patternsMap.BG();
    // Draw MR and remove from array
    if (clean_input[0][0] === "MR") {
      patternsMap["MR"]();
      clean_input[0] = clean_input[0].slice(1);
    }
    // The rest
    for (let i = 0; i < clean_input.length; i++) {
      // Draw SLST
      let slstCount = 1;
      if (clean_input[i][clean_input[i].length - 1] > 0) {
        slstCount = clean_input[i][clean_input[i].length - 1];
        patternsMap.SLST(slstCount);
      }
      // Remove SLST count
      clean_input[i].splice(-1, slstCount);
      const reps = clean_input[i].length;
      // Other stitches
      for (let j = 0; j < reps; j++) {
        const pattern = clean_input[i][j];
        // Offset angle for current pattern
        const repAngle = ((2 * Math.PI) / reps) * j;
        // 1 chain
        if (pattern == "CH") {
          patternsMap.CH(reps, repAngle, i);
          // Multiple chain
        } else if (pattern.split(" ").length > 1) {
          patternsMap.CH(reps, repAngle, i, pattern.split(" ")[0]);
          // Other stitches
        } else if (patternsMap[pattern]) {
          patternsMap[pattern](reps, repAngle, i);
        } else {
          console.warn(`Pattern "${pattern}" not found.`);
          // Show error message
          document.getElementById(
            "messageArea"
          ).textContent = `Pattern "${pattern}" not found.`;
          // Clear canvas
          layer.destroyChildren();
          // Disable download button
          dlButton.disabled = true;
          dlButton.style.backgroundColor = "#6b7280";
          return;
        }
      }
    }
    // Enable download button
    dlButton.disabled = false;
    dlButton.style.backgroundColor = "#000000";
  } catch (error) {
    console.error("Failed to generate diagram:", error);
    document.getElementById("messageArea").textContent = "An error occurred.";
  } finally {
    // Restore button state
    generateBtn.textContent = "Generate Diagram";
    generateBtn.disabled = false;
  }
});
