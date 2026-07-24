const Storage = {
  async request(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        "content-type": "application/json",
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    return data;
  },

  getOffers() {
    return this.request("/.netlify/functions/offers");
  },

  getOffer(id) {
    return this.request(`/.netlify/functions/offers?id=${encodeURIComponent(id)}`);
  },

  addOffer(offer) {
    return this.request("/.netlify/functions/offers", {
      method: "POST",
      body: JSON.stringify(offer)
    });
  },

  deleteOffer(id) {
    return this.request(`/.netlify/functions/offers?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
  },

  getSettings() {
    return this.request("/.netlify/functions/settings");
  },

  saveSettings(settings) {
    return this.request("/.netlify/functions/settings", {
      method: "PUT",
      body: JSON.stringify(settings)
    });
  }
};

const DEFAULT_SETTINGS = {
  companyName: "SENTHIL ANDAVAR INDUSTRIES",
  address: "",
  phone: "",
  email: "",
  website: "",
  gstNo: "",
  bankName: "",
  bankAccountNo: "",
  branch: "",
  ifscCode: "",
  terms: "",
  footerText: "",
  tinCstText: "",
  signatoryName: "",
  companyLogo: "",
  isoLogo: ""
};
