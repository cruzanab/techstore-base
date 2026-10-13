const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = String(codigo ?? '').trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false }
  }

  // O cupom PRIMEIRACOMPRA vale para qualquer cliente. O histórico de compras
  // não deve impedir o uso do desconto.
  return { valido: true, desconto }
}
