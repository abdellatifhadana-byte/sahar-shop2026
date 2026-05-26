import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../store';
import { Plus, Search, X, Camera, Trash2, Edit3, Check, Sparkles } from 'lucide-react';
import type { Product } from '../types';

/* ---------------- AI ENGINE ---------------- */
const AI = {
  suggestName(cat: string) {
    const map: any = {
      clothing: "قميص فاخر عصري",
      shoes: "حذاء رياضي احترافي",
      accessory: "إكسسوار أنيق",
      default: "منتج عالي الجودة"
    };
    return map[cat] || map.default;
  },

  suggestDescription(name: string) {
    return `✨ ${name} بجودة عالية وتصميم عصري مناسب لجميع الاستخدامات.`;
  },

  suggestPrice(cost: number) {
    return Math.round(cost * 1.8);
  },

  suggestEmoji(cat: string) {
    const map: any = {
      clothing: "👕",
      shoes: "👟",
      accessory: "👜",
      default: "📦"
    };
    return map[cat] || "📦";
  }
};

/* ---------------- MODAL ---------------- */
function Modal({ title, onClose, children }: any) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
          <h3>{title}</h3>
          <button onClick={onClose}><X /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- FORM ---------------- */
function ProductForm({ product, onClose }: any) {
  const { addProduct, updateProduct, settings, notify } = useStore();

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    cost: product?.cost?.toString() || '',
    stock: product?.stock?.toString() || '',
    category: product?.category || settings.products.categories[0],
    emoji: product?.emoji || '📦',
    imageUrl: product?.imageUrl || ''
  });

  /* ---------------- AI HELPERS ---------------- */
  const applyAIName = () => {
    setForm(p => ({ ...p, name: AI.suggestName(p.category) }));
  };

  const applyAIDescription = () => {
    setForm(p => ({ ...p, description: AI.suggestDescription(p.name) }));
  };

  const applyAIPrice = () => {
    const cost = parseFloat(form.cost || '0');
    if (cost > 0) {
      setForm(p => ({ ...p, price: AI.suggestPrice(cost).toString() }));
    }
  };

  const applyAIEmoji = () => {
    setForm(p => ({ ...p, emoji: AI.suggestEmoji(p.category) }));
  };

  /* ---------------- SAVE ---------------- */
  const save = () => {
    if (!form.name || !form.price) {
      notify('error', 'الاسم والسعر مطلوبان');
      return;
    }

    const data = {
      ...form,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost || '0'),
      stock: parseInt(form.stock || '0')
    };

    product ? updateProduct(product.id, data) : addProduct(data);
    onClose();
  };

  /* ---------------- PRICE ANALYSIS ---------------- */
  const margin = useMemo(() => {
    const price = parseFloat(form.price || '0');
    const cost = parseFloat(form.cost || '0');
    if (!price || !cost) return 0;
    return Math.round(((price - cost) / price) * 100);
  }, [form.price, form.cost]);

  return (
    <div style={{ padding: 16 }}>

      {/* AI BUTTONS */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <button onClick={applyAIName}><Sparkles size={14}/> اسم AI</button>
        <button onClick={applyAIDescription}><Sparkles size={14}/> وصف AI</button>
        <button onClick={applyAIPrice}><Sparkles size={14}/> سعر AI</button>
        <button onClick={applyAIEmoji}><Sparkles size={14}/> Emoji AI</button>
      </div>

      {/* FORM */}
      <input
        placeholder="اسم المنتج"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="input"
      />

      <textarea
        placeholder="الوصف"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        className="textarea"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input
          type="number"
          placeholder="السعر"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="input"
        />

        <input
          type="number"
          placeholder="التكلفة"
          value={form.cost}
          onChange={e => setForm({ ...form, cost: e.target.value })}
          className="input"
        />
      </div>

      {/* AI WARNING */}
      {margin < 20 && margin > 0 && (
        <p style={{ color: 'orange', fontWeight: 700 }}>
          ⚠️ هامش ربح ضعيف ({margin}%)
        </p>
      )}

      <button onClick={save} className="btn btn-primary">
        <Check /> حفظ المنتج
      </button>

    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function ProductsPage() {
  const { products, deleteProduct, adjustStock, settings } = useStore();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);

  /* ---------------- SMART FILTER ---------------- */
  const filtered = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>🛍️ المنتجات الذكية</h1>
        <button onClick={() => setModal(true)}>
          <Plus /> إضافة
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="بحث ذكي..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input"
      />

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} className="card">

            {/* IMAGE */}
            {p.imageUrl ? (
              <img src={p.imageUrl} style={{ width: '100%', height: 120 }} />
            ) : (
              <div style={{ fontSize: 40 }}>{p.emoji}</div>
            )}

            <h3>{p.name}</h3>

            <p>
              {p.price} {settings.brand.currency}
            </p>

            {/* STOCK */}
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => adjustStock(p.id, -1)}>-</button>
              <span>{p.stock}</span>
              <button onClick={() => adjustStock(p.id, 1)}>+</button>
            </div>

            {/* DELETE */}
            <button onClick={() => deleteProduct(p.id)}>
              <Trash2 size={14}/> حذف
            </button>

          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <Modal title="AI Product Creator" onClose={() => setModal(false)}>
          <ProductForm onClose={() => setModal(false)} />
        </Modal>
      )}

    </div>
  );
}
