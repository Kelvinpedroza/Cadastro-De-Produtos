(function () {
  "use strict";

  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
        } else {
          inserir();
          form.classList.remove("was-validated");
          form.reset();
        }
        event.preventDefault();
        event.stopPropagation();
      },
      false
    );
  });
})();
//! Listeners
const atualizarProdutos = document.getElementById("btnAtualizar");
atualizarProdutos.addEventListener("click", editar);
const cancelarAtua = document.getElementById("btnCancelar");
cancelarAtua.addEventListener("click", cancelarAtualizacao);


function getLocalStorage() {
  return JSON.parse(localStorage.getItem("bd_clientes")) ?? [];
}

function setLocalStorage(bd_clientes) {
  localStorage.setItem("bd_clientes", JSON.stringify(bd_clientes));
}

function limparTabela() {
  var elemento = document.querySelector("#tabela>tbody");
  while (elemento.firstChild) {
    elemento.removeChild(elemento.firstChild);
  }
}
function atualizarTabela() {
  // Adaptação da função atualizarTabela (5 pontos)
  limparTabela();
  const bd_clientes = getLocalStorage();
  let index = 0;

  for (cliente of bd_clientes) {
    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = `
        <th scope="row">${index}</th>
        <td>${cliente.nome}</td>
        <td>${cliente.codigo}</td>
        <td>${cliente.precoCusto}</td>
        <td>${cliente.precoVenda}</td>
        <td>${cliente.lucro} %</td>
        <td>${cliente.quantidade}</td>
        <td>${cliente.valorTotal}</td>
        <td>${cliente.fabricante}</td>
        
        <td>
        <button type="button" class="btn btn-primary" id="${index}" onclick="capturarValores(${index})">Editar</button>
        <button type="button" class="btn btn-danger" id="${index}" onclick="excluir(${index})">Excluir</button>
        
        </td>
    `;
    document.querySelector("#tabela>tbody").appendChild(novaLinha);
    index++;
  }
}
function inserir() {
  // Adaptação da função inserir (10 pontos)
  const cliente = {
    nome: document.getElementById("nome").value,
    codigo: document.getElementById("codigo").value,
    precoCusto: document.getElementById("preco").value,
    fabricante: document.getElementById("fabricante").value,
    quantidade: document.getElementById("quantidade").value,
    lucro: document.getElementById("lucro").value,
  };
  // Declaração de variaveis
  const bd_clientes = getLocalStorage();
  // Chamada das funcões
  cliente.precoVenda = precoComLucro(cliente.precoCusto, cliente.lucro);
  cliente.valorTotal = valorTotal(cliente.precoVenda, cliente.quantidade);
  cliente.precoVenda = formatarMoney(cliente.precoVenda);
  cliente.precoCusto = formatarMoney(parseInt(cliente.precoCusto));
  bd_clientes.push(cliente);
  setLocalStorage(bd_clientes);
  atualizarTabela();
}

//!Captura nos valores dos produtos ja inseridos no banco
function capturarValores(valor) {
  const bd_clientes = getLocalStorage();
  const alterar = bd_clientes[valor];
  const nova = alterar.precoCusto.replace(/[^0-9]/g, "");

  (document.querySelector("[name='nome']").value = alterar.nome),
    (document.querySelector("[name='preco']").value = nova.slice(0, -2)),
    (document.querySelector("[name='codigo']").value = alterar.codigo),
    (document.querySelector("[name='fabricante']").value = alterar.fabricante),
    (document.querySelector("[name='quantidade']").value = alterar.quantidade),
    (document.querySelector("[name='select']").value = alterar.lucro),
    adicionarBtnAtualizar();
  adicionarBtnCancelar();
  disbledInput(true);
  disabledInserir(true);
}
//! Editar os produtos ja existentes
function editar() {
  const bd_clientes = getLocalStorage();
  const nome = document.querySelector("[name='nome']").value;
  const preco = document.querySelector("[name='preco']").value;
  const codigo = document.querySelector("[name='codigo']").value;
  const fabricante = document.querySelector("[name='fabricante']").value;
  const quantidade = document.querySelector("[name='quantidade']").value;
  const select = document.querySelector('#lucro').value;
  const precoLucro = precoComLucro(preco,parseInt(select));
  bd_clientes.forEach((elemento, index) => {
    if (elemento.codigo == codigo) {
      bd_clientes[index].nome = nome;
      bd_clientes[index].precoCusto = formatarMoney(parseInt(preco))
      bd_clientes[index].precoVenda = formatarMoney(precoComLucro(preco,select))
      bd_clientes[index].fabricante = fabricante;
      bd_clientes[index].quantidade = quantidade;
      bd_clientes[index].select = select;
      bd_clientes[index].valorTotal = formatarMoney(
        quantidade * precoLucro)
    }
    
  });
  setLocalStorage(bd_clientes);
  cancelarAtualizacao()
  atualizarTabela();
}
//! Função para cancelar a atualização
function cancelarAtualizacao() {
  document.querySelector("[name='nome']").value = "";
  document.querySelector("[name='preco']").value = "";
  document.querySelector("[name='codigo']").value = "";
  document.querySelector("[name='fabricante']").value = "";
  document.querySelector("[name='quantidade']").value = "";
  document.querySelector("[name='select']").value = "";
  retirarBtnAtualizar();
  retirarBtnCancelar();
  disabledInserir(false);
  disbledInput(false);
}

function excluir(index) {
  // Adaptação da função excluir (5 pontos)
  const bd_clientes = getLocalStorage();
  bd_clientes.splice(index, 1);
  setLocalStorage(bd_clientes);
  atualizarTabela();
}
//! valida se o codigo já existe no banco de dados
function validarCodigo() {
  // Adaptação da função validar (10 pontos)
  const bd_clientes = getLocalStorage();
  for (cliente of bd_clientes) {
    if (codigo.value == cliente.codigo) {
      codigo.setCustomValidity("Este Código ja Existe !");
      feedbackCodigo.innerText = "Este codigo já existe!";
      return false;
    } else {
      codigo.setCustomValidity("");
      feedbackCodigo.innerText = "Informe o Código corretamente.";
    }
  }
  return true;
}

atualizarTabela();
//! Seleção dos elementos e adição do listener para validação customizada (5 pontos)
const codigo = document.getElementById("codigo");
const feedbackCodigo = document.getElementById("feedbackCodigo");
codigo.addEventListener("input", validarCodigo);

//! Função para desabilidar o input do codigo do produto
function disbledInput(boolean) {
  document.querySelector("[name='codigo']").disabled = boolean;
}
function disabledInserir(boolean) {
  document.querySelector("[name='inserirBtn']").disabled = boolean;
}
//! função responsavel por habilidar os botões de Atualizar e cancelar
function adicionarBtnAtualizar() {
  document.querySelector("#atualizar").classList.add("d-md-flex");
}
function adicionarBtnCancelar() {
  document.getElementById("cancelar").classList.add("d-md-flex");
}

//! função responsavel em desabilitar os botões atualizar e cancelar
function retirarBtnAtualizar() {
  document.querySelector("#atualizar").classList.remove("d-md-flex");
}
function retirarBtnCancelar() {
  document.querySelector("#cancelar").classList.remove("d-md-flex");
}
//! Formatação dos valores para BRL
function formatarMoney(valores) {
  return valores.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
//! Soma a quantide total do valor dos  produto inseridos
function valorTotal(valores, quantidade) {
  const valorInt = parseInt(valores);
  const quantidades = parseInt(quantidade);
  const valorFormatado = valorInt * quantidades;
  return formatarMoney(valorFormatado);
}
//! Atualiza o preço do Produto baseado na quantidade de lucro desejada
function precoComLucro(preco, lucros) {
  const precos = parseInt(preco);
  const lucro = parseInt(lucros);
  const result = precos * (lucro / 100);
  let precoComLucro = precos + result;
  return precoComLucro;
}
