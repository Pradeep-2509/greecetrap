function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function headerHtml(settings) {
  return `
    <div class="doc-header">
      <div class="logo-box">
        ${settings.companyLogo ? `<img src="${settings.companyLogo}" alt="Company Logo" />` : ""}
      </div>
      <div class="company-info">
        <h1>${settings.companyName}</h1>
        <p>${settings.address}</p>
        <p>Email: ${settings.email} | Web: ${settings.website}</p>
        <p>GST No: ${settings.gstNo}</p>
      </div>
      <div class="logo-box">
        ${settings.isoLogo ? `<img src="${settings.isoLogo}" alt="ISO 9001 Logo" />` : ""}
      </div>
    </div>
    <div class="header-rule"></div>
  `;
}

function footerHtml(settings) {
  return `
    <div class="doc-footer">
      <div class="footer-company">${settings.companyName}</div>
      <div class="footer-products">${settings.footerText}</div>
      <div class="gold-bar">${settings.tinCstText}</div>
    </div>
  `;
}

function itemDescription(item, projectType) {
  // If structured descriptionParts exist (Oil Skimmer / Agitator offers), use them
  if (item.descriptionParts) {
    const parts = item.descriptionParts;

    if (projectType === "Oil Skimmer") {
      const lines = [];
      lines.push(`<div class="desc-line"><strong><u>${item.product || item.capacity || "Single Belt Oil Skimmer"}</u></strong></div>`);

      if (parts.motor) {
        lines.push(`<div class="desc-line"><strong>1. Motor</strong></div>`);
        lines.push(`<div class="desc-line">Capacity : ${parts.motor.capacity || ""}, Make: ${parts.motor.make || ""}</div>`);
        lines.push(`<div class="desc-line">RPM : ${parts.motor.rpm || ""},Type : ${parts.motor.type || ""}, Phase: ${parts.motor.phase || ""}</div>`);
      }

      if (parts.gearbox) {
        lines.push(`<div class="desc-line"><strong>2. Gear Box</strong></div>`);
        lines.push(`<div class="desc-line">Make : ${parts.gearbox.make || ""}</div>`);
        lines.push(`<div class="desc-line">Ratio : ${parts.gearbox.ratio || ""},Type : ${parts.gearbox.type || ""}, Body size: ${parts.gearbox.bodySize || ""}</div>`);
        lines.push(`<div class="desc-line">Output Shaft:${parts.gearbox.shaft || ""}</div>`);
      }

      if (parts.belt) {
        lines.push(`<div class="desc-line"><strong>3. Belt</strong></div>`);
        lines.push(`<div class="desc-line">Belt Size: ${parts.belt.size || ""}</div>`);
        lines.push(`<div class="desc-line">Number of Belt: ${parts.belt.number || ""}</div>`);
        lines.push(`<div class="desc-line">Bottom & Top Pully : ${parts.belt.pully || ""}</div>`);
      }

      if (parts.frame) {
        lines.push(`<div class="desc-line">Frame: ${parts.frame}</div>`);
      }

      return lines.join("");
    }

    if (projectType === "Agitator") {
      const lines = [];
      lines.push(`<div class="desc-line"><strong><u>Agitator</u></strong></div>`);

      if (parts.motor) {
        lines.push(`<div class="desc-line"><strong>1. Motor</strong></div>`);
        lines.push(`<div class="desc-line">Capacity : ${parts.motor.capacity || ""},Make: ${parts.motor.make || ""}</div>`);
        lines.push(`<div class="desc-line">${parts.motor.voltage || ""} RPM : ${parts.motor.rpm || ""},Type : ${parts.motor.type || ""}, Phase: ${parts.motor.phase || ""}</div>`);
      }

      if (parts.gearbox) {
        lines.push(`<div class="desc-line"><strong>2. Gear Box</strong></div>`);
        lines.push(`<div class="desc-line">Make : ${parts.gearbox.make || ""}</div>`);
        lines.push(`<div class="desc-line">Ratio : ${parts.gearbox.ratio || ""}</div>`);
        lines.push(`<div class="desc-line">Type : ${parts.gearbox.type || ""}, Body size: ${parts.gearbox.bodySize || ""}</div>`);
        lines.push(`<div class="desc-line">Output Shaft:${parts.gearbox.shaft || ""}</div>`);
      }

      if (parts.shaft) {
        lines.push(`<div class="desc-line"><strong>3. Shaft</strong></div>`);
        lines.push(`<div class="desc-line">Length: ${parts.shaft.length || ""}</div>`);
        lines.push(`<div class="desc-line">Number of Leaf: ${parts.shaft.leaf || ""}</div>`);
        lines.push(`<div class="desc-line">Impeller : ${parts.shaft.impeller || ""}</div>`);
      }

      if (parts.frame) {
        lines.push(`<div class="desc-line">Frame: ${parts.frame}</div>`);
      }

      return lines.join("");
    }
  }

  // Fallback: if description text exists, render line by line
  if (item.description && item.description.trim()) {
    const lines = item.description
      .trim()
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<div class="desc-line">${line}</div>`)
      .join("");

    return `
      <div class="desc-line"><strong>${item.product || item.capacity || "-"}</strong></div>
      ${lines}
    `;
  }

  // Default: structured from basic fields (Grease Trap)
  const descriptionLines = [
    `<div class="desc-line"><strong>Capacity:</strong> ${item.product || item.capacity || "-"}</div>`
  ];

  descriptionLines.push(`<div class="desc-line"><strong>Size:</strong> ${item.size || "-"}</div>`);
  descriptionLines.push(`<div class="desc-line"><strong>Material:</strong> ${item.material}</div>`);

  if (item.inletOutlet) {
    descriptionLines.push(`<div class="desc-line"><strong>Inlet &amp; Outlet:</strong> ${item.inletOutlet}</div>`);
  }

  descriptionLines.push(`<div class="desc-line"><strong>Quantity:</strong> ${item.quantity}</div>`);
  return descriptionLines.join("");
}

function offerTableHeaders(projectType) {
  if (projectType === "Oil Skimmer") {
    return `
      <tr>
        <th style="width:40px;">S.No</th>
        <th>Description</th>
        <th style="width:80px;">Qty</th>
        <th style="width:110px;">Amount</th>
      </tr>
    `;
  }

  if (projectType === "Agitator") {
    return `
      <tr>
        <th style="width:40px;">S.No</th>
        <th>Description</th>
        <th style="width:80px;"></th>
        <th style="width:110px;">Amount</th>
      </tr>
    `;
  }

  return `
    <tr>
      <th style="width:40px;">S.No</th>
      <th>Description</th>
      <th style="width:110px;">Amount</th>
    </tr>
  `;
}

function renderPage1(offer, settings) {
  const projectType = offer.projectType || "Grease Trap";
  const hasQtyCol = projectType === "Oil Skimmer" || projectType === "Agitator";

  const rows = offer.items
    .map(
      (item, idx) => {
        let qtyCell = "";
        if (projectType === "Oil Skimmer") {
          qtyCell = `<td class="amount">${item.quantity} UNIT</td>`;
        } else if (projectType === "Agitator") {
          qtyCell = `<td class="amount">${formatCurrency(item.unitPrice)}</td>`;
        }
        return `
        <tr>
          <td class="num">${idx + 1}</td>
          <td>${itemDescription(item, projectType)}</td>
          ${qtyCell}
          <td class="amount">${formatCurrency(item.total)}</td>
        </tr>
      `;
      }
    )
    .join("");

  const totalColspan = hasQtyCol ? 3 : 2;

  const subjectText = projectType === "Oil Skimmer"
    ? "Offer for Oil Skimmer"
    : projectType === "Agitator"
      ? "Offer for Agitator"
      : `Offer for ${projectType}`;
  const offerTitle = projectType === "Grease Trap" ? "OFFER" : `OFFER - ${projectType.toUpperCase()}`;

  return `
    <div class="a4-page">
      ${headerHtml(settings)}
      <div class="page-body">
        <div class="offer-title">${offerTitle}</div>
        <div class="meta-row">
          <span>Ref: ${offer.id}</span>
          <span>Date: ${new Date(offer.date).toLocaleDateString("en-IN")}</span>
        </div>
        <div class="to-subject">
          <p><strong>To:</strong> ${offer.customer.name}${offer.customer.company ? ", " + offer.customer.company : ""}</p>
          <p>${offer.customer.address || ""}</p>
          <p><strong>Subject:</strong> ${subjectText}</p>
        </div>
        <div class="salutation">
          Dear Sir,<br /><br />
          We thank for your valued enquiry and take pleasure in submitting our most competitive offer as detailed below for your kind consideration and favourable order.
        </div>
        <table class="offer-table">
          <thead>
            ${offerTableHeaders(projectType)}
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row">
              <td colspan="${totalColspan}" style="text-align:right;">Grand Total</td>
              <td class="amount">${formatCurrency(offer.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ${footerHtml(settings)}
    </div>
  `;
}

function renderPage2(offer, settings) {
  return `
    <div class="a4-page">
      ${headerHtml(settings)}
      <div class="page-body">
        <div class="section-title">Terms and Conditions</div>
        <div class="terms-list">${settings.terms}</div>

        <div class="section-title">Bank Details</div>
        <table class="bank-table">
          <tr><td>Bank Name</td><td>${settings.bankName}</td></tr>
          <tr><td>Account No</td><td>${settings.bankAccountNo}</td></tr>
          <tr><td>Branch</td><td>${settings.branch}</td></tr>
          <tr><td>IFSC Code</td><td>${settings.ifscCode}</td></tr>
        </table>

        <div class="signature-block">
          <p>Thanking you and assuring you of our best services at all times.</p>
          <p>Yours sincerely,</p>
          <p><strong>For ${settings.companyName}</strong></p>
          <div class="signature-space"></div>
          ${settings.signatoryName ? `<p class="signatory-name">${settings.signatoryName.toUpperCase()}</p>` : ""}
          <p>Authorized Signatory</p>
        </div>
      </div>
      ${footerHtml(settings)}
    </div>
  `;
}

async function renderOfferPdf() {
  const id = getQueryParam("id");
  const root = document.getElementById("pdfRoot");
  let offer = null;
  let settings = DEFAULT_SETTINGS;
  try {
    [offer, settings] = await Promise.all([
      id ? Storage.getOffer(id) : Promise.resolve(null),
      Storage.getSettings()
    ]);
  } catch (err) {
    root.innerHTML = `<div class="a4-page"><p>Could not load offer: ${err.message}</p></div>`;
    return;
  }

  if (!offer) {
    root.innerHTML = `<div class="a4-page"><p>Offer not found.</p></div>`;
    return;
  }

  document.title = `Offer ${offer.id}`;
  root.innerHTML = renderPage1(offer, settings) + renderPage2(offer, settings);

  if (getQueryParam("print") === "1") {
    setTimeout(() => window.print(), 300);
  }
}

renderOfferPdf();
