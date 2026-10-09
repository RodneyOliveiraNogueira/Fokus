const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
const ulTarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoTarefa = document.querySelector(
  ".app__section-active-task-description",
);
const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  // Linha problemática removida daqui
}

btnAdicionarTarefa.addEventListener("click", () => {
  formAdicionarTarefa.classList.toggle("hidden");
});

formAdicionarTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const textoTarefa = textArea.value.trim();

  // Evita guardar se estiver vazio ou apenas com espaços
  if (!textoTarefa) return;

  const tarefa = {
    descricao: textoTarefa,
  };

  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
  atualizarTarefas();

  textArea.value = "";
  textArea.blur(); // Remove o foco do campo para evitar o aviso de acessibilidade
  formAdicionarTarefa.classList.add("hidden");
});

textArea.value = "";
formAdicionarTarefa.classList.add("hidden");

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  const botao = document.createElement("button");
  botao.classList.add("app__button--edit");

  botao.onclick = () => {
    const novaDescricao = prompt(
      "Digite a nova descrição da tarefa:",
      tarefa.descricao,
    );
    if (novaDescricao !== null && novaDescricao.trim() !== "") {
      tarefa.descricao = novaDescricao.trim();
      paragrafo.textContent = tarefa.descricao;
      atualizarTarefas();
    }
  };

  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "/imagens/edit.png");
  botao.append(imagemBotao);

  li.append(svg, paragrafo, botao);

  if (tarefa.completa) {
    li.classList.add("app__section-task-list-item-complete");
    botao.setAttribute("disabled", "true");
  } else {
    li.onclick = () => {
      paragrafoDescricaoTarefa.textContent = tarefa.descricao;
      document
        .querySelectorAll(".app__section-task-list-item")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefa.textContent = "";
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
        return;
      }

      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;

      li.classList.add("app__section-task-list-item-active");
    };
  }

  return li;
}

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});

document.addEventListener("focoFinalizado", () => {
  if (tarefaSelecionada && liTarefaSelecionada) {
    liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
    liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
    liTarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "true");
    tarefaSelecionada.completa = true;
    atualizarTarefas();
  }
});

const removerTarefas = (somenteCompletas) => {
  let seletor = ".app__section-task-list-item";
  if (somenteCompletas) {
    seletor = ".app__section-task-list-item-complete";
  }
  document.querySelectorAll(seletor).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa) => !tarefa.completa)
    : [];
  atualizarTarefas();
};

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);

// 1. Seleciona os botões
const btnCancelar = document.querySelector(".app__form-footer__button--cancel");
const btnDeletar = document.querySelector(".app__form-footer__button--delete");

// 2. Função para limpar o texto e fechar o formulário
const limparEFecharFormulario = () => {
  textArea.value = "";
  formAdicionarTarefa.classList.add("hidden");
};

// 3. O botão Cancelar apenas limpa e fecha o formulário
btnCancelar.addEventListener("click", limparEFecharFormulario);

// 4. O botão Deletar limpa o texto (ou faz o mesmo papel de cancelar)
btnDeletar.addEventListener("click", () => {
  textArea.value = "";
  textArea.focus();
});
