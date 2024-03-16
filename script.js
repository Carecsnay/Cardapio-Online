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

cartBTN.addEventListener('click', () => {
    modal.style.display = 'flex';
});