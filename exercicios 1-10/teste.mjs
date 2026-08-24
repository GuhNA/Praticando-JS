import { produtos } from "./produtos.mjs";
import * as f from "./exercicios.mjs";

let ok = 0, falhou = 0, pulou = 0;
const perto = (a, b) => typeof a === "number" && typeof b === "number" && Math.abs(a - b) < 1e-6;
function igual(a, b) {
  if (a === b || perto(a, b)) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => igual(a[k], b[k]));
}
function checa(nome, recebido, esperado) {
  if (igual(recebido, esperado)) { ok++; console.log(`  ✅ ${nome}`); }
  else {
    falhou++;
    console.log(`  ❌ ${nome}`);
    console.log(`     esperado: ${JSON.stringify(esperado)}`);
    console.log(`     recebido: ${JSON.stringify(recebido)}`);
  }
}
// roda um bloco; se a função não existir/lançar "não implementada", marca como pulado
function bloco(titulo, fn) {
  console.log(`\n${titulo}`);
  const snapshot = JSON.stringify(produtos);
  try { fn(); } catch (err) {
    if (String(err.message).includes("não implementada")) { pulou++; console.log("  ⏭️  ainda não implementada"); }
    else { falhou++; console.log(`  💥 erro: ${err.message}`); }
  }
  if (JSON.stringify(produtos) !== snapshot) { falhou++; console.log("  ❌ MUTOU a lista original de produtos!"); }
  else if (!titulo.startsWith("[1]") && !titulo.startsWith("[2]")) { ok++; console.log("  ✅ não mutou a lista original"); }
}

bloco("[1] agruparPorCategoria", () => {
  const g = f.agruparPorCategoria(produtos);
  checa("chaves", Object.keys(g), ["Eletronicos", "Esportes", "Casa", "Livros"]);
  checa("tamanhos", Object.values(g).map((v) => v.length), [5, 3, 3, 3]);
  checa("ordem dentro de Casa", g.Casa.map((p) => p.nome), ["Cafeteira", "Aspirador", "Luminária"]);
  checa("Livros[0] é o mesmo objeto da lista", g.Livros[0] === produtos[11], true);
  checa("lista vazia", f.agruparPorCategoria([]), {});
});

bloco("[2] indexarPorId", () => {
  const m = f.indexarPorId(produtos);
  checa("chaves", Object.keys(m).length, 14);
  checa("acesso por id", m[7].nome, "Bola");
  checa("acesso por id 14", m[14].nome, "Refactoring");
  checa("mesma referência", m[3] === produtos[2], true);
  checa("id inexistente", m[99], undefined);
});

bloco("[3] contarPorFaixa", () => {
  checa("contagem", f.contarPorFaixa(produtos), {
    "até 100": 3, "101 a 1000": 6, "1001 a 10000": 4, "acima de 10000": 1,
  });
  checa("lista vazia mantém as 4 chaves", f.contarPorFaixa([]), {
    "até 100": 0, "101 a 1000": 0, "1001 a 10000": 0, "acima de 10000": 0,
  });
  checa("bordas exatas", f.contarPorFaixa([{ preco: 100 }, { preco: 1000 }, { preco: 10000 }, { preco: 10001 }]), {
    "até 100": 1, "101 a 1000": 1, "1001 a 10000": 1, "acima de 10000": 1,
  });
});

bloco("[4] estatisticasPorCategoria", () => {
  checa("resultado completo", f.estatisticasPorCategoria(produtos), {
    "Eletronicos": { quantidade: 5, total: 21600,   media: 4320,               maisCaro: "PC Gamer" },
    "Esportes":    { quantidade: 3, total: 1404.9,  media: 468.3,              maisCaro: "Bicicleta" },
    "Casa":        { quantidade: 3, total: 1295.49, media: 431.83,             maisCaro: "Aspirador" },
    "Livros":      { quantidade: 3, total: 476.3,   media: 158.76666666666668, maisCaro: "Refactoring" },
  });
  checa("lista vazia", f.estatisticasPorCategoria([]), {});
});

bloco("[5] atualizarPreco", () => {
  const nova = f.atualizarPreco(produtos, 7, 19.9);
  checa("preço trocado", nova[6].preco, 19.9);
  checa("demais campos preservados", nova[6].nome, "Bola");
  checa("array é novo", nova !== produtos, true);
  checa("objeto alterado é novo", nova[6] !== produtos[6], true);
  checa("objetos NÃO alterados são a mesma referência", nova[0] === produtos[0], true);
  checa("id inexistente devolve conteúdo igual", JSON.stringify(f.atualizarPreco(produtos, 999, 1)), JSON.stringify(produtos));
});

bloco("[6] alternarFavorito", () => {
  const a = f.alternarFavorito(produtos, 1);
  checa("false → true", a[0].favorito, true);
  const b = f.alternarFavorito(produtos, 2);
  checa("true → false", b[1].favorito, false);
  checa("vizinhos intactos", a[1].favorito, true);
  checa("mesma referência para não alterados", a[5] === produtos[5], true);
  checa("alternar duas vezes volta ao original", f.alternarFavorito(f.alternarFavorito(produtos, 9), 9)[8].favorito, true);
});

bloco("[7] removerPorId", () => {
  const r = f.removerPorId(produtos, 3);
  checa("tamanho", r.length, 13);
  checa("id 3 sumiu", r.some((p) => p.id === 3), false);
  checa("ordem preservada", r.map((p) => p.id), [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  checa("id inexistente não remove nada", f.removerPorId(produtos, 999).length, 14);
});

bloco("[8] buscar", () => {
  checa("sem acento acha com acento", f.buscar(produtos, "luminaria").map((p) => p.nome), ["Luminária"]);
  checa("case-insensitive", f.buscar(produtos, "CLEAN").map((p) => p.nome), ["Clean Code"]);
  checa("acento + case + espaços", f.buscar(produtos, "  MeCâNiCo  ").map((p) => p.nome), ["Teclado Mecânico"]);
  checa("parcial no meio", f.buscar(produtos, "book").map((p) => p.nome), ["Notebook"]);
  checa("termo vazio devolve todos", f.buscar(produtos, "").length, 14);
  checa("só espaços devolve todos", f.buscar(produtos, "   ").length, 14);
  checa("sem resultado", f.buscar(produtos, "zzz"), []);
});

bloco("[9] valorEmEstoque", () => {
  checa("total", f.valorEmEstoque(produtos), 47527.3);
  checa("lista vazia", f.valorEmEstoque([]), 0);
  checa("estoque 0 não soma", f.valorEmEstoque([{ preco: 500, estoque: 0 }]), 0);
});

bloco("[10] ordenarPor", () => {
  checa("preco crescente", f.ordenarPor(produtos, "preco").map((p) => p.id), [7, 11, 13, 12, 8, 14, 9, 5, 10, 6, 1, 4, 2, 3]);
  checa("preco decrescente", f.ordenarPor(produtos, "preco", { crescente: false }).map((p) => p.id), [3, 2, 4, 1, 6, 10, 5, 9, 14, 8, 12, 13, 11, 7]);
  checa("nome crescente (localeCompare)", f.ordenarPor(produtos, "nome").map((p) => p.nome).slice(0, 5), ["Aspirador", "Bicicleta", "Bola", "Cafeteira", "Clean Code"]);
  checa("nome: Luminária antes de Monitor", f.ordenarPor(produtos, "nome").map((p) => p.nome).slice(7, 9), ["Luminária", 'Monitor 27"']);
  checa("estoque decrescente", f.ordenarPor(produtos, "estoque", { crescente: false }).map((p) => p.estoque), [40, 22, 15, 12, 9, 7, 6, 5, 4, 3, 2, 1, 0, 0]);
  checa("favorito crescente (false primeiro)", f.ordenarPor(produtos, "favorito").map((p) => p.favorito), [...Array(10).fill(false), ...Array(4).fill(true)]);
  checa("array é novo", f.ordenarPor(produtos, "preco") !== produtos, true);
  checa("objetos são as mesmas referências", f.ordenarPor(produtos, "preco")[0] === produtos[6], true);
});

console.log(`\n${"─".repeat(46)}`);
if (falhou === 0 && pulou === 0) console.log(`🎉 Tudo certo! ${ok} testes passaram.`);
else console.log(`${ok} passaram · ${falhou} falharam · ${pulou} exercício(s) ainda não implementado(s)`);
