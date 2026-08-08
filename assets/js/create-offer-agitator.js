const itemsBody = document.getElementById('itemsBody');
const template = document.getElementById('itemRowTemplate');
const grandTotalEl = document.getElementById('grandTotal');

function buildProductOptions(select) {
  const catalogue = AGITATOR_CATALOGUE;
  select.innerHTML = '';
  catalogue.forEach((product) => {
    const opt = document.createElement('option');
    opt.value = getProductOptionValue(product);
    opt.textContent = `${product.capacity} (${product.size})`;
    select.appendChild(opt);
  });
}

function recalcRow(row) {
  const productValue = row.querySelector('.capacity-select').value;
  const material = row.querySelector('.material-select').value;
  const qty = Number(row.querySelector('.quantity').value) || 0;
  const unitPrice = getUnitPrice(productValue, material, 'Agitator');
  row.querySelector('.unit-price').value = unitPrice;
  const rowTotal = unitPrice * qty;
  row.querySelector('.row-total').textContent = formatCurrency(rowTotal);
  recalcGrandTotal();
}

function recalcGrandTotal() {
  let total = 0;
  document.querySelectorAll('.item-row').forEach((row) => {
    const unitPrice = Number(row.querySelector('.unit-price').value) || 0;
    const qty = Number(row.querySelector('.quantity').value) || 0;
    total += unitPrice * qty;
  });
  grandTotalEl.textContent = formatCurrency(total);
}

function addItemRow() {
  const clone = template.content.cloneNode(true);
  const row = clone.querySelector('.item-row');
  const capacitySelect = row.querySelector('.capacity-select');
  buildProductOptions(capacitySelect);

  row.querySelectorAll('select, input').forEach((el) => {
    el.addEventListener('input', () => recalcRow(row));
    el.addEventListener('change', () => recalcRow(row));
  });

  row.querySelector('.remove-row').addEventListener('click', () => {
    row.remove();
    recalcGrandTotal();
  });

  itemsBody.appendChild(row);
  recalcRow(row);
}

document.getElementById('addItemBtn').addEventListener('click', addItemRow);
addItemRow();

document.getElementById('offerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
  const rows = document.querySelectorAll('.item-row');
  if (rows.length === 0) { alert('Please add at least one product.'); return; }

  const items = Array.from(rows).map((row) => {
    const selectedValue = row.querySelector('.capacity-select').value;
    const product = findProduct(selectedValue, 'Agitator');
    const material = row.querySelector('.material-select').value;
    const quantity = Number(row.querySelector('.quantity').value) || 1;
    const unitPrice = Number(row.querySelector('.unit-price').value) || 0;

    // Collect individual fields
    const motorCapacity = row.querySelector('.motor-capacity').value.trim();
    const motorMake = row.querySelector('.motor-make').value.trim();
    const motorVoltage = row.querySelector('.motor-voltage').value.trim();
    const motorRpm = row.querySelector('.motor-rpm').value.trim();
    const motorType = row.querySelector('.motor-type').value.trim();
    const motorPhase = row.querySelector('.motor-phase').value.trim();

    const gearboxMake = row.querySelector('.gearbox-make').value.trim();
    const gearboxRatio = row.querySelector('.gearbox-ratio').value.trim();
    const gearboxType = row.querySelector('.gearbox-type').value.trim();
    const gearboxBodysize = row.querySelector('.gearbox-bodysize').value.trim();
    const gearboxShaft = row.querySelector('.gearbox-shaft').value.trim();

    const shaftLength = row.querySelector('.shaft-length').value.trim();
    const shaftLeaf = row.querySelector('.shaft-leaf').value.trim();
    const shaftImpeller = row.querySelector('.shaft-impeller').value.trim();

    const frameMaterial = row.querySelector('.frame-material').value.trim();

    // Build structured description for PDF rendering
    const descriptionParts = {
      motor: { capacity: motorCapacity, make: motorMake, voltage: motorVoltage, rpm: motorRpm, type: motorType, phase: motorPhase },
      gearbox: { make: gearboxMake, ratio: gearboxRatio, type: gearboxType, bodySize: gearboxBodysize, shaft: gearboxShaft },
      shaft: { length: shaftLength, leaf: shaftLeaf, impeller: shaftImpeller },
      frame: frameMaterial
    };

    // Build readable description string
    const descLines = [];
    descLines.push('Agitator');
    if (motorCapacity || motorMake || motorRpm) {
      descLines.push('1. Motor');
      descLines.push(`Capacity : ${motorCapacity},Make: ${motorMake}`);
      descLines.push(`${motorVoltage} RPM : ${motorRpm},Type : ${motorType}, Phase: ${motorPhase}`);
    }
    if (gearboxMake || gearboxRatio) {
      descLines.push('2. Gear Box');
      descLines.push(`Make : ${gearboxMake}`);
      descLines.push(`Ratio : ${gearboxRatio}`);
      descLines.push(`Type : ${gearboxType}, Body size: ${gearboxBodysize}`);
      descLines.push(`Output Shaft:${gearboxShaft}`);
    }
    if (shaftLength || shaftLeaf) {
      descLines.push('3. Shaft');
      descLines.push(`Length: ${shaftLength}`);
      descLines.push(`Number of Leaf: ${shaftLeaf}`);
      descLines.push(`Impeller : ${shaftImpeller}`);
    }
    if (frameMaterial) {
      descLines.push(`Frame: ${frameMaterial}`);
    }

    return {
      capacity: product ? product.capacity : selectedValue,
      product: product ? product.capacity : selectedValue,
      size: product ? product.size : '',
      material,
      description: descLines.join('\n'),
      descriptionParts,
      quantity,
      unitPrice,
      total: unitPrice * quantity
    };
  });

  const offer = {
    projectType: 'Agitator',
    customer: {
      name: document.getElementById('customerName').value,
      company: document.getElementById('companyName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value
    },
    items
  };

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    const savedOffer = await Storage.addOffer(offer);
    showToast('Offer saved successfully');
    setTimeout(() => {
      window.location.href = `offer-pdf.html?id=${encodeURIComponent(savedOffer.id)}`;
    }, 500);
  } catch (err) {
    showToast(`Save failed: ${err.message}`);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Offer';
  }
});
