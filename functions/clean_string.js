// Removing whitespace and indexing reps and patterns
function prepareString(str) {
  let preparedStr = str.replace(/SL ST/g, "SLST");
  preparedStr = preparedStr.replace(/,/g, "");
  preparedStr = preparedStr.replace(/ /g, ",");
  return preparedStr;
}

// Separate layers by ;
function separateLayers(str) {
  let layers = str.split(":");
  layers = layers.slice(1);
  for (let i = 0; i < layers.length; i++) {
    if (isNumeric(layers[i][layers[i].length - 1])) {
      layers[i] = layers[i].slice(0, -1);
    }
    layers[i] = layers[i].trim();
  }
  return layers;
}

// Group stitches enclosed by brackets
function groupBrackets(str) {
  let stack = [];
  let result = [];
  let isBracketOpen = false;

  for (const char of str) {
    if (char === "," && !isBracketOpen) {
      if (stack.length > 0) {
        result.push(stack.join(""));
        stack = []; // Clear the stack
      }
    } else if (char === "(") {
      isBracketOpen = true;
    } else if (char === ")") {
      if (stack.length > 0) {
        result.push(stack.join(""));
        stack = []; // Clear the stack
      }
      isBracketOpen = false;
    } else {
      stack.push(char);
    }
  }

  // Append remaining stitches in the stack
  if (stack.length > 0) {
    result.push(stack.join(""));
  }
  return result;
}

function isNumeric(str) {
  if (typeof str != "string") return false; // a non-string is not numeric
  return !isNaN(+str) && !isNaN(parseFloat(str));
}

// Open brackets
function expandBrackets(arr) {
  let l = 0; // left pointer
  let r = 1; // right pointer
  const result = [];

  while (l < arr.length) {
    // Non-repeated stitches
    if (!isNumeric(arr[l])) {
      result.push(arr[l]);
      l++;
      r++;
    }
    // Group stitch (bracketed patterns, contains a comma)
    else if (arr[r] && arr[r].includes(",")) {
      if (l != 0) {
        result.push("MT");
      }
      // Reps for the group stitch
      const repeatCount = parseInt(arr[l], 10);
      for (let i = 0; i < repeatCount; i++) {
        const subPatterns = arr[r].split(",");
        for (const j of subPatterns) {
          result.push(j);
        }
        result.push("MT");
      }
      l += 2;
      r += 2;
    }
    // Repeated stitches
    else {
      if (arr[l] !== undefined) result.push(arr[l]);
      if (arr[r] !== undefined) result.push(arr[r]);
      l += 2;
      r += 2;
    }
  }
  return result;
}

// Open repetitions
function openReps(arr) {
  let l = 0;
  let r = 1;
  let slstCount = 0;
  const result = [];

  while (l < arr.length) {
    // Single stitch
    if (!isNumeric(arr[l])) {
      if (arr[l] != "SLST") {
        result.push(arr[l]);
      } else {
        slstCount++;
      }
      l++;
      r++;
      // Multiple chains
    } else if (arr[r] === "CH") {
      result.push(`${arr[l]} CH`);
      l += 2;
      r += 2;
      // Multiple stitches
    } else {
      const repeatCount = parseInt(arr[l], 10);
      if (arr[r] != "SLST") {
        for (let i = 0; i < repeatCount; i++) {
          result.push(arr[r]);
        }
      } else {
        slstCount += repeatCount;
      }
      l += 2;
      r += 2;
    }
  }
  result.push(slstCount);

  return result;
}

// All together
export function cleanString(str) {
  const preparedStr = prepareString(str);
  let layers = separateLayers(preparedStr);

  // Process each layer through the cleaning pipeline
  for (let i = 0; i < layers.length; i++) {
    const grouped = groupBrackets(layers[i]);
    const expanded = expandBrackets(grouped);
    layers[i] = openReps(expanded);
  }

  return layers;
}
