// Initialize the Konva stage
const container = document.getElementById("container");
export const stage = new Konva.Stage({
  container: "container",
  width: container.offsetWidth,
  height: container.offsetHeight,
});

// Add a layer to the stage. Layers are used to draw things on.
export const layer = new Konva.Layer();
stage.add(layer);
