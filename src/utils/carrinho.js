// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array

export function normalizarPreco(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return null
  }

  const texto = String(valor).trim().replace(/\s+/g, '')

  if (!texto || texto === 'null' || texto === 'undefined') {
    return null
  }

  let valorNumerico = texto

  if (texto.includes(',') && texto.includes('.')) {
    valorNumerico = texto.replace(/\./g, '').replace(',', '.')
  } else if (texto.includes(',')) {
    valorNumerico = texto.replace(',', '.')
  }

  const numero = Number(valorNumerico)
  return Number.isFinite(numero) ? numero : null
}

export function produtoDisponivelParaVenda(produto) {
  if (!produto) return false
  return normalizarPreco(produto.price) !== null && produto.estoque > 0
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    const preco = normalizarPreco(produto.price)
    return total + (preco ?? 0)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    if (!produtoDisponivelParaVenda(produto)) return

    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
