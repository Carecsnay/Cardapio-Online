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
        Toastify({
            text: "⚠️ Seu carrinho está vazio. Por favor, adicione itens ao seu carrinho antes de finalizar o pedido.",
            style: {
                background: "#ef4444",
                'max-width': '90%',
            },
            stopOnFocus: true,
            position: "right",
            newWindow: true,
            close: true,
            gravity: "top",
            duration: 3000
        }).showToast();
        return;
    }
    
    if(addressInput.value === "") {
        warnInput.classList.remove('hidden');
        addressInput.classList.add("border-red-500");
        return
    }
});

function customAlert(title, message) {
    var customAlertBox = document.createElement("div");
    customAlertBox.className = "fixed inset-0 flex items-center justify-center";

    var customAlertOverlay = document.createElement("div");
    customAlertOverlay.className = "fixed inset-0 bg-gray-900 opacity-50";
    customAlertOverlay.addEventListener('click', function() {
        document.body.removeChild(customAlertBox);
    });

    var customAlertContent = document.createElement("div");
    customAlertContent.className = "bg-white rounded-lg px-4 py-9 max-w-[90%] sm:max-w-md absolute";

    var horarioFuncionamento = document.createElement("p");
    horarioFuncionamento.className = "flex items-center justify-center text-red-600 text-sm mb-2 font-bold";
    horarioFuncionamento.innerHTML = "Horário de Funcionamento: Seg a Dom 18:00 às 22:00";

    var customAlertTitle = document.createElement("h2");
    customAlertTitle.className = "flex items-center justify-center text-lg font-semibold mb-2";
    customAlertTitle.innerHTML = title;

    var customAlertMessage = document.createElement("p");
    customAlertMessage.className = "flex items-center justify-center text-gray-700 mb-2";
    customAlertMessage.innerHTML = message;

    var okButton = document.createElement("button");
    okButton.className = "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center justify-center mx-auto"; // Adicionando classes para centralizar o botão
    var timer = 5;
    okButton.innerHTML = "OK (" + timer + "s)";
    
    var timerInterval = setInterval(function() {
        timer--;
        okButton.innerHTML = "OK (" + timer + "s)";
        if (timer === 0) {
            clearInterval(timerInterval);
            document.body.removeChild(customAlertBox);
        }
    }, 1000);

    okButton.onclick = function() {
        clearInterval(timerInterval);
        document.body.removeChild(customAlertBox);
    };

    customAlertContent.appendChild(customAlertTitle);
    customAlertContent.appendChild(customAlertMessage);
    customAlertContent.appendChild(horarioFuncionamento); // Adicionando o horário de funcionamento antes do título
    customAlertContent.appendChild(okButton);

    customAlertBox.appendChild(customAlertOverlay);
    customAlertBox.appendChild(customAlertContent);

    document.body.appendChild(customAlertBox);
}



// customAlert("⚠️ Comunicado ⚠️","Estamos fechados no momento, voltamos em breve!")
//106:57