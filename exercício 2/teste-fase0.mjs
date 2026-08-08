import { produtos } from "./produtos.mjs";
import { resumo, aplicarDesconto } from "./minhas-funcoes.mjs";

// ---------- mini framework de teste ----------
let ok = 0, falhou = 0;
const perto = (a, b, tol = 1e-6) =>
  typeof a === "number" && typeof b === "number" && Math.abs(a - b) < tol;

function igual(a, b) {
  if (perto(a, b)) return true;
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => igual(a[k], b[k]));
}

function checa(nome, recebido, esperado) {
  if (igual(recebido, esperado)) {
    ok++; console.log(`  ✅ ${nome}`);
  } else {
    falhou++;
    console.log(`  ❌ ${nome}`);
    console.log(`     esperado: ${JSON.stringify(esperado)}`);
    console.log(`     recebido: ${JSON.stringify(recebido)}`);
  }
}

// ---------- 1) resumo(produtos) ----------
console.log("\n[1] resumo(produtos)");
const r = resumo(produtos);
checa("quantidade", r.quantidade, 14);
checa("total", r.total, 24776.69);
checa("media", r.media, 1769.7635714285714);
checa("maisCaro", r.maisCaro, { id: 3, nome: "PC Gamer", categoria: "Eletronicos", preco: 12000 });
checa("maisBarato", r.maisBarato, { id: 7, nome: "Bola", categoria: "Esportes", preco: 15 });
checa("porCategoria", r.porCategoria, {
  "Eletronicos": 21600,
  "Esportes": 1404.9,
  "Casa": 1295.49,
  "Livros": 476.3,
});

// ---------- 2) resumo com sublista ----------
console.log("\n[2] resumo(apenas Eletronicos)");
const eletro = produtos.filter((p) => p.categoria === "Eletronicos");
const re = resumo(eletro);
checa("quantidade", re.quantidade, 5);
checa("total", re.total, 21600);
checa("media", re.media, 4320);
checa("maisCaro.nome", re.maisCaro.nome, "PC Gamer");
checa("maisBarato.nome", re.maisBarato.nome, "Teclado Mecânico");
checa("porCategoria", re.porCategoria, { "Eletronicos": 21600 });

// ---------- 3) resumo([]) — caso de borda ----------
console.log("\n[3] resumo([]) — não pode quebrar nem dividir por zero");
const rv = resumo([]);
checa("quantidade", rv.quantidade, 0);
checa("total", rv.total, 0);
checa("media", rv.media, 0);
checa("maisCaro", rv.maisCaro, null);
checa("maisBarato", rv.maisBarato, null);
checa("porCategoria", rv.porCategoria, {});

// ---------- 4) aplicarDesconto ----------
console.log("\n[4] aplicarDesconto(produtos, 10)");
const antes = JSON.stringify(produtos);
const d10 = aplicarDesconto(produtos, 10);
checa("preços", d10.map((p) => p.preco), [
  1170, 5400, 10800, 1665, 405, 1080, 13.5, 170.91,
  288, 809.991, 67.95, 119.16, 88.2, 221.31,
]);
checa("mantém nome do 1º", d10[0].nome, "RTX 2060");
checa("mantém id do 1º", d10[0].id, 1);
checa("mantém categoria do 1º", d10[0].categoria, "Eletronicos");

console.log("\n[5] imutabilidade — o teste que mais importa");
checa("array original intacto", JSON.stringify(produtos), antes);
checa("retornou um array NOVO", d10 !== produtos, true);
checa("retornou objetos NOVOS", d10[0] !== produtos[0], true);

console.log("\n[6] outros percentuais");
checa("0%",   aplicarDesconto(produtos, 0).map((p) => p.preco).slice(0, 4),   [1300, 6000, 12000, 1850]);
checa("25%",  aplicarDesconto(produtos, 25).map((p) => p.preco).slice(0, 4),  [975, 4500, 9000, 1387.5]);
checa("100%", aplicarDesconto(produtos, 100).map((p) => p.preco).slice(0, 4), [0, 0, 0, 0]);
checa("lista vazia", aplicarDesconto([], 10), []);

console.log("\n[7] composição — as duas funções juntas");
checa("total após 10% off", resumo(aplicarDesconto(produtos, 10)).total, 22299.021);

// ---------- resultado ----------
console.log(`\n${"─".repeat(40)}`);
console.log(falhou === 0 ? `🎉 Tudo certo! ${ok}/${ok} testes passaram.` : `${ok} passaram, ${falhou} falharam.`);
