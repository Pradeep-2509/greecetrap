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

function itemDescription(item) {
  return `
    <div class="desc-line"><strong>Capacity:</strong> ${item.capacity}</div>
    <div class="desc-line"><strong>Size:</strong> ${item.size}</div>
    <div class="desc-line"><strong>Strainer:</strong> Perforated ${item.material} Strainer</div>
    <div class="desc-line"><strong>Shaft:</strong> ${item.material}</div>
    <div class="desc-line"><strong>Inlet &amp; Outlet:</strong> ${item.inletOutlet || "-"}</div>
    <div class="desc-line"><strong>Quantity:</strong> ${item.quantity}</div>
  `;
}

function renderPage1(offer, settings) {
  const rows = offer.items
    .map(
      (item, idx) => `
      <tr>
        <td class="num">${idx + 1}</td>
        <td>${itemDescription(item)}</td>
        <td class="amount">${formatCurrency(item.total)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="a4-page">
      ${headerHtml(settings)}
      <div class="page-body">
        <div class="offer-title">OFFER</div>
        <div class="meta-row">
          <span>Ref: ${offer.id}</span>
          <span>Date: ${new Date(offer.date).toLocaleDateString("en-IN")}</span>
        </div>
        <div class="to-subject">
          <p><strong>To:</strong> ${offer.customer.name}${offer.customer.company ? ", " + offer.customer.company : ""}</p>
          <p>${offer.customer.address || ""}</p>
          <p><strong>Subject:</strong> Offer for Grease Trap</p>
        </div>
        <div class="salutation">
          Dear Sir,<br /><br />
          We thank for your valued enquiry and take pleasure in submitting our most competitive offer as detailed below for your kind consideration and favourable order.
        </div>
        <table class="offer-table">
          <thead>
            <tr>
              <th style="width:40px;">S.No</th>
              <th>Description</th>
              <th style="width:110px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr class="total-row">
              <td colspan="2" style="text-align:right;">Grand Total</td>
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
