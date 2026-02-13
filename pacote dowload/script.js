let carrinho = [];

// Configuração Padrão (Caso não tenha nada salvo)
const defaultConfig = {
    whatsapp: '5524992525931',
    menu: [
        {
            categoria: "Lanches",
            itens: [
                { nome: "X-Burger", preco: 15.00, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", desc: "Pão, hambúrguer, queijo, alface, tomate e maionese" },
                { nome: "X-Bacon", preco: 18.00, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop", desc: "Pão, hambúrguer, queijo, bacon, alface, tomate e maionese" },
                { nome: "X-Tudo", preco: 22.00, img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop", desc: "Pão, hambúrguer, queijo, bacon, ovo, presunto, alface, tomate e maionese" },
                { nome: "X-Frango", preco: 16.00, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop", desc: "Pão, filé de frango, queijo, alface, tomate e maionese" },
                { nome: "X-Calabresa", preco: 17.00, img: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop", desc: "Pão, calabresa, queijo, cebola, tomate e maionese" },
                { nome: "X-Salada", preco: 14.00, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop", desc: "Pão, hambúrguer, queijo, alface e tomate" }
            ]
        },
        {
            categoria: "Bebidas",
            itens: [
                { nome: "Refrigerante Lata", preco: 5.00, img: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop", desc: "350ml - Coca-Cola, Guaraná, Fanta" },
                { nome: "Suco Natural", preco: 7.00, img: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop", desc: "500ml - Laranja, Limão, Acerola" },
                { nome: "Água Mineral", preco: 3.00, img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop", desc: "500ml" }
            ]
        }
    ]
};

// Carregar configurações
let appConfig = JSON.parse(localStorage.getItem('lanchoneteConfig')) || defaultConfig;

// Função para renderizar o menu na tela
function renderizarMenu() {
    const container = document.getElementById('menu-container');
    let html = '';

    appConfig.menu.forEach(secao => {
        html += `
            <div class="menu-section">
                <h2>${secao.categoria}</h2>
                <div class="menu-grid">
        `;
        
        secao.itens.forEach(item => {
            html += `
                <div class="menu-item" data-nome="${item.nome}">
                    <img src="${item.img}" alt="${item.nome}" class="item-image">
                    <div class="item-info">
                        <h3>${item.nome}</h3>
                        <p class="description">${item.desc}</p>
                        <p class="price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button class="btn-add" onclick="adicionarItem('${item.nome}', ${item.preco})">Adicionar</button>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

// Funções de Administração
function abrirAdmin() {
    const senha = prompt("Digite a senha de administrador:");
    if (senha !== "admin123") { // Senha simples para exemplo
        alert("Senha incorreta!");
        return;
    }

    const modal = document.getElementById('admin-modal');
    const fieldsContainer = document.getElementById('admin-fields');
    
    let html = `
        <div class="admin-group">
            <label>Número do WhatsApp (apenas números):</label>
            <input type="text" id="admin-whatsapp" value="${appConfig.whatsapp}">
        </div>
    `;

    appConfig.menu.forEach((secao, secaoIndex) => {
        html += `<h3>${secao.categoria}</h3>`;
        secao.itens.forEach((item, itemIndex) => {
            html += `
                <div class="admin-group">
                    <label>${item.nome} - Preço (R$):</label>
                    <input type="number" step="0.01" id="price-${secaoIndex}-${itemIndex}" value="${item.preco}">
                    <label>URL da Imagem:</label>
                    <input type="text" id="img-${secaoIndex}-${itemIndex}" value="${item.img}">
                </div>
            `;
        });
    });

    fieldsContainer.innerHTML = html;
    modal.style.display = 'block';
}

function fecharAdmin() {
    document.getElementById('admin-modal').style.display = 'none';
}

function salvarConfiguracoes() {
    appConfig.whatsapp = document.getElementById('admin-whatsapp').value;

    appConfig.menu.forEach((secao, secaoIndex) => {
        secao.itens.forEach((item, itemIndex) => {
            const novoPreco = parseFloat(document.getElementById(`price-${secaoIndex}-${itemIndex}`).value);
            const novaImg = document.getElementById(`img-${secaoIndex}-${itemIndex}`).value;
            
            if (!isNaN(novoPreco)) item.preco = novoPreco;
            if (novaImg) item.img = novaImg;
        });
    });

    localStorage.setItem('lanchoneteConfig', JSON.stringify(appConfig));
    renderizarMenu();
    fecharAdmin();
    alert('Configurações salvas com sucesso!');
}

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
    
    const urlWhatsApp = `https://wa.me/${appConfig.whatsapp}?text=${mensagem}`;
    
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
    renderizarMenu(); // Inicializa o menu dinâmico
});
