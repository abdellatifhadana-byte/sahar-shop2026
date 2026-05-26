import React, { useMemo, useState } from "react";
import { useStore } from "../store";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";

import type { Product } from "../types";

/* ================= AI CALL ================= */

async function callAI(endpoint: string, data: any) {
  const res = await fetch(`/api/ai/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

/* ================= MAIN ================= */

export default function ProductsPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    settings,
  } = useStore();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  /* ================= FILTERED ================= */

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  /* ================= AI: GENERATE PRODUCT ================= */

  const generateProduct = async () => {
    const idea = prompt("💡 اكتب فكرة المنتج");

    if (!idea) return;

    setAiLoading(true);

    const ai = await callAI("generate-product", { idea });

    addProduct({
      name: ai.name,
      description: ai.description,
      price: ai.price,
      category: ai.category,
      tags: ai.tags,
      emoji: "📦",
      stock: 10,
      cost: Math.round(ai.price * 0.5),
      images: [],
      sizes: ai.suggestedSizes || [],
      colors: ai.suggestedColors || [],
      status: "published",
      imageUrl: "",
    });

    setAiLoading(false);
  };

  /* ================= AI: OPTIMIZE ================= */

  const optimizeProduct = async (p: Product) => {
    setAiLoading(true);

    const ai = await callAI("optimize-product", {
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
    });

    updateProduct(p.id, {
      ...p,
      name: ai.name,
      description: ai.description,
      price: ai.price,
    });

    setAiLoading(false);
  };

  /* ================= AI: SMART PRICE ================= */

  const smartPrice = async (p: Product) => {
    const ai = await callAI("smart-price", {
      cost: p.cost,
      category: p.category,
    });

    updateProduct(p.id, {
      ...p,
      price: ai.price,
    });
  };

  /* ================= UI ================= */

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

      {/* ================= LEFT ================= */}
      <div>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>📦 Products AI GOD MODE</h1>

          <button onClick={generateProduct}>
            <Sparkles /> AI Create
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
          {filtered.map((p) => (
            <div key={p.id} style={{ border: "1px solid #333", padding: 10 }}>

              <h3>{p.name}</h3>
              <p>{p.description}</p>

              <p>💰 {p.price} {settings.brand.currency}</p>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>

                <button onClick={() => optimizeProduct(p)}>
                  <Wand2 size={14} /> Optimize
                </button>

                <button onClick={() => smartPrice(p)}>
                  💰 Price AI
                </button>

                <button onClick={() => deleteProduct(p.id)}>
                  <Trash2 size={14} />
                </button>

                <button onClick={() => adjustStock(p.id, +1)}>+</button>
                <button onClick={() => adjustStock(p.id, -1)}>-</button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT AI PANEL ================= */}
      <div style={{ borderLeft: "1px solid #333", paddingLeft: 10 }}>

        <h3>🧠 AI CONTROL PANEL</h3>

        <button onClick={generateProduct}>
          ⚡ Generate Product
        </button>

        <button onClick={() => alert("AI SEO coming soon")}>
          🏷️ SEO Boost
        </button>

        <button onClick={() => alert("Image AI ready")}>
          📸 Image Analyzer
        </button>

        <button onClick={() => alert("Market AI active")}>
          📊 Market Score
        </button>

        {aiLoading && <p>⏳ AI Thinking...</p>}
      </div>
    </div>
  );
}
