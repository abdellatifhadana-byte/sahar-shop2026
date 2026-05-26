import React, { useState, useRef } from 'react';
import { useStore } from '../store';
import { Plus, Search, X, Camera, Trash2, Edit3, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { Product } from '../types';

type Filter = 'all' | 'published' | 'draft' | 'low' | 'out';
type Sort = 'newest' | 'name' | 'price' | 'stock' | 'sales';

const EMOJIS = ['👔','👗','🧥','👟','👜','👖','👕','👘','🧣','👒','🧢','👠','👞','💍','⌚','🕶️','🧤','🧦','👚','🎒','💼','👙','🩱'];

function Modal({ title, onClose, children }: any) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20, borderBottom: '1px solid var(--clr-border)' }}>
          <h2 style={{ fontWeight: 900 }}>{title}</h2>
          <button onClick={onClose}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductForm({ product, onClose }: any) {
  const { addProduct, updateProduct, settings, notify, setPage } = useStore();

  const [step, setStep] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imgTab, setImgTab] = useState<'photo' | 'emoji'>('photo');

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    cost: product?.cost?.toString() || '',
    stock: product?.stock?.toString() || '',
    category: product?.category || settings.products.categories[0],
    sizes: product?.sizes || [],
    colors: product?.colors || [],
    status: product?.status || 'published',
    emoji: product?.emoji || '📦',
    imageUrl: product?.imageUrl || '',
    colorImages: product?.colorImages || {},
    oldPrice: product?.oldPrice?.toString() || ''
  });

  const steps = [
    { n: 1, label: 'الأساسي', icon: '📝' },
    { n: 2, label: 'الصور', icon: '📸' },
    { n: 3, label: 'السعر', icon: '💰' },
    { n: 4, label: 'التفاصيل', icon: '🏷️' },
    { n: 5, label: 'النشر', icon: '✅' }
  ];

  const canNext = () => {
    if (step === 1) return form.name && form.category;
    if (step === 3) return form.price;
    return true;
  };

  const save = () => {
    if (!form.name || !form.price) return notify('error', 'الاسم والسعر مطلوبان');

    const data = {
      ...form,
      price: parseFloat(form.price),
      cost: parseFloat(form.cost || '0'),
      stock: parseInt(form.stock || '0'),
      oldPrice: parseFloat(form.oldPrice || '0')
    };

    product ? updateProduct(product.id, data) : addProduct(data);
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '82vh' }}>

      {/* STEPS HEADER */}
      <div style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map(s => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              style={{
                padding: '6px 10px',
                borderRadius: 20,
                background: step === s.n ? 'var(--ember)' : '#222',
                color: '#fff'
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 20, overflowY: 'auto' }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
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

            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="select"
            >
              {settings.products.categories.map((c: string) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setImgTab('photo')}>📸</button>
              <button onClick={() => setImgTab('emoji')}>😊</button>
            </div>

            {imgTab === 'photo' ? (
              <div onClick={() => fileRef.current?.click()} style={{ padding: 20 }}>
                <Camera />
                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const r = new FileReader();
                    r.onload = ev => setForm({ ...form, imageUrl: ev.target?.result as string });
                    r.readAsDataURL(f);
                  }}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm({ ...form, emoji: e })}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <input
              type="number"
              placeholder="السعر"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="input"
            />
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <input
              placeholder="العلامة التجارية"
              value={form.brand || ''}
              onChange={e => setForm({ ...form, brand: e.target.value })}
              className="input"
            />
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div>
            <button onClick={save} className="btn btn-primary">
              <Check /> نشر المنتج
            </button>
          </div>
        )}

      </div>

      {/* NAV */}
      <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between' }}>
        {step > 1 && <button onClick={() => setStep(step - 1)}>رجوع</button>}
        {step < 5 ? (
          <button onClick={() => canNext() && setStep(step + 1)}>التالي</button>
        ) : null}
      </div>

    </div>
  );
}

export default function ProductsPage() {
  const { products, deleteProduct, adjustStock, settings } = useStore();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [edit, setEdit] = useState<Product | undefined>();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>المنتجات</h1>
        <button onClick={() => setModal('add')}><Plus /> إضافة</button>
      </div>

      <input
        placeholder="بحث..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
        {filtered.map(p => (
          <div key={p.id} className="card">

            {p.imageUrl ? (
              <img src={p.imageUrl} style={{ width: '100%' }} />
            ) : (
              <div style={{ fontSize: 40 }}>{p.emoji}</div>
            )}

            <h3>{p.name}</h3>
            <p>{p.price} {settings.brand.currency}</p>

            <div>
              <button onClick={() => adjustStock(p.id, -1)}>-</button>
              <span>{p.stock}</span>
              <button onClick={() => adjustStock(p.id, 1)}>+</button>
            </div>

            <button onClick={() => deleteProduct(p.id)}>حذف</button>

          </div>
        ))}
      </div>

      {modal && (
        <Modal title="منتج" onClose={() => setModal(null)}>
          <ProductForm product={edit} onClose={() => setModal(null)} />
        </Modal>
      )}

    </div>
  );
}
