// --- Cart Logic for Add to Cart ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(product) {
  let cart = getCart();
  const idx = cart.findIndex(item => item.id === product.id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  setCart(cart);
}

// Attach to Add to Cart button if present
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.querySelector('.btn, .add-to-cart');
  if (addBtn && addBtn.textContent.match(/add to cart/i)) {
    addBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Try to get product data from product page
      const detail = document.querySelector('.product-detail, #product-detail');
      if (detail) {
        // Try to extract product info from DOM
        const name = detail.querySelector('h1, h3')?.textContent || '';
        const priceText = detail.querySelector('.price')?.textContent || '';
        const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
        const image = detail.querySelector('img')?.getAttribute('src') || '';
        if (name && price && image) {
          addToCart({ id: name + price, name, price, image });
          addBtn.textContent = 'Added!';
          setTimeout(() => { addBtn.textContent = 'Add to Cart'; }, 1200);
        }
      }
    });
  }
});
// Hide/show announce bar on scroll up
let lastScrollY = window.scrollY;
const announceBar = document.querySelector('.announce-bar');
window.addEventListener('scroll', function() {
  if (!announceBar) return;
  const currentScroll = window.scrollY;
  if (currentScroll > lastScrollY && currentScroll > 40) {
    // Scrolling down
    announceBar.classList.add('hide');
  } else {
    // Scrolling up
    announceBar.classList.remove('hide');
  }
  lastScrollY = currentScroll;
});
// Announcement Bar Carousel
document.addEventListener('DOMContentLoaded', function() {
    const announceTrack = document.querySelector('.announce-track');
    const announceSlides = document.querySelectorAll('.announce-slide');
    let announceIndex = 0;
    let announceInterval;
    if (announceTrack && announceSlides.length > 1) {
        function updateAnnounce() {
            announceTrack.style.transform = `translateX(-${announceIndex * 100}%)`;
        }
        function showNextAnnounce() {
            announceIndex = (announceIndex + 1) % announceSlides.length;
            updateAnnounce();
        }
        function startAnnounceInterval() {
            announceInterval = setInterval(showNextAnnounce, 3500);
        }
        announceTrack.addEventListener('mouseenter', () => clearInterval(announceInterval));
        announceTrack.addEventListener('mouseleave', startAnnounceInterval);
        startAnnounceInterval();
    }
});
// Sliding Banner Carousel JS
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let intervalId;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => {
        showNext();
        resetInterval();
    });
    prevBtn.addEventListener('click', () => {
        showPrev();
        resetInterval();
    });

    function startInterval() {
        intervalId = setInterval(showNext, 3500);
    }
    function resetInterval() {
        clearInterval(intervalId);
        startInterval();
    }
    startInterval();
});
// --- Hamburger Menu for Mobile ---
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('menu-open', isOpen);
        });
        // Close menu on link click (mobile UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', false);
                document.body.classList.remove('menu-open');
            });
        });
    }
});
// --- Basic Cart Functionality ---
const CART_KEY = 'eshop_cart';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    const idx = cart.findIndex(item => item.id === product.id);
    if (idx > -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({...product, qty: 1});
    }
    saveCart(cart);
    updateCartCount();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
    renderCartTable();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    let cartLinks = document.querySelectorAll('.nav-links a[href="cart.html"]');
    cartLinks.forEach(link => {
        link.textContent = `Cart${count > 0 ? ' (' + count + ')' : ''}`;
    });
}

// --- Add to Cart Button Handler (on product.html and products.html) ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Add to Cart buttons
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.textContent.trim().toLowerCase() === 'add to cart') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Get product info from DOM
                const card = btn.closest('.product-card, .product-detail');
                if (!card) return;
                const name = card.querySelector('h3, h1').textContent;
                const price = parseFloat(card.querySelector('.price, p').textContent.replace(/[^\d.]/g, ''));
                const img = card.querySelector('img')?.getAttribute('src') || '';
                const id = name.toLowerCase().replace(/\s+/g, '-');
                addToCart({id, name, price, img});
                btn.textContent = 'Added!';
                setTimeout(() => btn.textContent = 'Add to Cart', 1000);
            });
        }
    });

    // Render cart table if on cart.html
    if (window.location.pathname.endsWith('cart.html')) {
        renderCartTable();
    }

    // Handle checkout form
    if (window.location.pathname.endsWith('checkout.html')) {
        const form = document.querySelector('.checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Order placed! (Demo only)');
                localStorage.removeItem(CART_KEY);
                window.location.href = 'index.html';
            });
        }
    }

    // Handle contact form
    if (window.location.pathname.endsWith('contact.html')) {
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Message sent! (Demo only)');
                form.reset();
            });
        }
    }
});

// --- Render Cart Table ---
function renderCartTable() {
    const cart = getCart();
    const tbody = document.querySelector('.cart-table tbody');
    const summary = document.querySelector('.cart-summary p');
    if (!tbody) return;
    tbody.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${item.img}" alt="" style="width:40px;height:40px;object-fit:contain;vertical-align:middle;"> ${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.qty).toFixed(2)}</td>
            <td><button class="btn btn-remove" data-id="${item.id}">Remove</button></td>
        `;
        tbody.appendChild(tr);
        subtotal += item.price * item.qty;
    });
    if (summary) summary.innerHTML = `<strong>Subtotal:</strong> $${subtotal.toFixed(2)}`;
    // Remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.getAttribute('data-id'));
        });
    });
}
