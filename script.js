// Product catalogue: edit names, categories, emojis, and service prices here.
const PRODUCTS = [
  { id: "shirt", name: "Casual shirt", category: "Men", emoji: "👔", prices: { "Wash & Fold": 39, "Wash & Iron": 59, "Dry Clean": 99, "Steam Iron": 29 } },
  { id: "trousers", name: "Trousers", category: "Men", emoji: "👖", prices: { "Wash & Fold": 49, "Wash & Iron": 69, "Dry Clean": 119, "Steam Iron": 39 } },
  { id: "tshirt", name: "T-shirt", category: "Men", emoji: "👕", prices: { "Wash & Fold": 29, "Wash & Iron": 49, "Dry Clean": 89, "Steam Iron": 25 } },
  { id: "jeans", name: "Denim jeans", category: "Men", emoji: "🩳", prices: { "Wash & Fold": 49, "Wash & Iron": 69, "Dry Clean": 129, "Steam Iron": 39 } },
  { id: "suit", name: "Two-piece suit", category: "Premium care", emoji: "🤵", prices: { "Wash & Fold": 179, "Wash & Iron": 219, "Dry Clean": 349, "Steam Iron": 129 } },
  { id: "kurta", name: "Kurta", category: "Men", emoji: "🥻", prices: { "Wash & Fold": 49, "Wash & Iron": 69, "Dry Clean": 119, "Steam Iron": 39 } },
  { id: "dress", name: "Everyday dress", category: "Women", emoji: "👗", prices: { "Wash & Fold": 59, "Wash & Iron": 79, "Dry Clean": 149, "Steam Iron": 49 } },
  { id: "saree", name: "Saree", category: "Women", emoji: "🥻", prices: { "Wash & Fold": 99, "Wash & Iron": 129, "Dry Clean": 249, "Steam Iron": 79 } },
  { id: "blouse", name: "Blouse", category: "Women", emoji: "👚", prices: { "Wash & Fold": 39, "Wash & Iron": 59, "Dry Clean": 99, "Steam Iron": 29 } },
  { id: "leggings", name: "Leggings", category: "Women", emoji: "🩱", prices: { "Wash & Fold": 29, "Wash & Iron": 45, "Dry Clean": 89, "Steam Iron": 25 } },
  { id: "sweater", name: "Woollen sweater", category: "Premium care", emoji: "🧶", prices: { "Wash & Fold": 69, "Wash & Iron": 89, "Dry Clean": 179, "Steam Iron": 59 } },
  { id: "jacket", name: "Winter jacket", category: "Premium care", emoji: "🧥", prices: { "Wash & Fold": 129, "Wash & Iron": 159, "Dry Clean": 279, "Steam Iron": 99 } },
  { id: "kids-set", name: "Kids' outfit", category: "Kids", emoji: "🧒", prices: { "Wash & Fold": 39, "Wash & Iron": 55, "Dry Clean": 99, "Steam Iron": 29 } },
  { id: "kids-dress", name: "Kids' dress", category: "Kids", emoji: "👗", prices: { "Wash & Fold": 45, "Wash & Iron": 65, "Dry Clean": 119, "Steam Iron": 35 } },
  { id: "school-uniform", name: "School uniform", category: "Kids", emoji: "🎒", prices: { "Wash & Fold": 39, "Wash & Iron": 55, "Dry Clean": 89, "Steam Iron": 29 } },
  { id: "bedsheet", name: "Double bedsheet", category: "Household", emoji: "🛏️", prices: { "Wash & Fold": 99, "Wash & Iron": 129, "Dry Clean": 199, "Steam Iron": 79 } },
  { id: "blanket", name: "Blanket", category: "Household", emoji: "🧣", prices: { "Wash & Fold": 179, "Wash & Iron": 219, "Dry Clean": 329, "Steam Iron": 149 } },
  { id: "curtains", name: "Curtains (pair)", category: "Household", emoji: "🪟", prices: { "Wash & Fold": 149, "Wash & Iron": 179, "Dry Clean": 299, "Steam Iron": 119 } },
  { id: "towel", name: "Bath towel", category: "Household", emoji: "🧖", prices: { "Wash & Fold": 39, "Wash & Iron": 49, "Dry Clean": 89, "Steam Iron": 29 } },
  { id: "leather-jacket", name: "Leather jacket", category: "Premium care", emoji: "🧥", prices: { "Wash & Fold": 249, "Wash & Iron": 299, "Dry Clean": 499, "Steam Iron": 199 } }
];

// Service labels, storage keys, order stages, and shared app state.
const SERVICES = ["Wash & Fold", "Wash & Iron", "Dry Clean", "Steam Iron"];
const CART_STORAGE_KEY = "freshfold_cart_v1";
const ORDERS_STORAGE_KEY = "freshfold_orders_v1";
const ORDER_STEPS = ["Order placed", "Picked up", "Cleaning", "Out for delivery", "Delivered"];
let cart = loadStoredArray(CART_STORAGE_KEY);
let orders = loadStoredArray(ORDERS_STORAGE_KEY);
let activeCategory = "All";
let activeCoupon = "";
let selectedOrderId = "";
let loggedInPhone = loadSavedPhone();
let toastTimer;
let returnFocusElement = null;

const elements = {
  productGrid: document.getElementById("product-grid"),
  emptyState: document.getElementById("empty-state"),
  shopSearch: document.getElementById("shop-search-input"),
  cartCount: document.getElementById("cart-count"),
  drawerCount: document.getElementById("drawer-item-count"),
  overlay: document.getElementById("overlay"),
  drawer: document.getElementById("cart-drawer"),
  cartItems: document.getElementById("cart-items"),
  cartEmpty: document.getElementById("cart-empty"),
  cartBottom: document.getElementById("cart-bottom"),
  subtotal: document.getElementById("subtotal-value"),
  discount: document.getElementById("discount-value"),
  delivery: document.getElementById("delivery-value"),
  total: document.getElementById("total-value"),
  minimumNote: document.getElementById("minimum-note"),
  checkoutButton: document.getElementById("checkout-button"),
  couponMessage: document.getElementById("coupon-message"),
  modal: document.getElementById("modal-shell"),
  modalContent: document.getElementById("modal-content"),
  toast: document.getElementById("toast")
};

// Safe storage helpers: browser privacy settings can disable localStorage.
function loadStoredArray(key) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("FreshFold could not read saved data.", error);
    return [];
  }
}

function loadSavedPhone() {
  try {
    const phone = localStorage.getItem("freshfold_phone_v1") || "";
    return /^\d{10}$/.test(phone) ? phone : "";
  } catch (error) {
    console.warn("FreshFold could not read the saved sign-in.", error);
    return "";
  }
}

function savePhone(phone) {
  try {
    localStorage.setItem("freshfold_phone_v1", phone);
    return true;
  } catch (error) {
    console.warn("FreshFold could not save the sign-in.", error);
    showToast("We couldn't save your sign-in on this device.");
    return false;
  }
}

function clearSavedPhone() {
  try {
    localStorage.removeItem("freshfold_phone_v1");
    return true;
  } catch (error) {
    console.warn("FreshFold could not clear the saved sign-in.", error);
    showToast("We couldn't sign out on this device.");
    return false;
  }
}

function saveStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("FreshFold could not save your data.", error);
    showToast("We couldn't save this on your device. Please keep this tab open.");
    return false;
  }
}

// Escape any text that is interpolated into HTML templates.
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function formatPrice(value) {
  return `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
}

function productById(id) {
  return PRODUCTS.find(product => product.id === id);
}

function getServicePrice(product, service) {
  return Number(product.prices[service]) || 0;
}

function cartQuantityFor(productId, service) {
  const line = cart.find(item => item.productId === productId && item.service === service);
  return line ? line.quantity : 0;
}

function itemCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function subtotalAmount() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function couponDiscount(subtotal = subtotalAmount()) {
  if (activeCoupon === "FRESH20") return Math.min(Math.round(subtotal * 0.2), 100);
  if (activeCoupon === "SAVE50" && subtotal >= 500) return 50;
  return 0;
}

function deliveryAmount(subtotal = subtotalAmount()) {
  if (subtotal === 0 || subtotal > 299) return 0;
  return 40;
}

function orderTotal(subtotal = subtotalAmount()) {
  return Math.max(0, subtotal - couponDiscount(subtotal) + deliveryAmount(subtotal));
}

// Shop rendering and product service/quantity controls.
function renderProducts() {
  const search = elements.shopSearch.value.trim().toLocaleLowerCase();
  let visibleProducts = PRODUCTS.filter(product => {
    const categoryMatches = activeCategory === "All" || product.category === activeCategory;
    const searchMatches = `${product.name} ${product.category}`.toLocaleLowerCase().includes(search);
    return categoryMatches && searchMatches;
  });
  elements.emptyState.classList.toggle("hidden", visibleProducts.length > 0);
  elements.productGrid.innerHTML = visibleProducts.map(product => {
    const service = SERVICES[0];
    const quantity = cartQuantityFor(product.id, service);
    return `<article class="product-card" data-product="${escapeHTML(product.id)}">
      <div class="product-visual"><span class="product-emoji" aria-hidden="true">${escapeHTML(product.emoji)}</span><span class="product-category">${escapeHTML(product.category)}</span></div>
      <div class="product-details"><h3>${escapeHTML(product.name)}</h3>
        <p class="product-price" data-price-for="${escapeHTML(product.id)}">${formatPrice(getServicePrice(product, service))} <small>/ piece</small></p>
        <label class="sr-only" for="service-${escapeHTML(product.id)}">Service for ${escapeHTML(product.name)}</label>
        <select class="service-select" id="service-${escapeHTML(product.id)}" data-service-for="${escapeHTML(product.id)}">${SERVICES.map(name => `<option value="${escapeHTML(name)}"${name === service ? " selected" : ""}>${escapeHTML(name)}</option>`).join("")}</select>
        <div class="product-action" data-action-for="${escapeHTML(product.id)}">${quantity > 0 ? productStepperHTML(product.id, service, quantity) : `<button class="add-button" type="button" data-add="${escapeHTML(product.id)}">Add to bag</button>`}</div>
      </div>
    </article>`;
  }).join("");
}

function productStepperHTML(productId, service, quantity) {
  return `<div class="quantity-control"><button type="button" data-product-qty="${escapeHTML(productId)}" data-service="${escapeHTML(service)}" data-change="-1" aria-label="Remove one">−</button><span>${quantity} in bag</span><button type="button" data-product-qty="${escapeHTML(productId)}" data-service="${escapeHTML(service)}" data-change="1" aria-label="Add one">+</button></div>`;
}

function syncProductCard(productId) {
  const product = productById(productId);
  const card = elements.productGrid.querySelector(`[data-product="${CSS.escape(productId)}"]`);
  if (!product || !card) return;
  const select = card.querySelector(".service-select");
  const price = card.querySelector(`[data-price-for="${CSS.escape(productId)}"]`);
  const action = card.querySelector(`[data-action-for="${CSS.escape(productId)}"]`);
  const service = select.value;
  const quantity = cartQuantityFor(productId, service);
  price.innerHTML = `${formatPrice(getServicePrice(product, service))} <small>/ piece</small>`;
  action.innerHTML = quantity > 0 ? productStepperHTML(productId, service, quantity) : `<button class="add-button" type="button" data-add="${escapeHTML(productId)}">Add to bag</button>`;
}

function addToCart(productId, service) {
  const product = productById(productId);
  if (!product || !SERVICES.includes(service)) return;
  const existing = cart.find(item => item.productId === productId && item.service === service);
  if (existing) existing.quantity += 1;
  else cart.push({ productId, service, price: getServicePrice(product, service), quantity: 1 });
  persistCart();
  refreshCart();
  syncProductCard(productId);
}

function changeCartQuantity(productId, service, change) {
  const line = cart.find(item => item.productId === productId && item.service === service);
  if (!line) return;
  line.quantity += change;
  if (line.quantity <= 0) cart = cart.filter(item => item !== line);
  persistCart();
  refreshCart();
  syncProductCard(productId);
}

function removeFromCart(productId, service) {
  cart = cart.filter(item => !(item.productId === productId && item.service === service));
  persistCart();
  refreshCart();
  syncProductCard(productId);
}

function persistCart() {
  saveStoredValue(CART_STORAGE_KEY, cart);
}

// Cart drawer contents, coupon rules, and price calculation.
function renderCartItems() {
  const validItems = cart.filter(item => productById(item.productId) && SERVICES.includes(item.service) && Number.isFinite(item.quantity) && item.quantity > 0);
  if (validItems.length !== cart.length) {
    cart = validItems;
    persistCart();
  }
  elements.cartItems.innerHTML = cart.map(item => {
    const product = productById(item.productId);
    return `<article class="cart-line">
      <div class="cart-line-emoji" aria-hidden="true">${escapeHTML(product.emoji)}</div>
      <div class="cart-line-main"><h3>${escapeHTML(product.name)}</h3><p>${escapeHTML(item.service)} · ${formatPrice(item.price)} / piece</p>
        <div class="mini-quantity"><button type="button" data-cart-change="-1" data-id="${escapeHTML(item.productId)}" data-service="${escapeHTML(item.service)}" aria-label="Remove one ${escapeHTML(product.name)}">−</button><span>${item.quantity}</span><button type="button" data-cart-change="1" data-id="${escapeHTML(item.productId)}" data-service="${escapeHTML(item.service)}" aria-label="Add one ${escapeHTML(product.name)}">+</button></div>
      </div>
      <div class="cart-line-side"><span class="cart-line-price">${formatPrice(item.price * item.quantity)}</span><button class="remove-button" type="button" data-remove="${escapeHTML(item.productId)}" data-service="${escapeHTML(item.service)}">Remove</button></div>
    </article>`;
  }).join("");
}

function refreshCart() {
  const count = itemCount();
  const subtotal = subtotalAmount();
  const discount = couponDiscount(subtotal);
  const delivery = deliveryAmount(subtotal);
  const total = subtotal - discount + delivery;
  elements.cartCount.textContent = String(count);
  document.getElementById("cart-button").setAttribute("aria-label", `Open cart, ${count} item${count === 1 ? "" : "s"}`);
  elements.drawerCount.textContent = `(${count})`;
  renderCartItems();
  elements.productGrid.querySelectorAll(".product-card").forEach(card => syncProductCard(card.dataset.product));
  elements.cartEmpty.classList.toggle("visible", count === 0);
  elements.cartBottom.classList.toggle("is-empty", count === 0);
  elements.subtotal.textContent = formatPrice(subtotal);
  elements.discount.textContent = `−${formatPrice(discount)}`;
  elements.delivery.textContent = formatPrice(delivery);
  elements.total.textContent = formatPrice(total);
  elements.checkoutButton.disabled = subtotal < 149;
  elements.minimumNote.textContent = subtotal < 149 && count > 0 ? `Add ${formatPrice(149 - subtotal)} more to reach the ₹149 minimum.` : count > 0 ? (subtotal >= 299 ? "Free delivery unlocked!" : "Free delivery on orders of ₹299 or more.") : "Minimum order value is ₹149.";
  if (activeCoupon === "SAVE50" && subtotal < 500) {
    elements.couponMessage.textContent = "Add items worth ₹500 to unlock SAVE50.";
    elements.couponMessage.classList.add("error");
  } else if (activeCoupon) {
    elements.couponMessage.textContent = `${activeCoupon} applied — you saved ${formatPrice(discount)}.`;
    elements.couponMessage.classList.remove("error");
  }
}

function applyCoupon(code) {
  const normalized = code.trim().toUpperCase();
  if (normalized !== "FRESH20" && normalized !== "SAVE50") {
    activeCoupon = "";
    elements.couponMessage.textContent = "That coupon code isn't valid. Try FRESH20 or SAVE50.";
    elements.couponMessage.classList.add("error");
    refreshCart();
    return;
  }
  if (normalized === "SAVE50" && subtotalAmount() < 500) {
    activeCoupon = "";
    elements.couponMessage.textContent = "SAVE50 works on orders of ₹500 or more.";
    elements.couponMessage.classList.add("error");
    refreshCart();
    return;
  }
  activeCoupon = normalized;
  elements.couponMessage.classList.remove("error");
  refreshCart();
}

// Shared overlay, drawer, modal, toast, and keyboard interactions.
function showOverlay() {
  elements.overlay.hidden = false;
  document.body.classList.add("no-scroll");
}

function hideOverlayIfUnused() {
  if (!elements.drawer.classList.contains("open") && elements.modal.hidden) {
    elements.overlay.hidden = true;
    document.body.classList.remove("no-scroll");
  }
}

function openCart() {
  returnFocusElement = document.activeElement;
  elements.drawer.classList.add("open");
  elements.drawer.setAttribute("aria-hidden", "false");
  showOverlay();
  document.getElementById("close-cart").focus();
}

function closeCart() {
  elements.drawer.classList.remove("open");
  elements.drawer.setAttribute("aria-hidden", "true");
  hideOverlayIfUnused();
  if (returnFocusElement && typeof returnFocusElement.focus === "function") returnFocusElement.focus();
}

function openModal(html) {
  returnFocusElement = document.activeElement;
  elements.modalContent.innerHTML = html;
  elements.modal.hidden = false;
  showOverlay();
  document.getElementById("close-modal").focus();
}

function closeModal() {
  elements.modal.hidden = true;
  elements.modalContent.innerHTML = "";
  hideOverlayIfUnused();
  if (returnFocusElement && typeof returnFocusElement.focus === "function") returnFocusElement.focus();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 2800);
}

// Checkout form, client-side validation, and simulated payment/order creation.
function upcomingPickupDates() {
  const dates = [];
  for (let offset = 0; offset <= 3; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    dates.push(date);
  }
  return dates;
}

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function checkoutTemplate() {
  const dates = upcomingPickupDates();
  return `<div class="modal-heading"><span class="eyebrow">ONE LAST STEP</span><h2 id="modal-title">Schedule your pickup</h2><p>Tell us where and when to collect your laundry.</p></div>
    <form class="checkout-form" id="checkout-form" novalidate>
      <div class="form-field"><label for="customer-name">Full name</label><input id="customer-name" name="name" autocomplete="name" placeholder="Your name" required><span class="field-error" data-error-for="name"></span></div>
      <div class="form-field"><label for="customer-mobile">Mobile number</label><input id="customer-mobile" name="mobile" type="tel" inputmode="numeric" autocomplete="tel" maxlength="10" value="${escapeHTML(loggedInPhone)}" placeholder="10-digit number" required><span class="field-error" data-error-for="mobile"></span></div>
      <div class="form-field full-width"><label for="customer-address">Pickup address</label><input id="customer-address" name="address" autocomplete="street-address" placeholder="House / flat, street, area" required><span class="field-error" data-error-for="address"></span></div>
      <div class="form-field"><label for="customer-pincode">Pincode</label><input id="customer-pincode" name="pincode" inputmode="numeric" autocomplete="postal-code" maxlength="6" placeholder="6-digit pincode" required><span class="field-error" data-error-for="pincode"></span></div>
      <div class="form-field"><label for="pickup-date">Pickup date · delivered same day</label><select id="pickup-date" name="date" required>${dates.map(date => `<option value="${localDateValue(date)}">${date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</option>`).join("")}</select><span class="field-error" data-error-for="date"></span></div>
      <div class="form-field full-width"><label for="pickup-slot">Pickup time slot</label><select id="pickup-slot" name="slot"><option>9 AM – 12 PM</option><option>12 PM – 3 PM</option><option>3 PM – 6 PM</option><option>6 PM – 9 PM</option></select></div>
      <fieldset class="choice-group"><legend>Payment method</legend><div class="choice-options three-options">
        <label class="choice-card"><input type="radio" name="payment" value="UPI" checked><span>UPI</span></label>
        <label class="choice-card"><input type="radio" name="payment" value="Card"><span>Card</span></label>
        <label class="choice-card"><input type="radio" name="payment" value="Cash on delivery"><span>Cash on delivery</span></label>
      </div></fieldset>
      <p class="demo-payment-note">Demo checkout — no real payment will be taken.</p>
      <div class="checkout-total"><strong>Order total</strong><strong id="checkout-total">${formatPrice(orderTotal())}</strong></div>
      <p class="form-message" id="form-message" aria-live="polite"></p>
      <button class="primary-button" type="submit">Place order <span aria-hidden="true">→</span></button>
    </form>`;
}

function validateCheckout(formData) {
  const fields = {
    name: formData.get("name").trim().length >= 2 ? "" : "Please enter your name.",
    mobile: /^\d{10}$/.test(formData.get("mobile").trim()) ? "" : "Enter a valid 10-digit mobile number.",
    address: formData.get("address").trim().length >= 8 ? "" : "Please enter your full pickup address.",
    pincode: /^\d{6}$/.test(formData.get("pincode").trim()) ? "" : "Enter a valid 6-digit pincode.",
    date: formData.get("date") ? "" : "Choose a pickup date."
  };
  Object.entries(fields).forEach(([name, message]) => {
    const messageElement = elements.modalContent.querySelector(`[data-error-for="${name}"]`);
    const inputElement = elements.modalContent.querySelector(`[name="${name}"]`);
    messageElement.textContent = message;
    inputElement.setAttribute("aria-invalid", message ? "true" : "false");
  });
  return Object.values(fields).every(message => !message);
}

// Optional mobile-number demo sign-in; real identity verification needs a backend.
function refreshLoginButton() {
  const label = document.getElementById("login-label");
  const button = document.getElementById("login-button");
  label.textContent = loggedInPhone ? "Account" : "Login";
  button.setAttribute("aria-label", loggedInPhone ? `Account signed in as ${loggedInPhone}` : "Sign in with mobile number");
}

function openLoginPage(showOrderHistoryAfterLogin = false) {
  const accountOrders = loggedInPhone ? ordersForPhone(loggedInPhone) : [];
  const content = loggedInPhone
    ? `<div class="modal-heading"><span class="eyebrow">YOUR FRESHFOLD ACCOUNT</span><h2 id="modal-title">You're signed in</h2><p>Your mobile number and order history are saved on this device.</p></div><div class="login-account">Signed in with<strong>${escapeHTML(loggedInPhone)}</strong><span>${accountOrders.length} saved order${accountOrders.length === 1 ? "" : "s"}</span></div><button class="primary-button" id="account-orders" type="button">View my order history</button><button class="secondary-button" id="logout-button" type="button">Sign out</button>`
    : `<div class="modal-heading"><span class="eyebrow">WELCOME TO FRESHFOLD</span><h2 id="modal-title">${showOrderHistoryAfterLogin ? "Find your order history" : "Sign in with your mobile"}</h2><p>${showOrderHistoryAfterLogin ? "Use the same phone number you entered when placing your order." : "Use your number to keep your FreshFold details handy."}</p></div><form class="login-form" id="login-form" novalidate><div class="form-field"><label for="login-mobile">Mobile number</label><input id="login-mobile" type="tel" inputmode="numeric" autocomplete="tel" maxlength="10" placeholder="Enter your 10-digit number"><span class="field-error" id="login-error" aria-live="polite"></span></div><p class="login-note">Demo sign-in only; this does not verify your identity.</p><button class="primary-button" type="submit">Continue <span aria-hidden="true">→</span></button></form>`;
  openModal(content);
  const form = document.getElementById("login-form");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    const phoneInput = document.getElementById("login-mobile");
    const phone = phoneInput.value.trim();
    if (!/^\d{10}$/.test(phone)) {
      document.getElementById("login-error").textContent = "Enter a valid 10-digit mobile number.";
      phoneInput.setAttribute("aria-invalid", "true");
      phoneInput.focus();
      return;
    }
    loggedInPhone = phone;
    savePhone(phone);
    refreshLoginButton();
    closeModal();
    if (showOrderHistoryAfterLogin) openOrders("");
    else showToast("You're signed in on this device.");
  });
  const accountOrdersButton = document.getElementById("account-orders");
  if (accountOrdersButton) accountOrdersButton.addEventListener("click", () => openOrders(""));
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) logoutButton.addEventListener("click", () => {
    if (!clearSavedPhone()) return;
    loggedInPhone = "";
    refreshLoginButton();
    closeModal();
    showToast("You've been signed out.");
  });
}

function generateOrderId() {
  let orderId;
  do {
    orderId = `FF${String(Math.floor(100000 + Math.random() * 900000))}`;
  } while (orders.some(order => order.id === orderId));
  return orderId;
}

function placeOrder(formData) {
  const subtotal = subtotalAmount();
  const discount = couponDiscount(subtotal);
  const delivery = deliveryAmount(subtotal);
  const total = subtotal - discount + delivery;
  const order = {
    id: generateOrderId(),
    name: formData.get("name").trim(),
    mobile: formData.get("mobile").trim(),
    address: formData.get("address").trim(),
    pincode: formData.get("pincode").trim(),
    date: formData.get("date"),
    slot: formData.get("slot"),
    payment: formData.get("payment"),
    paymentDetails: {
      method: formData.get("payment"),
      amount: total,
      status: formData.get("payment") === "Cash on delivery" ? "Due on delivery" : "Simulated; not charged"
    },
    items: cart.map(item => ({ ...item })),
    subtotal,
    discount,
    delivery,
    total,
    status: 0,
    createdAt: new Date().toISOString()
  };
  orders.unshift(order);
  saveStoredValue(ORDERS_STORAGE_KEY, orders);
  cart = [];
  activeCoupon = "";
  persistCart();
  refreshCart();
  selectedOrderId = order.id;
  renderConfirmation(order);
}

function renderConfirmation(order) {
  const safeName = escapeHTML(order.name);
  const pickupDate = new Date(`${order.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const payment = order.paymentDetails;
  openModal(`<div class="order-confirmation"><div class="confirmation-icon" aria-hidden="true">✓</div><span class="eyebrow">ALL FOLDED INTO PLACE</span><h2>You're booked, ${safeName}!</h2><p>Your pickup is scheduled. We’ll wash and deliver your clothes on the same day.</p><div class="order-id">${escapeHTML(order.id)}</div><div class="confirmation-details"><strong>Pickup: ${escapeHTML(pickupDate)} · ${escapeHTML(order.slot)}</strong><br>Washed and delivered the same day<br>Payment: ${escapeHTML(payment.method)} · ${formatPrice(payment.amount)}<br>${escapeHTML(payment.status)}</div><button class="primary-button" id="confirmation-orders" type="button">Track your order</button></div>`);
  document.getElementById("confirmation-orders").addEventListener("click", () => openOrders(order.id));
}

// Order history, five-stage demo tracker, and before-pickup cancellation.
function pickupDescription(order) {
  const date = new Date(`${order.date}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Pickup date unavailable";
  return `${date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${order.slot}`;
}

function orderCardHTML(order, selected) {
  const names = (Array.isArray(order.items) ? order.items : []).map(item => {
    const product = productById(item.productId);
    return product ? `${item.quantity} × ${product.name}` : "";
  }).filter(Boolean).join(", ");
  const paymentMethod = order.paymentDetails?.method || order.payment || "Not recorded";
  return `<article class="order-card${selected ? " selected" : ""}"><button class="order-card-button" type="button" data-select-order="${escapeHTML(order.id)}"><span><strong>${escapeHTML(order.id)}</strong><small>${escapeHTML(names || "Laundry order")}<br>Pickup: ${escapeHTML(pickupDescription(order))} · delivered same day<br>Payment: ${escapeHTML(paymentMethod)}</small></span><span class="order-card-total">${formatPrice(order.paymentDetails?.amount ?? order.total)}</span></button></article>`;
}

function trackingHTML(order) {
  const status = Math.max(0, Math.min(4, Number(order.status) || 0));
  const isCancelled = Boolean(order.cancelled);
  const payment = order.paymentDetails || {
    amount: Number(order.total) || 0,
    method: order.payment || "Not recorded",
    status: order.payment === "Cash on delivery" ? "Due on delivery" : "Simulated; not charged"
  };
  return `<div class="tracking-panel"><h3>Order ${escapeHTML(order.id)} · ${isCancelled ? "Cancelled" : escapeHTML(ORDER_STEPS[status])}</h3>
    <p class="tracking-meta">${escapeHTML(order.address)}, ${escapeHTML(order.pincode)} · Pickup ${escapeHTML(pickupDescription(order))} · same-day delivery</p>
    ${isCancelled ? `<p class="tracking-status">This order has been cancelled.</p>` : `<div class="tracking-steps" aria-label="Order progress">${ORDER_STEPS.map((step, index) => `<div class="tracking-step${index < status ? " done" : ""}${index === status ? " current" : ""}"><span class="tracking-dot">${index < status ? "✓" : index + 1}</span><span>${escapeHTML(step)}</span></div>`).join("")}</div>
    <div class="tracking-actions"><button class="primary-button" id="simulate-step" type="button"${status >= ORDER_STEPS.length - 1 ? " disabled" : ""}>${status >= ORDER_STEPS.length - 1 ? "Order delivered" : "Simulate next step →"}</button>${status === 0 ? `<button class="secondary-button" id="cancel-order" type="button">Cancel order</button>` : ""}</div>
    <p class="tracking-status" id="tracking-status">${status === 0 ? "Your pickup is all set. Follow each step right here." : `Looking fresh: ${escapeHTML(ORDER_STEPS[status])}.`}</p>`}
    <div class="confirmation-details"><strong>${escapeHTML(order.items.map(item => { const product = productById(item.productId); return product ? `${item.quantity} × ${product.name} (${item.service})` : ""; }).filter(Boolean).join(" · "))}</strong><br>
      Subtotal: ${formatPrice(order.subtotal)} · Discount: −${formatPrice(order.discount)} · Delivery: ${formatPrice(order.delivery)}<br>
      Payment: ${escapeHTML(payment.method)} · Amount: ${formatPrice(payment.amount)}<br>
      <span>${escapeHTML(payment.status)}</span>
    </div>
  </div>`;
}

function ordersForPhone(phone) {
  return orders.filter(order => order.mobile === phone);
}

function openOrders(preferredId = selectedOrderId) {
  if (!loggedInPhone && !preferredId) {
    openLoginPage(true);
    return;
  }
  const accountOrders = loggedInPhone
    ? ordersForPhone(loggedInPhone)
    : orders.filter(order => order.id === preferredId);
  selectedOrderId = accountOrders.some(order => order.id === preferredId) ? preferredId : (accountOrders[0] ? accountOrders[0].id : "");
  const selectedOrder = accountOrders.find(order => order.id === selectedOrderId);
  const content = `<div class="modal-heading"><span class="eyebrow">YOUR FRESHFOLD HISTORY</span><h2 id="modal-title">Your orders</h2><p>Every order, from pickup to freshly folded.</p></div>
    ${accountOrders.length ? `<div class="orders-list">${accountOrders.map(order => orderCardHTML(order, order.id === selectedOrderId)).join("")}</div>${selectedOrder ? trackingHTML(selectedOrder) : ""}` : `<div class="order-empty">${loggedInPhone ? "No orders are linked to this mobile number yet." : "Your order is saved. Sign in with this mobile number later to find your order history."}</div><button class="primary-button" id="browse-services" type="button">Browse services</button>`}`;
  openModal(content);
  wireOrderModal();
}

function wireOrderModal() {
  elements.modalContent.querySelectorAll("[data-select-order]").forEach(button => {
    button.addEventListener("click", () => openOrders(button.dataset.selectOrder));
  });
  const simulateButton = document.getElementById("simulate-step");
  if (simulateButton) simulateButton.addEventListener("click", () => {
    const order = orders.find(item => item.id === selectedOrderId);
    if (!order || Number(order.status) >= ORDER_STEPS.length - 1) return;
    order.status = Number(order.status) + 1;
    saveStoredValue(ORDERS_STORAGE_KEY, orders);
    openOrders(order.id);
  });
  const cancelButton = document.getElementById("cancel-order");
  if (cancelButton) cancelButton.addEventListener("click", () => {
    const order = orders.find(item => item.id === selectedOrderId);
    if (!order || Number(order.status) !== 0) return;
    order.cancelled = true;
    saveStoredValue(ORDERS_STORAGE_KEY, orders);
    openOrders(order.id);
  });
  const browseButton = document.getElementById("browse-services");
  if (browseButton) browseButton.addEventListener("click", () => {
    closeModal();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
}

// Wire page interactions and initialize persisted cart data.
document.getElementById("category-tabs").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-tab").forEach(tab => {
    const selected = tab === button;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  renderProducts();
});

elements.productGrid.addEventListener("change", event => {
  const select = event.target.closest("[data-service-for]");
  if (select) syncProductCard(select.dataset.serviceFor);
});

elements.productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const productId = addButton.dataset.add;
    const card = addButton.closest(".product-card");
    addToCart(productId, card.querySelector(".service-select").value);
    showToast("Added to your bag.");
    return;
  }
  const quantityButton = event.target.closest("[data-product-qty]");
  if (quantityButton) changeCartQuantity(quantityButton.dataset.productQty, quantityButton.dataset.service, Number(quantityButton.dataset.change));
});

elements.cartItems.addEventListener("click", event => {
  const changeButton = event.target.closest("[data-cart-change]");
  if (changeButton) {
    changeCartQuantity(changeButton.dataset.id, changeButton.dataset.service, Number(changeButton.dataset.cartChange));
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) removeFromCart(removeButton.dataset.remove, removeButton.dataset.service);
});

elements.shopSearch.addEventListener("input", renderProducts);
document.getElementById("header-search-form").addEventListener("submit", event => {
  event.preventDefault();
  elements.shopSearch.value = document.getElementById("header-search").value;
  activeCategory = "All";
  document.querySelectorAll(".category-tab").forEach(tab => {
    const selected = tab.dataset.category === "All";
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  renderProducts();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("shop-search-form").addEventListener("submit", event => event.preventDefault());

document.getElementById("cart-button").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("continue-shopping").addEventListener("click", () => {
  closeCart();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("orders-button").addEventListener("click", () => openOrders(""));
document.getElementById("login-button").addEventListener("click", () => openLoginPage());
document.getElementById("coupon-form").addEventListener("submit", event => {
  event.preventDefault();
  applyCoupon(document.getElementById("coupon-input").value);
});

elements.checkoutButton.addEventListener("click", () => {
  if (subtotalAmount() < 149) return;
  openModal(checkoutTemplate());
  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!validateCheckout(formData)) return;
    placeOrder(formData);
  });
});

document.getElementById("close-modal").addEventListener("click", closeModal);
elements.overlay.addEventListener("click", () => {
  if (!elements.modal.hidden) closeModal();
  else closeCart();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (!elements.modal.hidden) closeModal();
    else if (elements.drawer.classList.contains("open")) closeCart();
  }
});

function hydrateCart() {
  const cleaned = cart.flatMap(item => {
    const product = productById(item.productId);
    const quantity = Math.floor(Number(item.quantity));
    if (!product || !SERVICES.includes(item.service) || !Number.isFinite(quantity) || quantity <= 0) return [];
    return [{ productId: product.id, service: item.service, price: getServicePrice(product, item.service), quantity }];
  });
  cart = cleaned;
  persistCart();
  renderProducts();
  refreshCart();
}

hydrateCart();
refreshLoginButton();
