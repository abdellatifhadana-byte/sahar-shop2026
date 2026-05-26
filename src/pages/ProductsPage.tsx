import React, { useState, useMemo } from "react";
import { useStore } from "../store";
import { Plus, Search, Edit3, Trash2, SlidersHorizontal } from "lucide-react";
import type { Product } from "../types";

/* ---------------- TYPES ---------------- */

type Filter = "all" | "published" | "draft" | "low" | "out";
type Sort = "newest" | "name" | "price" | "stock";

/* ---------------- UI HELPERS ---------------- */

const badgeColor = (status: Product["status"]) => {
  if (status === "published") return "rgba(16,185,129,0.15)";
  if (status === "draft") return "rgba(245,158,11,0.15)";
  return "rgba(239,68,68,0.15)";
};

const card = {
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
  background: "var(--clr-surface)",
  border: "1px solid var(--clr-border)",
};

/* ---------------- MAIN ---------------- */

export default function ProductsPage() {
  const { products, deleteProduct, adjustStock, settings } = useStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");

  /* ---------------- FILTERED ---------------- */

  const filtered = useMemo(() => {
    return products
      .filter((p) => {
        const matchSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase());

        const matchFilter =
          filter === "all"
            ? true
            : filter === "published"
            ? p.status === "published"
            : filter === "draft"
            ? p.status === "draft"
            : filter === "low"
            ? p.stock > 0 && p.stock <= settings.products.lowStockAlert
            : p.stock === 0;

        return matchSearch && matchFilter;
      })
      .sort((a, b) => {
        if (sort === "name") return a.name.localeCompare(b.name, "ar");
        if (sort === "price") return b.price - a.price;
        if (sort === "stock") return b.stock - a.stock;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [products, search, filter, sort, settings]);

  /* ---------------- UI ---------------- */

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>المنتجات</h1>
          <p style={{ fontSize: 12, opacity: 0.6 }}>
            {products.length} منتج
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              opacity: 0.5,
            }}
          />
          <input
            className="input"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
        >
          <option value="newest">الأحدث</option>
          <option value="name">الاسم</option>
          <option value="price">السعر</option>
          <option value="stock">المخزون</option>
        </select>
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["all", "published", "draft", "low", "out"] as Filter[]).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tab-btn ${filter === f ? "active" : ""}`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14,
        }}
      >
        {filtered.map((p) => (
          <div key={p.id} style={card}>

            {/* IMAGE */}
            <div style={{ position: "relative" }}>
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  style={{ width: "100%", height: 160, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    height: 160,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                  }}
                >
                  {p.emoji}
                </div>
              )}

              {/* STATUS */}
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  padding: "4px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800,
                  background: badgeColor(p.status),
                }}
              >
                {p.status}
              </span>

              {/* ACTIONS */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  display: "flex",
                  gap: 6,
                }}
              >
                <button className="icon-btn">
                  <Edit3 size={14} />
                </button>

                <button
                  className="icon-btn danger"
                  onClick={() => deleteProduct(p.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* INFO */}
            <div style={{ padding: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800 }}>
                {p.name}
              </h3>

              <p style={{ fontSize: 11, opacity: 0.6 }}>
                {p.category}
              </p>

              {/* PRICE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <strong>{p.price} {settings.brand.currency}</strong>
                <span style={{ fontSize: 11, opacity: 0.6 }}>
                  stock: {p.stock}
                </span>
              </div>

              {/* STOCK CONTROL */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 10,
                }}
              >
                <button
                  onClick={() => adjustStock(p.id, -1)}
                  className="icon-btn"
                >
                  -
                </button>

                <button
                  onClick={() => adjustStock(p.id, +1)}
                  className="icon-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
