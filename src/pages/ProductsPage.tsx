import React from 'react';
import { useState, useRef } from 'react';
import { useStore } from '../store';
import { Plus, Search, X, Camera, Trash2, Edit3, Check, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { Product } from '../types';

type Filter = 'all' | 'published' | 'draft' | 'low' | 'out';
type Sort = 'newest' | 'name' | 'price' | 'stock' | 'sales';

const EMOJIS = ['👔','👗','🧥','👟','👜','👖','👕','👘','🧣','👒','🧢','👠','👞','💍','⌚','🕶️','🧤','🧦','👚','🎒','💼','👙','🩱'];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid var(--clr-border)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--txt-1)' }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--clr-border)', color: 'var(--txt-3)', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onNavigate }: { product?: Product; onClose: () => void; onNavigate?: (page: string) => void }) {
  const { addProduct, updateProduct, settings, notify, setPage } = useStore();
  // Detect category type for dynamic fields
  const getCatType = (cat: string) => {
    const lo = cat.toLowerCase();
    if (lo.includes('رجال') || lo.includes('نساء') || lo.includes('ملابس') || lo.includes('قميص') || lo.includes('بنطال') || lo.includes('فستان') || lo.includes('جاكيت') || lo.includes('hoodie')) return 'clothing';
    if (lo.includes('حذاء') || lo.includes('أحذية') || lo.includes('shoes')) return 'shoes';
    if (lo.includes('إكسسوار') || lo.includes('حقيبة') || lo.includes('ساعة') || lo.includes('مجوهر') || lo.includes('نظارة')) return 'accessory';
    if (lo.includes('أطفال') || lo.includes('بيبي') || lo.includes('طفل')) return 'children';
    if (lo.includes('منزل') || lo.includes('ديكور') || lo.includes('أثاث') || lo.includes('مطبخ')) return 'home';
    if (lo.includes('رياضة') || lo.includes('sport') || lo.includes('gym')) return 'sport';
    return 'general';
  };

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    cost: product?.cost?.toString() ?? '',
    stock: product?.stock?.toString() ?? '',
    category: product?.category ?? settings.products.categories[0] ?? '',
    sizes: product?.sizes ?? [...settings.products.defaultSizes],
    colors: product?.colors ?? [...settings.products.defaultColors],
    status: (product?.status ?? 'published') as Product['status'],
    emoji: product?.emoji ?? '📦',
    imageUrl: product?.imageUrl ?? '',
    images: product?.images ?? [],
    isForChildren: product?.isForChildren ?? false,
    ageRange: product?.ageRange ?? '',
    sizeType: (product as any)?.sizeType ?? 'adult',
    colorImages: (product as any)?.colorImages ?? {},
    // Smart extra fields
    brand: (product as any)?.brand ?? '',
    material: (product as any)?.material ?? '',
    gender: (product as any)?.gender ?? '',
    season: (product as any)?.season ?? '',
    dimensions: (product as any)?.dimensions ?? '',
    oldPrice: (product as any)?.oldPrice?.toString() ?? '',
  });

  const catType = getCatType(form.category);
  const [imgTab, setImgTab] = useState<'photo' | 'emoji'>('photo');
  const [step, setStep] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const STEPS = [
    { n: 1, label: 'الأساسي', icon: '📝' },
    { n: 2, label: 'الصور',   icon: '📸' },
    { n: 3, label: 'السعر',   icon: '💰' },
    { n: 4, label: 'التفاصيل',icon: '🏷️' },
    { n: 5, label: 'النشر',   icon: '✅' },
  ];

  const canNext = () => {
    if (step === 1) return !!(form.name.trim() && form.category);
    if (step === 3) return !!(form.price && parseFloat(form.price) > 0);
    return true;
  };

  const tog = (arr: string[], val: string) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 8 * 1024 * 1024) { notify('error', 'الصورة أكبر من 8MB'); return; }
    const r = new FileReader();
    r.onload = ev => setForm(p => ({ ...p, imageUrl: ev.target?.result as string }));
    r.readAsDataURL(f);
  };

  const save = () => {
    if (!form.name || !form.price) { notify('error', 'اسم المنتج والسعر مطلوبان'); return; }
    const d = { 
      name: form.name.trim(), description: form.description, 
      price: parseFloat(form.price) || 0, cost: parseFloat(form.cost) || 0, 
      stock: parseInt(form.stock) || 0, category: form.category, 
      sizes: form.sizes, colors: form.colors, status: form.status, 
      emoji: form.emoji, imageUrl: form.imageUrl, images: form.images, 
      isForChildren: form.isForChildren, ageRange: form.ageRange,
      sizeType: (form as any).sizeType,
      colorImages: (form as any).colorImages || {},
      brand: form.brand, material: form.material, gender: form.gender,
      season: form.season, dimensions: form.dimensions,
      oldPrice: parseFloat((form as any).oldPrice) || 0,
    };
    if (product) updateProduct(product.id, d); else addProduct(d);
    onClose();
  };

  const margin = form.price && form.cost ? Math.round(((parseFloat(form.price) - parseFloat(form.cost)) / parseFloat(form.price)) * 100) : 0;

  const chip = (active: boolean, onClick: () => void, label: string) => (
    <button onClick={onClick} style={{ padding: '6px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', transition: 'all .15s', border: `1.5px solid ${active ? 'rgba(99,102,241,0.5)' : 'var(--clr-border)'}`, background: active ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.04)', color: active ? 'var(--clr-pri-h)' : 'var(--txt-3)' }}>
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '82vh' }}>
      {/* Step indicator */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <button
                onClick={() => { if (s.n < step || (s.n === step + 1 && canNext())) setStep(s.n); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                  cursor: 'pointer', border: 'none', transition: 'all .15s',
                  background: step === s.n ? 'var(--ember)' : step > s.n ? 'rgba(0,210,179,.12)' : 'rgba(255,255,255,.05)',
                  color: step === s.n ? '#fff' : step > s.n ? 'var(--mint)' : 'var(--ink3)',
                }}>
                <span>{step > s.n ? '✓' : s.icon}</span>
                <span style={{ display: 'none' }} className="step-label">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, borderRadius: 1, background: step > s.n ? 'var(--mint)' : 'var(--border)', transition: 'background .3s' }}/>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink2)', marginTop: 8 }}>
          {STEPS[step-1].icon} {STEPS[step-1].label}
          <span style={{ color: 'var(--ink3)', fontWeight: 400 }}> — خطوة {step} من {STEPS.length}</span>
        </div>
      </div>

      {/* Step content */}
      <div style={{ padding: '18px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* STEP 1 — Basic info */}
      {step === 1 && (<>
      {/* Image */}
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['photo','emoji'].map(t => (
            <button key={t} onClick={() => setImgTab(t as any)} className={`tab-btn ${imgTab === t ? 'active' : ''}`} style={{ fontSize: 12.5 }}>
              {t === 'photo' ? '📸 صورة' : '😊 إيقونة'}
            </button>
          ))}
        </div>

      {/* Name */}
      <div>
        <label className="label">اسم المنتج *</label>
        <input className="input" placeholder="مثال: قميص كتان فاخر" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoFocus={!product} />
      </div>

      {/* Desc */}
      <div>
        <label className="label">الوصف</label>
        <textarea className="textarea" rows={2} placeholder="وصف مختصر..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>

      {/* Price / Cost / Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: `السعر * (${settings.brand.currency})`, key: 'price', ph: '299' },
          { label: 'التكلفة', key: 'cost', ph: '150' },
          { label: 'المخزون', key: 'stock', ph: '50' },
        ].map(f => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input className="input" type="number" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} dir="ltr" />
          </div>
        ))}
      </div>
      {margin > 0 && <p style={{ fontSize: 12, color: '#34d399', fontWeight: 800, marginTop: -10 }}>💰 هامش الربح: {margin}% — ربح {(parseFloat(form.price || '0') - parseFloat(form.cost || '0')).toFixed(0)} {settings.brand.currency}</p>}

      {/* Category */}
      <div>
        <label className="label">التصنيف</label>
        <select className="select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
          {settings.products.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      </>)}

      {/* STEP 2 — Images */}
      {step === 2 && (<>
      {/* Image */}
      <div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {(['photo','emoji'] as const).map(t => (
            <button key={t} onClick={() => setImgTab(t)} className={`tab-btn ${imgTab === t ? 'active' : ''}`} style={{ fontSize: 12.5 }}>
              {t === 'photo' ? '📸 صورة' : '😊 إيقونة'}
            </button>
          ))}
        </div>
        {imgTab === 'photo' ? (
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={handleImg} />
            {form.imageUrl ? (
              <div style={{ position: 'relative' }}>
                <img src={form.imageUrl} alt="" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--border)' }} />
                <button onClick={() => setForm(p => ({ ...p, imageUrl: '' }))} style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 8, background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
                {/* AI suggestions */}
                <div style={{ marginTop: 8, padding: '10px 12px', background: 'var(--ember-soft)', border: '1px solid var(--border-ember)', borderRadius: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ember)', marginBottom: 8 }}>✨ اقتراحات AI</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[{e:'🎨',l:'محرر الصور',a:'editor'},{e:'🏷️',l:'إضافة اللوغو',a:'logo'},{e:'📝',l:'اسم المتجر',a:'name'},{e:'👗',l:'شخص يلبسه',a:'wear'}].map(opt => (
                      <button key={opt.a} onClick={() => {
                        if (opt.a === 'wear') { notify('info', '🤖 يحتاج مفتاح Gemini Vision'); return; }
                        sessionStorage.setItem('sahar_editor_image', form.imageUrl);
                        if (opt.a !== 'editor') sessionStorage.setItem('editor_action', opt.a);
                        if (opt.a === 'name') sessionStorage.setItem('editor_store_name', settings.brand.name || 'SAHAR shop');
                        onClose(); setTimeout(() => setPage('editor'), 80);
                      }} style={{ display:'flex',alignItems:'center',gap:5,padding:'5px 11px',borderRadius:8,background:'var(--panel)',border:'1px solid var(--border)',color:'var(--ink2)',fontSize:11,fontWeight:700,cursor:'pointer' }}>
                        {opt.e} {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="img-upload" onClick={() => fileRef.current?.click()}>
                <Camera size={28} />
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>التقط أو اختر من المعرض</span>
                <span style={{ fontSize: 11.5, opacity: .6 }}>أقصى 8MB</span>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setForm(p => ({ ...p, emoji: e }))}
                style={{ width: 38, height: 38, borderRadius: 10, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `2px solid ${form.emoji === e ? 'var(--ember)' : 'transparent'}`, background: form.emoji === e ? 'var(--ember-soft)' : 'rgba(255,255,255,.05)' }}>
                {e}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color images */}
      {form.colors.length > 0 && (
        <div>
          <label className="label">صور الألوان (اختياري)</label>
          <p style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 8 }}>صورة مستقلة لكل لون — يراها الزبون عند اختياره</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.colors.map(color => {
              const colorImg = ((form as any).colorImages || {})[color];
              const inputId = `ci-${color}`;
              return (
                <div key={color} style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:'var(--void2)',borderRadius:10,border:'1px solid var(--border)' }}>
                  <div style={{ width:52,height:52,borderRadius:8,overflow:'hidden',background:'var(--panel)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'var(--ink3)' }}>
                    {colorImg ? <img src={colorImg} alt={color} style={{ width:'100%',height:'100%',objectFit:'cover' }}/> : '—'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13,fontWeight:700,color:'var(--ink1)',marginBottom:4 }}>{color}</div>
                    <div style={{ display:'flex',gap:6 }}>
                      <label htmlFor={inputId} style={{ padding:'4px 10px',borderRadius:6,background:'var(--ember)',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer' }}>
                        {colorImg ? '🔄' : '📸 إضافة'}
                      </label>
                      {colorImg && <button onClick={() => { const i={...(form as any).colorImages}; delete i[color]; setForm(p=>({...p,colorImages:i})); }} style={{ padding:'4px 10px',borderRadius:6,background:'rgba(255,77,26,.1)',border:'1px solid rgba(255,77,26,.2)',color:'var(--ember)',fontSize:11,cursor:'pointer' }}>حذف</button>}
                    </div>
                    <input id={inputId} type="file" accept="image/*" style={{ display:'none' }} onChange={(e) => {
                      const f=e.target.files?.[0]; if(!f) return;
                      const r=new FileReader(); r.onload=ev=>setForm(p=>({...p,colorImages:{...(p as any).colorImages,[color]:ev.target?.result as string}})); r.readAsDataURL(f); e.target.value='';
                    }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </>)}

      {/* STEP 3 — Pricing */}
      {step === 3 && (<>
      <div>
        <label className="label">السعر * ({settings.brand.currency})</label>
        <input className="input" type="number" placeholder="299" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} dir="ltr" style={{ fontSize: 22, fontWeight: 700 }}/>
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
        <div>
          <label className="label">السعر القديم (قبل الخصم)</label>
          <input className="input" type="number" placeholder="399" value={(form as any).oldPrice} onChange={e=>setForm(p=>({...p,oldPrice:e.target.value}))} dir="ltr"/>
          {(form as any).oldPrice && parseFloat((form as any).oldPrice) > parseFloat(form.price||'0') && (
            <p style={{ fontSize:11,color:'var(--mint)',fontWeight:700,marginTop:4 }}>
              🏷️ خصم {Math.round((1-parseFloat(form.price||'0')/parseFloat((form as any).oldPrice))*100)}%
            </p>
          )}
        </div>
        <div>
          <label className="label">التكلفة</label>
          <input className="input" type="number" placeholder="150" value={form.cost} onChange={e=>setForm(p=>({...p,cost:e.target.value}))} dir="ltr"/>
          {form.price && form.cost && parseFloat(form.price) > 0 && (
            <p style={{ fontSize:11,color:'#34d399',fontWeight:700,marginTop:4 }}>
              💰 ربح {Math.round(((parseFloat(form.price)-parseFloat(form.cost))/parseFloat(form.price))*100)}%
            </p>
          )}
        </div>
      </div>
      <div>
        <label className="label">المخزون</label>
        <input className="input" type="number" placeholder="50" value={form.stock} onChange={e=>setForm(p=>({...p,stock:e.target.value}))} dir="ltr"/>
      </div>
      </>)}

      {/* STEP 4 — Smart category fields */}
      {step === 4 && (<>
      {/* ── SMART DYNAMIC FIELDS ── */}
      {/* Old Price (discount) — already in step 3, skip here */}
      <div>
        <label className="label">السعر القديم (قبل التخفيض)</label>
        <input className="input" type="number" placeholder="مثال: 399 — اتركه فارغاً إن لم يكن هناك تخفيض"
          value={(form as any).oldPrice}
          onChange={e=>setForm(p=>({...p,oldPrice:e.target.value}))} dir="ltr"/>
        {(form as any).oldPrice && parseFloat((form as any).oldPrice) > parseFloat(form.price||'0') && (
          <p style={{ fontSize:11,color:'#34d399',fontWeight:700,marginTop:4 }}>
            🏷️ تخفيض: {Math.round((1-parseFloat(form.price||'0')/parseFloat((form as any).oldPrice))*100)}%
          </p>
        )}
      </div>

      {/* Gender — clothing, accessory, children */}
      {['clothing','accessory','children','sport'].includes(catType) && (
        <div>
          <label className="label">الجنس / الفئة</label>
          <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
            {(catType==='children'
              ? ['ولد','بنت','للجنسين']
              : ['رجال','نساء','للجنسين','يونيسكس']
            ).map(g=>(
              <button key={g} onClick={()=>setForm(p=>({...p,gender:g}))}
                style={{ padding:'6px 14px',borderRadius:99,fontSize:12,fontWeight:700,cursor:'pointer',border:`1.5px solid ${form.gender===g?'var(--ember)':'var(--border)'}`,background:form.gender===g?'var(--ember-soft)':'transparent',color:form.gender===g?'var(--ember)':'var(--ink3)' }}>
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {['clothing','shoes','accessory','sport'].includes(catType) && (
        <div>
          <label className="label">العلامة التجارية</label>
          <input className="input" placeholder="Nike / Zara / محلي..." value={form.brand}
            onChange={e=>setForm(p=>({...p,brand:e.target.value}))}/>
        </div>
      )}

      {/* Material */}
      {['clothing','accessory','home','children'].includes(catType) && (
        <div>
          <label className="label">الخامة / المادة</label>
          <div style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:6 }}>
            {(catType==='clothing'||catType==='children'
              ? ['قطن 100%','كتان','بوليستر','جلد','دنيم','صوف','مزيج']
              : catType==='accessory'
              ? ['جلد طبيعي','جلد صناعي','ستانلس','ذهب','فضة','قماش']
              : ['خشب','معدن','بلاستيك','زجاج','قماش']
            ).map(m=>(
              <button key={m} onClick={()=>setForm(p=>({...p,material:m}))}
                style={{ padding:'5px 12px',borderRadius:99,fontSize:11,fontWeight:700,cursor:'pointer',border:`1.5px solid ${form.material===m?'var(--mint)':'var(--border)'}`,background:form.material===m?'var(--mint-soft)':'transparent',color:form.material===m?'var(--mint)':'var(--ink3)' }}>
                {m}
              </button>
            ))}
          </div>
          {!['قطن 100%','كتان','بوليستر','جلد','دنيم','صوف','مزيج','جلد طبيعي','جلد صناعي','ستانلس','ذهب','فضة','قماش','خشب','معدن','بلاستيك','زجاج'].includes(form.material) && (
            <input className="input" placeholder="أو اكتب خامة أخرى..." value={form.material}
              onChange={e=>setForm(p=>({...p,material:e.target.value}))} style={{ marginTop:6 }}/>
          )}
        </div>
      )}

      {/* Season — clothing */}
      {catType==='clothing' && (
        <div>
          <label className="label">الموسم</label>
          <div style={{ display:'flex',gap:6 }}>
            {['صيف','شتاء','كل الفصول','ربيع/خريف'].map(s=>(
              <button key={s} onClick={()=>setForm(p=>({...p,season:s}))}
                style={{ flex:1,padding:'7px 6px',borderRadius:9,fontSize:11,fontWeight:700,cursor:'pointer',border:`1.5px solid ${form.season===s?'var(--gold)':'var(--border)'}`,background:form.season===s?'var(--gold-soft)':'transparent',color:form.season===s?'var(--gold)':'var(--ink3)',textAlign:'center' }}>
                {s==='صيف'?'☀️':s==='شتاء'?'❄️':s==='كل الفصول'?'🌍':'🍃'} {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dimensions — home/decor */}
      {catType==='home' && (
        <div>
          <label className="label">الأبعاد / الحجم</label>
          <input className="input" placeholder="مثال: 120 × 80 × 40 سم" value={form.dimensions}
            onChange={e=>setForm(p=>({...p,dimensions:e.target.value}))}/>
        </div>
      )}

      {/* Children age range */}
      {catType==='children' && (
        <div>
          <label className="label">الفئة العمرية</label>
          <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
            {['0-6 أشهر','6-12 شهر','1-2 سنة','2-4 سنوات','4-6 سنوات','6-10 سنوات','10+ سنوات'].map(a=>(
              <button key={a} onClick={()=>setForm(p=>({...p,ageRange:a}))}
                style={{ padding:'5px 11px',borderRadius:99,fontSize:11,fontWeight:700,cursor:'pointer',border:`1.5px solid ${form.ageRange===a?'var(--aurora)':'var(--border)'}`,background:form.ageRange===a?'var(--aurora-soft)':'transparent',color:form.ageRange===a?'var(--aurora)':'var(--ink3)' }}>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      <div>
        <label className="label">المقاسات</label>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {[['adult','بالغين'],['children','أطفال'],['shoes','أحذية']].map(([k,l]) => (
            <button key={k} onClick={() => setForm(p => ({ ...p, sizeType: k as any, sizes: [] }))}
              style={{ padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1.5px solid ${(form as any).sizeType === k ? 'var(--ember)' : 'var(--border)'}`, background: (form as any).sizeType === k ? 'rgba(255,77,26,.1)' : 'transparent', color: (form as any).sizeType === k ? 'var(--ember2)' : 'var(--ink3)' }}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {((form as any).sizeType === 'children'
            ? ['0-1 أسبوع','1-4 أسابيع','1-3 أشهر','3-6 أشهر','6-9 أشهر','9-12 شهر','12-18 شهر','18-24 شهر','2 سنوات','3 سنوات','4 سنوات','5 سنوات','6 سنوات','7 سنوات','8 سنوات','9 سنوات','10 سنوات','11 سنوات','12 سنوات']
            : (form as any).sizeType === 'shoes'
            ? ['35','36','37','38','39','40','41','42','43','44','45','46']
            : ['XS','S','M','L','XL','XXL','XXXL']
          ).map(s => chip(form.sizes.includes(s), () => setForm(p => ({ ...p, sizes: tog(p.sizes, s) })), s))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="label">الألوان</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['أسود','أبيض','أحمر','أزرق','أخضر','رمادي','بني','وردي','ذهبي','بيج','نبيتي','برتقالي'].map(c => chip(form.colors.includes(c), () => setForm(p => ({ ...p, colors: tog(p.colors, c) })), c))}
        </div>
      </div>

      {/* Color Images */}
      {form.colors.length > 0 && (
        <div>
          <label className="label">صور الألوان (اختياري)</label>
          <p style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 8 }}>
            أضف صورة لكل لون — الزبون سيرى صورة اللون الذي يختاره
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.colors.map(color => {
              const colorImgs = (form as any).colorImages || {};
              const colorImg = colorImgs[color];
              const inputId = `color-img-${color}`;
              return (
                <div key={color} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--void2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', background: 'var(--panel)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {colorImg
                      ? <img src={colorImg} alt={color} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 10, color: 'var(--ink3)' }}>بدون صورة</span>
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink1)', marginBottom: 4 }}>{color}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <label htmlFor={inputId} style={{ padding: '4px 12px', borderRadius: 6, background: 'var(--ember)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                        {colorImg ? '🔄 تغيير' : '📸 إضافة'}
                      </label>
                      {colorImg && (
                        <button onClick={() => {
                          const imgs = { ...(form as any).colorImages };
                          delete imgs[color];
                          setForm(p => ({ ...p, colorImages: imgs }));
                        }} style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(255,77,26,.1)', border: '1px solid rgba(255,77,26,.2)', color: 'var(--ember)', fontSize: 11, cursor: 'pointer' }}>
                          حذف
                        </button>
                      )}
                    </div>
                    <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]; if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
                          setForm(p => ({ ...p, colorImages: { ...(p as any).colorImages, [color]: ev.target?.result as string } }));
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      </>)}

      {/* STEP 5 — Publish */}
      {step === 5 && (<>
      {/* Status */}
      <div>
        <label className="label">الحالة</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {([['published','🟢 نشر مباشرة'],['draft','📝 مسودة']] as const).map(([s, l]) => (
            <button key={s} onClick={() => setForm(p => ({ ...p, status: s }))} style={{ padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all .18s', border: `1.5px solid ${form.status === s ? 'rgba(99,102,241,0.45)' : 'var(--clr-border)'}`, background: form.status === s ? 'rgba(99,102,241,0.13)' : 'rgba(255,255,255,0.04)', color: form.status === s ? 'var(--clr-pri-h)' : 'var(--txt-3)' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      </>)}

      </div>{/* end step content */}

      {/* Navigation */}
      <div style={{ padding: '12px 20px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }}>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost" style={{ paddingInline: 16 }}>
            → رجوع
          </button>
        )}
        <div style={{ flex: 1 }}/>
        {step < 5 ? (
          <button onClick={() => canNext() ? setStep(s => s + 1) : notify('error', 'أكمل الحقول المطلوبة أولاً')}
            className="btn btn-primary" style={{ paddingInline: 24 }}>
            التالي ←
          </button>
        ) : (
          <button onClick={save} className="btn btn-primary" style={{ paddingInline: 24, justifyContent: 'center' }}>
            <Check size={16} /> {product ? 'حفظ التعديلات' : 'نشر المنتج'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { products, setPage, deleteProduct, adjustStock, settings } = useStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<Sort>('newest');
  const [showFilter, setShowFilter] = useState(false);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editProd, setEditProd] = useState<Product | undefined>();
  const { currency } = settings.brand;

  const filtered = products.filter(p => {
    const mf = filter === 'all' ? true : filter === 'published' ? p.status === 'published' : filter === 'draft' ? p.status === 'draft' : filter === 'low' ? (p.stock > 0 && p.stock <= settings.products.lowStockAlert) : p.stock === 0;
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.includes(search);
    return mf && ms;
  }).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name,'ar') : sort === 'price' ? b.price - a.price : sort === 'stock' ? b.stock - a.stock : sort === 'sales' ? b.sales - a.sales : b.createdAt.localeCompare(a.createdAt));

  const counts = { all: products.length, published: products.filter(p => p.status === 'published').length, draft: products.filter(p => p.status === 'draft').length, low: products.filter(p => p.stock > 0 && p.stock <= settings.products.lowStockAlert).length, out: products.filter(p => p.stock === 0).length };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 className="page-title">المنتجات</h1>
          <p className="page-sub">{counts.published} منشور · {products.length} إجمالي</p>
        </div>
        <button onClick={() => { setEditProd(undefined); setModal('add'); }} className="btn btn-primary">
          <Plus size={16} /> إضافة منتج
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--txt-3)', pointerEvents: 'none' }} />
            <input className="input" style={{ paddingRight: 38 }} placeholder="بحث في المنتجات..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFilter(!showFilter)} className={`btn btn-ghost ${showFilter ? 'btn-ghost' : ''}`} style={{ paddingInline: 14 }}>
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {showFilter && (
          <div className="card anim-fade-in" style={{ padding: '14px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <div className="tabs" style={{ flex: 1 }}>
              {([['all','الكل'],['published','منشور'],['draft','مسودة'],['low','منخفض'],['out','نفذ']] as [Filter,string][]).map(([f,l]) => (
                <button key={f} onClick={() => setFilter(f)} className={`tab-btn ${filter === f ? 'active' : ''}`} style={{ fontSize: 12.5 }}>
                  {l} <span style={{ opacity: .5, marginRight: 3 }}>{counts[f]}</span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpDown size={14} style={{ color: 'var(--txt-3)', flexShrink: 0 }} />
              <select className="select" style={{ height: 34, fontSize: 12.5, width: 'auto', paddingInline: '10px' }} value={sort} onChange={e => setSort(e.target.value as Sort)}>
                <option value="newest">الأحدث</option>
                <option value="name">الاسم</option>
                <option value="price">السعر</option>
                <option value="stock">المخزون</option>
                <option value="sales">المبيعات</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card">
          {search ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div>
                <p className="empty-state-title">لا نتائج لـ "{search}"</p>
                <p className="empty-state-sub">جرب كلمة بحث مختلفة أو تحقق من الإملاء</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <div>
                <p className="empty-state-title">لا توجد منتجات بعد</p>
                <p className="empty-state-sub">أضف أول منتج وشارك متجرك مع زبائنك</p>
              </div>
              <button onClick={() => setModal('add')} className="btn btn-primary">
                <Plus size={15}/> أضف أول منتج
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {filtered.map(p => {
            const margin = p.cost > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
            const stockColor = p.stock === 0 ? '#f87171' : p.stock <= settings.products.lowStockAlert ? '#fbbf24' : '#34d399';
            return (
              <div key={p.id} className="product-card"
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement; el.style.transform='translateY(-4px)'; el.style.boxShadow='0 12px 36px rgba(0,0,0,.4)'; el.style.borderColor='rgba(255,255,255,.12)';}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=''; el.style.borderColor='';}}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--sh-md)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                {/* Image / Emoji */}
                <div style={{ position: 'relative', background: 'var(--clr-surface)' }}>
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08))' }}>
                      {p.emoji || '📦'}
                    </div>
                  )}
                  {/* Status */}
                  <span style={{ position: 'absolute', top: 8, right: 8, padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 800, background: p.status === 'published' ? 'rgba(16,185,129,0.85)' : 'rgba(245,158,11,0.85)', color: '#fff' }}>
                    {p.status === 'published' ? 'منشور' : 'مسودة'}
                  </span>
                  {p.stock === 0 && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(3px)' }}>
                      <span style={{ padding: '5px 14px', borderRadius: 20, background: 'rgba(239,68,68,0.85)', color: '#fff', fontSize: 12, fontWeight: 900 }}>نفذ من المخزون</span>
                    </div>
                  )}
                  {/* Actions */}
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 5, opacity: 0, transition: 'opacity .18s' }}
                    className="prod-actions">
                    <button onClick={() => { setEditProd(p); setModal('edit'); }} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit3 size={13} /></button>
                    <button onClick={() => { if (confirm(`حذف "${p.name}"؟`)) deleteProduct(p.id); }} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(239,68,68,0.75)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} /></button>
                    {p.status === 'published' && (
                      <button onClick={() => {
                        const uid2 = (() => { try { const u = localStorage.getItem('ai_commerce_user'); return u ? JSON.parse(u)?.id : ''; } catch { return ''; } })();
                        const storeUrl = `${window.location.origin}/store/${uid2}`;
                        const msg = `🛍️ *${p.name}*\n\n${p.description ? p.description + '\n\n' : ''}💰 السعر: ${p.price} ${settings.brand.currency}\n${(p.sizes||[]).length > 0 ? '📏 المقاسات: ' + (p.sizes||[]).join(' · ') + '\n' : ''}${(p.colors||[]).length > 0 ? '🎨 الألوان: ' + (p.colors||[]).join(' · ') + '\n' : ''}\n🛒 اطلب الآن: ${storeUrl}`;
                        const wPhone = (settings.brand.phone||'').replace(/\D/g,'');
                        if (wPhone) { window.open('https://wa.me/' + wPhone + '?text=' + encodeURIComponent(msg), '_blank'); }
                        else { navigator.clipboard?.writeText(msg); alert('تم نسخ رسالة المنتج — أرسلها لزبائنك!'); }
                      }} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(37,211,102,0.8)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="إرسال للزبائن">
                        <span style={{ fontSize: 13 }}>💬</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '12px 13px' }}>
                  <p style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--txt-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{p.name}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--txt-3)', marginBottom: 8 }}>{p.category}</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--txt-1)' }}>{p.price} <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>{currency}</span></span>
                    {margin > 0 && <span style={{ fontSize: 11, color: '#34d399', fontWeight: 800 }}>{margin}%</span>}
                  </div>

                  {/* Stock +/- */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => adjustStock(p.id, -1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', color: 'var(--txt-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>−</button>
                    <span style={{ flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 800, color: stockColor }}>{p.stock}</span>
                    <button onClick={() => adjustStock(p.id, +1)} style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--clr-border)', background: 'var(--clr-surface)', color: 'var(--txt-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16 }}>+</button>
                  </div>
                </div>

                <style>{`.card:hover .prod-actions { opacity: 1 !important; }`}</style>
              </div>
            );
          })}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'إضافة منتج جديد' : 'تعديل المنتج'} onClose={() => { setModal(null); setEditProd(undefined); }}>
          <ProductForm product={editProd} onClose={() => { setModal(null); setEditProd(undefined); }} />
        </Modal>
      )}
    </div>
  );
}
