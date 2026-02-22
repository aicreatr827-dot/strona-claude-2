// ============================================================
// GardenCraft — Shared Cart Logic
// ============================================================

const CART_KEY = 'gardencraft_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) { existing.qty += item.qty || 1; }
  else { cart.push({ ...item, qty: item.qty || 1 }); }
  saveCart(cart);
  showCartToast(item.name);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.qty = qty; if (item.qty <= 0) return removeFromCart(id); }
  saveCart(cart);
}

function getCartTotal() { return getCart().reduce((sum, i) => sum + i.price * i.qty, 0); }
function getCartCount() { return getCart().reduce((sum, i) => sum + i.qty, 0); }

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showCartToast(name) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = `position:fixed;bottom:2rem;right:2rem;z-index:9999;background:#2d4a2d;color:#fff;padding:1rem 1.5rem;border-radius:12px;font-family:Arial,sans-serif;font-size:0.9rem;box-shadow:0 12px 40px rgba(0,0,0,0.25);display:flex;align-items:center;gap:0.7rem;transform:translateY(100px);opacity:0;transition:all 0.35s cubic-bezier(.34,1.56,.64,1);`;
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span style="font-size:1.2rem">🛒</span><div><strong>${name}</strong><br><span style="opacity:.7;font-size:.8rem">Dodano do koszyka</span></div><a href="koszyk.html" style="margin-left:0.5rem;padding:0.4rem 0.9rem;background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:100px;color:#fff;font-size:0.78rem;font-weight:700;text-decoration:none;white-space:nowrap;flex-shrink:0;">Koszyk →</a>`;
  requestAnimationFrame(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.transform = 'translateY(100px)'; toast.style.opacity = '0'; }, 3000);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
