// ========== AGRO FORTE - MISSÃO POLINIZADORES ==========

// DADOS DO JOGADOR
let playerName = "";
let selectedChar = "boy";

// ESTADO DO JOGO
let gameState = {
    bees: 50,        // proteção dos polinizadores %
    recycling: 50,   // reciclagem de resíduos %
    day: 1,
    score: 0,
    gameActive: true
};

const MAX_STAT = 100;
const MIN_STAT = 0;
const DAYS_TO_WIN = 20;
const SCORE_TO_WIN = 500;

// DEFINIÇÃO DAS AÇÕES
const actions = {
    // Ações para Polinizadores
    plantarFlores: {
        name: "🌻 Plantar Flores Nativas",
        bees: 15,
        recycling: 0,
        points: 10,
        message: "Flores plantadas! As abelhas já estão chegando! 🐝",
        fala: "Que lindo {nome}! As flores vão atrair muitos polinizadores!"
    },
    criarAbelhas: {
        name: "🏠 Instalar Caixas de Abelhas",
        bees: 20,
        recycling: 0,
        points: 15,
        message: "Caixas instaladas! As abelhas têm um lar seguro! 🏡",
        fala: "Excelente {nome}! Essas caixas vão proteger nossas abelhas!"
    },
    pararAgrotoxico: {
        name: "🚫 Reduzir Agrotóxicos",
        bees: 25,
        recycling: 0,
        points: 20,
        message: "Agrotóxicos reduzidos! Os polinizadores agradecem! 🌿",
        fala: "Atitude corajosa {nome}! Menos veneno, mais vida!"
    },
    corredorEcologico: {
        name: "🌿 Criar Corredor Ecológico",
        bees: 30,
        recycling: 0,
        points: 25,
        message: "Corredor ecológico criado! Conexão entre áreas verdes! 🌳",
        fala: "Parabéns {nome}! Esse corredor vai salvar muitas espécies!"
    },
    
    // Ações para Reciclagem
    coletaSeletiva: {
        name: "🗑️ Coleta Seletiva",
        bees: 0,
        recycling: 15,
        points: 10,
        message: "Coleta seletiva implementada! Resíduos separados! ♻️",
        fala: "Boa {nome}! Cada resíduo no lugar certo faz a diferença!"
    },
    compostagem: {
        name: "🍂 Compostagem de Restos",
        bees: 5,
        recycling: 20,
        points: 10,
        message: "Compostagem ativada! Restos viram adubo rico! 🌱",
        fala: "A natureza agradece {nome}! Compostagem é pura sustentabilidade!"
    },
    reaproveitarEmbalagens: {
        name: "📦 Reaproveitar Embalagens",
        bees: 0,
        recycling: 15,
        points: 12,
        message: "Embalagens reaproveitadas! Menos lixo no ambiente! 📦",
        fala: "Criatividade sustentável {nome}! Embalagens ganham nova vida!"
    },
    bioenergia: {
        name: "⚡ Bioenergia com Resíduos",
        bees: 0,
        recycling: 25,
        points: 20,
        message: "Bioenergia gerada! Resíduos viram energia limpa! ⚡",
        fala: "Incrível {nome}! Transformar lixo em energia é o futuro do Agro!"
    }
};

// EVENTOS ALEATÓRIOS
const randomEvents = [
    {
        name: "🌸 FLORAÇÃO ABUNDANTE",
        bees: 15,
        recycling: 0,
        points: 20,
        message: "Floração abundante! Os polinizadores estão em festa! 🎉",
        fala: "Que sorte {nome}! A natureza está nos dando uma forcinha!"
    },
    {
        name: "⚠️ INVASÃO DE PRAGAS",
        bees: -15,
        recycling: 0,
        points: -10,
        message: "Pragas atacaram! Os polinizadores sofreram! 😢",
        fala: "Vamos agir rápido {nome}! Precisamos proteger as abelhas!"
    },
    {
        name: "🏆 PRÊMIO SUSTENTABILIDADE",
        bees: 10,
        recycling: 10,
        points: 30,
        message: "Você ganhou um prêmio por práticas sustentáveis! 🏆",
        fala: "Parabéns {nome}! O mundo está reconhecendo seu trabalho!"
    },
    {
        name: "🌧️ CHUVA BENÉFICA",
        bees: 5,
        recycling: 5,
        points: 15,
        message: "Chuva na medida certa! Tudo floresce! 🌧️",
        fala: "Essa chuva veio na hora certa {nome}! A natureza está feliz!"
    },
    {
        name: "🤝 PARCERIA VERDE",
        bees: 10,
        recycling: 15,
        points: 25,
        message: "Parceria com ONG ambiental! Novas práticas sustentáveis! 🤝",
        fala: "União faz a força {nome}! Juntos somos mais fortes!"
    }
];

// DOM Elements
let playerNameGame, playerAvatar, talkerPlayerName, talkerAvatar, talkerSpeech;
let beeValue, recycleValue, dayCounter, scoreValue;
let beeFill, recycleFill;
let eventMessage, historyList;

// Inicialização
function init() {
    // Captura elementos
    playerNameGame = document.getElementById("playerNameGame");
    playerAvatar = document.getElementById("playerAvatar");
    talkerPlayerName = document.getElementById("talkerPlayerName");
    talkerAvatar = document.getElementById("talkerAvatar");
    talkerSpeech = document.getElementById("talkerSpeech");
    beeValue = document.getElementById("beeValue");
    recycleValue = document.getElementById("recycleValue");
    dayCounter = document.getElementById("dayCounter");
    scoreValue = document.getElementById("scoreValue");
    beeFill = document.getElementById("beeFill");
    recycleFill = document.getElementById("recycleFill");
    eventMessage = document.getElementById("eventMessage");
    historyList = document.getElementById("historyList");
    
    // Tela de história -> escolha de personagem
    document.getElementById("startGameFromStory").addEventListener("click", () => {
        const nome = document.getElementById("storyPlayerName").value.trim();
        if (nome === "") {
            alert("🌱 Digite seu nome para começar a aventura!");
            return;
        }
        playerName = nome;
        document.getElementById("storyScreen").classList.remove("active");
        document.getElementById("charSelectScreen").classList.add("active");
    });
    
    // Seleção de personagem
    const charCards = document.querySelectorAll(".char-card");
    charCards.forEach(card => {
        card.addEventListener("click", () => {
            charCards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            selectedChar = card.getAttribute("data-char");
        });
    });
    
    document.getElementById("confirmCharBtn").addEventListener("click", () => {
        document.getElementById("charSelectScreen").classList.remove("active");
        startGame();
    });
    
    // Botões de reiniciar
    document.getElementById("restartGameBtn").addEventListener("click", () => restartGame());
    document.getElementById("playAgainBtn").addEventListener("click", () => restartGame());
    document.getElementById("playAgainGameOverBtn").addEventListener("click", () => restartGame());
    
    // Eventos das ações (delegação)
    document.querySelector(".challenges-area")?.addEventListener("click", (e) => {
        const btn = e.target.closest(".action-card");
        if (!btn) return;
        const actionId = btn.getAttribute("data-action");
        if (actionId && actions[actionId]) {
            executeAction(actions[actionId], actionId);
        }
    });
}

function startGame() {
    // Reset estado
    gameState = {
        bees: 50,
        recycling: 50,
        day: 1,
        score: 0,
        gameActive: true
    };
    
    // Atualizar personagem
    if (selectedChar === "boy") {
        playerAvatar.innerHTML = "👨‍🌾";
        talkerAvatar.innerHTML = "👨‍🌾";
    } else {
        playerAvatar.innerHTML = "👩‍🌾";
        talkerAvatar.innerHTML = "👩‍🌾";
    }
    
    playerNameGame.innerHTML = playerName;
    talkerPlayerName.innerHTML = playerName;
    historyList.innerHTML = "";
    
    updateUI();
    characterSpeak(`Seja bem-vindo(a) ${playerName}! Sou seu assistente no Agro Forte. Vamos juntos proteger os polinizadores e reciclar resíduos! 🐝♻️`);
    
    document.getElementById("gameScreen").classList.add("active");
}

function characterSpeak(message) {
    const msg = message.replace(/\{nome\}/g, playerName);
    talkerSpeech.innerHTML = msg;
    // Animação
    const bubble = document.querySelector(".talker-bubble");
    bubble.style.transform = "scale(1.02)";
    setTimeout(() => bubble.style.transform = "scale(1)", 200);
}

function updateUI() {
    beeValue.textContent = Math.floor(gameState.bees);
    recycleValue.textContent = Math.floor(gameState.recycling);
    dayCounter.textContent = gameState.day;
    scoreValue.textContent = gameState.score;
    
    beeFill.style.width = (gameState.bees / MAX_STAT) * 100 + "%";
    recycleFill.style.width = (gameState.recycling / MAX_STAT) * 100 + "%";
    
    // Cores críticas
    if (gameState.bees < 30) beeFill.style.background = "#f44336";
    else if (gameState.bees < 60) beeFill.style.background = "#ff9800";
    else beeFill.style.background = "linear-gradient(90deg, #ffd54f, #ffb300)";
    
    if (gameState.recycling < 30) recycleFill.style.background = "#f44336";
    else if (gameState.recycling < 60) recycleFill.style.background = "#ff9800";
    else recycleFill.style.background = "linear-gradient(90deg, #66bb6a, #388e3c)";
    
    // Verificar game over
    if (gameState.bees <= 0) {
        gameOver("🐝 As abelhas desapareceram! Os polinizadores foram extintos da fazenda. ❌");
    } else if (gameState.recycling <= 0) {
        gameOver("🗑️ Os resíduos se acumularam e contaminaram o solo! A fazenda virou um depósito de lixo. ❌");
    }
}

function addToHistory(text) {
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `📅 Dia ${gameState.day}: ${text}`;
    historyList.insertBefore(item, historyList.firstChild);
    while (historyList.children.length > 15) {
        historyList.removeChild(historyList.lastChild);
    }
}

function executeAction(action, actionId) {
    if (!gameState.gameActive) return;
    
    // Aplica efeitos
    gameState.bees = Math.min(MAX_STAT, Math.max(MIN_STAT, gameState.bees + (action.bees || 0)));
    gameState.recycling = Math.min(MAX_STAT, Math.max(MIN_STAT, gameState.recycling + (action.recycling || 0)));
    gameState.score += action.points;
    
    updateUI();
    addToHistory(`${action.name}: 🐝${action.bees || 0} ♻️${action.recycling || 0} +${action.points}pts`);
    
    eventMessage.innerHTML = `✅ ${action.message}`;
    characterSpeak(action.fala);
    
    // Avança dia
    gameState.day++;
    updateUI();
    
    // Verifica vitória
    if (gameState.day > DAYS_TO_WIN && gameState.score >= SCORE_TO_WIN) {
        victory();
        return;
    }
    
    if (gameState.day > DAYS_TO_WIN) {
        gameOver("⏰ O tempo acabou! Você não conseguiu atingir a pontuação necessária.");
        return;
    }
    
    // Evento aleatório
    triggerRandomEvent();
}

function triggerRandomEvent() {
    if (Math.random() < 0.35) {
        const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        
        gameState.bees = Math.min(MAX_STAT, Math.max(MIN_STAT, gameState.bees + event.bees));
        gameState.recycling = Math.min(MAX_STAT, Math.max(MIN_STAT, gameState.recycling + event.recycling));
        gameState.score += event.points;
        
        updateUI();
        addToHistory(`🎲 EVENTO: ${event.name} - 🐝${event.bees} ♻️${event.recycling} ${event.points > 0 ? `+${event.points}` : event.points}pts`);
        
        eventMessage.innerHTML = `🎲 ${event.name}! ${event.message}`;
        characterSpeak(event.fala);
        
        // Verifica game over após evento
        if (gameState.bees <= 0) gameOver("🐝 As abelhas desapareceram!");
        else if (gameState.recycling <= 0) gameOver("🗑️ Resíduos acumulados!");
    } else {
        characterSpeak("Dia novo, {nome}! Escolha sabiamente suas ações para proteger os polinizadores e reciclar os resíduos! 🌱");
    }
}

function victory() {
    gameState.gameActive = false;
    document.getElementById("winPlayerName").textContent = playerName;
    document.getElementById("winBee").textContent = Math.floor(gameState.bees);
    document.getElementById("winRecycle").textContent = Math.floor(gameState.recycling);
    document.getElementById("winScore").textContent = gameState.score;
    
    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("winScreen").classList.add("active");
}

function gameOver(msg) {
    gameState.gameActive = false;
    document.getElementById("gameOverMsg").textContent = msg;
    document.getElementById("gameOverBee").textContent = Math.floor(gameState.bees);
    document.getElementById("gameOverRecycle").textContent = Math.floor(gameState.recycling);
    document.getElementById("gameOverScore").textContent = gameState.score;
    
    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("gameOverScreen").classList.add("active");
}

function restartGame() {
    // Volta para tela de história
    document.getElementById("storyPlayerName").value = "";
    document.getElementById("gameScreen").classList.remove("active");
    document.getElementById("winScreen").classList.remove("active");
    document.getElementById("gameOverScreen").classList.remove("active");
    document.getElementById("charSelectScreen").classList.remove("active");
    document.getElementById("storyScreen").classList.add("active");
}

window.addEventListener("DOMContentLoaded", init);
