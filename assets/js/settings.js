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
