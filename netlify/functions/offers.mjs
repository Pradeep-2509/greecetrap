import { getPool, json, errorResponse } from "./_db.mjs";

function mapOffer(row, items = []) {
  return {
    id: row.offer_number,
    date: row.offer_date,
    customer: {
      name: row.customer_name,
      company: row.company_name || "",
      email: row.email || "",
      phone: row.phone || "",
      address: row.address || ""
    },
    items: items.map((item) => ({
      capacity: item.capacity || "",
      size: item.size || "",
      material: item.shaft_material || "",
      inletOutlet: item.inlet_outlet || "",
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unit_price || 0),
      total: Number(item.total || 0)
    })),
    total: Number(row.grand_total || 0)
  };
}

export default async (req) => {
  const pool = getPool();
  const url = new URL(req.url);
  const offerNumber = url.searchParams.get("id");

  try {
    if (req.method === "GET" && offerNumber) {
      const offerResult = await pool.query(
        "SELECT * FROM offers WHERE offer_number = $1 LIMIT 1",
        [offerNumber]
      );
      if (!offerResult.rowCount) return json({ error: "Offer not found" }, 404);

      const row = offerResult.rows[0];
      const itemsResult = await pool.query(
        "SELECT * FROM offer_items WHERE offer_id = $1 ORDER BY id",
        [row.id]
      );
      return json(mapOffer(row, itemsResult.rows));
    }

    if (req.method === "GET") {
      const result = await pool.query(
        "SELECT * FROM offers ORDER BY created_at DESC, id DESC"
      );
      return json(result.rows.map((row) => mapOffer(row)));
    }

    if (req.method === "POST") {
      const body = await req.json();
      if (!body?.customer?.name?.trim()) {
        return json({ error: "Customer name is required" }, 400);
      }
      if (!Array.isArray(body.items) || body.items.length === 0) {
        return json({ error: "At least one product is required" }, 400);
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const total = body.items.reduce(
          (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 1),
          0
        );

        const inserted = await client.query(
          `INSERT INTO offers
            (customer_name, company_name, email, phone, address, grand_total, offer_date)
           VALUES ($1,$2,$3,$4,$5,$6,CURRENT_TIMESTAMP)
           RETURNING *`,
          [
            body.customer.name.trim(),
            body.customer.company || "",
            body.customer.email || "",
            body.customer.phone || "",
            body.customer.address || "",
            total
          ]
        );

        const offerRow = inserted.rows[0];
        const year = new Date(offerRow.offer_date).getFullYear();
        const offerNumber = `SAI/${year}/${String(offerRow.id).padStart(3, "0")}`;

        const updated = await client.query(
          "UPDATE offers SET offer_number = $1 WHERE id = $2 RETURNING *",
          [offerNumber, offerRow.id]
        );

        const savedItems = [];
        for (const item of body.items) {
          const quantity = Math.max(1, Number(item.quantity) || 1);
          const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
          const itemTotal = quantity * unitPrice;
          const result = await client.query(
            `INSERT INTO offer_items
              (offer_id, capacity, size, shaft_material, inlet_outlet, quantity, unit_price, total)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING *`,
            [
              offerRow.id,
              item.capacity || "",
              item.size || "",
              item.material || "",
              item.inletOutlet || "",
              quantity,
              unitPrice,
              itemTotal
            ]
          );
          savedItems.push(result.rows[0]);
        }

        await client.query("COMMIT");
        return json(mapOffer(updated.rows[0], savedItems), 201);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    if (req.method === "DELETE") {
      if (!offerNumber) return json({ error: "Offer id is required" }, 400);
      const result = await pool.query(
        "DELETE FROM offers WHERE offer_number = $1 RETURNING id",
        [offerNumber]
      );
      if (!result.rowCount) return json({ error: "Offer not found" }, 404);
      return json({ ok: true });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (error) {
    return errorResponse(error);
  }
};
