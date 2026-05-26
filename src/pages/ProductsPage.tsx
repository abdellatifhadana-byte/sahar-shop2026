import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Sparkles, TrendingUp, AlertTriangle, Check } from 'lucide-react';
import type { Product } from '../types';

/* ---------------- SAFE AI ENGINE (FRONT ONLY) ---------------- */
const AI = {
  score(p: any) {
    let s = 50;
    if (p.imageUrl) s += 15;
    if (p.description?.length > 20) s += 10;
    if (p.price > p.cost * 1.5) s += 15;
    if (p.stock > 5) s += 10;
    return Math.min(100, s);
  },

  status(score: number) {
    if (score >= 80) return { label: 'ممتاز', color: '#10b981' };
    if (score >= 60) return { label: 'جيد', color: '#f59e0b' };
    return { label: 'ضعيف', color: '#ef4444' };
  },

  suggestPrice(cost: number) {
    return Math.round(cost * 1.8);
  },

  whatsapp(p: any, currency: string) {
    return `🛍️ ${p.name}\n💰 ${p.price} ${currency}\n📦 اطلب الآن قبل النفاذ`;
  }
};

export default function ProductsPage() {
  const { products, deleteProduct, adjustStock, settings } = useStore();

  const [search, setSearch] = useState('');

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🧠 AI Products Dashboard</h1>

        <button className="btn btn-primary">
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="input"
        placeholder="بحث ذكي..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginTop: 10 }}
      />

      {/* GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: 12,
        marginTop: 15
      }}>
        {filtered.map(p => {

          const score = AI.score(p);
          const status = AI.status(score);

          return (
            <div key={p.id} className="card" style={{ position: 'relative' }}>

              {/* SCORE */}
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: status.color,
                color: '#fff',
                padding: '3px 8px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 800
              }}>
                {score}/100
              </div>

              {/* IMAGE */}
              {p.imageUrl ? (
                <img src={p.imageUrl} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: 40, textAlign: 'center' }}>
                  {p.emoji || '📦'}
                </div>
              )}

              {/* NAME */}
              <h3 style={{ marginTop: 8 }}>{p.name}</h3>

              {/* PRICE */}
              <p>
                {p.price} {settings.brand.currency}
              </p>

              {/* AI STATUS */}
              <p style={{ color: status.color, fontWeight: 700, fontSize: 12 }}>
                {status.label}
              </p>

              {/* WARNING */}
              {score < 60 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#ef4444',
                  fontSize: 11
                }}>
                  <AlertTriangle size={14} />
                  يحتاج تحسين (صورة / وصف / سعر)
                </div>
              )}

              {/* STOCK */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button onClick={() => adjustStock(p.id, -1)}>-</button>
                <span>{p.stock}</span>
                <button onClick={() => adjustStock(p.id, 1)}>+</button>
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>

                <button
                  className="btn"
                  onClick={() => {
                    const msg = AI.whatsapp(p, settings.brand.currency);
                    navigator.clipboard.writeText(msg);
                    alert('تم نسخ رسالة التسويق');
                  }}
                >
                  💬 تسويق AI
                </button>

                <button
                  className="btn"
                  style={{ background: '#ef4444', color: '#fff' }}
                  onClick={() => deleteProduct(p.id)}
                >
                  <Trash2 size={14} />
                </button>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
