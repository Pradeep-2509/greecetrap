const itemsBody = document.getElementById("itemsBody");
const template = document.getElementById("itemRowTemplate");
const grandTotalEl = document.getElementById("grandTotal");

function buildCapacityOptions(select) {
  PRODUCT_CATALOGUE.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.capacity;
    opt.textContent = `${p.capacity} (${p.size})`;
    select.appendChild(opt);
  });
}

function recalcRow(row) {
  const capacity = row.querySelector(".capacity-select").value;
  const material = row.querySelector(".material-select").value;
  const qty = Number(row.querySelector(".quantity").value) || 0;
  const unitPrice = getUnitPrice(capacity, material);
  row.querySelector(".unit-price").value = unitPrice;
  const rowTotal = unitPrice * qty;
  row.querySelector(".row-total").textContent = formatCurrency(rowTotal);
  recalcGrandTotal();
}

function recalcGrandTotal() {
  let total = 0;
  document.querySelectorAll(".item-row").forEach((row) => {
    const unitPrice = Number(row.querySelector(".unit-price").value) || 0;
    const qty = Number(row.querySelector(".quantity").value) || 0;
    total += unitPrice * qty;
  });
  grandTotalEl.textContent = formatCurrency(total);
}

function addItemRow() {
  const clone = template.content.cloneNode(true);
  const row = clone.querySelector(".item-row");
  const capacitySelect = row.querySelector(".capacity-select");
  buildCapacityOptions(capacitySelect);

  row.querySelectorAll("select, input").forEach((el) => {
    el.addEventListener("input", () => recalcRow(row));
    el.addEventListener("change", () => recalcRow(row));
  });

  row.querySelector(".remove-row").addEventListener("click", () => {
    row.remove();
    recalcGrandTotal();
  });

  itemsBody.appendChild(row);
  recalcRow(row);
}

document.getElementById("addItemBtn").addEventListener("click", addItemRow);

// Start with one row pre-filled
addItemRow();

document.getElementById("offerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
  const rows = document.querySelectorAll(".item-row");
  if (rows.length === 0) {
    alert("Please add at least one product.");
    return;
  }

  const items = Array.from(rows).map((row) => {
    const capacity = row.querySelector(".capacity-select").value;
    const product = findProduct(capacity);
    const material = row.querySelector(".material-select").value;
    const inletOutlet = row.querySelector(".inlet-outlet").value;
    const quantity = Number(row.querySelector(".quantity").value) || 1;
    const unitPrice = Number(row.querySelector(".unit-price").value) || 0;
    return {
      capacity,
      size: product ? product.size : "",
      material,
      inletOutlet,
      quantity,
      unitPrice,
      total: unitPrice * quantity
    };
  });

  const offer = {
    customer: {
      name: document.getElementById("customerName").value,
      company: document.getElementById("companyName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value
    },
    items
  };

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";
    const savedOffer = await Storage.addOffer(offer);
    showToast("Offer saved successfully");
    setTimeout(() => {
      window.location.href = `offer-pdf.html?id=${encodeURIComponent(savedOffer.id)}`;
    }, 500);
  } catch (err) {
    showToast(`Save failed: ${err.message}`);
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Offer";
  }
});
