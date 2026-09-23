/* =========================================================
   CampusBite — script.js
   All data below is fictional/demo content for a college
   technical club project. No real payments, no real orders.
   ========================================================= */

/* -------------------- 1. MENU DATA -------------------- */
const CATEGORIES = [
  { name: "Pizza",    emoji: "🍕" },
  { name: "Burgers",  emoji: "🍔" },
  { name: "Meals",    emoji: "🍛" },
  { name: "Snacks",   emoji: "🍟" },
  { name: "Desserts", emoji: "🍰" },
  { name: "Drinks",   emoji: "🥤" },
];

const MENU_ITEMS = [
  { id: 1,  name: "Chicken Burger",        category: "Burgers",  price: 149, rating: 4.8, reviews: 124, emoji: "🍔", desc: "Grilled chicken patty, lettuce, cheese and our signature mayo in a toasted bun." },
  { id: 2,  name: "Veg Cheese Burger",      category: "Burgers",  price: 119, rating: 4.5, reviews: 88,  emoji: "🍔", desc: "Crispy veg patty loaded with melted cheese, onions and tangy sauce." },
  { id: 3,  name: "Double Patty Burger",    category: "Burgers",  price: 189, rating: 4.7, reviews: 61,  emoji: "🍔", desc: "Two juicy patties stacked high with cheese, pickles and house sauce." },
  { id: 4,  name: "Margherita Pizza",       category: "Pizza",    price: 229, rating: 4.6, reviews: 98,  emoji: "🍕", desc: "Classic tomato base, fresh mozzarella and basil on a thin crispy crust." },
  { id: 5,  name: "Farmhouse Pizza",        category: "Pizza",    price: 269, rating: 4.7, reviews: 76,  emoji: "🍕", desc: "Loaded with capsicum, onion, tomato, mushroom and extra cheese." },
  { id: 6,  name: "Pepperoni Pizza",        category: "Pizza",    price: 289, rating: 4.8, reviews: 112, emoji: "🍕", desc: "Spicy pepperoni slices over a rich tomato-cheese base." },
  { id: 7,  name: "Veg Thali",              category: "Meals",    price: 129, rating: 4.6, reviews: 143, emoji: "🍛", desc: "Dal, sabzi, rice, roti, salad and pickle — a full comfort meal." },
  { id: 8,  name: "Chicken Biryani",        category: "Meals",    price: 179, rating: 4.9, reviews: 210, emoji: "🍛", desc: "Fragrant basmati rice layered with spiced chicken and fried onions." },
  { id: 9,  name: "Paneer Butter Masala + Rice", category: "Meals", price: 159, rating: 4.7, reviews: 95, emoji: "🍛", desc: "Creamy paneer curry served with steamed rice and a side of roti." },
  { id: 10, name: "French Fries",           category: "Snacks",  price: 79,  rating: 4.7, reviews: 156, emoji: "🍟", desc: "Golden, crispy fries tossed in peri-peri seasoning." },
  { id: 11, name: "Chicken Nuggets (6 pc)", category: "Snacks",  price: 109, rating: 4.5, reviews: 67,  emoji: "🍗", desc: "Crunchy on the outside, juicy inside — served with dip." },
  { id: 12, name: "Veg Spring Rolls",       category: "Snacks",  price: 89,  rating: 4.4, reviews: 52,  emoji: "🥟", desc: "Crispy rolls stuffed with fresh veggies, served with chilli sauce." },
  { id: 13, name: "Chocolate Brownie",      category: "Desserts", price: 89, rating: 4.8, reviews: 134, emoji: "🍫", desc: "Warm, fudgy brownie with a molten chocolate centre." },
  { id: 14, name: "Vanilla Milkshake",      category: "Drinks",  price: 99,  rating: 4.6, reviews: 71,  emoji: "🥤", desc: "Thick and creamy, topped with a scoop of vanilla ice cream." },
  { id: 15, name: "Gulab Jamun (2 pc)",     category: "Desserts", price: 59, rating: 4.5, reviews: 58,  emoji: "🍮", desc: "Soft, syrup-soaked classic Indian dessert — always a favourite." },
  { id: 16, name: "Cold Coffee",            category: "Drinks",  price: 89,  rating: 4.7, reviews: 102, emoji: "☕", desc: "Chilled, frothy coffee blended with milk and a hint of chocolate." },
  { id: 17, name: "Fresh Lime Soda",        category: "Drinks",  price: 49,  rating: 4.3, reviews: 39,  emoji: "🥤", desc: "Refreshing lime soda, sweet or salted, served ice-cold." },
];

const SAMPLE_REVIEWS = [
  { text: "Really tasty and the ordering process was super easy.", name: "Demo Student", stars: 5 },
  { text: "Biryani was on point and it didn't take long at all.", name: "Demo Student", stars: 5 },
  { text: "Clean interface, easy to find what I wanted between classes.", name: "Demo Student", stars: 4 },
  { text: "Loved the cart flow — quick to check out before my next lecture.", name: "Demo Student", stars: 5 },
  { text: "Good variety across stalls, prices felt fair for a canteen.", name: "Demo Student", stars: 4 },
];

function itemReviewSnippets(item) {
  // Small set of demo mini-reviews shown on the detail modal for any item.
  return [
    { name: "Demo Student", text: `${item.name} is one of my go-to orders here.` },
    { name: "Demo Student", text: `Good portion size and came out tasting fresh.` },
  ];
}

/* -------------------- 2. STATE -------------------- */
let cart = JSON.parse(localStorage.getItem("campusbite_cart") || "[]");
let activeFilter = "all";
let searchTerm = "";
let activeDetailItem = null;
let detailQty = 1;

/* -------------------- 3. HELPERS -------------------- */
const rupee = (n) => `₹${n.toLocaleString("en-IN")}`;
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => document.querySelectorAll(sel);

function saveCart() {
  localStorage.setItem("campusbite_cart", JSON.stringify(cart));
}

function showToast(msg) {
  const toast = $("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

function openOverlay(id) {
  $(id).classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeOverlay(id) {
  $(id).classList.remove("open");
  if (!document.querySelector(".overlay.open")) {
    document.body.style.overflow = "";
  }
}
function closeAllOverlays() {
  $all(".overlay").forEach((o) => o.classList.remove("open"));
  document.body.style.overflow = "";
}

/* -------------------- 4. RENDER: CATEGORIES -------------------- */
function renderCategories() {
  const grid = $("#categoryGrid");
  grid.innerHTML = CATEGORIES.map(
    (c) => `
    <button class="category-card" data-cat="${c.name}">
      <span class="emoji">${c.emoji}</span>
      <span class="name">${c.name}</span>
    </button>`
  ).join("");

  grid.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      activeFilter = card.dataset.cat;
      syncFilterChips();
      renderMenu();
      document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function syncFilterChips() {
  $all(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.filter === activeFilter);
  });
}

/* -------------------- 5. RENDER: MENU -------------------- */
function getFilteredItems() {
  return MENU_ITEMS.filter((item) => {
    const matchesCategory = activeFilter === "all" || item.category === activeFilter;
    const matchesSearch =
      searchTerm.trim() === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderMenu() {
  const grid = $("#menuGrid");
  const items = getFilteredItems();

  $("#noResults").hidden = items.length !== 0;
  grid.hidden = items.length === 0;

  grid.innerHTML = items
    .map(
      (item) => `
    <article class="food-card" data-id="${item.id}">
      <div class="food-media" data-open-detail="${item.id}">
        <span class="cat-tag">${item.category}</span>
        ${item.emoji}
      </div>
      <div class="food-body">
        <h3 data-open-detail="${item.id}">${item.name}</h3>
        <p class="food-desc">${item.desc}</p>
        <p class="food-rating">⭐ <strong>${item.rating}</strong> (${item.reviews} reviews · demo)</p>
        <div class="food-footer">
          <span class="food-price">${rupee(item.price)}</span>
          <button class="add-btn" data-add="${item.id}">Add to Cart</button>
        </div>
      </div>
    </article>`
    )
    .join("");

  grid.querySelectorAll("[data-open-detail]").forEach((el) => {
    el.addEventListener("click", () => openDetail(Number(el.dataset.openDetail)));
  });
  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(Number(btn.dataset.add), 1);
    });
  });
}

/* -------------------- 6. FOOD DETAIL MODAL -------------------- */
function openDetail(id) {
  const item = MENU_ITEMS.find((i) => i.id === id);
  if (!item) return;
  activeDetailItem = item;
  detailQty = 1;
  renderDetail();
  openOverlay("#detailOverlay");
}

function renderDetail() {
  const item = activeDetailItem;
  if (!item) return;
  const reviews = itemReviewSnippets(item);

  $("#detailBody").innerHTML = `
    <div class="detail-media">${item.emoji}</div>
    <div class="detail-content">
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p class="detail-rating">⭐ <strong>${item.rating}</strong> · ${item.reviews} reviews <em>(demo/sample data)</em></p>
      <p class="detail-price">${rupee(item.price)}</p>
      <div class="qty-row">
        <button class="qty-btn" id="detailMinus">−</button>
        <span class="qty-value" id="detailQtyValue">${detailQty}</span>
        <button class="qty-btn" id="detailPlus">+</button>
      </div>
      <button class="btn btn-primary btn-block" id="detailAddBtn">Add to Cart — ${rupee(item.price * detailQty)}</button>

      <div class="detail-reviews">
        <h4>Sample reviews</h4>
        ${reviews
          .map((r) => `<p class="mini-review"><strong>${r.name}:</strong> "${r.text}"</p>`)
          .join("")}
      </div>
    </div>
  `;

  $("#detailMinus").addEventListener("click", () => {
    detailQty = Math.max(1, detailQty - 1);
    renderDetail();
  });
  $("#detailPlus").addEventListener("click", () => {
    detailQty += 1;
    renderDetail();
  });
  $("#detailAddBtn").addEventListener("click", () => {
    addToCart(item.id, detailQty);
    closeOverlay("#detailOverlay");
  });
}

/* -------------------- 7. CART LOGIC -------------------- */
function addToCart(id, qty) {
  const item = MENU_ITEMS.find((i) => i.id === id);
  if (!item) return;
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart();
  renderCartCount();
  showToast(`${item.name} added to cart`);
}

function updateQty(id, delta) {
  const line = cart.find((c) => c.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) {
    cart = cart.filter((c) => c.id !== id);
  }
  saveCart();
  renderCart();
  renderCartCount();
}

function removeFromCart(id) {
  cart = cart.filter((c) => c.id !== id);
  saveCart();
  renderCart();
  renderCartCount();
}

function cartLines() {
  return cart
    .map((c) => {
      const item = MENU_ITEMS.find((i) => i.id === c.id);
      return item ? { ...item, qty: c.qty } : null;
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartLines().reduce((sum, l) => sum + l.price * l.qty, 0);
}

function renderCartCount() {
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  $("#cartCount").textContent = count;
}

function renderCart() {
  const lines = cartLines();
  const container = $("#cartItems");
  const empty = $("#cartEmpty");
  const summary = $("#cartSummary");

  if (lines.length === 0) {
    container.innerHTML = "";
    empty.style.display = "flex";
    summary.style.display = "none";
    return;
  }
  empty.style.display = "none";
  summary.style.display = "flex";

  container.innerHTML = lines
    .map(
      (l) => `
    <div class="cart-item">
      <span class="cart-item-emoji">${l.emoji}</span>
      <div class="cart-item-info">
        <h4>${l.name}</h4>
        <p class="cart-item-price">${rupee(l.price)} × ${l.qty} = ${rupee(l.price * l.qty)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-minus="${l.id}">−</button>
        <span class="qty-value">${l.qty}</span>
        <button class="qty-btn" data-plus="${l.id}">+</button>
        <button class="cart-item-remove" data-remove="${l.id}">Remove</button>
      </div>
    </div>`
    )
    .join("");

  container.querySelectorAll("[data-minus]").forEach((b) =>
    b.addEventListener("click", () => updateQty(Number(b.dataset.minus), -1))
  );
  container.querySelectorAll("[data-plus]").forEach((b) =>
    b.addEventListener("click", () => updateQty(Number(b.dataset.plus), 1))
  );
  container.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => removeFromCart(Number(b.dataset.remove)))
  );

  $("#cartSubtotal").textContent = rupee(cartTotal());
  $("#cartTotal").textContent = rupee(cartTotal());
}

/* -------------------- 8. CHECKOUT -------------------- */
function renderCheckoutSummary() {
  const lines = cartLines();
  const summary = $("#checkoutSummary");
  summary.innerHTML =
    lines
      .map(
        (l) => `<div class="os-row"><span>${l.name} × ${l.qty}</span><span>${rupee(l.price * l.qty)}</span></div>`
      )
      .join("") +
    `<div class="os-row total"><span>Total</span><span>${rupee(cartTotal())}</span></div>`;
}

function validateCheckout() {
  let valid = true;
  const name = $("#custName").value.trim();
  const phone = $("#custPhone").value.trim();
  const location = $("#custLocation").value.trim();

  const setError = (fieldId, inputId, msg) => {
    $(fieldId).textContent = msg;
    $(inputId).classList.toggle("invalid", !!msg);
    if (msg) valid = false;
  };

  setError("#err-custName", "#custName", name.length < 2 ? "Please enter your name." : "");
  setError(
    "#err-custPhone",
    "#custPhone",
    /^[0-9]{10}$/.test(phone) ? "" : "Enter a valid 10-digit phone number."
  );
  setError(
    "#err-custLocation",
    "#custLocation",
    location.length < 3 ? "Please enter your campus/hostel location." : ""
  );

  return valid;
}

function generateOrderNumber() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `#CB${n}`;
}

function placeOrder(e) {
  e.preventDefault();
  if (cart.length === 0) return;
  if (!validateCheckout()) return;

  const location = $("#custLocation").value.trim();
  const lines = cartLines();
  const orderNum = generateOrderNumber();
  const prepTime = `${20 + Math.floor(Math.random() * 3) * 5}–${30 + Math.floor(Math.random() * 3) * 5} minutes`;

  $("#confirmOrderNum").textContent = orderNum;
  $("#confirmPrepTime").textContent = prepTime;
  $("#confirmLocation").textContent = location;
  $("#confirmTotal").textContent = rupee(cartTotal());
  $("#confirmItems").innerHTML = lines
    .map(
      (l) => `<div class="confirm-item-row"><span>${l.name} × ${l.qty}</span><span>${rupee(l.price * l.qty)}</span></div>`
    )
    .join("");

  // Clear cart — order is "placed"
  cart = [];
  saveCart();
  renderCartCount();
  renderCart();
  $("#checkoutForm").reset();

  closeAllOverlays();
  openOverlay("#confirmOverlay");
}

/* -------------------- 9. REVIEWS SECTION -------------------- */
function renderReviews() {
  $("#reviewsTrack").innerHTML = SAMPLE_REVIEWS.map(
    (r) => `
    <div class="review-card">
      <div class="review-stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
      <p class="review-quote">"${r.text}"</p>
      <p class="review-name">${r.name} · demo review</p>
    </div>`
  ).join("");
}

/* -------------------- 10. EVENT WIRING -------------------- */
function wireNav() {
  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });
  $all(".main-nav .nav-link").forEach((link) =>
    link.addEventListener("click", () => $("#mainNav").classList.remove("open"))
  );
}

function wireSearchAndFilters() {
  $("#searchInput").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderMenu();
  });
  $all(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      syncFilterChips();
      renderMenu();
    });
  });
}

function wireOverlays() {
  $("#cartBtn").addEventListener("click", () => {
    renderCart();
    openOverlay("#cartOverlay");
  });
  $all("[data-close]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const overlay = e.target.closest(".overlay");
      if (overlay) closeOverlay(`#${overlay.id}`);
    })
  );
  $all(".overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeOverlay(`#${overlay.id}`);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllOverlays();
  });

  $("#checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    closeOverlay("#cartOverlay");
    renderCheckoutSummary();
    openOverlay("#checkoutOverlay");
  });

  $("#checkoutForm").addEventListener("submit", placeOrder);

  $("#backToMenuBtn").addEventListener("click", () => {
    closeAllOverlays();
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
  });
}

function wireFooterCategoryLinks() {
  $all(".footer-grid [data-cat]").forEach((link) => {
    link.addEventListener("click", () => {
      activeFilter = link.dataset.cat;
      syncFilterChips();
      renderMenu();
    });
  });
}

function wireContactForm() {
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    $("#contactNote").hidden = false;
    e.target.reset();
  });
}

/* -------------------- 11. INIT -------------------- */
function init() {
  renderCategories();
  renderMenu();
  syncFilterChips();
  renderReviews();
  renderCartCount();
  renderCart();

  wireNav();
  wireSearchAndFilters();
  wireOverlays();
  wireFooterCategoryLinks();
  wireContactForm();
}

document.addEventListener("DOMContentLoaded", init);
