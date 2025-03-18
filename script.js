// Datos de productos
const products = [
    {
        id: 1,
        name: "Bonsái Arce Japonés",
        type: "Decoración de Casa",
        price: 150000,
        image: "https://i.pinimg.com/564x/97/f2/8f/97f28fb019b7dcfb18a3a75da48c029c.jpg",
        description: "Perfecto para decorar espacios interiores con mucha luz."
    },
    {
        id: 2,
        name: "Bonsái Junípero",
        type: "Decoración de Oficina",
        price: 120000,
        image: "https://www.shenjikai.com.mx/cdn/shop/articles/JUNIPERO_GREEN_MOUNTAIN_1200x630.jpg?v=1628703686",
        description: "Ideal para escritorios ejecutivos, de fácil mantenimiento."
    },
    {
        id: 3,
        name: "Bonsái Pino Negro",
        type: "Decoración de Casa",
        price: 180000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYp7QE1xz-wquHtxSBv9w6QxGmE3XazgryDA&s",
        description: "Elegante y tradicional, perfecto para ambientes zen."
    },
    {
        id: 4,
        name: "Bonsái Ficus",
        type: "Decoración de Oficina",
        price: 95000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-_jIaLwIKd2_cK-UWmRWkOMv2VHSmNBKOLg&s",
        description: "Resistente y de bajo mantenimiento, ideal para oficinas."
    },
    {
        id: 5,
        name: "Bonsái Olmo Chino",
        type: "Estudio de Yoga",
        price: 140000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYInde46p1y1l2r4j3Ga2Kx6_DjcW6NFIadw&s",
        description: "Transmite calma y equilibrio, perfecto para espacios de yoga."
    },
    {
        id: 6,
        name: "Bonsái Cerezo",
        type: "Decoración de Casa",
        price: 210000,
        image: "https://m.media-amazon.com/images/I/61e18KAxftL.jpg",
        description: "Espectacular cuando florece, ideal para espacios luminosos."
    },
    {
        id: 7,
        name: "Bonsái Zelkova",
        type: "Estudio de Yoga",
        price: 170000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuUWMzs_5pUHXCdBtpNgr8jrMShZgnFhAveA&s",
        description: "Simboliza la fortaleza y flexibilidad, ideal para estudios de yoga."
    },
    {
        id: 8,
        name: "Bonsái Carmona",
        type: "Decoración de Oficina",
        price: 115000,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhAEzctol9fEP8o29U7bERl7MHCYGLFmgPVg&s",
        description: "Elegante y compacto, perfecto para escritorios pequeños."
    }
];

// Estado del carrito
let cart = [];

// Elementos del DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    loadProducts();
    updateCartDisplay();
    
    // Event listeners
    document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
    document.getElementById('close-modal').addEventListener('click', closeCheckoutModal);
    document.getElementById('checkout-form').addEventListener('submit', processOrder);
    
    // Botón del carrito (opcional para mostrar/ocultar)
    document.querySelector('.cart-icon').addEventListener('click', function() {
        document.getElementById('cart-section').scrollIntoView({ behavior: 'smooth' });
    });
});

// Cargar productos en la interfaz
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.type}</p>
                <p>${product.description}</p>
                <p class="price">$${formatPrice(product.price)}</p>
                <div class="product-actions">
                    <div class="quantity-control">
                        <button class="qty-btn decrease" data-id="${product.id}">-</button>
                        <span class="quantity" id="qty-${product.id}">1</span>
                        <button class="qty-btn increase" data-id="${product.id}">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
    
    // Agregar event listeners a los botones de cantidad
    document.querySelectorAll('.qty-btn.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.qty-btn.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    // Agregar event listeners a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Función para formatear precios
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para disminuir cantidad
function decreaseQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const quantitySpan = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(quantitySpan.textContent);
    
    if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
    }
}

// Función para aumentar cantidad
function increaseQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const quantitySpan = document.getElementById(`qty-${productId}`);
    let quantity = parseInt(quantitySpan.textContent);
    
    quantity++;
    quantitySpan.textContent = quantity;
}

// Función para añadir al carrito
function addToCart(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const quantitySpan = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantitySpan.textContent);
    
    // Buscar el producto en el array de productos
    const productToAdd = products.find(product => product.id === productId);
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Si ya existe, actualizar la cantidad
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Si no existe, añadir al carrito
        cart.push({
            ...productToAdd,
            quantity: quantity
        });
    }
    
    // Resetear la cantidad a 1
    quantitySpan.textContent = "1";
    
    // Actualizar la interfaz del carrito
    updateCartDisplay();
    
    // Efecto de confirmación
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = "¡Añadido!";
    button.style.backgroundColor = "#28a745";
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "";
    }, 1000);
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Actualizar el contador del carrito
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Si el carrito está vacío
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        cartTotalElement.textContent = "$0";
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = "0.5";
        return;
    }
    
    // Activar el botón de checkout
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    
    // Actualizar los items del carrito
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>${item.type}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="qty-btn decrease-cart" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn increase-cart" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">$${formatPrice(item.price * item.quantity)}</div>
                <button class="qty-btn remove-item" data-id="${item.id}">&times;</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Agregar event listeners a los botones del carrito
    document.querySelectorAll('.decrease-cart').forEach(button => {
        button.addEventListener('click', decreaseCartQuantity);
    });
    
    document.querySelectorAll('.increase-cart').forEach(button => {
        button.addEventListener('click', increaseCartQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeCartItem);
    });
    
    // Actualizar el total del carrito
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${formatPrice(cartTotal)}`;
}

// Función para disminuir cantidad en el carrito
function decreaseCartQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    
    if (cartItemIndex !== -1) {
        if (cart[cartItemIndex].quantity > 1) {
            cart[cartItemIndex].quantity--;
        } else {
            cart.splice(cartItemIndex, 1);
        }
        
        updateCartDisplay();
    }
}

// Función para aumentar cantidad en el carrito
function increaseCartQuantity(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    const cartItemIndex = cart.findIndex(item => item.id === productId);
    
    if (cartItemIndex !== -1) {
        cart[cartItemIndex].quantity++;
        updateCartDisplay();
    }
}

// Función para eliminar item del carrito
function removeCartItem(event) {
    const productId = parseInt(event.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Función para abrir el modal de checkout
function openCheckoutModal() {
    if (cart.length === 0) return;
    
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
}

// Función para cerrar el modal de checkout
function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

// Función para procesar la orden
function processOrder(event) {
    event.preventDefault();
    
    // Cerrar el modal de checkout
    closeCheckoutModal();
    
    // Mostrar el modal de éxito
    const successModal = document.getElementById('success-modal');
    successModal.style.display = 'flex';
    
    // Después de 3 segundos, cerrar el modal y vaciar el carrito
    setTimeout(() => {
        successModal.style.display = 'none';
        cart = [];
        updateCartDisplay();
    }, 3000);
}

// Cerrar modales al hacer clic fuera del contenido
window.addEventListener('click', function(event) {
    const checkoutModal = document.getElementById('checkout-modal');
    const successModal = document.getElementById('success-modal');
    
    if (event.target === checkoutModal) {
        closeCheckoutModal();
    }
    
    if (event.target === successModal) {
        successModal.style.display = 'none';
    }
});