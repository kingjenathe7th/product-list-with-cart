
// const removeItemsButtons = document.querySelectorAll(".remove-item");
const cart = document.querySelector('.cart');
const emptyCart = document.querySelector('.empty-cart');

const CartHeaderQuantity = document.querySelector('.cart-header-quantity');
const incrementBtns = document.querySelectorAll('.cart-plus-minus');
const decrement = document.querySelectorAll('.more-less decrement');
const increment = document.querySelectorAll('.more-less increment');
const itemQuantity = document.querySelectorAll('.item-quantity');
const addToCartBtns = document.querySelectorAll('.add-btn1');
const fullGridContainerHTML = document.querySelector('.grid-container');
const fullCart = document.querySelector('.full-cart');

let fullGridProducts = [];
let carts = [];


document.addEventListener('DOMContentLoaded', () => {
    initApp();
    addDataToHTML();
    checkCartState();
    addToCartHtml();

});



const initApp = () => {
    //get data from the json
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            fullGridProducts = data;
            console.log(fullGridProducts);
            addDataToHTML();
        })
        .catch(error => console.error('Error fetching data:', error));
};

const addDataToHTML = () => {
    fullGridContainerHTML.innerHTML = '';
    if (fullGridProducts.length > 0) {
        fullGridProducts.forEach(products => {
            let newProducts = document.createElement('div');
            newProducts.classList.add('full-grid');
            newProducts.dataset.id = products.id;
            newProducts.innerHTML = `
                        <div class="image-container">
                            <img src="${products.image.desktop}" alt="">
                        </div>
                        <div class="button-container">
                            <button class="add-btn1 active">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" fill="none"
                                    viewBox="0 0 21 20">
                                    <g fill="#C73B0F" clip-path="url(#a)">
                                        <path
                                            d="M6.583 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM15.334 18.75a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM3.446 1.752a.625.625 0 0 0-.613-.502h-2.5V2.5h1.988l2.4 11.998a.625.625 0 0 0 .612.502h11.25v-1.25H5.847l-.5-2.5h11.238a.625.625 0 0 0 .61-.49l1.417-6.385h-1.28L16.083 10H5.096l-1.65-8.248Z" />
                                        <path d="M11.584 3.75v-2.5h-1.25v2.5h-2.5V5h2.5v2.5h1.25V5h2.5V3.75h-2.5Z" />
                                    </g>
                                    <defs>
                                        <clipPath id="a">
                                            <path fill="#fff" d="M.333 0h20v20h-20z" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p>
                                    Add to cart
                                </p>
                            </button>
                            <div class="cart-plus-minus">
                                <span class="access-hidden">Cart quantity</span>
                                <button class="more-less decrement">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill=""
                                        viewBox="0 0 10 2">
                                        <path fill="" d="M0 .375h10v1.25H0V.375Z" />
                                    </svg>
                                </button>
                                <span class="item-quantity">1</span>
                                <button class="more-less increment">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill=""
                                        viewBox="0 0 10 10">
                                        <path fill=""
                                            d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                     <p class="description">
                        ${products.category}
                        <br>
                    <h5 class="tertiary-header">${products.name}</h5 class="tertiary-header">
                    <div class="price">$${products.price.toFixed(2)}</div>
                    </p>
            `;
            fullGridContainerHTML.appendChild(newProducts);
        });
        toggleAddToCArtButtons();

        document.querySelectorAll('.increment').forEach(button => {
            button.addEventListener('click', (event) => {
                const productElement = event.target.closest('.full-grid');
                const productID = productElement.dataset.id;
                const quantityElement = productElement.querySelector('.item-quantity');
                let quantity = parseInt(quantityElement.innerText);
                quantity++;
                quantityElement.innerText = quantity;
                updateCart(productID, quantity);
            });
        });
        document.querySelectorAll('.decrement').forEach(button => {
            button.addEventListener('click', (event) => {
                const productElement = event.target.closest('.full-grid');
                const productID = productElement.dataset.id;
                const quantityElement = productElement.querySelector('.item-quantity');
                let quantity = parseInt(quantityElement.innerText);
                if (quantity > 1) {
                    quantity--;
                    quantityElement.innerText = quantity;
                    updateCart(productID, quantity);
                }
            });
        });

    };
};



fullGridContainerHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-btn1')) {
        let product_ID = event.target.parentElement.parentElement.dataset.id;
        addToCart(product_ID);
    }
});



const updateCart = (productID, quantity) => {
    const cartItemIndex = carts.findIndex(item => item.product_ID === productID);
    if (cartItemIndex !== -1) {
        carts[cartItemIndex].quantity = quantity;
    } else {
        carts.push({ productID: productID, quantity: quantity });
    }
    addToCartHtml();
    updateCartHeaderQuantity();
    updateCartTotal();
};



//TO ADD THE ITEMS TO CART
const addToCart = (product_ID) => {
    let positionThisProductIndex = carts.findIndex((value) => value.product_ID === product_ID);
    if (carts.length <= 0) {
        carts = [{
            product_ID: product_ID,
            quantity: 1,
        }];
    } else if (positionThisProductIndex < 0) {
        carts.push({
            product_ID: product_ID,
            quantity: 1
        });
    } else {
        carts[positionThisProductIndex].quantity += 1;
    };

       // Toggle button states for the item in the grid
       const productElement = document.querySelector(`.full-grid[data-id="${product_ID}"]`);
       if (productElement) {
           const addToCartButton = productElement.querySelector('.add-btn1');
           const cartPlusMinus = productElement.querySelector('.cart-plus-minus');
   
           if (addToCartButton && cartPlusMinus) {
               addToCartButton.style.display = 'none';        // Hide 'Add to Cart' button
               cartPlusMinus.style.display = 'flex';          // Show 'cart-plus-minus' controls
           }
       }
    addToCartHtml();
};




const addToCartHtml = () => {
    const cartContainerHTML = document.querySelector('.cart-container');
    cartContainerHTML.innerHTML = '';
    let totalCartHeaderQuantity = 0;

    if (carts.length > 0) {
        carts.forEach(cart => {
            totalCartHeaderQuantity = totalCartHeaderQuantity + cart.quantity;
            const newCartItem = document.createElement('article');
            newCartItem.classList.add('cart-item');
            console.log(`cart.product_ID:`, cart.product_ID);
            let positionProduct = fullGridProducts.findIndex((value) => value.id == cart.product_ID);
            let info = fullGridProducts[positionProduct];
            newCartItem.innerHTML = `
                <div class="cart-quantity">
                    <p class="cart-heading">${info.name}</p>
                    <div class="quantity-wrapper">
                        <span class="quantity">${cart.quantity + 'x'}</span>
                        <span class="each-item">@$${info.price.toFixed(2)}</span>
                        <span class="item-total">$${(cart.quantity * info.price.toFixed(2)).toFixed(2)}</span>
                    </div>
                </div>
                <button class="remove-item" type="button">
                    <span class="access-hidden"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                        <path fill="" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                    </svg>
                </button>
            `;
            cartContainerHTML.appendChild(newCartItem);



            // Remove item event listener
            const removeItemsButtons = newCartItem.querySelectorAll('.remove-item');
            removeItemsButtons.forEach((removeItemButton, index) => {
                removeItemButton.addEventListener('click', (event) => {
                    event.preventDefault();

                    // DECREASE THE QUANTITY IN THE CART ARRAY
                    const cartItemIndex = carts.findIndex(item => item.product_ID === cart.product_ID);
                    if (cartItemIndex !== -1) {
                        carts.splice(cartItemIndex, 1);
                        newCartItem.remove();// Remove the item from the cart array

                        //FINDING THE CORRESPONDING PRODUCT AND TOGGLE THE VISIBILITY
                        const productElement = document.querySelector(`.full-grid[data-id="${cart.product_ID}"]`);
                        if (productElement) {
                            const addToCartButton = productElement.querySelector('.add-btn1');
                            const cartPlusMinus = productElement.querySelector('.cart-plus-minus');
                            const itemQuantity = productElement.querySelector(`.item-quantity`);

                            if (addToCartButton && cartPlusMinus && itemQuantity) {
                                addToCartButton.classList.remove('active');
                                addToCartButton.style.display = 'flex';
                                cartPlusMinus.style.display = 'none';
                                itemQuantity.innerText = 1;
                            }
                        };
                        updateCartHeaderQuantity();
                        updateCartTotal();
                        checkCartState();
                    };
                });
            });
        });
    };
    updateCartHeaderQuantity();
    updateCartTotal();
    checkCartState();
};






const updateCartHeaderQuantity = () => {
    let totalCartHeaderQuantity = carts.reduce((acc, cart) => acc + cart.quantity, 0);
    CartHeaderQuantity.textContent = `(` + totalCartHeaderQuantity + `)`;
}


//TOGGLE THE ADD TO CART BUTTONS
function toggleAddToCArtButtons() {
    const addBtns = document.querySelectorAll('.add-btn1');
    const cartPlusMinus = document.querySelectorAll('.cart-plus-minus');
    addBtns.forEach((btn, index) => {
        btn.addEventListener('click', (event) => {
            event.target.classList.toggle('active');
            if (cartPlusMinus[index]) {
                cartPlusMinus[index].classList.add('active');
            }
        });
    });
};



//to calculate the cart total
function updateCartTotal() {
    var cartItemContainer = document.querySelector(".cart-container");
    var cartRows = cartItemContainer.getElementsByClassName('cart-item');
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        // Getting the price and quantity
        var priceElement = cartRow.getElementsByClassName('each-item')[0];
        var quantityElement = cartRow.querySelector('.quantity');
        var price = parseFloat(priceElement.innerText.replace('@', '').replace('$', '0'));
        let quantity = parseInt(quantityElement.innerText);
        total += (price * quantity);
    };
    document.querySelector('.amount').innerText = '$' + total.toFixed(2);
};





//To check cart state
function checkCartState() {
    const cartItem = document.querySelectorAll('.cart-item');
    if (cartItem.length > 0) {
        fullCart.style.display = 'block';
        emptyCart.style.display = 'none';
    } else {
        fullCart.style.display = 'none';
        emptyCart.classList.add('active');
        emptyCart.style.display = 'block';
    }

};


// checkCartState();



