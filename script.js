// ========== PROJETO AGRO FORTE - JAVASCRIPT ==========

// 1. MODO ESCURO (alterna tema e salva preferência)
const darkToggle = document.getElementById('darkModeToggle');

// Função para alternar modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    darkToggle.innerHTML = isDark ? '☀️ Light Mode' : '🌓 Dark Mode';
    
    // Salvar preferência no localStorage
    localStorage.setItem('agroTheme', isDark ? 'dark' : 'light');
}

// Carregar preferência salva
function loadThemePreference() {
    const savedTheme = localStorage.getItem('agroTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        darkToggle.innerHTML = '☀️ Light Mode';
    }
}

darkToggle.addEventListener('click', toggleDarkMode);
loadThemePreference();

// 2. SAUDAÇÃO PERSONALIZADA (armazena nome e exibe)
const saudacaoBtn = document.getElementById('saudacaoBtn');
const mensagemDiv = document.getElementById('mensagemPersonalizada');

function exibirSaudacao() {
    const nomeInput = document.getElementById('nomeUsuario');
    let nome = nomeInput.value.trim();
    const email = document.getElementById('emailUser').value.trim();
    
    // Guarda o nome para uso personalizado
    if (nome === "") {
        nome = "parceiro(a) rural";
    }
    
    let texto = `🌿 Olá, ${nome}! `;
    
    if (email !== "") {
        texto += `Enviaremos novidades sustentáveis para ${email}. `;
    } else {
        texto += "Cadastre seu e-mail depois para mais conteúdos exclusivos. ";
    }
    
    texto += "Juntos construímos um agro forte e sustentável! 🌎💚";
    mensagemDiv.innerHTML = texto;
    
    // Efeito visual
    mensagemDiv.style.transform = "scale(1.01)";
    setTimeout(() => { mensagemDiv.style.transform = "scale(1)"; }, 300);
}

saudacaoBtn.addEventListener('click', exibirSaudacao);

// 3. CÁLCULO DE REDUÇÃO DE CO₂ (processa informações do formulário)
const calcBtn = document.getElementById('calcImpactoBtn');
const resultadoArea = document.getElementById('resultadoCO2');

function calcularReducao() {
    const hectares = parseFloat(document.getElementById('hectares').value);
    const selectPratica = document.getElementById('pratica');
    const fatorSelecionado = parseFloat(selectPratica.value);
    const praticaTexto = selectPratica.options[selectPratica.selectedIndex].text;
    
    // Validação
    if (isNaN(hectares) || hectares <= 0) {
        resultadoArea.innerHTML = "⚠️ Por favor, insira um valor válido de hectares (maior que zero).";
        resultadoArea.style.background = "#ffe0b5";
        return;
    }
    
    // Cálculo simbólico de toneladas de CO2 reduzidas
    const reducaoTon = (hectares * fatorSelecionado).toFixed(1);
    const arvoresEquivalentes = Math.round(reducaoTon * 12);
    
    resultadoArea.innerHTML = `🌱 Resultado: Com ${hectares} hectares aplicando "<strong>${praticaTexto}</strong>", você reduz cerca de <strong>${reducaoTon} toneladas de CO₂eq por ano</strong>!<br> Isso equivale a plantar <strong>${arvoresEquivalentes} árvores nativas</strong>. O agro sustentável é o caminho! 🌳💚`;
    resultadoArea.style.background = "var(--light-green)";
    resultadoArea.style.color = "var(--text-color)";
}

calcBtn.addEventListener('click', calcularReducao);

// 4. CONTADOR DE ÁRVORES (manipulação de contador na tela)
let contadorArvores = 0;
const arvoreSpan = document.getElementById('arvoreCounter');
const incrementBtn = document.getElementById('incrementArvore');
const decrementBtn = document.getElementById('decrementArvore');
const msgArvoreSpan = document.getElementById('msgArvore');

function atualizarContador() {
    arvoreSpan.innerText = contadorArvores;
    
    // Mensagens motivacionais baseadas no contador
    if (contadorArvores === 0) {
        msgArvoreSpan.innerHTML = "🌱 Comece sua jornada verde!";
    } else if (contadorArvores < 5) {
        msgArvoreSpan.innerHTML = "🌿 Cada árvore é um passo para o futuro!";
    } else if (contadorArvores < 15) {
        msgArvoreSpan.innerHTML = "🍃 Você está restaurando a paisagem! Parabéns!";
    } else if (contadorArvores < 30) {
        msgArvoreSpan.innerHTML = "🏆 Agro forte! Você é um guardião da sustentabilidade!";
    } else {
        msgArvoreSpan.innerHTML = "🎉 HERÓI DO CLIMA! Você já plantou " + contadorArvores + " árvores simbólicas!";
    }
}

incrementBtn.addEventListener('click', () => {
    contadorArvores++;
    atualizarContador();
    
    // Efeito visual de pulso
    arvoreSpan.style.transform = "scale(1.2)";
    setTimeout(() => { arvoreSpan.style.transform = "scale(1)"; }, 150);
});

decrementBtn.addEventListener('click', () => {
    if (contadorArvores > 0) {
        contadorArvores--;
        atualizarContador();
        arvoreSpan.style.transform = "scale(1.2)";
        setTimeout(() => { arvoreSpan.style.transform = "scale(1)"; }, 150);
    } else {
        msgArvoreSpan.innerHTML = "🌍 Não pode ficar negativo! Plante mais árvores!";
        setTimeout(() => { 
            if(contadorArvores === 0) msgArvoreSpan.innerHTML = "🌱 Comece sua jornada verde!"; 
        }, 2000);
    }
});

// 5. BOTÃO "DESCUBRA COMO" - Cria mensagem informativa temporária
const saibaBtn = document.getElementById('saibaBtn');

function mostrarMensagemInformativa() {
    // Verifica se já existe uma mensagem para não duplicar
    let infoBox = document.getElementById('infoAgroExtra');
    
    if (!infoBox) {
        const heroDiv = document.querySelector('.hero-content');
        infoBox = document.createElement('div');
        infoBox.id = 'infoAgroExtra';
        infoBox.className = 'eco-feedback';
        infoBox.style.marginTop = '1rem';
        infoBox.style.animation = 'fadeInUp 0.4s';
        infoBox.innerHTML = '✅ Agro sustentável = produtividade + respeito aos ciclos naturais. O Brasil é referência em tecnologias de baixo carbono como ILPF, bioinsumos e energias renováveis. Invista no futuro! 🌎';
        
        // Insere após o hero content
        heroDiv.parentNode.insertBefore(infoBox, heroDiv.nextSibling);
        
        // Remove após 6 segundos com fade out
        setTimeout(() => {
            if(infoBox) infoBox.style.opacity = '0';
            setTimeout(() => {
                if(infoBox && infoBox.remove) infoBox.remove();
            }, 500);
        }, 6000);
    }
}

saibaBtn.addEventListener('click', mostrarMensagemInformativa);

// 6. DATA ATUAL NO RODAPÉ
const footerDate = document.getElementById('dataAtualFooter');
const dataAtual = new Date();
footerDate.innerHTML = `🌾 Ano ${dataAtual.getFullYear()} · Projeto inspirado no equilíbrio entre produção agrícola e meio ambiente 🌎`;

// 7. INICIALIZAÇÃO DO CONTADOR
atualizarContador();

// Mensagem no console (sem erros)
console.log("🌿 Projeto Agro Forte carregado com sucesso! Manipulação de DOM ativa.");
