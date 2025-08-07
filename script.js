const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("userInput");

// 🔁 URL do seu agente com Chat Trigger
const API_URL = "https://n8n-n8nteste.blcogy.easypanel.host/webhook/d2ae52db-b30e-44ee-bbd2-e1caf007c4ba/chat";

let sessionId = null;

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Adiciona mensagem do usuário
  addMessage(text, 'user');
  userInput.value = '';
  
  // Adiciona indicador de carregamento
  const loadingMessage = addMessage("Digitando...", 'bot', true);

  try {
    console.log("Enviando mensagem:", text); // Debug
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chatInput: text,
        sessionId: sessionId || ""
      })
    });

    console.log("Status da resposta:", response.status); // Debug

    // Remove indicador de carregamento
    if (loadingMessage && loadingMessage.parentNode) {
      messagesContainer.removeChild(loadingMessage);
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dados recebidos:", data); // Debug
    
    const reply = data.text || data.message || "Desculpe, não consegui processar sua mensagem.";

    // Atualiza sessionId se fornecido
    if (data.sessionId) {
      sessionId = data.sessionId;
    }

    addMessage(reply, 'bot');

  } catch (error) {
    console.error("Erro na comunicação:", error);
    
    // Remove indicador de carregamento em caso de erro
    if (loadingMessage && loadingMessage.parentNode) {
      messagesContainer.removeChild(loadingMessage);
    }
    
    addMessage("❌ Erro ao se comunicar com o assistente. Verifique sua conexão.", 'bot');
  }
}

function addMessage(text, sender, isLoading = false) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${sender}`;
  
  if (isLoading) {
    messageEl.classList.add('loading');
    messageEl.id = 'loading-message'; // Para facilitar remoção
  }
  
  messageEl.textContent = text;
  messagesContainer.appendChild(messageEl);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  return isLoading ? messageEl : null;
}

// Event listener para Enter no input
userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Foca no input ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
  userInput.focus();
  console.log("Assistente carregado com sucesso!");
  console.log("API URL:", API_URL);
});

// Função de teste (pode chamar no console)
window.testAPI = async function() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: "teste", sessionId: "" })
    });
    console.log("Teste API - Status:", response.status);
    const data = await response.json();
    console.log("Teste API - Resposta:", data);
    return data;
  } catch (error) {
    console.error("Teste API - Erro:", error);
    return null;
  }
};