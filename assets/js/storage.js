const STORAGE_KEYS = {
  offers: "sai_offers",
  settings: "sai_company_settings"
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

const Storage = {
  readLocal(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  writeLocal(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  async request(url, options = {}) {
    try {
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
    } catch (err) {
      return this.localFallback(url, options, err);
    }
  },

  localFallback(url, options = {}, err) {
    if (!window.localStorage) {
      throw err;
    }

    const method = (options.method || "GET").toUpperCase();
    const pathname = url.split("?")[0];

    if (pathname.endsWith("/.netlify/functions/offers") || pathname.endsWith("/offers")) {
      const id = new URLSearchParams(url.split("?")[1] || "").get("id");
      const offers = this.readLocal(STORAGE_KEYS.offers, []);

      if (method === "GET" && !id) {
        return offers;
      }

      if (method === "GET" && id) {
        const offer = offers.find((item) => item.id === id);
        if (!offer) throw new Error("Offer not found.");
        return offer;
      }

      if (method === "POST") {
        const payload = JSON.parse(options.body || "{}");
        const total = (payload.items || []).reduce((sum, item) => sum + (item.total || 0), 0);
        const created = {
          ...payload,
          id: this.nextOfferId(),
          date: new Date().toISOString(),
          total
        };
        this.writeLocal(STORAGE_KEYS.offers, [...offers, created]);
        return created;
      }

      if (method === "DELETE" && id) {
        const updated = offers.filter((item) => item.id !== id);
        this.writeLocal(STORAGE_KEYS.offers, updated);
        return { success: true };
      }
    }

    if (pathname.endsWith("/.netlify/functions/settings") || pathname.endsWith("/settings")) {
      const settings = this.readLocal(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
      if (method === "GET") {
        return settings;
      }

      if (method === "PUT") {
        const payload = JSON.parse(options.body || "{}");
        const merged = { ...DEFAULT_SETTINGS, ...settings, ...payload };
        this.writeLocal(STORAGE_KEYS.settings, merged);
        return merged;
      }
    }

    throw err;
  },

  nextOfferId() {
    const year = new Date().getFullYear();
    const offers = this.readLocal(STORAGE_KEYS.offers, []);
    const lastSequence = offers
      .map((offer) => Number(String(offer.id).split("/").pop() || "0"))
      .filter((n) => !Number.isNaN(n))
      .sort((a, b) => b - a)[0] || 0;
    const nextSequence = String(lastSequence + 1).padStart(4, "0");
    return `SAI/${year}/${nextSequence}`;
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
