return (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#07080D',
    padding: 20,
    flexDirection: 'column'
  }}>

    {/* LOGO */}
    <div style={{
      width: 110,
      height: 110,
      margin: '0 auto 16px',
      borderRadius: 24,
      overflow: 'hidden',
      background: '#07080D',
      boxShadow: '0 8px 32px rgba(255,77,26,.3), 0 0 0 1px rgba(255,255,255,.06)',
    }}>
      <img
        src="/sahar-logo-text.png"
        alt="SAHAR shop"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>

    {/* TITLE */}
    <h1 style={{
      fontSize: 26,
      fontWeight: 900,
      color: 'var(--ink1)',
      marginBottom: 6,
      letterSpacing: '-.02em'
    }}>
      <span style={{ color: 'var(--ember)' }}>SAHAR</span> shop
    </h1>

    <p style={{
      color: 'var(--ink3)',
      fontSize: 11,
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      marginBottom: 20
    }}>
      AI commerce OS
    </p>

    {/* CARD */}
    <div style={{
      width: '100%',
      maxWidth: 420,
      background: 'var(--panel)',
      border: '1px solid var(--border)',
      borderRadius: 24,
      padding: 28,
      backdropFilter: 'blur(20px)',
      boxShadow: '0 24px 64px rgba(0,0,0,.4)'
    }}>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--void2)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24
      }}>
        {[{ v: true, l: 'تسجيل الدخول' }, { v: false, l: 'حساب جديد' }].map(({ v, l }) => (
          <button
            key={l}
            onClick={() => { setIsLogin(v); setError(''); }}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: 9,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: isLogin === v ? 'var(--ember)' : 'transparent',
              color: isLogin === v ? '#fff' : 'var(--ink3)',
              border: 'none'
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {!isLogin && (
          <input
            style={inp}
            type="text"
            placeholder="اسمك الكامل *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        )}

        {!isLogin && (
          <input
            style={inp}
            type="text"
            placeholder="اسم متجرك"
            value={form.storeName}
            onChange={e => setForm({ ...form, storeName: e.target.value })}
          />
        )}

        <input
          style={{ ...inp, direction: 'ltr' }}
          type="email"
          placeholder="البريد الإلكتروني *"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <div style={{ position: 'relative' }}>
          <input
            style={{ ...inp, direction: 'ltr', paddingLeft: 42 }}
            type={showPass ? 'text' : 'password'}
            placeholder="كلمة المرور *"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--ink3)',
              cursor: 'pointer'
            }}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            background: 'rgba(255,77,26,.1)',
            border: '1px solid rgba(255,77,26,.25)',
            borderRadius: 10,
            padding: '10px 14px',
            color: 'var(--ember2)',
            fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* SUBMIT */}
        <button type="submit" disabled={loading} style={{
          padding: '15px',
          borderRadius: 12,
          border: 'none',
          background: 'var(--ember)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 900,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}>
          {loading ? 'جارٍ التحقق...' : isLogin ? 'دخول' : 'إنشاء الحساب'}
        </button>

      </form>

      {/* DEMO */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            localStorage.setItem('ai_commerce_token', 'demo');
            window.location.href = '/dashboard';
          }}
        >
          دخول Demo
        </button>
      </div>

    </div>
  </div>
);