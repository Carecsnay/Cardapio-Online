const modal = document.querySelector('#modal');
const menu = document.querySelector('#menu');
const cartBTN = document.querySelector('#cart-btn');
const cartItemsContainer = document.querySelector('#cart-items');
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
    if (e.target === modal) {
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

        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateModal()
}
function updateModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let counterTotal = 0;

    cart.forEach(item => {
        const totalPerItem = item.price * item.quantity; 

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">Valor: R$ ${item.price} x ${item.quantity} = R$ ${totalPerItem.toFixed(2)}</p>
                </div>
                <button class="item-modal-remove" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;

        total += totalPerItem;
        counterTotal += item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cardCounter.innerHTML = counterTotal;
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    });
}

cartItemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('item-modal-remove')) {
        const name = e.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateModal();
            return;
        } else {
            cart.splice(index, 1);
            updateModal();
        }
    }
}

addressInput.addEventListener('input', (e) => {
    let inputValue = e.target.value;
    
    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        warnInput.classList.add('hidden');
    }
    
});

checkoutBTN.addEventListener('click', () => {
    if(cart.length === 0) {
        alert('Seu carrinho está vazio. Por favor, adicione itens ao seu carrinho antes de finalizar o pedido.')
        return;
    }
    if(addressInput.value === "") {
        warnInput.classList.remove('hidden');
        addressInput.classList.add("border-red-500");
        return
    }
});

