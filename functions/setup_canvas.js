// Initialize the Konva stage
const container = document.getElementById("container");
export const stage = new Konva.Stage({
  container: "container",
  width: container.offsetWidth,
  height: container.offsetHeight,
});

// Add a layer to the stage
export const layer = new Konva.Layer();
stage.add(layer);

// Handle window resizing to keep the canvas responsive
window.addEventListener("resize", () => {
  stage.width(container.offsetWidth);
  stage.height(container.offsetHeight);
  stage.draw();
});
