// Hardcoded product catalogues used by the offer builder.
// Each product lookup is performed by project type + chosen model.
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

const OIL_SKIMMER_CATALOGUE = [
  { capacity: "Belt Type 1 Mini Skimmer", size: "945 x 45 x 3 mm", ms: 19908, ss304: 20790 },
  { capacity: "Belt Type 1 Mini Skimmer", size: "1150 x 45 x 3 mm", ms: 20790, ss304: 21700 },
  { capacity: "Single Belt Oil Skimmer", size: "Dia 300 mm", ms: 17910, ss304: 21500 },
  { capacity: "Single Belt Oil Skimmer", size: "Dia 500 mm", ms: 21492, ss304: 25800 },
  { capacity: "Single Belt Oil Skimmer", size: "1 mtr (2320 x 100 x 3 mm)", ms: 30600, ss304: 32600 },
  { capacity: "Single Belt Oil Skimmer", size: "1.5 mtr (3320 x 100 x 3 mm)", ms: 32700, ss304: 41580 },
  { capacity: "Single Belt Oil Skimmer", size: "2 mtr (4320 x 100 x 3 mm)", ms: 41895, ss304: 49600 },
  { capacity: "Single Belt Oil Skimmer", size: "2.5 mtr (5320 x 100 x 3 mm)", ms: 37200, ss304: 40425 },
  { capacity: "Single Belt Oil Skimmer", size: "3 mtr (6320 x 100 x 3 mm)", ms: 39690, ss304: 44100 },
  { capacity: "Double Belt Oil Skimmer", size: "1 mtr (2320 x 100 x 3 mm)", ms: 33075, ss304: 41895 },
  { capacity: "Double Belt Oil Skimmer", size: "1.5 mtr (3320 x 100 x 3 mm)", ms: 38600, ss304: 49600 },
  { capacity: "Double Belt Oil Skimmer", size: "2 mtr (4320 x 100 x 3 mm)", ms: 44100, ss304: 57400 },
  { capacity: "Double Belt Oil Skimmer", size: "2.5 mtr (5320 x 100 x 3 mm)", ms: 49600, ss304: 66100 },
  { capacity: "Double Belt Oil Skimmer", size: "3 mtr (6320 x 100 x 3 mm)", ms: 55125, ss304: 82600 },
  { capacity: "Multi Stage Belt Skimmer", size: "1 mtr (2320 x 100 x 3 mm)", ms: 40790, ss304: 45200 },
  { capacity: "Multi Stage Belt Skimmer", size: "1.5 mtr (3320 x 100 x 3 mm)", ms: 46300, ss304: 50700 } 
];

const AGITATOR_CATALOGUE = [
  { capacity: "0.25 HP", size: "3ph, 72 RPM", ms: 17200, ss304: 21800 },
  { capacity: "0.5 HP", size: "3ph, 72 RPM", ms: 20700, ss304: 28600 },
  { capacity: "1 HP", size: "3ph, 72 RPM", ms: 29200, ss304: 34650 },
  { capacity: "1.5 HP", size: "3ph, 72 RPM", ms: 36960, ss304: 0 },
  { capacity: "2 HP", size: "3ph, 72 RPM, 24", ms: 43890, ss304: 0 },
  { capacity: "3 HP", size: "3ph, 72 RPM, 24", ms: 46800, ss304: 0 },
  { capacity: "1 HP", size: "3ph, 72 RPM", ms: 29200, ss304: 34650 }
];

const PRODUCT_CATALOGUES = {
  "Grease Trap": PRODUCT_CATALOGUE,
  "Oil Skimmer": OIL_SKIMMER_CATALOGUE,
  "Agitator": AGITATOR_CATALOGUE
};

function getProductOptionValue(product) {
  return `${product.capacity}||${product.size || ""}`;
}

function getProjectCatalogue(projectType) {
  return PRODUCT_CATALOGUES[projectType] || PRODUCT_CATALOGUE;
}

function findProduct(selectedValue, projectType = "Grease Trap") {
  if (!selectedValue) return null;
  const [capacity, size] = selectedValue.split("||");
  return getProjectCatalogue(projectType).find((p) => {
    if (capacity && size) {
      return p.capacity === capacity && p.size === size;
    }
    return p.capacity === capacity || p.size === capacity;
  });
}

function getUnitPrice(selectedValue, material, projectType = "Grease Trap") {
  const product = findProduct(selectedValue, projectType);
  if (!product) return 0;
  return material === "SS304" ? product.ss304 : product.ms;
}
