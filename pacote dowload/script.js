let carrinho = [];

function adicionarItem(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    mostrarFeedback(nome);
}

function removerItem(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    atualizarCarrinho();
}

function alterarQuantidade(nome, quantidade) {
    const item = carrinho.find(item => item.nome === nome);
    if (item) {
        item.quantidade = quantidade;
        if (item.quantidade <= 0) {
            removerItem(nome);
        } else {
            atualizarCarrinho();
        }
    }
}

function atualizarCarrinho() {
    const cartItems = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    const btnEnviar = document.getElementById('btn-enviar');
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Carrinho vazio</p>';
        totalElement.textContent = '0,00';
        btnEnviar.disabled = true;
        return;
    }
    
    btnEnviar.disabled = false;
    
    let html = '';
    let total = 0;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.nome}</div>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="alterarQuantidade('${item.nome}', ${item.quantidade - 1})">-</button>
                    <span class="qty-number">${item.quantidade}</span>
                    <button class="qty-btn" onclick="alterarQuantidade('${item.nome}', ${item.quantidade + 1})">+</button>
                    <button class="btn-remove" onclick="removerItem('${item.nome}')">🗑️</button>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    totalElement.textContent = total.toFixed(2).replace('.', ',');
}

function enviarPedido() {
    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de enviar o pedido!');
        return;
    }
    
    let mensagem = '*Pedido da Lanchonete*%0A%0A';
    let total = 0;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2).replace('.', ',')}%0A`;
    });
    
    mensagem += `%0A*Total: R$ ${total.toFixed(2).replace('.', ',')}*%0A%0A`;
    mensagem += 'Aguardando confirmação do pedido!';
    
    const numeroWhatsApp = '5524992525931';
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    
    window.open(urlWhatsApp, '_blank');
}

function mostrarFeedback(nome) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        const itemNome = item.getAttribute('data-nome');
        if (itemNome === nome) {
            item.style.borderColor = '#25D366';
            setTimeout(() => {
                item.style.borderColor = 'transparent';
            }, 500);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const btnEnviar = document.getElementById('btn-enviar');
    btnEnviar.disabled = true;
});
