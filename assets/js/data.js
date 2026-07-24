// Hardcoded Oil & Grease Trap product catalogue.
// Prices are looked up by capacity + shaft material.
const PRODUCT_CATALOGUE = [
  { capacity: "10 LITER", size: "250x200x250MM", ms: 1730, ss304: 3700 },
  { capacity: "20 LITER", size: "300x250x280MM", ms: 3800, ss304: 6870 },
  { capacity: "50 LITER", size: "2x1x1 FEET", ms: 6300, ss304: 11340 },
  { capacity: "100 LITER", size: "2x1x1.75 FEET", ms: 9450, ss304: 18270 },
  { capacity: "250 LITER", size: "3x1.5x2 FEET", ms: 18900, ss304: 40950 },
  { capacity: "500 LITER", size: "4x2x2.5 FEET", ms: 37800, ss304: 73200 },
  { capacity: "750 LITER", size: "5x2x2.75 FEET", ms: 52920, ss304: 99200 },
  { capacity: "1000 LITER", size: "5x2.5x3 FEET", ms: 75600, ss304: 144900 },
  { capacity: "1500 LITER", size: "6x3x3 FEET", ms: 105840, ss304: 168750 },
  { capacity: "3000 LITER", size: "8x3.5x4 FEET", ms: 138600, ss304: 193200 },
];

function findProduct(capacity) {
  return PRODUCT_CATALOGUE.find((p) => p.capacity === capacity);
}

function getUnitPrice(capacity, material) {
  const product = findProduct(capacity);
  if (!product) return 0;
  return material === "SS304" ? product.ss304 : product.ms;
}
