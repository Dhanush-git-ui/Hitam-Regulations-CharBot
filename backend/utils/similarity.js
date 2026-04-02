function cosineSimilarity(a, b) {

  if (!Array.isArray(a) || !Array.isArray(b)) {
    throw new Error("Inputs must be arrays");
  }

  if (a.length !== b.length) {
    throw new Error("Vector dimensions do not match");
  }

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  const denominator = Math.sqrt(magA) * Math.sqrt(magB);

  if (denominator === 0) {
    return 0;
  }

  return dot / denominator;
}

module.exports = cosineSimilarity;