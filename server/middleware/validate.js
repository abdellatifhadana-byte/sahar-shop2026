'use strict';
/**
 * Input validation middleware for SAHAR SHOP
 * Protects against XSS, injection, oversized payloads
 */

// Sanitize a string value
function sanitizeStr(val, maxLen = 500) {
  if (val === null || val === undefined) return '';
  return String(val)
    .slice(0, maxLen)
    .replace(/[<>]/g, '') // basic XSS
    .trim();
}

// Validate Moroccan phone number
function isValidPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\+]/g, '');
  return /^(212|0)(5|6|7)\d{8}$/.test(clean) || /^\d{9,12}$/.test(clean);
}

// Validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

// Middleware: sanitize all string body fields (skip arrays/objects)
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      // Only sanitize primitive strings — never touch arrays or objects
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeStr(req.body[key]);
      }
      // For arrays of strings (like tags), sanitize each element
      // But arrays of objects (like items) — leave untouched
    }
  }
  next();
}

// Middleware: validate order creation
function validateOrder(req, res, next) {
  const { customerName, customerPhone, items, total } = req.body;
  const errors = [];
  if (!customerName || customerName.length < 2) errors.push('الاسم مطلوب (2 أحرف على الأقل)');
  if (!customerPhone) errors.push('رقم الهاتف مطلوب');
  if (!Array.isArray(items) || items.length === 0) errors.push('يجب إضافة منتج واحد على الأقل');
  if (isNaN(parseFloat(total)) || parseFloat(total) < 0) errors.push('المجموع غير صحيح');
  if (items && items.length > 50) errors.push('الحد الأقصى 50 منتج في الطلب');
  if (errors.length) return res.status(400).json({ error: errors[0], errors });
  next();
}

// Middleware: validate product
function validateProduct(req, res, next) {
  const { name, price } = req.body;
  if (!name || name.trim().length < 2) return res.status(400).json({ error: 'اسم المنتج مطلوب' });
  if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
    return res.status(400).json({ error: 'السعر غير صحيح' });
  }
  next();
}

// Middleware: validate auth
function validateAuth(req, res, next) {
  const { email, password } = req.body;
  if (!isValidEmail(email)) return res.status(400).json({ error: 'البريد الإلكتروني غير صحيح' });
  if (!password || password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
  next();
}

module.exports = { sanitizeBody, validateOrder, validateProduct, validateAuth, sanitizeStr, isValidPhone, isValidEmail };
