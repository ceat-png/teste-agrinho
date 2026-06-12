// ========== AGRO FORTE - JOGO COMPLETO 3 FASES ==========

// DADOS DO JOGADOR
let playerName = "";
let selectedChar = "boy"; // boy ou girl

// Estado do jogo
let currentPhase = 0;

// ========== FASE 1 - JOGO DA ABELHA ==========
let beeGame = {
    canvas: null,
    ctx: null,
    beeY: 200,
    flowers: [],
    obstacles: [],
    score: 0,
    collisions: 0,
    gameRunning: true,
    animationId: null,
    keys: { ArrowUp: false, ArrowDown: false }
};

// ========== FASE 2 - COMPOSTAGEM ==========
let compostGame = {
    acertos: 0,
    erros: 0,
    items: [
        { name: "🍌 Casca de Banana", type: "organico", emoji: "🍌" },
        { name: "🍃 Folhas Secas", type: "organico", emoji: "🍃" },
        { name: "🍎 Casca de Maçã", type: "organico", emoji: "🍎" },
        { name: "🥬 Restos de Verduras", type: "organico", emoji: "🥬" },
        { name: "🥫 Lata", type: "rejeito", emoji: "🥫" },
        { name: "🧴 Plástico", type: "rejeito", emoji: "🧴" },
        { name: "🔋 Pilha", type: "rejeito", emoji: "🔋" },
        { name: "☕ Borra de Café", type: "organico", emoji: "☕" }
    ],
    currentItems: []
};

// ========== FASE 3 - PLANTANDO O FUTURO ==========
let farmGame = {
    spots: [
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null }
    ],
    mudasCount: 0,
    watered: false,
    regadas: 0
};

// DOM Elements
let introScreen, charSelectScreen, fase1Screen, fase2Screen, fase3Screen, finalScreen;

// ========== FUNÇÕES PRINCIPAIS ==========
function init() {
    // Telas
    introScreen = document.getElementById("introScreen");
    charSelectScreen = document.getElementById("charSelectScreen");
    fase1Screen = document.getElementById("fase1Screen");
    fase2Screen = document.getElementById("fase2Screen");
    fase3Screen = document.getElementById("fase3Screen");
    finalScreen = document.getElementById("finalScreen");
    
    // FASE 0: Input do nome
    document.getElementById("confirmNameBtn").addEventListener("click", () => {
        const nome = document.getElementById("playerNameIntro").value.trim();
        if (nome === "") {
            alert("🌱 Digite seu nome para começar!");
            return;
        }
        playerName = nome;
        document.getElementById("displayName").textContent = playerName;
        document.getElementById("finalPlayerName").textContent = playerName;
        introScreen.classList.remove("active");
        charSelectScreen.classList.add("active");
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
    
    document.getElementById("startFase1Btn").addEventListener("click", () => {
        charSelectScreen.classList.remove("active");
        startFase1();
    });
    
    // Botões de próxima fase
    document.getElementById("nextToFase2Btn").addEventListener("click", () => {
        stopBeeGame();
        fase1Screen.classList.remove("active");
        startFase2();
    });
    
    document.getElementById("nextToFase3Btn").addEventListener("click", () => {
        fase2Screen.classList.remove("active");
        startFase3();
    });
    
    document.getElementById("nextToFinalBtn").addEventListener("click", () => {
        fase3Screen.classList.remove("active");
        showFinal();
    });
    
    document.getElementById("playAgainBtn").addEventListener("click", () => {
        finalScreen.classList.remove("active");
        introScreen.classList.add("active");
        document.getElementById("playerNameIntro").value = "";
        resetGame();
    });
}

// ========== FASE 1: JOGO DA ABELHA ==========
function startFase1() {
    const dialogText = document.getElementById("fase1DialogText");
    dialogText.innerHTML = `${playerName}, você sabia que muitas plantas precisam das abelhas para produzir frutas? Sem os polinizadores, a produção de alimentos seria muito menor. Ajude esta abelha a chegar até as flores! Use as setas ↑ e ↓ para desviar da fumaça e do fogo.`;
    
    fase1Screen.classList.add("active");
    initBeeGame();
}

function initBeeGame() {
    beeGame.canvas = document.getElementById("beeGameCanvas");
    beeGame.ctx = beeGame.canvas.getContext("2d");
    beeGame.beeY = 200;
    beeGame.score = 0;
    beeGame.collisions = 0;
    beeGame.gameRunning = true;
    beeGame.flowers = [];
    beeGame.obstacles = [];
    
    // Ajustar tamanho do canvas
    beeGame.canvas.width = 800;
    beeGame.canvas.height = 400;
    
    // Criar flores e obstáculos
    for (let i = 0; i < 10; i++) {
        beeGame.flowers.push({
            x: 100 + Math.random() * 600,
            y: 30 + Math.random() * 340,
            collected: false
        });
    }
    
    for (let i = 0; i < 8; i++) {
        beeGame.obstacles.push({
            x: 80 + Math.random() * 650,
            y: 30 + Math.random() * 340,
            type: Math.random() > 0.5 ? "💨" : "🔥"
        });
    }
    
    // Controles do teclado
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") beeGame.keys.ArrowUp = true;
        if (e.key === "ArrowDown") beeGame.keys.ArrowDown = true;
        e.preventDefault();
    });
    
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") beeGame.keys.ArrowUp = false;
        if (e.key === "ArrowDown") beeGame.keys.ArrowDown = false;
    });
    
    updateBeeGame();
}

function updateBeeGame() {
    if (!beeGame.gameRunning) return;
    
    // Movimento da abelha
    if (beeGame.keys.ArrowUp && beeGame.beeY > 20) beeGame.beeY -= 3;
    if (beeGame.keys.ArrowDown && beeGame.beeY < 380) beeGame.beeY += 3;
    
    // Desenhar
    const ctx = beeGame.ctx;
    ctx.clearRect(0, 0, 800, 400);
    
    // Desenhar chão
    ctx.fillStyle = "#6b8c5c";
    ctx.fillRect(0, 300, 800, 100);
    
    // Desenhar flores
    beeGame.flowers.forEach(flower => {
        if (!flower.collected) {
            ctx.font = "25px Arial";
            ctx.fillStyle = "#ff69b4";
            ctx.fillText("🌸", flower.x, flower.y);
            
            // Colisão com flor
            if (Math.abs(flower.x - 50) < 30 && Math.abs(flower.y - beeGame.beeY) < 25) {
                flower.collected = true;
                beeGame.score++;
                document.getElementById("floresColetadas").textContent = beeGame.score;
            }
        }
    });
    
    // Desenhar obstáculos
    beeGame.obstacles.forEach(obs => {
        ctx.font = "25px Arial";
        ctx.fillStyle = obs.type === "💨" ? "#9e9e9e" : "#ff5722";
        ctx.fillText(obs.type, obs.x, obs.y);
        
        // Colisão com obstáculo
        if (Math.abs(obs.x - 50) < 30 && Math.abs(obs.y - beeGame.beeY) < 25) {
            beeGame.collisions++;
            document.getElementById("colisoesCount").textContent = beeGame.collisions;
            obs.x = 700 + Math.random() * 100;
            obs.y = 30 + Math.random() * 340;
        }
    });
    
    // Desenhar abelha
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffc107";
    ctx.fillText(selectedChar === "boy" ? "🐝👦" : "🐝👧", 50, beeGame.beeY);
    
    // Deslocar elementos
    beeGame.flowers.forEach(flower => { if (!flower.collected) flower.x -= 2; });
    beeGame.obstacles.forEach(obs => { obs.x -= 2.5; });
    
    // Reciclar elementos
    beeGame.flowers = beeGame.flowers.filter(f => f.x > -50);
    beeGame.obstacles = beeGame.obstacles.filter(o => o.x > -50);
    
    // Adicionar novos elementos
    if (beeGame.flowers.length < 8 && Math.random() < 0.02) {
        beeGame.flowers.push({ x: 800, y: 30 + Math.random() * 340, collected: false });
    }
    if (beeGame.obstacles.length < 6 && Math.random() < 0.015) {
        beeGame.obstacles.push({ x: 800, y: 30 + Math.random() * 340, type: Math.random() > 0.5 ? "💨" : "🔥" });
    }
    
    // Verificar vitória
    if (beeGame.score >= 10) {
        beeGame.gameRunning = false;
        document.getElementById("nextToFase2Btn").style.display = "block";
        const dialog = document.getElementById("fase1DialogText");
        dialog.innerHTML = `Muito bem, ${playerName}! Você ajudou a proteger os polinizadores e contribuiu para uma agricultura mais sustentável.`;
        return;
    }
    
    beeGame.animationId = requestAnimationFrame(updateBeeGame);
}

function stopBeeGame() {
    if (beeGame.animationId) cancelAnimationFrame(beeGame.animationId);
    window.removeEventListener("keydown", () => {});
    window.removeEventListener("keyup", () => {});
}

// ========== FASE 2: COMPOSTAGEM ==========
function startFase2() {
    const dialog = document.getElementById("fase2DialogText");
    dialog.innerHTML = `${playerName}, agora vamos aprender sobre compostagem. Restos de frutas, verduras e folhas podem virar adubo natural. Isso reduz o lixo e ajuda as plantas a crescerem mais saudáveis. Arraste os itens corretos para a composteira!`;
    
    compostGame.acertos = 0;
    compostGame.erros = 0;
    document.getElementById("acertosComp").textContent = "0";
    document.getElementById("errosComp").textContent = "0";
    
    compostGame.currentItems = [...compostGame.items];
    // Embaralhar
    for (let i = compostGame.currentItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [compostGame.currentItems[i], compostGame.currentItems[j]] = [compostGame.currentItems[j], compostGame.currentItems[i]];
    }
    
    renderCompostItems();
    
    document.getElementById("nextToFase3Btn").style.display = "none";
    document.getElementById("compostMessage").innerHTML = "";
    
    fase2Screen.classList.add("active");
}

function renderCompostItems() {
    const area = document.getElementById("itemsArea");
    area.innerHTML = "";
    
    compostGame.currentItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "compost-item";
        div.innerHTML = `<span style="font-size:2rem">${item.emoji}</span><br>${item.name}`;
        div.onclick = () => handleCompostClick(index);
        area.appendChild(div);
    });
}

function handleCompostClick(index) {
    const item = compostGame.currentItems[index];
    const isCorrect = item.type === "organico";
    
    if (isCorrect) {
        compostGame.acertos++;
        document.getElementById("acertosComp").textContent = compostGame.acertos;
        document.getElementById("compostMessage").innerHTML = "✅ Correto! Este item pode ir para a composteira! ✅";
        document.getElementById("compostMessage").style.background = "#c8e6c9";
    } else {
        compostGame.erros++;
        document.getElementById("errosComp").textContent = compostGame.erros;
        document.getElementById("compostMessage").innerHTML = "❌ Errado! Este item NÃO pode ir para a composteira. Coloque no lixo rejeitado. ❌";
        document.getElementById("compostMessage").style.background = "#ffcdd2";
    }
    
    // Remover item
    compostGame.currentItems.splice(index, 1);
    renderCompostItems();
    
    // Verificar se completou
    if (compostGame.currentItems.length === 0 || compostGame.acertos >= 5) {
        document.getElementById("compostMessage").innerHTML = `🎉 Excelente trabalho, ${playerName}! Você transformou resíduos orgânicos em adubo natural! 🎉`;
        document.getElementById("nextToFase3Btn").style.display = "block";
    }
}

// ========== FASE 3: PLANTANDO O FUTURO ==========
function startFase3() {
    const dialog = document.getElementById("fase3DialogText");
    dialog.innerHTML = `${playerName}, graças às abelhas e à compostagem, agora podemos produzir alimentos de forma sustentável. Vamos plantar mudas e ajudar o campo a crescer!`;
    
    // Reset farm game
    farmGame.spots = [
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null },
        { planted: false, grown: false, type: null, name: null, emoji: null }
    ];
    farmGame.mudasCount = 0;
    farmGame.regadas = 0;
    
    document.getElementById("mudasPlantadas").textContent = "0";
    document.getElementById("regadasCount").textContent = "0";
    document.getElementById("nextToFinalBtn").style.display = "none";
    document.getElementById("plantMessage").innerHTML = "";
    
    renderPlantSpots();
    enableSeedlings();
    
    // Botão de regar
    document.getElementById("waterBtn").onclick = waterPlants;
    
    fase3Screen.classList.add("active");
}

function renderPlantSpots() {
    const container = document.getElementById("plantSpots");
    container.innerHTML = "";
    
    farmGame.spots.forEach((spot, index) => {
        const div = document.createElement("div");
        div.className = `plant-spot ${spot.planted ? "planted" : "empty"} ${spot.grown ? "grown" : ""}`;
        
        if (spot.planted) {
            div.innerHTML = `<div class="plant-emoji">${spot.emoji}</div>
                            <div class="plant-name">${spot.name}</div>
                            ${spot.grown ? '<span style="font-size:0.7rem">🌱 CRESCIDO! 🌱</span>' : '<span style="font-size:0.7rem">💧 Precisa regar</span>'}`;
        } else {
            div.innerHTML = `<div class="plant-emoji">⬜</div>
                            <div class="plant-name">Vazio</div>
                            <span style="font-size:0.7rem">Clique para plantar</span>`;
        }
        
        div.onclick = () => plantSeed(index);
        container.appendChild(div);
    });
}

function enableSeedlings() {
    const seedlings = document.querySelectorAll(".seedling");
    seedlings.forEach(seedling => {
        seedling.onclick = () => {
            const type = seedling.getAttribute("data-type");
            const name = seedling.textContent;
            selectSeedling(type, name);
        };
    });
}

let selectedSeedType = null;
let selectedSeedName = null;

function selectSeedling(type, name) {
    selectedSeedType = type;
    selectedSeedName = name;
    document.getElementById("plantMessage").innerHTML = `🌱 Muda de ${name} selecionada! Clique em um espaço vazio para plantar. 🌱`;
    document.getElementById("plantMessage").style.background = "#c8e6c9";
}

function plantSeed(index) {
    if (!selectedSeedType) {
        document.getElementById("plantMessage").innerHTML = "⚠️ Primeiro selecione uma muda! ⚠️";
        document.getElementById("plantMessage").style.background = "#fff3e0";
        return;
    }
    
    if (farmGame.spots[index].planted) {
        document.getElementById("plantMessage").innerHTML = "❌ Este espaço já está plantado! ❌";
        return;
    }
    
    // Plantar
    const emojis = { tomate: "🍅", alface: "🥬", milho: "🌽" };
    farmGame.spots[index] = {
        planted: true,
        grown: false,
        type: selectedSeedType,
        name: selectedSeedName,
        emoji: emojis[selectedSeedType]
    };
    
    farmGame.mudasCount++;
    document.getElementById("mudasPlantadas").textContent = farmGame.mudasCount;
    
    selectedSeedType = null;
    selectedSeedName = null;
    
    renderPlantSpots();
    
    document.getElementById("plantMessage").innerHTML = "✅ Muda plantada! Não esqueça de regar para crescer! ✅";
}

function waterPlants() {
    let wateredCount = 0;
    
    farmGame.spots.forEach(spot => {
        if (spot.planted && !spot.grown) {
            spot.grown = true;
            wateredCount++;
        }
    });
    
    farmGame.regadas += wateredCount;
    document.getElementById("regadasCount").textContent = farmGame.regadas;
    renderPlantSpots();
    
    if (wateredCount > 0) {
        document.getElementById("plantMessage").innerHTML = `💧 ${wateredCount} planta(s) regada(s)! Agora estão crescendo forte! 💧`;
    } else {
        document.getElementById("plantMessage").innerHTML = "⚠️ Não há plantas para regar! Plante primeiro! ⚠️";
    }
    
    // Verificar se completou
    const allPlanted = farmGame.spots.every(spot => spot.planted);
    const allGrown = farmGame.spots.every(spot => spot.grown);
    
    if (allPlanted && allGrown) {
        document.getElementById("nextToFinalBtn").style.display = "block";
        document.getElementById("plantMessage").innerHTML = `🎉 Parabéns, ${playerName}! Sua fazenda está produzindo! 🎉`;
    }
}

// ========== TELA FINAL ==========
function showFinal() {
    finalScreen.classList.add("active");
}

function resetGame() {
    // Resetar variáveis
    beeGame.gameRunning = false;
    if (beeGame.animationId) cancelAnimationFrame(beeGame.animationId);
    
    // Resetar inputs
    document.getElementById("playerNameIntro").value = "";
    
    // Resetar visibilidade dos botões
    document.getElementById("nextToFase2Btn").style.display = "none";
    document.getElementById("nextToFase3Btn").style.display = "none";
    document.getElementById("nextToFinalBtn").style.display = "none";
}

window.addEventListener("DOMContentLoaded", init);
