import {produtos} from './produtos.mjs';

//{ quantidade, total, media, maisCaro, maisBarato, porCategoria }
export function resumo(lista) {
  const result = lista.reduce((acc,e) =>{
    acc.quantidade++;
    acc.total += e.preco;
    if(!acc.maisCaro ||acc.maisCaro.preco < e.preco) acc.maisCaro = e;
    if(!acc.maisBarato ||acc.maisBarato.preco > e.preco)acc.maisBarato = e;
    acc.porCategoria[e.categoria] = (acc.porCategoria[e.categoria] ?? 0) + e.preco;
    return acc;
  },{
      quantidade: 0,
      media: 0,
      total: 0,
      maisCaro: null,
      maisBarato: null,
      porCategoria: {}
    })
  result.media = result.quantidade ? result.total/result.quantidade : 0;
  return result;
}

export function aplicarDesconto(lista, pct) {
    return lista.map(x =>
          ({
              ...x,
              preco: x.preco * (1-pct/100)
          })
    )
}

console.log(resumo(produtos));