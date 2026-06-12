// ========== JOGO AGRO FORTE - SISTEMA COMPLETO ==========

// ESTADO DO JOGO
let gameState = {
    producao: 500,
    ambiente: 500,
    dinheiro: 5000,
    dia: 1,
    pontuacao: 0,
    historico: [],
    jogoAtivo: true
};

// LIMITES DO JOGO
const MAX_STAT = 1000;
const MIN_STAT = 0;
const DIAS_PARA_VENCER = 30;
const PONTUACAO_VITORIA = 1000;

// AÇÕES E SEUS EFEITOS
const acoes = {
    plantioDireto: {
        nome: "🌾 Plantio Direto",
        producao: 30,
        ambiente: 20,
        dinheiro: -50,
        descricao: "Técnica sustentável que melhora o solo"
    },
    desmatamento: {
        nome: "🪓 Desmatamento",
        producao: 50,
        ambiente: -60,
        dinheiro: 200,
        descricao: "Expansão rápida mas agride o ambiente"
    },
    reflorestamento: {
        nome: "🌳 Reflorestamento",
        producao: -20,
        ambiente: 50,
        dinheiro: -150,
        descricao: "Planta árvores e recupera ecossistemas"
    },
    tecnologiaVerde: {
        nome: "💡 Tecnologia Verde",
        producao: 40,
        ambiente: 35,
        dinheiro: -200,
        descricao: "Investe em energia limpa e bioinsumos"
    },
    agrotoxico: {
        nome: "🧪 Agrotóxico",
        producao: 45,
        ambiente: -40,
        dinheiro: 100,
        descricao: "Aumenta produção mas polui o solo"
    },
    feiraOrganica: {
        nome: "🛒 Feira Orgânica",
        producao: -15,
        ambiente: 30,
        dinheiro: 180,
        descricao: "Produtos orgânicos valorizam a marca"
    }
};

// EVENTOS ALEATÓRIOS
const eventosAleatorios = [
    {
        nome: "🌧️ Chuva Abundante",
        efeito: { producao: 40, ambiente: 10, dinheiro: 0 },
        mensagem: "As chuvas ajudaram suas plantações!"
    },
    {
        nome: "🔥 Estiagem Severa",
        efeito: { producao: -50, ambiente: -20, dinheiro: -300 },
        mensagem: "A seca prejudicou sua produção e gerou prejuízos!"
    },
    {
        nome: "📈 Preços Elevados",
        efeito: { producao: 0, ambiente: 0, dinheiro: 400 },
        mensagem: "Os preços dos grãos dispararam no mercado!"
    },
    {
        nome: "🐛 Praga na Lavoura",
        efeito: { producao: -60, ambiente: -10, dinheiro: -200 },
        mensagem: "Uma praga atingiu parte da sua plantação!"
    },
    {
        nome: "🏆 Prêmio Sustentável",
        efeito: { producao: 20, ambiente: 40, dinheiro: 500 },
        mensagem: "Você ganhou um prêmio por práticas sustentáveis!"
    },
    {
        nome: "🤝 Parceria Internacional",
        efeito: { producao: 30, ambiente: 20, dinheiro: 600 },
        mensagem: "Nova parceria trouxe investimentos verdes!"
    }
];

// DOM Elements
let startScreen, gameScreen, gameOverScreen, winScreen;
let prodValue, envValue, moneyValue, dayCounter, scoreValue;
let prodFill, envFill, moneyFill;
let eventMessage, historyList;

// FUNÇÃO PARA ATUALIZAR INTERFACE
function atualizarInterface() {
    // Atualiza valores numéricos
    prodValue.textContent = Math.floor(gameState.producao);
    envValue.textContent = Math.floor(gameState.ambiente);
    moneyValue.textContent = Math.floor(gameState.dinheiro);
    dayCounter.textContent = gameState.dia;
    
    // Calcula pontuação (média ponderada)
    gameState.pontuacao = Math.floor(
        (gameState.producao * 0.3) + 
        (gameState.ambiente * 0.5) + 
        (Math.min(gameState.dinheiro / 10, 500) * 0.2)
    );
    scoreValue.textContent = gameState.pontuacao;
    
    // Atualiza barras de progresso (porcentagem)
    let prodPercent = (gameState.producao / MAX_STAT) * 100;
    let envPercent = (gameState.ambiente / MAX_STAT) * 100;
    let moneyPercent = (gameState.dinheiro / 10000) * 100;
    
    prodFill.style.width = Math.min(prodPercent, 100) + "%";
    envFill.style.width = Math.min(envPercent, 100) + "%";
    moneyFill.style.width = Math.min(moneyPercent, 100) + "%";
    
    // Altera cor das barras se estiverem críticas
    if (gameState.producao < 200) prodFill.style.background = "#f44336";
    else if (gameState.producao < 400) prodFill.style.background = "#ff9800";
    else prodFill.style.background = "linear-gradient(90deg, #ffd700, #ff9800)";
    
    if (gameState.ambiente < 200) envFill.style.background = "#f44336";
    else if (gameState.ambiente < 400) envFill.style.background = "#ff9800";
    else envFill.style.background = "linear-gradient(90deg, #4caf50, #2e7d32)";
    
    if (gameState.dinheiro < 1000) moneyFill.style.background = "#f44336";
    else if (gameState.dinheiro < 2500) moneyFill.style.background = "#ff9800";
    else moneyFill.style.background = "linear-gradient(90deg, #2196f3, #1976d2)";
}

// FUNÇÃO PARA ADICIONAR AO HISTÓRICO
function adicionarHistorico(acaoNome, efeitos, eventoAleatorio = false) {
    let cor = "";
    let sinal = "";
    let totalEfeito = (efeitos.producao || 0) + (efeitos.ambiente || 0) + (efeitos.dinheiro || 0);
    
    if (totalEfeito > 0) {
        cor = "positive";
        sinal = "✅";
    } else if (totalEfeito < 0) {
        cor = "negative";
        sinal = "⚠️";
    } else {
        sinal = "ℹ️";
    }
    
    const item = document.createElement("div");
    item.className = `history-item ${cor}`;
    item.innerHTML = `<strong>Dia ${gameState.dia}:</strong> ${sinal} ${acaoNome}<br>
                      <small>🌽${efeitos.producao !== 0 ? (efeitos.producao > 0 ? `+${efeitos.producao}` : efeitos.producao) : ''}
                      🌳${efeitos.ambiente !== 0 ? (efeitos.ambiente > 0 ? `+${efeitos.ambiente}` : efeitos.ambiente) : ''}
                      💰${efeitos.dinheiro !== 0 ? (efeitos.dinheiro > 0 ? `+${efeitos.dinheiro}` : efeitos.dinheiro) : ''}</small>`;
    
    historyList.insertBefore(item, historyList.firstChild);
    
    // Limita histórico a 15 itens
    while (historyList.children.length > 15) {
        historyList.removeChild(historyList.lastChild);
    }
}

// FUNÇÃO PARA APLICAR EFEITOS
function aplicarEfeitos(efeitos, acaoNome, isEvento = false) {
    // Aplica os efeitos
    gameState.producao = Math.min(MAX_STAT, Math.max(MIN_STAT, gameState.producao + (efeitos.producao || 0)));
    gameState.ambiente = Math.min(MAX_STAT, Math.max(MIN_STAT, gameState.ambiente + (efeitos.ambiente || 0)));
    gameState.dinheiro = Math.min(20000, Math.max(MIN_STAT, gameState.dinheiro + (efeitos.dinheiro || 0)));
    
    // Atualiza interface
    atualizarInterface();
    
    // Adiciona ao histórico
    adicionarHistorico(acaoNome, efeitos, isEvento);
    
    // Mostra mensagem temporária
    let msg = acaoNome;
    if (efeitos.producao !== 0) msg += ` | 🌽 ${efeitos.producao > 0 ? '+' : ''}${efeitos.producao}`;
    if (efeitos.ambiente !== 0) msg += ` | 🌳 ${efeitos.ambiente > 0 ? '+' : ''}${efeitos.ambiente}`;
    if (efeitos.dinheiro !== 0) msg += ` | 💰 ${efeitos.dinheiro > 0 ? '+' : ''}${efeitos.dinheiro}`;
    
    eventMessage.innerHTML = `✨ ${msg} ✨`;
    eventMessage.style.animation = "none";
    setTimeout(() => { eventMessage.style.animation = "pulse 2s infinite"; }, 10);
    
    // Verifica game over
    verificarGameOver();
}

// FUNÇÃO PARA EVENTO ALEATÓRIO
function triggerEventoAleatorio() {
    if (Math.random() < 0.4) { // 40% de chance de evento
        const evento = eventosAleatorios[Math.floor(Math.random() * eventosAleatorios.length)];
        eventMessage.innerHTML = `🎲 EVENTO: ${evento.nome} - ${evento.mensagem}`;
        aplicarEfeitos(evento.efeito, `🎲 ${evento.nome}`, true);
        return true;
    }
    return false;
}

// FUNÇÃO PARA AVANÇAR DIA
function avancarDia() {
    gameState.dia++;
    atualizarInterface();
    
    // Verifica vitória
    if (gameState.dia > DIAS_PARA_VENCER && gameState.pontuacao >= PONTUACAO_VITORIA) {
        vitoria();
        return;
    }
    
    if (gameState.dia > DIAS_PARA_VENCER) {
        gameOver("Tempo esgotado! Você não atingiu a pontuação necessária.");
        return;
    }
    
    // Evento aleatório do dia
    triggerEventoAleatorio();
}

// FUNÇÃO PARA EXECUTAR AÇÃO
function executarAcao(acaoId) {
    if (!gameState.jogoAtivo) return;
    
    const acao = acoes[acaoId];
    if (!acao) return;
    
    // Aplica os efeitos da ação
    aplicarEfeitos(
        { producao: acao.producao, ambiente: acao.ambiente, dinheiro: acao.dinheiro },
        acao.nome
    );
    
    // Avança para o próximo dia se o jogo ainda estiver ativo
    if (gameState.jogoAtivo) {
        avancarDia();
    }
}

// FUNÇÃO PARA VERIFICAR GAME OVER
function verificarGameOver() {
    if (gameState.ambiente <= 0) {
        gameOver("❌ O MEIO AMBIENTE FOI DESTRUÍDO! ❌ Suas práticas insustentáveis levaram ao colapso ecológico.");
    } else if (gameState.dinheiro <= 0) {
        gameOver("💰 VOCÊ FALIU! 💰 A falta de recursos financeiros quebrou sua fazenda.");
    } else if (gameState.producao <= 0) {
        gameOver("🌾 PRODUÇÃO ZERADA! 🌾 Sua terra não produz mais nada.");
    }
}

// FUNÇÃO GAME OVER
function gameOver(mensagem) {
    gameState.jogoAtivo = false;
    document.getElementById("gameOverMessage").textContent = mensagem;
    document.getElementById("finalProd").textContent = Math.floor(gameState.producao);
    document.getElementById("finalEnv").textContent = Math.floor(gameState.ambiente);
    document.getElementById("finalMoney").textContent = Math.floor(gameState.dinheiro);
    document.getElementById("finalScore").textContent = gameState.pontuacao;
    
    gameScreen.classList.remove("active");
    gameOverScreen.classList.add("active");
}

// FUNÇÃO VITÓRIA
function vitoria() {
    gameState.jogoAtivo = false;
    document.getElementById("winProd").textContent = Math.floor(gameState.producao);
    document.getElementById("winEnv").textContent = Math.floor(gameState.ambiente);
    document.getElementById("winMoney").textContent = Math.floor(gameState.dinheiro);
    document.getElementById("winScore").textContent = gameState.pontuacao;
    
    gameScreen.classList.remove("active");
    winScreen.classList.add("active");
}

// FUNÇÃO REINICIAR JOGO
function reiniciarJogo() {
    gameState = {
        producao: 500,
        ambiente: 500,
        dinheiro: 5000,
        dia: 1,
        pontuacao: 0,
        historico: [],
        jogoAtivo: true
    };
    
    // Limpa histórico visual
    historyList.innerHTML = "<p>✨ Nenhuma ação ainda. Comece a jogar!</p>";
    
    // Atualiza interface
    atualizarInterface();
    
    // Reset mensagem
    eventMessage.innerHTML = "✨ Escolha sua ação do dia! ✨";
    
    // Mostra tela de jogo
    startScreen.classList.remove("active");
    gameOverScreen.classList.remove("active");
    winScreen.classList.remove("active");
    gameScreen.classList.add("active");
}

// INICIALIZAR JOGO
function init() {
    // Captura elementos DOM
    startScreen = document.getElementById("startScreen");
    gameScreen = document.getElementById("gameScreen");
    gameOverScreen = document.getElementById("gameOverScreen");
    winScreen = document.getElementById("winScreen");
    
    prodValue = document.getElementById("prodValue");
    envValue = document.getElementById("envValue");
    moneyValue = document.getElementById("moneyValue");
    dayCounter = document.getElementById("dayCounter");
    scoreValue = document.getElementById("scoreValue");
    
    prodFill = document.getElementById("prodFill");
    envFill = document.getElementById("envFill");
    moneyFill = document.getElementById("moneyFill");
    
    eventMessage = document.getElementById("eventMessage");
    historyList = document.getElementById("historyList");
    
    // Botões de ação
    const actionButtons = document.querySelectorAll("[data-action]");
    actionButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const action = btn.getAttribute("data-action");
            executarAcao(action);
        });
    });
    
    // Botões de controle
    document.getElementById("startGameBtn").addEventListener("click", () => reiniciarJogo());
    document.getElementById("restartGameBtn").addEventListener("click", () => reiniciarJogo());
    document.getElementById("playAgainBtn").addEventListener("click", () => reiniciarJogo());
    document.getElementById("playAgainWinBtn").addEventListener("click", () => reiniciarJogo());
    
    // Inicializa valores
    atualizarInterface();
}

// Inicia tudo quando a página carregar
window.addEventListener("DOMContentLoaded", init);
    
