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

// Atualize a função updateModal para adicionar itens ao contêiner do carrinho
function updateModal() {
    cartItemsContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar novos itens
    let total = 0;
    let counterTotal = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">Valor Unitário: R$ ${item.price}</p>
            </div>

            <button>
                Remover
            </button>
        </div>
        `;

        total += item.price * item.quantity;
        counterTotal += item.quantity;

        cartItemsContainer.appendChild(cartItemElement); // Adiciona o item ao contêiner do carrinho
    });

    // Atualize o contador do carrinho e o total do carrinho
    cardCounter.innerHTML = counterTotal;
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: 'currency',
        currency: 'BRL'
    });
}
