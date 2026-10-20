/* =========================================================
   BAFFI — MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. CART
   ========================================================= */

let cart = [];

/* =========================================================
   LOAD CART FROM LOCAL STORAGE
   ========================================================= */

try {
    const savedCart = localStorage.getItem("baffiCart");

    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cart = parsedCart
                .filter(function(product) {
                    return (
                        product &&
                        typeof product.name === "string" &&
                        product.name.trim() !== ""
                    );
                })
                .map(function(product) {
                    return {
                        name: product.name,
                        quantity: Math.max(
                            1,
                            Number(product.quantity) || 1
                        )
                    };
                });
        }
    }
} catch (error) {
    console.error("Unable to load BAFFI cart:", error);
    cart = [];
}


/* =========================================================
   PRODUCT PRICES
   ========================================================= */

const productPrices = {

    "Premium Essential Tee": 150,
    "BAFFI Premium Essential Hoodie": 280,
    "BAFFI Signature Sweatshirt": 250,
    "Classic BAFFI Suit": 850,
    "Premium Dress Shirt": 180,
    "BAFFI Classic Tie": 90,
    "BAFFI Classic Men's Shoes": 350,
    "BAFFI Classic Watch": 300,
    "BAFFI Signature Cap": 100

};

/* =========================================================4. UPDATE CART COUNTER========================================================= */
function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        function(total, product) {
            return total + product.quantity;
        },
        0
    );

    cartCount.textContent = totalItems;
}

/* =========================================================5. SAVE CART========================================================= */
function saveCart() {

    localStorage.setItem(
        "baffiCart",
        JSON.stringify(cart)
    );

}

/* =========================================================6. ADD PRODUCT TO CART========================================================= */
function addToCart(productName) {

    const existingProduct =
        cart.find(function(product) {
            return product.name === productName;
        });


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: productName,
            quantity: 1
        });

    }


    saveCart();

    updateCartCount();


    alert(
        `${productName} has been added to your cart.`
    );
}

/* =========================================================7. ADD-TO-CART BUTTONS========================================================= */
document.addEventListener("DOMContentLoaded", function() {

    const addToCartButtons =
        document.querySelectorAll(".add-to-cart");


    addToCartButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const productName =
                button.getAttribute("data-product");


            if (!productName) {

                alert("Product information is missing.");

                return;
            }


            addToCart(productName);

        });

    });


    updateCartCount();

    renderCart();

});

/* =========================================================8. CART PAGE========================================================= */
function renderCart() {

    const cartContainer =
        document.getElementById("cart-container");

    const emptyCart =
        document.getElementById("empty-cart");

    const cartSummary =
        document.getElementById("cart-summary");

    const cartTotal =
        document.getElementById("cart-total");


    if (!cartContainer) {
        return;
    }


    if (cart.length === 0) {

        cartContainer.innerHTML = "";

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        if (cartSummary) {
            cartSummary.style.display = "none";
        }

        return;
    }


    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    if (cartSummary) {
        cartSummary.style.display = "block";
    }


    let total = 0;


    cartContainer.innerHTML =
        cart.map(function(product, index) {

            const price =
                productPrices[product.name] || 0;

            const itemTotal =
                price * product.quantity;

            total += itemTotal;


            return `
                <div class="cart-item">

                    <div class="cart-item-info">

                        <h3>${product.name}</h3>

                        <p>
                            GH₵${price.toLocaleString()} each
                        </p>

                    </div>

                    <div class="cart-item-actions">

                        <button
                            class="quantity-btn decrease-quantity"
                            data-index="${index}"
                            type="button"
                        >
                            −
                        </button>

                        <span class="cart-quantity">
                            ${product.quantity}
                        </span>

                        <button
                            class="quantity-btn increase-quantity"
                            data-index="${index}"
                            type="button"
                        >
                            +
                        </button>

                        <strong class="cart-item-total">
                            GH₵${itemTotal.toLocaleString()}
                        </strong>

                        <button
                            class="remove-cart-item"
                            data-index="${index}"
                            type="button"
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `;

        }).join("");


    if (cartTotal) {

        cartTotal.textContent =
            `GH₵${total.toLocaleString()}`;

    }

/* -----------------------------------------------------INCREASE QUANTITY----------------------------------------------------- */
    const increaseButtons =
        document.querySelectorAll(".increase-quantity");


    increaseButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const index =
                Number(button.dataset.index);

            cart[index].quantity += 1;

            saveCart();

            updateCartCount();

            renderCart();

        });

    });

/* -----------------------------------------------------DECREASE QUANTITY----------------------------------------------------- */
    const decreaseButtons =
        document.querySelectorAll(".decrease-quantity");


    decreaseButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const index =
                Number(button.dataset.index);


            if (cart[index].quantity > 1) {

                cart[index].quantity -= 1;

            } else {

                cart.splice(index, 1);

            }


            saveCart();

            updateCartCount();

            renderCart();

        });

    });

/* -----------------------------------------------------REMOVE PRODUCT----------------------------------------------------- */
const removeButtons =
    document.querySelectorAll(".remove-cart-item");

removeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const index =
            Number(button.dataset.index);

        cart.splice(index, 1);

        saveCart();

        updateCartCount();

        renderCart();

    });

});
}

/* =========================================================9. CLEAR CART========================================================= */
document.addEventListener("DOMContentLoaded", function() {

    const clearCartButton =
        document.getElementById("clear-cart");


    if (clearCartButton) {

        clearCartButton.addEventListener(
            "click",
            function() {

                if (cart.length === 0) {
                    return;
                }


                const confirmClear =
                    confirm(
                        "Are you sure you want to clear your BAFFI cart?"
                    );


                if (!confirmClear) {
                    return;
                }


                cart = [];

                saveCart();

                updateCartCount();

                renderCart();

            }
        );

    }

});

/* =========================================================10. NEWSLETTER========================================================= */
document.addEventListener("DOMContentLoaded", function() {

    const newsletterForm =
        document.getElementById("newsletter-form");


    if (!newsletterForm) {
        return;
    }


    newsletterForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById("email").value.trim();


            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            alert(
                `Thank you for joining BAFFI.\n\nWe'll keep ${email} updated with our latest collections.`
            );


            newsletterForm.reset();

        }
    );
});

/* =========================================================11. WHATSAPP CHECKOUT========================================================= */
document.addEventListener("DOMContentLoaded", function() {

    const whatsappCheckoutButton =
        document.getElementById("whatsapp-checkout");

    if (!whatsappCheckoutButton) {
        return;
    }

    whatsappCheckoutButton.addEventListener(
        "click",
        function() {

            /* ---------------------------------------------CHECK WHETHER CART IS EMPTY--------------------------------------------- */
            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add a product before checkout."
                );

                return;
            }

            /* ---------------------------------------------GET CUSTOMER DETAILS--------------------------------------------- */
            const customerName =
                document.getElementById("customer-name")?.value.trim();

            const customerPhone =
                document.getElementById("customer-phone")?.value.trim();

            const deliveryLocation =
                document.getElementById("delivery-location")?.value.trim();

            const orderNote =
                document.getElementById("order-note")?.value.trim();

            /* ---------------------------------------------VALIDATE REQUIRED DETAILS--------------------------------------------- */
            if (!customerName) {

                alert("Please enter your full name.");

                return;
            }

            if (!customerPhone) {

                alert("Please enter your phone number.");

                return;
            }

            if (!deliveryLocation) {

                alert("Please enter your delivery location.");

                return;
            }

            /* ---------------------------------------------WHATSAPP NUMBER--------------------------------------------- */
            const whatsappNumber = "233207417469";

            /* ---------------------------------------------BUILD ORDER MESSAGE--------------------------------------------- */
            let message =
                "Hello BAFFI, I would like to place an order.\n\n";

            message += "CUSTOMER DETAILS\n";
            message += "------------------------------\n";

            message +=
                `Name: ${customerName}\n`;

            message +=
                `Phone: ${customerPhone}\n`;

            message +=
                `Delivery Location: ${deliveryLocation}\n`;

            if (orderNote) {

                message +=
                    `Order Note: ${orderNote}\n`;

            }

            message +=
                "\nORDER SUMMARY\n";

            message +=
                "------------------------------\n";

            let total = 0;

            cart.forEach(function(product, index) {

                const price =
                    productPrices[product.name] || 0;

                const itemTotal =
                    price * product.quantity;

                total += itemTotal;


                message +=
                    `${index + 1}. ${product.name}\n`;

                message +=
                    `   Quantity: ${product.quantity}\n`;

                message +=
                    `   Price: GH₵${price.toLocaleString()} each\n`;

                message +=
                    `   Subtotal: GH₵${itemTotal.toLocaleString()}\n\n`;

            });

            /* ---------------------------------------------TOTAL--------------------------------------------- */
            message +=
                "------------------------------\n";

            message +=
                `TOTAL: GH₵${total.toLocaleString()}\n\n`;

            message +=
                "Please confirm availability and let me know the next steps for payment and delivery.\n\n";

            message +=
                "Thank you.";

            /* ---------------------------------------------OPEN WHATSAPP--------------------------------------------- */
            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            window.open(
                whatsappURL,
                "_blank"
            );

        }
    );

});

/* =========================================================
   SHOP PRODUCT FILTERS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const productCards =
        document.querySelectorAll(".product-card");

    const noProductsMessage =
        document.getElementById("no-products-message");


    if (!filterButtons.length || !productCards.length) {
        return;
    }


    if (noProductsMessage) {
        noProductsMessage.style.display = "none";
    }


    filterButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const selectedCategory =
                button.getAttribute("data-filter");


            filterButtons.forEach(function(btn) {
                btn.classList.remove("active");
            });


            button.classList.add("active");


            let visibleProducts = 0;


            productCards.forEach(function(card) {

                const productCategory =
                    card.getAttribute("data-category");


                if (
                    selectedCategory === "all" ||
                    productCategory === selectedCategory
                ) {

                    card.style.display = "";
                    visibleProducts++;

                } else {

                    card.style.display = "none";

                }

            });


            if (noProductsMessage) {

                noProductsMessage.style.display =
                    visibleProducts === 0
                        ? "block"
                        : "none";

            }

        });

    });


    /* =====================================================
       LOAD SHOP CATEGORY FROM URL
       ===================================================== */

    const urlParams =
        new URLSearchParams(window.location.search);

    const categoryFromURL =
        urlParams.get("category");


    if (!categoryFromURL) {
        return;
    }


    const matchingButton =
        document.querySelector(
            `.filter-btn[data-filter="${categoryFromURL}"]`
        );


    if (matchingButton) {
        matchingButton.click();
    }

});

/* =========================================================
   BAFFI — MOBILE MENU TOGGLE
   ========================================================= */

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {
        const isOpen = mainNav.classList.toggle("mobile-open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close the menu after a navigation link is selected
    mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            mainNav.classList.remove("mobile-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        });
    });

}