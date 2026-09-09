// =====================================================================
// CONFIGURAÇÃO DO FIREBASE
// Substitua os valores abaixo pelas credenciais do SEU projeto Firebase.
// Console: https://console.firebase.google.com  →  Configurações do projeto
// →  Seus apps  →  SDK setup and configuration  →  Config
// =====================================================================
const firebaseConfig = {
apiKey: "AIzaSyANNhRqvmE5eKE6RQXoeeVwtYUj7EVB0YE",
  authDomain: "convite-casamento-8a4c5.firebaseapp.com",
  databaseURL: "https://convite-casamento-8a4c5-default-rtdb.firebaseio.com",
  projectId: "convite-casamento-8a4c5",
  storageBucket: "convite-casamento-8a4c5.firebasestorage.app",
  messagingSenderId: "805894049946",
  appId: "1:805894049946:web:ac6ea393c082b9a8554f23",
};

// Nome da coleção onde as confirmações serão salvas no Firestore.
const COLLECTION_NAME = "confirmacoes";

// =====================================================================
// Firebase (via CDN, módulos ES)
// =====================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =====================================================================
// Elementos
// =====================================================================
const inviteCard = document.querySelector(".card:not(.card--form):not(.card--success)");
const formCard = document.getElementById("form-card");
const successCard = document.getElementById("success-card");
const openFormBtn = document.getElementById("open-form");
const rsvpForm = document.getElementById("rsvp-form");
const companionsList = document.getElementById("companions-list");
const addCompanionBtn = document.getElementById("add-companion");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-rsvp");
const successMessage = document.getElementById("success-message");

let companionCount = 0;

// =====================================================================
// Abrir formulário
// =====================================================================
openFormBtn.addEventListener("click", () => {
  inviteCard.hidden = true;
  formCard.hidden = false;
  formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("guest-name").focus();
});

// =====================================================================
// Adicionar / remover acompanhantes
// =====================================================================
function addCompanionField() {
  companionCount += 1;
  const row = document.createElement("div");
  row.className = "companion-row";
  row.innerHTML = `
    <input type="text" name="companion" placeholder="Nome do acompanhante" autocomplete="off">
    <button type="button" class="remove-companion" aria-label="Remover acompanhante">&times;</button>
  `;
  row.querySelector(".remove-companion").addEventListener("click", () => {
    row.remove();
  });
  companionsList.appendChild(row);
  row.querySelector("input").focus();
}

addCompanionBtn.addEventListener("click", addCompanionField);

// =====================================================================
// Envio do formulário
// =====================================================================
rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;

  const nameInput = document.getElementById("guest-name");
  const name = nameInput.value.trim();

  if (!name) {
    formError.textContent = "Por favor, preencha seu nome.";
    formError.hidden = false;
    nameInput.focus();
    return;
  }

  const companions = Array.from(companionsList.querySelectorAll('input[name="companion"]'))
    .map((input) => input.value.trim())
    .filter((value) => value.length > 0);

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      nome: name,
      acompanhantes: companions,
      totalPessoas: 1 + companions.length,
      criadoEm: serverTimestamp(),
    });

    const total = 1 + companions.length;
    successMessage.textContent =
      total > 1
        ? `Obrigado, ${name}! Sua presença e a de mais ${companions.length} pessoa(s) foram confirmadas. Contamos os dias para celebrar com vocês!`
        : `Obrigado, ${name}! Sua presença foi confirmada. Contamos os dias para celebrar com você!`;

    formCard.hidden = true;
    successCard.hidden = false;
    successCard.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error("Erro ao salvar confirmação:", error);
    formError.textContent =
      "Não foi possível enviar sua confirmação agora. Verifique sua conexão e tente novamente.";
    formError.hidden = false;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar confirmação";
  }
});

// Começa com um campo de acompanhante pronto para preencher, se desejado.
// (deixe vazio caso prefira que o convidado clique em "Adicionar pessoa")
