const projectFilterEl = document.getElementById("projectFilter");

async function renderOffers() {
  const body = document.getElementById("offersBody");
  const emptyState = document.getElementById("emptyState");
  body.innerHTML = `<tr><td colspan="6">Loading offers...</td></tr>`;

  try {
    const allOffers = await Storage.getOffers();
    const filterValue = projectFilterEl?.value || "all";
    const offers = filterValue === "all"
      ? allOffers
      : allOffers.filter((offer) => (offer.projectType || "Grease Trap") === filterValue);

    body.innerHTML = "";

    if (offers.length === 0) {
      const filterValue = projectFilterEl?.value || "all";
      emptyState.innerHTML = filterValue === "all"
        ? 'No offer letters yet. <a href="create-offer.html">Create your first offer</a>.'
        : `No ${filterValue} offers found. <a href="create-offer.html">Create a new offer</a>.`;
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    offers.forEach((offer) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><span class="badge">${offer.id}</span></td>
        <td>${offer.projectType || "Grease Trap"}</td>
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
    body.innerHTML = `<tr><td colspan="6">Could not load offers: ${err.message}</td></tr>`;
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

projectFilterEl?.addEventListener("change", renderOffers);
renderOffers();
