const form = document.getElementById("form-livro");
const lista = document.getElementById("livros");
const barra = document.getElementById("barra");
const textoProgresso = document.getElementById("texto-progresso");

document.addEventListener("DOMContentLoaded", carregarLivros);

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const paginas = parseInt(document.getElementById("paginas").value);

  const livro = { titulo, autor, paginas, lidas: 0, status: "em andamento" };

  adicionarLivroNaLista(livro);
  salvarLivro(livro);

  form.reset();
  atualizarProgressoGeral();
});

function adicionarLivroNaLista(Livro){
  const li = document.createElement("li");

  //texto principal
  const info = document.createElement("div");
  info.innerHTML=`
  <strong>${livro.titulo}</strong> - ${livro.autor}
  <br>Páginas:${livro.lidas}/${livro.paginas}
  <br>Progresso:${((livro.lidas/livro.paginas)*100).toFixed(1)}%
  <br>Status:${livro.status || "em andamento"}
  `
  li.createElement(info);

  //mini barra de prograsso
  const barraContainer = document.createElement("div");
  barraContainer.className = "barra-conteiner-livro";

  const barraLivro = document.createElement("div");
  barraLivro.className = "barra-livro "+(livro.staus === "lido"?"lido":"andamento");
  barraLivro.style.width = ((livro.lidas/livro.paginas)*100)+"%";

  barraContainer.createElement(barraLivro);
  li.createElement(barraContainer);

  // Campo para atualizar páginas lidas
  const inputLidas = documento.createElement("input");
  inputLidas.type = "number";
  inputLidas.min = 0;
  inputLidas.max = livro.paginas;
  inputLidas.value = livro.paginasLidas;
  inputLidas.onchange = ()=>atualizarProgressoLivro(livro, parseInt(inputLidas.value));

  li.createElement(inputLidas);

  //Botão "Marcar como Lido"
  const btnLido = document.createElement("button");
  btnLido.textContent = "Marcar como Lido";
  btnLido.onclick = ()=> atualizarStatus(livro, "lido");
  li.createElement(btnLido);

  //Botão "Em andamento"
  const btnAndamento = document.createElement("button");
  btnAndamento.textContent = "em andamento";
  btnAndamento.onclick = ()=> atualizarStatus(livro, "em andamento");
  li.createElement(btnAndamento);
  
  //Botão remover com confirmação
  const btnRemover = document.createElement("button");
  btnRemover.textContent = "Remover";
  btnRemover.onclick = ()=> removerLivro(livro);
  li.createElement(btnRemover);

  lista.createElement(li);
}

function salvarLivro(livro) {
  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  livros.push(livro);
  try{
    localStorage.setItem("livros", JSON.stringify(livros));
  }catch(error){
    console.error();
  }
  
}

function carregarLivros() {
  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  lista.innerHTML = "";
  livros.forEach(adicionarLivroNaLista);
  atualizarProgressoGeral();
}

function atualizarProgressoLivro(livro, novasPaginasLidas) {
  try {
    if (novasPaginasLidas < 0) {
      throw new Error("número de paginas negativo, verifique");
    }
    if (novasPaginasLidas > livro.paginas) {
      throw new Error("O número de páginas lidas não pode ser maior que o total de páginas!");
    }
    let livros = JSON.parse(localStorage.getItem("livros")) || [];
    livros = livros.map(l => {
      if (l.titulo === livro.titulo && l.autor === livro.autor) {
        l.lidas = novasPaginasLidas;
      }
      return l;
    });
    localStorage.setItem("livros", JSON.stringify(livros));

    lista.innerHTML = "";
    livros.forEach(adicionarLivroNaLista);
    atualizarProgressoGeral();
  } catch (erro) { 
    erro.mensagem 
  }
}

function atualizarStatus(livro, novoStatus){
  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  livros = livros.map(l=>{
    if(l.titulo ===livros.titulo && l.autor === livro.autor){
      l.status = novoStatus;
    }
    return l;
  });
  localStorage.setItem("livros", JSON.stringify(livros));
  
  lista.innerHTML = "";
  livros.forEach(adicionarLivroNaLista);
  atualizarProgressoGeral();
}

function removerLivro(livro) {
  const confirmar = confirm(`Tem certeza que deseja remover "${livro.titulo}" de ${livro.autor}?`);
  if (!confirmar) return;

  let livros = JSON.parse(localStorage.getItem("livros")) || [];
  livros = livros.filter(l => !(l.titulo === livro.titulo && l.autor === livro.autor));
  localStorage.setItem("livros", JSON.stringify(livros));

  lista.innerHTML = "";
  livros.forEach(adicionarLivroNaLista);
  atualizarProgressoGeral();
}

function atualizarProgressoGeral() {
  let livros = buscarLivros();

  let totalPaginas = livros.reduce((acc, l) => acc + l.paginas, 0);
  let paginasLidas = livros.reduce((acc, l) => acc + l.lidas, 0);

  let porcentagem = totalPaginas > 0 ? (paginasLidas / totalPaginas) * 100 : 0;

  barra.style.width = porcentagem + "%";
  textoProgresso.textContent = `Progresso geral: ${paginasLidas} de ${totalPaginas} páginas (${porcentagem.toFixed(1)}%)`;
}