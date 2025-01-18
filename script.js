const productGrid = document.getElementById("product-grid");
const loading = document.getElementById("loading");
const categoryFilter = document.getElementById("category-filter");
const sortFilter = document.getElementById("sort-filter");
const scrollToTopBtn = document.getElementById("scroll-to-top");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const closeCartBtn = document.getElementById("close-cart-modal");
const toastContainer = document.getElementById("toast-container");
const cartIcon = document.getElementById("cart-icon");
const cartText = document.getElementById("cart-text");
const backToCartBtn = document.getElementById("back-to-cart");
const totalPriceEl = document.getElementById("total-price");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let isCheckout = false;
let checkoutBtn = null;

// Product Data
const products = [
  {
    id: 1,
    name: "Smartphone 1",
    price: 12000,
    category: "Electronics",
    image: "./assets/Smartphone 1.jpg",
  },
  {
    id: 2,
    name: "Smartphone 2",
    price: 30000,
    category: "Electronics",
    image: "./assets/Smartphone 2.jpg",
  },
  {
    id: 3,
    name: "Laptop 1",
    price: 40000,
    category: "Electronics",
    image: "./assets/Laptop 1.jpg",
  },
  {
    id: 4,
    name: "Laptop 2",
    price: 75000,
    category: "Electronics",
    image: "./assets/Laptop 2.jpg",
  },
  {
    id: 5,
    name: "T-shirt",
    price: 500,
    category: "Clothing",
    image: "./assets/T-shirt 1.jpg",
  },
  {
    id: 6,
    name: "Jeans",
    price: 1000,
    category: "Clothing",
    image: "./assets/Jeans 1.jpg",
  },
  {
    id: 7,
    name: "Sunglasses",
    price: 1500,
    category: "Accessories",
    image: "./assets/Sunglasses 1.jpg",
  },
  {
    id: 8,
    name: "Watch",
    price: 2500,
    category: "Accessories",
    image: "./assets/Watch 1.jpg",
  },
];

// Load Products
function loadProducts() {
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortFilter.value;

  let filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (selectedSort === "low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = "";
  loading.style.display = "block";
  setTimeout(() => {
    if (filteredProducts.length === 0) {
      productGrid.innerHTML = "<p>No products found!</p>";
    } else {
      filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="product-img">
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₹${product.price}</p>
            <div class="product-actions">
              <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
              <button class="buy-now" onclick="buyNow(${product.id})">Buy Now</button>
            </div>
          </div>
        `;

        productCard.style.border = "2px solid black";
        productCard.style.borderRadius = "8px";
        productGrid.appendChild(productCard);
      });
    }
    loading.style.display = "none";
  }, 1000);
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((prod) => prod.id === productId);
  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
  showToast("Item added to cart!");
}

// Show Toast Message
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

// Update Cart Icon
function updateCartIcon() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartText.textContent = `Cart`;

  const cartBadge = cartIcon.querySelector("#cart-badge");
  if (totalItems > 0) {
    cartBadge.style.display = "inline-block";
    cartBadge.textContent = totalItems;
  } else {
    cartBadge.style.display = "none";
  }
}

// Show Cart Modal
function showCartModal() {
  cartModal.style.display = "flex";
  isCheckout = false;
  renderCartItems();
}

// Close Cart Modal
function closeCart() {
  cartModal.style.display = "none";
}

// Render Cart Items
function renderCartItems() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty!</p>";
    return;
  }

  let totalAmount = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    itemDiv.innerHTML = `
      <div class="product-info">
        <p class="product-name">${item.name} (x${item.quantity})</p>
        <p class="product-price">₹${item.price * item.quantity}</p>
      </div>
      <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItemsContainer.appendChild(itemDiv);

    totalAmount += item.price * item.quantity;
  });

  const totalAmountElement = document.createElement("div");
  totalAmountElement.classList.add("total-amount");
  totalAmountElement.innerHTML = `<p>Total: ₹${totalAmount}</p>`;

  if (!cartItemsContainer.querySelector(".total-amount")) {
    cartItemsContainer.appendChild(totalAmountElement);
  }

  if (!isCheckout && !cartItemsContainer.querySelector(".checkout-btn")) {
    checkoutBtn = document.createElement("button");
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.onclick = showCheckout;
    cartItemsContainer.appendChild(checkoutBtn);
  }
}

// Remove Item from Cart
function removeFromCart(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
  updateCartIcon();
  renderCartItems();
  showToast("Item removed from cart!");
}

// Checkout Process
function showCheckout() {
  isCheckout = true;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  totalPriceEl.textContent = `Total: ₹${totalPrice}`;
  renderCartItems();
  checkoutBtn.style.display = "block";
}

// Event Listeners
cartIcon.addEventListener("click", showCartModal);
closeCartBtn.addEventListener("click", closeCart);
categoryFilter.addEventListener("change", loadProducts);
sortFilter.addEventListener("change", loadProducts);
scrollToTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" })
);

// Back Button in Checkout
backToCartBtn.addEventListener("click", () => {
  cartModal.style.display = "flex";
  isCheckout = false;
  renderCartItems();
  backToCartBtn.style.display = "none";
});

loadProducts();
updateCartIcon();
