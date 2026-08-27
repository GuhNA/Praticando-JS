// ============================================================
//  EXERCÍCIOS — FASE 0.5
//  Implemente cada função e rode:  node teste.mjs
//  Regra geral: NUNCA altere a lista recebida nem os objetos dentro dela.
// ============================================================
import {produtos} from "./produtos.mjs"
/* 1 ─ agruparPorCategoria(lista)
   reduce montando arrays.
   → { "Eletrônicos": [prod, prod, ...], "Esportes": [...], ... }
   Os produtos dentro dos arrays podem ser as MESMAS referências da lista.
   Mantenha a ordem original de aparição dentro de cada grupo. */
export function agruparPorCategoria(lista) {
  return lista.reduce((acc, e) =>{
    if(acc[e.categoria]) acc[e.categoria].push(e);
    else acc[e.categoria] = [e];
    return acc;

  }, {})
}

/* 2 ─ indexarPorId(lista)
   reduce montando um mapa de busca (é assim que se "normaliza" dados de API).
   → { 1: prod1, 2: prod2, ... }  — acesso O(1) por id */
export function indexarPorId(lista) {
  return lista.reduce((acc,e) =>{
    acc[e.id] = e;
    return acc;
  }, {})
}

/* 3 ─ contarPorFaixa(lista)
   reduce com classificação. Retorne SEMPRE as 4 chaves, mesmo valendo 0:
   → { "até 100": n, "101 a 1000": n, "1001 a 10000": n, "acima de 10000": n }
   Regra: preco <= 100 | <= 1000 | <= 10000 | acima disso. */
export function contarPorFaixa(lista) {
  return lista.reduce((acc,e) =>{
      if(e.preco <= 100) { 
        acc["até 100"]++;
        return acc;
      }
      if(e.preco <= 1000) {
        acc["101 a 1000"]++;
        return acc;
      }
      if(e.preco <= 10000) {
        acc["1001 a 10000"]++;
        return acc;
      }
      acc["acima de 10000"]++;
      return acc;
    }, {
      "até 100": 0,
      "101 a 1000": 0,
      "1001 a 10000": 0,
      "acima de 10000": 0
    })
}

/* 4 ─ estatisticasPorCategoria(lista)   ⭐ o mais difícil
   reduce que acumula objetos aninhados.
   → { "Eletrônicos": { quantidade, total, media, maisCaro }, ... }
   `maisCaro` é a STRING com o nome do produto mais caro da categoria.
   `media` = total / quantidade da categoria. */
export function estatisticasPorCategoria(lista) {
    let preco = 0;
    const novaLista = lista.reduce((acc,p) =>{
      if(acc[p.categoria]){
        acc[p.categoria].quantidade++;
        acc[p.categoria].total += p.preco;
        
        if(preco < p.preco) {
          acc[p.categoria].maisCaro = p.nome;
          preco = p.preco
        }
      }
      else{
          acc[p.categoria] =
           {
            quantidade : 1,
            maisCaro: p.nome,
            total: p.preco,
            media: 0
          }
        preco = p.preco;
      }
      return acc;
    }, {})
  for(const [,value] of Object.entries(novaLista))
    value.media = value.total / value.quantidade;
  
  return novaLista;
}

/* 5 ─ atualizarPreco(lista, id, novoPreco)
   → NOVA lista onde só o produto com aquele id tem o preço trocado.
   Os outros objetos devem ser as MESMAS referências (não copie quem não mudou).
   Id inexistente → devolve uma nova lista igual à original. */
export function atualizarPreco(lista, id, novoPreco) {
  return lista.map(p => p.id === id ? {...p, preco: novoPreco} : p)
}

/* 6 ─ alternarFavorito(lista, id)
   → NOVA lista com o campo `favorito` invertido apenas nesse id.
   Mesma regra de referências do exercício 5. */
export function alternarFavorito(lista, id) {
  return lista.map(p => p.id === id ? {...p, favorito : !p.favorito} : p);
}

/* 7 ─ removerPorId(lista, id)
   → NOVA lista sem o produto daquele id. Sem splice, sem mutação. */
export function removerPorId(lista, id) {
  return lista.filter(e => e.id !== id);
}

/* 8 ─ buscar(lista, termo)
   Filtra por `nome`, ignorando maiúsculas/minúsculas E acentos.
   buscar(produtos, "luminaria") deve achar "Luminária".
   termo vazio ou só espaços → devolve todos.
   Dica: "Luminária".normalize("NFD").replace(/\p{Diacritic}/gu, "") */
export function buscar(lista, termo) {
    return lista.reduce((acc, p) => {
      if(p["nome"].normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase()
        .includes(termo.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase().trim())
        || termo.trim() === ""){ 
        acc.push(p);
      }
      return acc;
  }, [])
}

/* 9 ─ valorEmEstoque(lista)
   → número: soma de (preco * estoque) de todos os produtos. */
export function valorEmEstoque(lista) {
  return lista.reduce((acc, e) =>{
    acc+= e.preco * e.estoque;
    return acc;
  }, 0)
}

/* 10 ─ ordenarPor(lista, campo, { crescente = true } = {})
   → NOVA lista ordenada por qualquer campo, sem mutar a original.
   Números: comparação numérica. Strings: localeCompare com "pt-BR".
   Booleanos: false antes de true no modo crescente. */
export function ordenarPor(lista, campo, opcoes = {}) {
  return lista.reduce((acc,e) => {
    acc = [...lista];
    if(opcoes.crescente || opcoes.crescente === undefined){
      if(campo === "preco" || campo === "id" || campo === "estoque"){
        acc.sort((a,b) => a[campo] - b[campo]);
      }
      else if(campo === "nome" || campo === "categoria"){
        acc.sort((a,b) => {
          return a[campo].localeCompare(b[campo], "pt-BR");
        });
      }
      else acc.sort((a,b) => {
        if(!a[campo] && b[campo]) return -1;
        else if(!b[campo] && a[campo]) return 1;
        return 0;
      })
    }
    else{
      if(campo === "preco" || campo === "id" || campo === "estoque"){
        acc.sort((a,b) => b[campo] - a[campo]);
      }
      else if(campo === "nome" || campo === "categoria"){
        acc.sort((a,b) => {
          return b[campo].localeCompare(a[campo], "pt-BR");
        });
      }
      else acc.sort((a,b) => {
        if(a[campo] && !b[campo]) return -1;
        else if(b[campo] && !a[campo]) return 1;
        return 0;
      })
    }
    return acc
  }, [])
}
