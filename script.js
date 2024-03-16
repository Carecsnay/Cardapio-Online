const modal = document.querySelector('#modal');
const menu = document.querySelector('#menu');
const cartBTN = document.querySelector('#cart-btn');
const cartItemsContainer = document.querySelector('#card-items');
const cartTotal = document.querySelector('#cart-total');
const checkoutBTN = document.querySelector('#checkout');
const closeModalBTN = document.querySelector('#close-modal-btn');
const cardCounter = document.querySelector('#cart-count');
const addressInput = document.querySelector('#address');
const warnInput = document.querySelector('#address-warn');

let cart = [];

cartBTN.addEventListener('click', () => {
    modal.style.display = 'flex';
});

modal.addEventListener('click', (e) => {
    if(e.target === modal) {
        modal.style.display = "none";
    }
});

closeModalBTN.addEventListener('click', () => {
    modal.style.display = "none";
});

menu.addEventListener('click', (e) => {
    let parentButton = e.target.closest(".add-to-cart-btn");
    
    if (parentButton) {
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price')).toFixed(2);

        addToCart(name,price);
    }
});

function addToCart (name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem) {
        existingItem.quantity ++;
        return;
    }

    cart.push({
        name,
        price,
        quantity: 1,
    });
}

