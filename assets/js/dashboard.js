async function renderOffers() {
  const body = document.getElementById("offersBody");
  const emptyState = document.getElementById("emptyState");
  body.innerHTML = `<tr><td colspan="5">Loading offers...</td></tr>`;

  try {
    const offers = await Storage.getOffers();
    body.innerHTML = "";

    if (offers.length === 0) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    offers.forEach((offer) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="badge">${offer.id}</span></td>
        <td>${offer.customer.name}</td>
        <td>${formatCurrency(offer.total)}</td>
        <td>${new Date(offer.date).toLocaleDateString("en-IN")}</td>
        <td class="actions">
          <button class="btn btn-outline btn-sm" onclick="viewOffer('${offer.id}')">View</button>
          <button class="btn btn-gold btn-sm" onclick="downloadOffer('${offer.id}')">Download</button>
          <button class="btn btn-danger btn-sm" onclick="deleteOffer('${offer.id}')">Delete</button>
        </td>`;
      body.appendChild(tr);
    });
  } catch (err) {
    body.innerHTML = `<tr><td colspan="5">Could not load offers: ${err.message}</td></tr>`;
  }
}

function viewOffer(id) {
  window.open(`offer-pdf.html?id=${encodeURIComponent(id)}`, "_blank");
}

function downloadOffer(id) {
  window.open(`offer-pdf.html?id=${encodeURIComponent(id)}&print=1`, "_blank");
}

async function deleteOffer(id) {
  if (!confirm(`Delete offer ${id}? This cannot be undone.`)) return;
  try {
    await Storage.deleteOffer(id);
    await renderOffers();
    showToast("Offer deleted");
  } catch (err) {
    showToast(`Delete failed: ${err.message}`);
  }
}

renderOffers();
