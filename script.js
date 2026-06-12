// ========== JOGO COMPLETO COM PERSONAGENS E MOVIMENTO ==========

// VARIÁVEIS GLOBAIS
let playerName = "";
let selectedChar = "boy"; // 'boy' ou 'girl'
let gameState = {
    producao: 500,
    ambiente: 500,
    dinheiro: 5000,
    dia: 1,
    pontuacao: 0,
    jogoAtivo: true,
    posX: 2,  // posição no mapa (0-4)
    posY: 2
};

// DEFINIÇÃO DO MAPA (cada célula tem um tipo)
const mapa = [
    ["farm", "farm", "forest", "farm", "river"],
    ["farm", "forest", "farm", "market", "farm"],
    ["forest", "farm", "farm", "farm", "forest"],
    ["river", "farm", "market", "forest", "farm"],
    ["farm", "forest", "river", "farm", "farm"]
];

// TIPOS DE ÁREA e suas ações
const areas = {
    farm: {
        nome: "🌾 PLANTação",
        desc: "Área de cultivo! Plante e colha alimentos.",
        acoes: [
            { id: "plantioDireto", nome: "🌾 Plantio Direto", efeito: { prod: 30, amb: 20, din: -50 }, fala: "Plantio direto protege o solo, {nome}!" },
            { id: "colher", nome: "💰 Colher Safra", efeito: { prod: -20, amb: 5, din: 150 }, fala: "Boa colheita, {nome}! Lucro garantido!" }
        ]
    },
    forest: {
        nome: "🌳 FLORESTA",
        desc: "Área de preservação ambiental.",
        acoes: [
            { id: "reflorestamento", nome: "🌱 Reflorestar", efeito: { prod: -10, amb: 40, din: -100 }, fala: "Cada árvore plantada é vida, {nome}!" },
            { id: "extrativismo", nome: "🪵 Extrativismo", efeito: { prod: 10, amb: -30, din: 100 }, fala: "Cuidado {nome}! Explorar demais prejudica a natureza." }
        ]
    },
    river: {
        nome: "💧 RIO",
        desc: "Fonte de água para irrigação.",
        acoes: [
            { id: "irrigacao", nome: "💧 Irrigação Sustentável", efeito: { prod: 25, amb: 10, din: -80 }, fala: "Água é vida, {nome}! Use com sabedoria." },
            { id: "pesca", nome: "🎣 Pesca Responsável", efeito: { prod: 5, amb: -5, din: 60 }, fala: "Pescar é bom, mas sem exageros {nome}!" }
        ]
    },
    market: {
        nome: "🏪 FEIRA LIVRE",
        desc: "Venda seus produtos orgânicos!",
        acoes: [
            { id: "venderOrg", nome: "🛒 Vender Orgânicos", efeito: { prod: -15, amb: 5, din: 200 }, fala: "Orgânicos valem mais, {nome}! Boa venda!" },
            { id: "comprarInsumo", nome: "📦 Comprar Insumo", efeito: { prod: 20, amb: -5, din: -120 }, fala: "Insumos de qualidade melhoram a produção, {nome}!" }
        ]
    }
};

// AÇÕES GLOBAIS (efeitos padrão)
const acoesGlobais = {
    plantioDireto: { prod: 30, amb: 20, din: -50, nome: "Plantio Direto" },
    colher: { prod: -20, amb: 5, din: 150, nome: "Colher Safra" },
    reflorestamento: { prod: -10, amb: 40, din: -100, nome: "Reflorestamento" },
    extrativismo: { prod: 10, amb: -30, din: 100, nome: "Extrativismo" },
    irrigacao: { prod: 25, amb: 10, din: -80, nome: "Irrigação" },
    pesca: { prod: 5, amb: -5, din: 60, nome: "Pesca" },
    venderOrg: { prod: -15, amb: 5, din: 200, nome: "Venda Orgânicos" },
    comprarInsumo: { prod: 20, amb: -5, din: -120, nome: "Comprar Insumo" }
};

// EVENTOS ALEATÓRIOS
const eventosAleatorios = [
    { nome: "🌧️ Chuva Forte", efeito: { prod: 30, amb: 10, din: 0 }, fala: "A chuva abençoou nossas plantações, {nome}!" },
    { nome: "🔥 Seca", efeito: { prod: -40, amb: -15, din: -200 }, fala: "Estiagem chegou, {nome}. Precisamos de reservas!" },
    { nome: "📈 Preços Altos", efeito: { prod: 0, amb: 0, din: 300 }, fala: "Preços dispararam, {nome}! Hora de vender!" },
    { nome: "🐛 Praga", efeito: { prod: -50, amb: -10, din: -150 }, fala: "Praga na lavoura, {nome}! Use controle biológico!" },
    { nome: "🏆 Prêmio Verde", efeito: { prod: 15, amb: 30, din: 400 }, fala: "Parabéns {nome}! Prêmio por sustentabilidade!" }
];

// DOM Elements
let charSprite, charNameDisplay, playerNameTag, talkAvatar;
let prodValue, envValue, moneyValue, dayCounter, scoreValue;
let eventMessageSpan, historyList, characterSpeech;
let posXSpan, posYSpan;

// ========== FUNÇÕES DO PERSONAGEM ==========
function setCharacter(char) {
    selectedChar = char;
    if (char === "boy") {
        charSprite.innerHTML = "👨‍🌾";
        charNameDisplay.innerHTML = "Lucas";
        talkAvatar.innerHTML = "👨‍🌾";
        document.getElementById("gameOverChar").innerHTML = "👨‍🌾";
        document.getElementById("winChar").innerHTML = "👨‍🌾";
    } else {
        charSprite.innerHTML = "👩‍🌾";
        charNameDisplay.innerHTML = "Sofia";
        talkAvatar.innerHTML = "👩‍🌾";
        document.getElementById("gameOverChar").innerHTML = "👩‍🌾";
        document.getElementById("winChar").innerHTML = "👩‍🌾";
    }
}

function characterSpeak(message, isEvento = false) {
    let finalMsg = message.replace(/\{nome\}/g, playerName);
    if (!isEvento && playerName) {
        // Adiciona nome naturalmente em algumas falas
        if (Math.random() > 0.6 && !finalMsg.includes(playerName)) {
            const prefixos = [`${playerName}, `, `E aí ${playerName}! `, `Olha só ${playerName}, `];
            finalMsg = prefixos[Math.floor(Math.random() * prefixos.length)] + finalMsg.toLowerCase();
        }
    }
    characterSpeech.innerHTML = finalMsg;
    
    // Animação
    const bubble = document.querySelector('.talk-bubble');
    bubble.style.transform = 'scale(1.02)';
    setTimeout(() => bubble.style.transform = 'scale(1)', 200);
}

// ========== FUNÇÕES DO JOGO ==========
function atualizarInterface() {
    prodValue.textContent = Math.floor(gameState.producao);
    envValue.textContent = Math.floor(gameState.ambiente);
    moneyValue.textContent = Math.floor(gameState.dinheiro);
    dayCounter.textContent = gameState.dia;
    playerNameTag.textContent = playerName;
    
    // Pontuação
    gameState.pontuacao = Math.floor(
        (gameState.producao * 0.3) + 
        (gameState.ambiente * 0.5) + 
        (Math.min(gameState.dinheiro / 10, 500) * 0.2)
    );
    scoreValue.textContent = gameState.pontuacao;
    
    // Verifica condições críticas
    if (gameState.ambiente < 200) characterSpeak("Cuidado {nome}! O meio ambiente está em perigo! 🌍⚠️");
    if (gameState.dinheiro < 1000) characterSpeak("{nome}, nosso dinheiro está acabando! 💰⚠️");
    if (gameState.producao < 200) characterSpeak("{nome}, a produção está baixa! Vamos agir! 🌽⚠️");
}

function adicionarHistorico(texto) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `📅 Dia ${gameState.dia}: ${texto}`;
    historyList.insertBefore(item, historyList.firstChild);
    while (historyList.children.length > 12) {
        historyList.removeChild(historyList.lastChild);
    }
}

function aplicarEfeitos(efeitos, acaoNome) {
    gameState.producao = Math.min(1000, Math.max(0, gameState.producao + (efeitos.prod || 0)));
    gameState.ambiente = Math.min(1000, Math.max(0, gameState.ambiente + (efeitos.amb || 0)));
    gameState.dinheiro = Math.min(20000, Math.max(0, gameState.dinheiro + (efeitos.din || 0)));
    
    atualizarInterface();
    adicionarHistorico(`${acaoNome}: 🌽${efeitos.prod || 0} 🌳${efeitos.amb || 0} 💰${efeitos.din || 0}`);
    
    // Verifica game over
    if (gameState.ambiente <= 0) gameOver("❌ O MEIO AMBIENTE FOI DESTRUÍDO!");
    else if (gameState.dinheiro <= 0) gameOver("💰 VOCÊ FALIU!");
    else if (gameState.producao <= 0) gameOver("🌾 PRODUÇÃO ZERADA!");
}

function triggerEventoAleatorio() {
    if (Math.random() < 0.35 && gameState.jogoAtivo) {
        const evento = eventosAleatorios[Math.floor(Math.random() * eventosAleatorios.length)];
        aplicarEfeitos(evento.efeito, `🎲 EVENTO: ${evento.nome}`);
        characterSpeak(evento.fala, true);
        eventMessageSpan.innerHTML = `🎲 ${evento.nome}: ${evento.efeito.prod ? `🌽${evento.efeito.prod}` : ''} ${evento.efeito.amb ? `🌳${evento.efeito.amb}` : ''} ${evento.efeito.din ? `💰${evento.efeito.din}` : ''}`;
        return true;
    }
    return false;
}

function avancarDia() {
    gameState.dia++;
    atualizarInterface();
    
    if (gameState.dia > 30 && gameState.pontuacao >= 1000) {
        vitoria();
    } else if (gameState.dia > 30) {
        gameOver("Tempo esgotado! Pontuação insuficiente.");
    } else {
        triggerEventoAleatorio();
        characterSpeak("Novo dia, {nome}! O que vamos fazer agora? 🌞");
    }
}

// ========== MOVIMENTO NO MAPA ==========
function desenharMapa() {
    const grid = document.getElementById("mapGrid");
    grid.innerHTML = "";
    
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            const cell = document.createElement("div");
            cell.className = "map-cell";
            
            // Ícone do tipo de terreno
            const tipo = mapa[y][x];
            if (tipo === "farm") cell.innerHTML = "🌾";
            else if (tipo === "forest") cell.innerHTML = "🌳";
            else if (tipo === "river") cell.innerHTML = "💧";
            else if (tipo === "market") cell.innerHTML = "🏪";
            
            // Destaca posição do jogador
            if (x === gameState.posX && y === gameState.posY) {
                cell.classList.add("player-cell");
                cell.innerHTML = selectedChar === "boy" ? "👨‍🌾" : "👩‍🌾";
            }
            
            grid.appendChild(cell);
        }
    }
    
    posXSpan.textContent = gameState.posX;
    posYSpan.textContent = gameState.posY;
    
    // Atualiza painel de ação conforme a área
    const tipoAtual = mapa[gameState.posY][gameState.posX];
    const area = areas[tipoAtual];
    document.getElementById("areaTitle").innerHTML = `📍 ${area.nome}`;
    document.getElementById("areaDesc").innerHTML = area.desc;
    
    const actionsDiv = document.getElementById("areaActions");
    actionsDiv.innerHTML = "";
    area.acoes.forEach(acao => {
        const btn = document.createElement("button");
        btn.className = "action-btn";
        btn.innerHTML = acao.nome;
        btn.onclick = () => executarAcaoLocal(acao.id, acao.nome, acao.efeito, acao.fala);
        actionsDiv.appendChild(btn);
    });
}

function mover(dx, dy) {
    if (!gameState.jogoAtivo) return;
    
    const novaX = gameState.posX + dx;
    const novaY = gameState.posY + dy;
    
    if (novaX >= 0 && novaX < 5 && novaY >= 0 && novaY < 5) {
        gameState.posX = novaX;
        gameState.posY = novaY;
        desenharMapa();
        
        const tipo = mapa[novaY][novaX];
        const area = areas[tipo];
        characterSpeak(`Fui para ${area.nome}. ${area.desc}`);
        eventMessageSpan.innerHTML = `🚶 Você andou até ${area.nome}`;
    } else {
        characterSpeak("Não dá pra sair da fazenda, {nome}! Vire para outro lado.");
    }
}

function executarAcaoLocal(acaoId, acaoNome, efeito, falaMsg) {
    if (!gameState.jogoAtivo) return;
    
    aplicarEfeitos(efeito, acaoNome);
    characterSpeak(falaMsg);
    eventMessageSpan.innerHTML = `✅ ${acaoNome} realizado!`;
    
    if (gameState.jogoAtivo) {
        avancarDia();
    }
}

// ========== TELAS DE FIM ==========
function gameOver(mensagem) {
    gameState.jogoAtivo = false;
    document.getElementById("gameOverMessage").textContent = mensagem;
    document.getElementById("finalProd").textContent = Math.floor(gameState.producao);
    document.getElementById("finalEnv").textContent = Math.floor(gameState.ambiente);
    document.getElementById("finalMoney").textContent = Math.floor(gameState.dinheiro);
    document.getElementById("finalScore").textContent = gameState.pontuacao;
    
    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("gameOverScreen").classList.add("active");
}

function vitoria() {
    gameState.jogoAtivo = false;
    document.getElementById("winProd").textContent = Math.floor(gameState.producao);
    document.getElementById("winEnv").textContent = Math.floor(gameState.ambiente);
    document.getElementById("winMoney").textContent = Math.floor(gameState.dinheiro);
    document.getElementById("winScore").textContent = gameState.pontuacao;
    
    characterSpeak(`PARABÉNS {nome}! Você é um HERÓI da sustentabilidade! 🏆🌱`);
    
    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("winScreen").classList.add("active");
}

function reiniciarJogo() {
    gameState = {
        producao: 500,
        ambiente: 500,
        dinheiro: 5000,
        dia: 1,
        pontuacao: 0,
        jogoAtivo: true,
        posX: 2,
        posY: 2
    };
    
    historyList.innerHTML = "";
    atualizarInterface();
    desenharMapa();
    characterSpeak("Vamos recomeçar, {nome}! O futuro sustentável depende de nós! 🌱");
    eventMessageSpan.innerHTML = "✨ Nova jornada! Ande pela fazenda com as setas! ✨";
    
    document.getElementById("charSelectScreen").classList.remove("active");
    document.getElementById("gameOverScreen").classList.remove("active");
    document.getElementById("winScreen").classList.remove("active");
    document.getElementById("gameScreen").classList.add("active");
}

// ========== INICIALIZAÇÃO ==========
function init() {
    // DOM
    charSprite = document.getElementById("charSprite");
    charNameDisplay = document.getElementById("charNameDisplay");
    playerNameTag = document.getElementById("playerNameTag");
    talkAvatar = document.getElementById("talkAvatar");
    prodValue = document.getElementById("prodValue");
    envValue = document.getElementById("envValue");
    moneyValue = document.getElementById("moneyValue");
    dayCounter = document.getElementById("dayCounter");
    scoreValue = document.getElementById("scoreValue");
    eventMessageSpan = document.getElementById("eventMessage");
    historyList = document.getElementById("historyList");
    characterSpeech = document.getElementById("characterSpeech");
    posXSpan = document.getElementById("posX");
    posYSpan = document.getElementById("posY");
    
    // Seleção de personagem
    const charCards = document.querySelectorAll(".char-card");
    charCards.forEach(card => {
        card.addEventListener("click", () => {
            charCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            const char = card.getAttribute("data-char");
            setCharacter(char);
        });
    });
    
    // Confirmação
    document.getElementById("confirmCharBtn").addEventListener("click", () => {
        const nomeInput = document.getElementById("playerNameSelect");
        if (nomeInput.value.trim() === "") {
            alert("Digite seu nome para começar!");
            return;
        }
        playerName = nomeInput.value.trim();
        setCharacter(selectedChar);
        reiniciarJogo();
    });
    
    // Controles de movimento
    document.getElementById("moveUp").addEventListener("click", () => mover(0, -1));
    document.getElementById("moveDown").addEventListener("click", () => mover(0, 1));
    document.getElementById("moveLeft").addEventListener("click", () => mover(-1, 0));
    document.getElementById("moveRight").addEventListener("click", () => mover(1, 0));
    
    // Teclado (setas)
    window.addEventListener("keydown", (e) => {
        if (!document.getElementById("gameScreen").classList.contains("active")) return;
        switch(e.key) {
            case "ArrowUp": mover(0, -1); break;
            case "ArrowDown": mover(0, 1); break;
            case "ArrowLeft": mover(-1, 0); break;
            case "ArrowRight": mover(1, 0); break;
        }
    });
    
    // Botões de reiniciar
    document.getElementById("restartGameBtn").addEventListener("click", () => reiniciarJogo());
    document.getElementById("playAgainBtn").addEventListener("click", () => reiniciarJogo());
    document.getElementById("playAgainWinBtn").addEventListener("click", () => reiniciarJogo());
    
    // Seleção padrão
    setCharacter("boy");
    document.querySelector('[data-char="boy"]').classList.add("selected");
}

window.addEventListener("DOMContentLoaded", init);
