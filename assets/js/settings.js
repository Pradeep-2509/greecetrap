const fields = [
  "companyName",
  "phone",
  "address",
  "email",
  "website",
  "gstNo",
  "bankName",
  "bankAccountNo",
  "branch",
  "ifscCode",
  "terms",
  "footerText",
  "tinCstText",
  "signatoryName",
];

let currentSettings = { ...DEFAULT_SETTINGS };

function populateForm() {
  fields.forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.value = currentSettings[key] || "";
  });
  updateLogoPreview("companyLogoPreview", currentSettings.companyLogo);
  updateLogoPreview("isoLogoPreview", currentSettings.isoLogo);
  renderPriceDetails();
}

function renderPriceDetails() {
  const body = document.getElementById("priceDetailsBody");
  if (!body) return;
  body.innerHTML = "";
  Object.entries(PRODUCT_CATALOGUES).forEach(([projectType, catalogue]) => {
    catalogue.forEach((product) => {
      const key = getProductOptionValue(product);
      const override = currentSettings.priceOverrides?.[projectType]?.[key] || {};
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${projectType}</td>
        <td>${product.capacity}</td>
        <td>${product.size}</td>
        <td><input type="number" min="0" step="0.01" data-price-project="${projectType}" data-price-key="${key}" data-price-material="ms" value="${override.ms ?? product.ms}" /></td>
        <td><input type="number" min="0" step="0.01" data-price-project="${projectType}" data-price-key="${key}" data-price-material="ss304" value="${override.ss304 ?? product.ss304}" /></td>
      `;
      body.appendChild(row);
    });
  });
}

function readPriceDetails() {
  const priceOverrides = {};
  document.querySelectorAll("[data-price-project]").forEach((input) => {
    const project = input.dataset.priceProject;
    const key = input.dataset.priceKey;
    const material = input.dataset.priceMaterial;
    priceOverrides[project] ||= {};
    priceOverrides[project][key] ||= {};
    priceOverrides[project][key][material] = Number(input.value) || 0;
  });
  return priceOverrides;
}

function updateLogoPreview(elId, base64) {
  const el = document.getElementById(elId);
  if (base64) {
    el.innerHTML = `<img src="${base64}" alt="logo" />`;
  } else {
    el.textContent = "No logo";
  }
}

// Downscales the uploaded image to a size that comfortably fits the PDF's
// 90x90 logo box, so large phone photos / high-res scans don't blow past the
// localStorage quota and end up silently unsaved.
function resizeImageToBase64(file, maxDim) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => reject(new Error("Could not read image file"));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

document.getElementById("companyLogoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    currentSettings.companyLogo = await resizeImageToBase64(file, 300);
    updateLogoPreview("companyLogoPreview", currentSettings.companyLogo);
  } catch (err) {
    showToast("Could not load that image — try a different file");
  }
});

document.getElementById("isoLogoInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    currentSettings.isoLogo = await resizeImageToBase64(file, 300);
    updateLogoPreview("isoLogoPreview", currentSettings.isoLogo);
  } catch (err) {
    showToast("Could not load that image — try a different file");
  }
});

document.getElementById("settingsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  fields.forEach((key) => {
    const el = document.getElementById(key);
    if (el) currentSettings[key] = el.value;
  });
  currentSettings.priceOverrides = readPriceDetails();
  try {
    currentSettings = await Storage.saveSettings(currentSettings);
    showToast("Settings saved");
  } catch (err) {
    showToast("Save failed — logo images may be too large");
  }
});

async function loadSettings() {
  try {
    currentSettings = await Storage.getSettings();
    populateForm();
  } catch (err) {
    showToast(`Could not load settings: ${err.message}`);
    populateForm();
  }
}
loadSettings();
