// APP STATE
let cart = [];
let wishlist = [];
let orders = [];
let activePage = 'home';
let appliedPromo = null;

// User Profile state
let userProfile = {
  name: "Alex Mercer",
  email: "alex.mercer@gmail.com",
  phone: "+1 (555) 389-2092",
  birthday: "1995-08-22",
  bio: "Love retro running sneakers, hiking boots, and sleek formals. Footwear enthusiast since 2018.",
  address: {
    street: "784 Skyline Heights Drive, Apt 4B",
    city: "San Francisco",
    state: "California",
    zip: "94103",
    country: "United States"
  }
};

// Selected product state for modal size/color selections
let modalSelectedSize = null;
let modalSelectedColor = null;
let modalProduct = null;

// Selected filter states for catalog page
let selectedSizes = [];
let selectedColorHex = null;

// Initialize APP
document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage
  loadLocalStorage();
  migrateLocalStorage();

  // Bind core event listeners
  bindEvents();

  // Populate dynamic UI items
  initializeFilters();
  renderTrendingHome();

  // Show page
  navigateTo('home');
  updateBadges();
});

// LOAD LOCALSTORAGE
function loadLocalStorage() {
  const storedCart = localStorage.getItem("fwh_cart");
  if (storedCart) cart = JSON.parse(storedCart);

  const storedWishlist = localStorage.getItem("fwh_wishlist");
  if (storedWishlist) wishlist = JSON.parse(storedWishlist);

  const storedOrders = localStorage.getItem("fwh_orders");
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  } else {
    // Populate simulated orders if empty to make it look realistic
    orders = [
      {
        id: "FWH-92841",
        date: "2026-05-12",
        items: [
          { id: "m-1", name: "Air Max Cosmic Pulse", price: 10812.00, size: 9, color: "Neon Red", qty: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop" }
        ],
        subtotal: 10812.00,
        discount: 0,
        shipping: 800.00,
        total: 11612.00,
        status: "Delivered"
      }
    ];
    localStorage.setItem("fwh_orders", JSON.stringify(orders));
  }

  const storedProfile = localStorage.getItem("fwh_profile");
  if (storedProfile) userProfile = JSON.parse(storedProfile);
}

// SAVE STATE TO STORAGE
function saveCart() {
  localStorage.setItem("fwh_cart", JSON.stringify(cart));
  updateBadges();
}

function saveWishlist() {
  localStorage.setItem("fwh_wishlist", JSON.stringify(wishlist));
  updateBadges();
}

function saveOrders() {
  localStorage.setItem("fwh_orders", JSON.stringify(orders));
}

function saveProfile() {
  localStorage.setItem("fwh_profile", JSON.stringify(userProfile));
}

// MIGRATE LOCAL STORAGE TO MATCH UPDATED CATALOG (AVOID NAIL PHOTOS & OLD NAMES)
function migrateLocalStorage() {
  let cartUpdated = false;
  if (Array.isArray(cart)) {
    cart.forEach(item => {
      const prod = PRODUCTS.find(p => p.id === item.id);
      if (prod) {
        if (item.image !== prod.image) {
          item.image = prod.image;
          cartUpdated = true;
        }
        if (item.name !== prod.name) {
          item.name = prod.name;
          cartUpdated = true;
        }
      }
    });
    if (cartUpdated) {
      saveCart();
    }
  }

  let ordersUpdated = false;
  if (Array.isArray(orders)) {
    orders.forEach(order => {
      if (Array.isArray(order.items)) {
        order.items.forEach(item => {
          const prod = PRODUCTS.find(p => p.id === item.id);
          if (prod) {
            if (item.image !== prod.image) {
              item.image = prod.image;
              ordersUpdated = true;
            }
            if (item.name !== prod.name) {
              item.name = prod.name;
              ordersUpdated = true;
            }
          }
        });
      }
    });
    if (ordersUpdated) {
      saveOrders();
    }
  }
}

// BIND DOM EVENTS
function bindEvents() {
  // Navigation Drawer Toggles
  const drawerBtn = document.getElementById("drawer-toggle-btn");
  const closeBtn = document.getElementById("drawer-close-btn");
  const overlay = document.getElementById("drawer-overlay");
  const drawer = document.getElementById("sidebar-drawer");

  if (drawerBtn) {
    drawerBtn.addEventListener("click", () => {
      drawer.classList.add("active");
      overlay.classList.add("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  if (overlay) {
    overlay.addEventListener("click", () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Close drawer when link clicked
  const drawerLinks = document.querySelectorAll(".drawer-link");
  drawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  // Global search enter key
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || searchInput.value.length > 0) {
        // Switch to shop catalog and apply text filter
        navigateTo('shop');
        applyFilters();
      }
    });
  }

  // Notification panel toggle
  const notifBtn = document.getElementById("notif-btn");
  const notifDropdown = document.getElementById("notif-dropdown");
  if (notifBtn) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle("active");
    });
  }

  document.addEventListener("click", (e) => {
    if (notifDropdown && !notifDropdown.contains(e.target) && e.target !== notifBtn) {
      notifDropdown.classList.remove("active");
    }
  });

  // Price range slider on catalog page
  const priceSlider = document.getElementById("price-slider-input");
  if (priceSlider) {
    priceSlider.addEventListener("change", () => {
      applyFilters();
    });
  }
}

// NAVIGATE TO VIEWS
function navigateTo(pageId) {
  activePage = pageId;

  // Toggle visible page view
  const views = document.querySelectorAll(".page-view");
  views.forEach(view => {
    view.classList.remove("active");
  });
  
  const targetView = document.getElementById(`view-${pageId}`);
  if (targetView) {
    targetView.classList.add("active");
  }

  // Toggle active class in headers and drawers
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  const drawerLinks = document.querySelectorAll(".drawer-link");
  drawerLinks.forEach(link => {
    if (link.getAttribute("data-page") === pageId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Update mobile bottom floating menu
  const floatBtns = document.querySelectorAll(".bottom-menu-btn");
  floatBtns.forEach(btn => {
    btn.classList.remove("active");
  });

  const floatBtnMap = {
    'home': 'btn-float-home',
    'shop': 'btn-float-categories',
    'wishlist': 'btn-float-wishlist',
    'cart': 'btn-float-cart',
    'profile': 'btn-float-profile'
  };

  const activeFloatBtnId = floatBtnMap[pageId];
  if (activeFloatBtnId) {
    const floatBtn = document.getElementById(activeFloatBtnId);
    if (floatBtn) floatBtn.classList.add("active");
  }

  // Additional rendering triggers when pages open
  if (pageId === 'cart') {
    renderCart();
  } else if (pageId === 'wishlist') {
    renderWishlist();
  } else if (pageId === 'orders') {
    renderOrders();
  } else if (pageId === 'profile') {
    populateProfileForm();
  }

  // Scroll to top of window
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// NAVIGATION BY CATEGORIES (MEN, WOMEN, KIDS, TRENDING)
function navigateToCategory(category) {
  navigateTo('shop');

  // Reset checkboxes first
  document.getElementById("cat-men-check").checked = false;
  document.getElementById("cat-women-check").checked = false;
  document.getElementById("cat-kids-check").checked = false;
  document.getElementById("flag-trending").checked = false;
  document.getElementById("flag-new").checked = false;
  document.getElementById("flag-bestseller").checked = false;

  if (category === 'men') {
    document.getElementById("cat-men-check").checked = true;
  } else if (category === 'women') {
    document.getElementById("cat-women-check").checked = true;
  } else if (category === 'kids') {
    document.getElementById("cat-kids-check").checked = true;
  } else if (category === 'trending') {
    document.getElementById("flag-trending").checked = true;
  }

  applyFilters();
}

// UPDATE BADGES (WISH & CART COUNTS)
function updateBadges() {
  const cartBadge = document.getElementById("cart-badge");
  const floatCartBadge = document.getElementById("float-cart-badge");
  const wishlistBadge = document.getElementById("wishlist-badge");
  const floatWishlistBadge = document.getElementById("float-wishlist-badge");

  // Sum quantities of products in cart
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const wishCount = wishlist.length;

  if (cartBadge) cartBadge.innerText = cartCount;
  if (floatCartBadge) floatCartBadge.innerText = cartCount;
  if (wishlistBadge) wishlistBadge.innerText = wishCount;
  if (floatWishlistBadge) floatWishlistBadge.innerText = wishCount;
}

// SCROLL TO A SECTION ON THE HOME PAGE
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// DYNAMICALLY INITIALIZE SIDEBAR FILTERS
function initializeFilters() {
  // 1. Brands selection list
  const brands = [...new Set(PRODUCTS.map(p => p.brand))];
  const brandContainer = document.getElementById("brand-filters-container");
  if (brandContainer) {
    brandContainer.innerHTML = brands.map(brand => `
      <label class="filter-checkbox-label">
        <input type="checkbox" class="filter-checkbox filter-brand-check" value="${brand}" onchange="applyFilters()">
        ${brand}
      </label>
    `).join('');
  }

  // 2. Sizes options grid
  const sizesSet = new Set();
  PRODUCTS.forEach(p => p.sizes.forEach(s => sizesSet.add(s)));
  const sizes = [...sizesSet].sort((a, b) => a - b);
  const sizeContainer = document.getElementById("size-filters-container");
  if (sizeContainer) {
    sizeContainer.innerHTML = sizes.map(size => `
      <button class="filter-size-btn" data-size="${size}" onclick="toggleSizeFilter(${size}, this)">${size}</button>
    `).join('');
  }

  // 3. Colors dots
  const colorMap = new Map();
  PRODUCTS.forEach(p => p.colors.forEach(c => colorMap.set(c.hex, c.name)));
  const colorContainer = document.getElementById("color-filters-container");
  if (colorContainer) {
    colorContainer.innerHTML = Array.from(colorMap.entries()).map(([hex, name]) => `
      <div class="filter-color-dot" style="background-color: ${hex};" title="${name}" data-color="${hex}" onclick="toggleColorFilter('${hex}', this)">
        <i class="fa-solid fa-check"></i>
      </div>
    `).join('');
  }
}

// TOGGLE SIZE FILTER BUTTON
function toggleSizeFilter(size, element) {
  const index = selectedSizes.indexOf(size);
  if (index > -1) {
    selectedSizes.splice(index, 1);
    element.classList.remove("active");
  } else {
    selectedSizes.push(size);
    element.classList.add("active");
  }
  applyFilters();
}

// TOGGLE COLOR FILTER DOT
function toggleColorFilter(colorHex, element) {
  const dots = document.querySelectorAll(".filter-color-dot");
  
  if (selectedColorHex === colorHex) {
    selectedColorHex = null;
    element.classList.remove("active");
  } else {
    selectedColorHex = colorHex;
    dots.forEach(dot => dot.classList.remove("active"));
    element.classList.add("active");
  }
  
  applyFilters();
}

// PRICE SLIDER VALUE TEXT
function updatePriceFilterValue(val) {
  const priceValText = document.getElementById("price-filter-val");
  if (priceValText) priceValText.innerText = `₹${parseFloat(val).toLocaleString('en-IN')}`;
}

// CLEAR ALL SIDEBAR FILTERS
function clearAllFilters() {
  // Reset Category Checkboxes
  document.getElementById("cat-men-check").checked = false;
  document.getElementById("cat-women-check").checked = false;
  document.getElementById("cat-kids-check").checked = false;
  
  // Reset Brand Checkboxes
  const brandChecks = document.querySelectorAll(".filter-brand-check");
  brandChecks.forEach(chk => chk.checked = false);

  // Reset Special flags
  document.getElementById("flag-trending").checked = false;
  document.getElementById("flag-new").checked = false;
  document.getElementById("flag-bestseller").checked = false;

  // Reset slider range
  const priceSlider = document.getElementById("price-slider-input");
  if (priceSlider) {
    priceSlider.value = 16000;
    updatePriceFilterValue(16000);
  }

  // Reset size filters
  selectedSizes = [];
  const sizeBtns = document.querySelectorAll(".filter-size-btn");
  sizeBtns.forEach(btn => btn.classList.remove("active"));

  // Reset color filters
  selectedColorHex = null;
  const colorDots = document.querySelectorAll(".filter-color-dot");
  colorDots.forEach(dot => dot.classList.remove("active"));

  // Reset Ratings
  const ratings = document.getElementsByName("rating-filter");
  ratings.forEach(rad => {
    if (rad.value === "0") rad.checked = true;
  });

  // Reset Search bar
  document.getElementById("global-search-input").value = "";

  // Apply resets
  applyFilters();
  showToast("Filters Cleared", "info");
}

// QUICK FILTER BY BRAND FROM CARDS/GRID
function filterByBrand(brand) {
  navigateTo('shop');
  clearAllFilters();
  
  const brandChecks = document.querySelectorAll(".filter-brand-check");
  brandChecks.forEach(chk => {
    if (chk.value === brand) chk.checked = true;
  });
  
  applyFilters();
}

// CORE FILTER & SORT CATALOG
function applyFilters() {
  let filtered = [...PRODUCTS];

  // 1. Search Query
  const searchQuery = document.getElementById("global-search-input").value.trim().toLowerCase();
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.brand.toLowerCase().includes(searchQuery) ||
      p.subCategory.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery)
    );
  }

  // 2. Gender Category Checks
  const catMen = document.getElementById("cat-men-check").checked;
  const catWomen = document.getElementById("cat-women-check").checked;
  const catKids = document.getElementById("cat-kids-check").checked;

  if (catMen || catWomen || catKids) {
    filtered = filtered.filter(p => {
      if (catMen && p.category === 'men') return true;
      if (catWomen && p.category === 'women') return true;
      if (catKids && p.category === 'kids') return true;
      return false;
    });
  }

  // 3. Brand Checks
  const checkedBrands = Array.from(document.querySelectorAll(".filter-brand-check:checked")).map(chk => chk.value);
  if (checkedBrands.length > 0) {
    filtered = filtered.filter(p => checkedBrands.includes(p.brand));
  }

  // 4. Price Slider
  const priceSliderVal = parseFloat(document.getElementById("price-slider-input").value);
  filtered = filtered.filter(p => {
    const activePrice = p.price * (1 - p.discount / 100);
    return activePrice <= priceSliderVal;
  });

  // 5. Sizes Selected
  if (selectedSizes.length > 0) {
    filtered = filtered.filter(p => 
      p.sizes.some(size => selectedSizes.includes(size))
    );
  }

  // 6. Colors Selected
  if (selectedColorHex) {
    filtered = filtered.filter(p => 
      p.colors.some(c => c.hex === selectedColorHex)
    );
  }

  // 7. Ratings
  const checkedRating = parseFloat(document.querySelector('input[name="rating-filter"]:checked').value);
  if (checkedRating > 0) {
    filtered = filtered.filter(p => p.rating >= checkedRating);
  }

  // 8. Tags (Trending, New, Best Seller)
  const isTrending = document.getElementById("flag-trending").checked;
  const isNew = document.getElementById("flag-new").checked;
  const isBestSeller = document.getElementById("flag-bestseller").checked;

  if (isTrending) filtered = filtered.filter(p => p.trending);
  if (isNew) filtered = filtered.filter(p => p.newArrival);
  if (isBestSeller) filtered = filtered.filter(p => p.bestSeller);

  // 9. SORTING
  const sortSelectVal = document.getElementById("sort-select").value;
  if (sortSelectVal === "popular") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortSelectVal === "price-low") {
    filtered.sort((a, b) => {
      const pA = a.price * (1 - a.discount / 100);
      const pB = b.price * (1 - b.discount / 100);
      return pA - pB;
    });
  } else if (sortSelectVal === "price-high") {
    filtered.sort((a, b) => {
      const pA = a.price * (1 - a.discount / 100);
      const pB = b.price * (1 - b.discount / 100);
      return pB - pA;
    });
  } else if (sortSelectVal === "discount") {
    filtered.sort((a, b) => b.discount - a.discount);
  }

  // Render items count
  const countSpan = document.getElementById("current-items-count");
  if (countSpan) countSpan.innerText = filtered.length;

  // Render cards
  const catalogGrid = document.getElementById("catalog-products-container");
  if (catalogGrid) {
    if (filtered.length === 0) {
      catalogGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop" class="empty-state-img" style="filter: grayscale(1) opacity(0.2) contrast(1.2); max-width: 150px; margin-bottom: 1rem;" alt="No results">
          <h3>No matching shoes found</h3>
          <p style="margin-top: 0.5rem;">Try relaxing search phrases or adjusting filter selectors.</p>
        </div>
      `;
    } else {
      catalogGrid.innerHTML = filtered.map(product => generateProductCardHTML(product)).join('');
    }
  }
}

// RENDER HOME TRENDS SECTION
function renderTrendingHome() {
  const container = document.getElementById("trending-home-container");
  if (container) {
    const trendingItems = PRODUCTS.filter(p => p.trending).slice(0, 4);
    container.innerHTML = trendingItems.map(p => generateProductCardHTML(p)).join('');
  }
}

// GENERATE HTML TEMPLATE FOR SHOE CARDS
function generateProductCardHTML(product) {
  const currentPrice = (product.price * (1 - product.discount / 100)).toFixed(2);
  const displayDiscount = product.discount > 0 
    ? `<span class="discount-tag">${product.discount}% OFF</span>` 
    : '';
  const displayOldPrice = product.discount > 0 
    ? `<span class="old-price">₹${parseFloat(product.price).toLocaleString('en-IN')}</span>` 
    : '';

  const isWishlisted = wishlist.includes(product.id) ? 'active' : '';
  const heartClass = wishlist.includes(product.id) ? 'fa-solid' : 'fa-regular';

  // Badges
  let badgeHTML = '';
  if (product.newArrival) {
    badgeHTML = `<span class="badge badge-primary product-tag">NEW</span>`;
  } else if (product.bestSeller) {
    badgeHTML = `<span class="badge badge-accent product-tag">BEST SELLER</span>`;
  } else if (product.trending) {
    badgeHTML = `<span class="badge badge-outline product-tag" style="background-color: var(--bg-glass); border-color: var(--primary); color: var(--primary);">TRENDING</span>`;
  }

  // Size pills (show first 3)
  const sizesHTML = product.sizes.slice(0, 3).map(s => `<span class="size-pill">${s}</span>`).join('') + (product.sizes.length > 3 ? '<span class="size-pill">+</span>' : '');

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-card-media" onclick="openProductDetailModal('${product.id}')">
        ${badgeHTML}
        <img src="${product.image}" class="product-card-img" alt="${product.name}" loading="lazy">
      </div>
      
      <!-- Wishlist Action -->
      <button class="product-wishlist-btn ${isWishlisted}" onclick="toggleWishlist('${product.id}', this)" aria-label="Toggle Wishlist">
        <i class="${heartClass} fa-heart"></i>
      </button>

      <div class="product-card-body">
        <div class="product-card-brand">${product.brand}</div>
        <h3 class="product-card-title" onclick="openProductDetailModal('${product.id}')">${product.name}</h3>
        
        <div class="product-card-rating">
          <i class="fa-solid fa-star"></i>
          <strong>${product.rating}</strong>
          <span>(${product.reviewsCount} reviews)</span>
        </div>

        <div class="product-card-sizes">
          <span style="color: var(--text-dark); margin-right: 0.2rem;">Sizes:</span>
          ${sizesHTML}
        </div>

        <div class="product-card-pricing">
          <span class="current-price">₹${parseFloat(currentPrice).toLocaleString('en-IN')}</span>
          ${displayOldPrice}
          ${displayDiscount}
        </div>

        <div class="product-card-actions">
          <button class="btn btn-secondary btn-sm" onclick="quickAddToCart('${product.id}')" aria-label="Add to Cart">
            <i class="fa-solid fa-cart-plus"></i> Cart
          </button>
          <button class="btn btn-primary btn-sm" onclick="buyNowDirect('${product.id}')">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `;
}

// QUICK ADD TO CART (USES FIRST SIZE/COLOR)
function quickAddToCart(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const defaultSize = prod.sizes[0];
  const defaultColor = prod.colors[0].name;

  addToCart(productId, 1, defaultSize, defaultColor);
}

// BUY NOW (ADDS AND DIRECTS TO CART)
function buyNowDirect(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  
  const defaultSize = prod.sizes[0];
  const defaultColor = prod.colors[0].name;
  
  // Add item
  addToCart(productId, 1, defaultSize, defaultColor, false);
  navigateTo('cart');
  showToast("Ready for checkout!", "success");
}

// GENERAL ADD TO CART CORE FUNCTION
function addToCart(productId, qty = 1, size, color, displayNotification = true) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  // Search if item with same size/color is already in cart
  const existingItemIndex = cart.findIndex(item => 
    item.id === productId && 
    item.selectedSize === size && 
    item.selectedColor === color
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].qty += qty;
  } else {
    cart.push({
      id: productId,
      name: prod.name,
      brand: prod.brand,
      price: prod.price,
      discount: prod.discount,
      qty: qty,
      selectedSize: size,
      selectedColor: color,
      image: prod.image
    });
  }

  saveCart();
  if (displayNotification) {
    showToast(`Added ${prod.name} (Size ${size}) to Cart!`, "success");
  }
}

// TOGGLE WISHLIST STATE
function toggleWishlist(productId, btnElement) {
  const index = wishlist.indexOf(productId);
  const prod = PRODUCTS.find(p => p.id === productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    if (btnElement) {
      btnElement.classList.remove("active");
      const icon = btnElement.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
      }
    }
    showToast(`Removed ${prod ? prod.name : 'item'} from Wishlist`, "info");
  } else {
    wishlist.push(productId);
    if (btnElement) {
      btnElement.classList.add("active");
      const icon = btnElement.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
      }
    }
    showToast(`Saved ${prod ? prod.name : 'item'} to Wishlist!`, "success");
  }

  saveWishlist();
  
  // If active page is wishlist, re-render it
  if (activePage === 'wishlist') {
    renderWishlist();
  }
}

// RENDERING WISHLIST PAGE
function renderWishlist() {
  const grid = document.getElementById("wishlist-grid-container");
  const emptyState = document.getElementById("wishlist-empty-state");
  const clearBtn = document.getElementById("wishlist-clear-btn");

  if (!grid) return;

  if (wishlist.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    if (clearBtn) clearBtn.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'block';
    
    const wishItems = PRODUCTS.filter(p => wishlist.includes(p.id));
    grid.innerHTML = wishItems.map(product => {
      const activePrice = (product.price * (1 - product.discount / 100)).toFixed(2);
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-card-media" onclick="openProductDetailModal('${product.id}')">
            <img src="${product.image}" class="product-card-img" alt="${product.name}">
          </div>
          <button class="product-wishlist-btn active" onclick="toggleWishlist('${product.id}', this)" aria-label="Remove from Wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
          <div class="product-card-body">
            <div class="product-card-brand">${product.brand}</div>
            <div class="product-card-pricing" style="margin-top: 1rem; margin-bottom: 1.2rem;">
              <span class="current-price">₹${parseFloat(activePrice).toLocaleString('en-IN')}</span>
              ${product.discount > 0 ? `<span class="old-price">₹${parseFloat(product.price).toLocaleString('en-IN')}</span>` : ''}
            </div>
            <div class="product-card-actions">
              <button class="btn btn-primary btn-sm" onclick="wishlistMoveToCart('${product.id}')"><i class="fa-solid fa-cart-shopping"></i> Move To Cart</button>
              <button class="btn btn-secondary btn-sm" onclick="toggleWishlist('${product.id}')"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// MOVE FROM WISHLIST TO CART
function wishlistMoveToCart(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  // Add default size/color to cart
  addToCart(productId, 1, prod.sizes[0], prod.colors[0].name, false);

  // Remove from wishlist
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    saveWishlist();
  }

  renderWishlist();
  showToast(`Moved ${prod.name} to Cart`, "success");
}

// CLEAR ALL WISHLIST ITEMS
function clearWishlist() {
  if (wishlist.length === 0) return;
  
  if (confirm("Are you sure you want to clear all wishlist saves?")) {
    wishlist = [];
    saveWishlist();
    renderWishlist();
    showToast("Wishlist cleared", "info");
  }
}

// RENDERING CART PAGE
function renderCart() {
  const container = document.getElementById("cart-items-list-container");
  const emptyState = document.getElementById("cart-empty-state");
  const cartLayout = document.getElementById("cart-content-layout");

  if (!container) return;

  if (cart.length === 0) {
    emptyState.style.display = 'block';
    cartLayout.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    cartLayout.style.display = 'grid';

    container.innerHTML = cart.map((item, index) => {
      const activeUnitPrice = item.price * (1 - item.discount / 100);
      const totalItemPrice = (activeUnitPrice * item.qty).toFixed(2);

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          
          <div class="cart-item-details">
            <span class="cart-item-brand">${item.brand}</span>
            <span class="cart-item-name" style="cursor: pointer;" onclick="openProductDetailModal('${item.id}')">${item.name}</span>
            <span class="cart-item-meta">Size: <strong>${item.selectedSize}</strong> | Color: <strong>${item.selectedColor}</strong></span>
          </div>

          <div class="cart-item-qty">
            <button class="qty-btn" onclick="adjustCartQty(${index}, -1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="adjustCartQty(${index}, 1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
          </div>

          <div class="cart-item-pricing">
            <span class="cart-item-price">₹${parseFloat(totalItemPrice).toLocaleString('en-IN')}</span>
            <button class="cart-item-remove" onclick="removeCartItem(${index})"><i class="fa-solid fa-trash-can"></i> Remove</button>
          </div>
        </div>
      `;
    }).join('');

    calculateCartPricing();
  }
}

// ADJUST CART QUANTITY
function adjustCartQty(index, amount) {
  if (cart[index]) {
    cart[index].qty += amount;
    
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
      showToast("Item removed from cart", "info");
    }
    
    saveCart();
    renderCart();
  }
}

// REMOVE ITEM FROM CART
function removeCartItem(index) {
  if (cart[index]) {
    const name = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    showToast(`Removed ${name} from Cart`, "info");
  }
}

// CALCULATE PRICING TOTALS
function calculateCartPricing() {
  // Calculate raw subtotal
  const subtotal = cart.reduce((total, item) => {
    const activeUnitPrice = item.price * (1 - item.discount / 100);
    return total + (activeUnitPrice * item.qty);
  }, 0);

  // Apply Coupon promo code discount logic
  let discountAmount = 0;
  let shippingCost = 800.0;

  if (appliedPromo === "FW10") {
    discountAmount = subtotal * 0.10; // 10% off
  } else if (appliedPromo === "FREESHIP") {
    shippingCost = 0.0;
  }

  // Free shipping automatically for subtotals above ₹12,000
  if (subtotal >= 12000) {
    shippingCost = 0.0;
  }

  const grandTotal = subtotal - discountAmount + shippingCost;

  // Update UI values
  document.getElementById("summary-subtotal").innerText = `₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById("summary-discount").innerText = `-₹${discountAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById("summary-shipping").innerText = shippingCost === 0.0 ? "FREE" : `₹${shippingCost.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  document.getElementById("summary-total").innerText = `₹${grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// APPLY PROMO CODE
function applyPromoCode() {
  const couponInput = document.getElementById("coupon-input").value.trim().toUpperCase();
  const couponMessage = document.getElementById("coupon-message");

  if (!couponInput) {
    showToast("Please enter a code", "info");
    return;
  }

  couponMessage.style.display = "block";

  if (couponInput === "FW10") {
    appliedPromo = "FW10";
    couponMessage.style.color = "var(--accent)";
    couponMessage.innerText = "✓ Promo code 'FW10' applied! 10% Off applied to your total.";
    showToast("Promo Code 'FW10' Applied!", "success");
  } else if (couponInput === "FREESHIP") {
    appliedPromo = "FREESHIP";
    couponMessage.style.color = "var(--accent)";
    couponMessage.innerText = "✓ Promo code 'FREESHIP' applied! Free Shipping applied.";
    showToast("Free Shipping Applied!", "success");
  } else {
    appliedPromo = null;
    couponMessage.style.color = "#ff3b30";
    couponMessage.innerText = "✗ Invalid Promo Code. Try 'FW10' or 'FREESHIP'.";
    showToast("Invalid Promo Code", "info");
  }

  calculateCartPricing();
}

// CLEAR CART
function clearCart(confirmRequire = true) {
  if (cart.length === 0) return;

  if (!confirmRequire || confirm("Clear all items from your cart?")) {
    cart = [];
    appliedPromo = null;
    saveCart();
    renderCart();
    showToast("Cart Cleared", "info");
  }
}

// PROCESS CHECKOUT / ORDER PLACEMENT
function processCheckout() {
  if (cart.length === 0) return;

  const subtotal = cart.reduce((total, item) => {
    const unitPrice = item.price * (1 - item.discount / 100);
    return total + (unitPrice * item.qty);
  }, 0);

  let discount = 0;
  let shipping = 10;
  if (appliedPromo === "FW10") discount = subtotal * 0.10;
  if (appliedPromo === "FREESHIP" || subtotal >= 150) shipping = 0;

  const total = subtotal - discount + shipping;

  // Build simulated order
  const randomId = "FWH-" + Math.floor(10000 + Math.random() * 90000);
  const currentDate = new Date().toISOString().split('T')[0];

  const newOrder = {
    id: randomId,
    date: currentDate,
    items: [...cart],
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    shipping: shipping,
    total: parseFloat(total.toFixed(2)),
    status: "Processing"
  };

  orders.unshift(newOrder); // Add to beginning of list
  saveOrders();

  // Clear Cart
  cart = [];
  appliedPromo = null;
  saveCart();

  // Redirect to Orders view
  navigateTo('orders');
  showToast("Order Placed Successfully!", "success");
}

// RENDER ORDER HISTORY PAGE
function renderOrders() {
  const container = document.getElementById("orders-list-container");
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="orders-empty">
        <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&auto=format&fit=crop" class="empty-state-img" alt="No Orders Found">
        <h3>No past orders found</h3>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Your orders will show up here after checkout completion.</p>
        <button class="btn btn-primary" onclick="navigateToCategory('men')">Shop Latest Collection</button>
      </div>
    `;
  } else {
    container.innerHTML = orders.map(order => {
      const itemsListHTML = order.items.map(item => `
        <div class="order-item">
          <div class="order-item-left">
            <img src="${item.image}" alt="${item.name}" class="order-item-img">
            <div>
              <div class="order-item-name">${item.name}</div>
              <div class="order-item-meta">Size: ${item.selectedSize} | Color: ${item.selectedColor} | Qty: ${item.qty}</div>
            </div>
          </div>
          <div class="order-item-price">₹${parseFloat((item.price * (1 - item.discount / 100) * item.qty).toFixed(2)).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        </div>
      `).join('');

      let statusBadge = `<span class="badge badge-outline" style="border-color: #00bfff; color: #00bfff;">${order.status}</span>`;
      if (order.status === "Delivered") {
        statusBadge = `<span class="badge badge-accent">${order.status}</span>`;
      }

      return `
        <div class="order-card">
          <div class="order-header">
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="order-meta">Order ID: <span>${order.id}</span></div>
              <div class="order-meta">Date: <span>${order.date}</span></div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="order-meta">Total Amount: <span style="color: var(--primary); font-size: 1.1rem;">₹${order.total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
              ${statusBadge}
            </div>
          </div>
          <div class="order-items">
            ${itemsListHTML}
          </div>
        </div>
      `;
    }).join('');
  }
}

// PROFILE SWITCH TABS
function switchProfileTab(tabName) {
  // Toggles active tab button
  const btns = document.querySelectorAll(".profile-tab-btn");
  btns.forEach(btn => {
    if (btn.innerText.toLowerCase().includes(tabName === 'details' ? 'account' : tabName === 'address' ? 'address' : 'settings')) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Toggles visible sub-form panels
  const subTabs = document.querySelectorAll(".profile-sub-tab");
  subTabs.forEach(tab => {
    tab.style.display = 'none';
  });

  document.getElementById(`profile-tab-${tabName}`).style.display = 'block';
}

// POPULATE PROFILE INFORMATION IN FORMS
function populateProfileForm() {
  document.getElementById("prof-name").value = userProfile.name;
  document.getElementById("prof-email").value = userProfile.email;
  document.getElementById("prof-phone").value = userProfile.phone;
  document.getElementById("prof-birthday").value = userProfile.birthday;
  document.getElementById("prof-bio").value = userProfile.bio;

  // Address
  document.getElementById("addr-street").value = userProfile.address.street;
  document.getElementById("addr-city").value = userProfile.address.city;
  document.getElementById("addr-state").value = userProfile.address.state;
  document.getElementById("addr-zip").value = userProfile.address.zip;
  document.getElementById("addr-country").value = userProfile.address.country;

  // Card details
  document.getElementById("profile-card-name").innerText = userProfile.name;
  document.getElementById("profile-card-email").innerText = userProfile.email;
}

// SAVE ACCOUNT DETAILS
function saveProfileDetails(e) {
  e.preventDefault();

  userProfile.name = document.getElementById("prof-name").value.trim();
  userProfile.email = document.getElementById("prof-email").value.trim();
  userProfile.phone = document.getElementById("prof-phone").value.trim();
  userProfile.birthday = document.getElementById("prof-birthday").value;
  userProfile.bio = document.getElementById("prof-bio").value.trim();

  saveProfile();
  populateProfileForm();
  showToast("Account Details Saved Successfully!", "success");
}

// SAVE DELIVERY ADDRESS
function saveProfileAddress(e) {
  e.preventDefault();

  userProfile.address.street = document.getElementById("addr-street").value.trim();
  userProfile.address.city = document.getElementById("addr-city").value.trim();
  userProfile.address.state = document.getElementById("addr-state").value.trim();
  userProfile.address.zip = document.getElementById("addr-zip").value.trim();
  userProfile.address.country = document.getElementById("addr-country").value.trim();

  saveProfile();
  showToast("Shipping Address Saved!", "success");
}

// CUSTOM TOAST NOTIFICATIONS
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconHTML = '<i class="fa-solid fa-circle-check" style="color: var(--accent);"></i>';
  if (type === "info") {
    iconHTML = '<i class="fa-solid fa-circle-info" style="color: #00bfff;"></i>';
  } else if (type === "error") {
    iconHTML = '<i class="fa-solid fa-circle-xmark" style="color: #ff3b30;"></i>';
  }

  toast.innerHTML = `
    ${iconHTML}
    <span>${message}</span>
    <i class="fa-solid fa-xmark toast-close" onclick="this.parentElement.remove()"></i>
  `;

  container.appendChild(toast);

  // Automatically remove toast after 3.5s
  setTimeout(() => {
    toast.style.animation = "slide-in 0.3s ease reverse";
    setTimeout(() => {
      toast.remove();
    }, 280);
  }, 3500);
}

// CLEAR NOTIFICATIONS DROPDOWN
function clearNotifications() {
  const container = document.getElementById("notif-list-container");
  const badge = document.getElementById("notif-badge");
  
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 0; color: var(--text-muted); font-size: 0.85rem;">
        <i class="fa-solid fa-bell-slash" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
        No unread notifications.
      </div>
    `;
  }
  
  if (badge) {
    badge.style.display = "none";
  }
  
  showToast("All notifications cleared", "info");
}

// Recommendation logic removed since advisor section was deleted.

// OPEN PRODUCT DETAILS OVERLAY MODAL
function openProductDetailModal(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  modalProduct = prod;
  modalSelectedSize = prod.sizes[0];
  modalSelectedColor = prod.colors[0].name;

  const currentPrice = (prod.price * (1 - prod.discount / 100)).toFixed(2);
  const displayOldPrice = prod.discount > 0 ? `<span class="modal-old-price">₹${parseFloat(prod.price).toLocaleString('en-IN')}</span>` : '';
  const displayDiscount = prod.discount > 0 ? `<span class="discount-tag">${prod.discount}% OFF</span>` : '';

  // Generate size items HTML
  const sizesHTML = prod.sizes.map((s, i) => `
    <button class="modal-size-btn ${i === 0 ? 'active' : ''}" onclick="selectModalSize(${s}, this)">${s}</button>
  `).join('');

  // Generate colors dots HTML
  const colorsHTML = prod.colors.map((c, i) => `
    <div class="modal-color-dot ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}" onclick="selectModalColor('${c.name}', this)">
      <i class="fa-solid fa-check"></i>
    </div>
  `).join('');

  // Render detail contents
  const modalGrid = document.getElementById("modal-content-grid-area");
  if (modalGrid) {
    modalGrid.innerHTML = `
      <!-- Left Media Gallery Panel -->
      <div class="modal-media-panel">
        <img src="${prod.image}" id="modal-primary-image" class="modal-main-img" alt="${prod.name}">
        <div class="modal-gallery">
          <img src="${prod.image}" class="gallery-thumbnail active" onclick="switchModalPrimaryImage('${prod.image}', this)" alt="Primary">
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop" class="gallery-thumbnail" onclick="switchModalPrimaryImage('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop', this)" alt="Side view">
          <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop" class="gallery-thumbnail" onclick="switchModalPrimaryImage('https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop', this)" alt="Bottom soles">
          <img src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop" class="gallery-thumbnail" onclick="switchModalPrimaryImage('https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop', this)" alt="Close up detail">
        </div>
      </div>

      <!-- Right Description and Buy Panel -->
      <div class="modal-info-panel">
        <span class="modal-brand">${prod.brand}</span>
        <h2 class="modal-name">${prod.name}</h2>
        
        <div class="modal-rating">
          <div style="color: #ffcc00;">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star-half-stroke"></i>
          </div>
          <strong>${prod.rating} / 5.0</strong>
          <span>(${prod.reviewsCount} verified reviews)</span>
        </div>

        <div class="modal-price-row">
          <span class="modal-curr-price" style="color: var(--primary);">₹${parseFloat(currentPrice).toLocaleString('en-IN')}</span>
          ${displayOldPrice}
          ${displayDiscount}
        </div>

        <p class="modal-desc">${prod.description}</p>

        <!-- Dynamic Select Options -->
        <div>
          <h4 class="modal-option-title">Select Color</h4>
          <div class="modal-colors-list">
            ${colorsHTML}
          </div>
        </div>

        <div>
          <h4 class="modal-option-title">Select Size (US / EU Standard)</h4>
          <div class="modal-sizes-list">
            ${sizesHTML}
          </div>
        </div>

        <!-- Call Actions -->
        <div class="modal-actions">
          <button class="btn btn-secondary btn-lg" onclick="detailModalAddToWishlist()"><i class="fa-regular fa-heart"></i> Saved List</button>
          <button class="btn btn-primary btn-lg" onclick="detailModalAddToCart()"><i class="fa-solid fa-cart-plus"></i> Add To Cart</button>
        </div>
        
        <button class="btn btn-secondary btn-block" style="border-color: var(--accent); color: var(--accent); background-color: var(--accent-glow);" onclick="detailModalBuyNow()">
          Buy & Express Checkout
        </button>

      </div>
    `;
  }

  // Load Related Products list
  renderRelatedProducts(prod);

  // Show Modal Overlay
  const modal = document.getElementById("product-detail-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Disable background scrolling
  }
}

// SWITCH PRIMARY MODAL IMAGE FROM THUMBNAILS
function switchModalPrimaryImage(imgSrc, element) {
  const mainImage = document.getElementById("modal-primary-image");
  if (mainImage) mainImage.src = imgSrc;

  const thumbs = document.querySelectorAll(".gallery-thumbnail");
  thumbs.forEach(t => t.classList.remove("active"));
  element.classList.add("active");
}

// SIZE SELECTION ON MODAL
function selectModalSize(size, btnElement) {
  modalSelectedSize = size;
  const buttons = document.querySelectorAll(".modal-size-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  btnElement.classList.add("active");
}

// COLOR SELECTION ON MODAL
function selectModalColor(colorName, dotElement) {
  modalSelectedColor = colorName;
  const dots = document.querySelectorAll(".modal-color-dot");
  dots.forEach(dot => dot.classList.remove("active"));
  dotElement.classList.add("active");
}

// ADD TO CART FROM DETAILED MODAL
function detailModalAddToCart() {
  if (modalProduct && modalSelectedSize && modalSelectedColor) {
    addToCart(modalProduct.id, 1, modalSelectedSize, modalSelectedColor);
    closeProductDetailModal();
  }
}

// ADD TO WISHLIST FROM DETAILED MODAL
function detailModalAddToWishlist() {
  if (modalProduct) {
    const isSaved = wishlist.includes(modalProduct.id);
    
    // Toggle state
    toggleWishlist(modalProduct.id);
    
    // Re-verify class button toggle
    const btn = document.querySelector(".modal-actions button");
    if (btn) {
      const icon = btn.querySelector("i");
      if (!isSaved) {
        icon.className = "fa-solid fa-heart";
        btn.style.color = "#ff3b30";
      } else {
        icon.className = "fa-regular fa-heart";
        btn.style.color = "var(--text-main)";
      }
    }
  }
}

// BUY NOW EXPRESS FROM DETAILED MODAL
function detailModalBuyNow() {
  if (modalProduct && modalSelectedSize && modalSelectedColor) {
    addToCart(modalProduct.id, 1, modalSelectedSize, modalSelectedColor, false);
    closeProductDetailModal();
    navigateTo('cart');
    showToast("Ready for Checkout!", "success");
  }
}

// CLOSE MODAL
function closeProductDetailModal() {
  const modal = document.getElementById("product-detail-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// CLOSE MODAL BY CLICKING OUTSIDE CONTAINER
function closeProductDetailModalOnOverlay(e) {
  if (e.target.id === "product-detail-modal") {
    closeProductDetailModal();
  }
}

// RENDER RELATED PRODUCTS IN MODAL FOOTER
function renderRelatedProducts(currProduct) {
  const container = document.getElementById("related-products-container");
  if (!container) return;

  // Find products in same category or brand, excluding current product
  const related = PRODUCTS.filter(p => 
    p.id !== currProduct.id && 
    (p.category === currProduct.category || p.brand === currProduct.brand)
  ).slice(0, 3); // Get up to 3 related

  if (related.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.95rem;">No related suggestions available.</p>`;
  } else {
    container.innerHTML = related.map(p => {
      const activePrice = (p.price * (1 - p.discount / 100)).toFixed(2);
      return `
        <div style="background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: var(--transition-fast);" onclick="openProductDetailModal('${p.id}')">
          <img src="${p.image}" style="width: 100%; height: 120px; object-fit: cover; background-color: #f1f5f9;">
          <div style="padding: 0.8rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); font-weight: 700;">${p.brand}</div>
            <div style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</div>
            <div style="font-weight: 800; font-size: 1rem; color: var(--text-main);">₹${parseFloat(activePrice).toLocaleString('en-IN')}</div>
          </div>
        </div>
      `;
    }).join('');
  }
}
