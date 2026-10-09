const html = document.querySelector("html");
const focoBt = document.querySelector(".app__card-button--foco");
const curtoBt = document.querySelector(".app__card-button--curto");
const longoBt = document.querySelector(".app__card-button--longo");
const botaoIniciar = document.querySelector(".app__card-primary-button");
const botoes = document.querySelectorAll(".app__card-button");
const displayTempo = document.querySelector("#timer");
const banner = document.querySelector(".app__image");
const titulo = document.querySelector(".app__title");
const tempoNaTela = document.querySelector("#timer");

let tempoDecorridoemSegundos = 1500;
const startPauseBT = document.querySelector("#start-pause");
let intervaloId = null;
const iniciarOuPausarBt = document.querySelector("#start-pause span");
const imgPlayPause = document.querySelector("#start-pause img");

const audioPlay = new Audio("/sons/play.wav");
const audioPausa = new Audio("/sons/pause.mp3");
const audioTempoFinalizado = new Audio("./sons/beep.mp3");

const musicaFocoInput = document.querySelector("#alternar-musica");
const musica = new Audio("./sons/luna-rise-part-one.mp3");
musica.loop = true;
const controleVolume = document.querySelector("#volume-musica");
musica.volume = controleVolume.value;

musicaFocoInput.addEventListener("change", () => {
  if (musicaFocoInput.checked) {
    musica.play();
  } else {
    musica.pause();
  }
});

// Define o volume inicial do áudio com base no valor padrão do input (0.5 = 50%)

// Evento para atualizar o volume ao deslizar o controle
controleVolume.addEventListener("input", () => {
  musica.volume = controleVolume.value;
});

focoBt.addEventListener("click", () => {
  tempoDecorridoemSegundos = 1500;
  mostrarTempo();
  alterarContexto("foco");
  focoBt.classList.add("active");
});

curtoBt.addEventListener("click", () => {
  tempoDecorridoemSegundos = 300;
  mostrarTempo();
  alterarContexto("descanso-curto");
  curtoBt.classList.add("active");
});

longoBt.addEventListener("click", () => {
  tempoDecorridoemSegundos = 900;
  mostrarTempo();
  alterarContexto("descanso-longo");
  longoBt.classList.add("active");
});

function alterarContexto(contexto) {
  botoes.forEach((botao) => {
    botao.classList.remove("active");
  });
  html.setAttribute("data-contexto", contexto);
  banner.setAttribute("src", `./imagens/${contexto}.png`);
  switch (contexto) {
    case "foco":
      titulo.innerHTML = `
      Otimize sua produtividade,<br />
          <strong class="app__title-strong">mergulhe no que importa.</strong>
      `;
      break;
    case "descanso-curto":
      titulo.innerHTML = `
      Que tal dar uma respirada? <br />
          <strong class="app__title-strong">Faça uma pausa curta!</strong>
      `;
      break;
    case "descanso-longo":
      titulo.innerHTML = `
      Hora de voltar à superfície.<br />
          <strong class="app__title-strong">Faça uma pausa longa.</strong>
      `;
      break;
    default:
      break;
  }
}

const contagemRegressiva = () => {
  if (tempoDecorridoemSegundos <= 0) {
    audioTempoFinalizado.play();
    setTimeout(() => {
      alert("Tempo finalizado!");
    }, 100);
    const focoAtivo = html.getAttribute("data-contexto") === "foco";
    if (focoAtivo) {
      const evento = new CustomEvent("focoFinalizado");
      document.dispatchEvent(evento);
    }
    zerar();

    return;
  }
  tempoDecorridoemSegundos--;
  mostrarTempo();
};

startPauseBT.addEventListener("click", iniciarOuPausar);
function iniciarOuPausar() {
  if (intervaloId) {
    audioPausa.play();
    zerar();

    return;
  }
  audioPlay.play();
  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarBt.textContent = "Pausar";
  imgPlayPause.setAttribute("src", "./imagens/pause.png");
}
function zerar() {
  clearInterval(intervaloId);
  iniciarOuPausarBt.textContent = "Começar";
  imgPlayPause.setAttribute("src", "./imagens/play_arrow.png");
  intervaloId = null;
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoemSegundos * 1000);
  const tempoFormatado = tempo.toLocaleTimeString([], {
    minute: "2-digit",
    second: "2-digit",
  });
  tempoNaTela.innerHTML = `${tempoFormatado}`;
}
mostrarTempo();
