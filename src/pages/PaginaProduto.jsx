import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemInteresse, setMensagemInteresse] = useState('')
  const [mensagemCarrinho, setMensagemCarrinho] = useState('')

  useEffect(() => {
    if (!mensagemCarrinho) return

    const temporizador = setTimeout(() => setMensagemCarrinho(''), 1600)
    return () => clearTimeout(temporizador)
  }, [mensagemCarrinho])

  const handleAdicionarCarrinho = () => {
    onAdicionar(produto)
    setMensagemCarrinho(`${produto.title} adicionado ao carrinho!`)
  }

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const relacionados = produtos
    .filter(
      (item) =>
        item.category === produto.category &&
        item.id !== produto.id &&
        typeof item?.price === 'number' &&
        !Number.isNaN(item.price) &&
        item.estoque > 0
    )
    .slice(0, 4)

  const semEstoque = produto.estoque === 0

  function handleRegistrarInteresse(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      setMensagemInteresse('Preencha nome e e-mail para receber a notificação.')
      return
    }

    onRegistrarInteresse(produto.id, { nome, email })
    setNome('')
    setEmail('')
    setMensagemInteresse(`Tudo certo, ${nome}! Você será avisado quando ${produto.title} voltar.`)
  }

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">R$ {produto.price.toFixed(2).replace('.', ',')}</p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {semEstoque ? (
            <form className="avise-me" onSubmit={handleRegistrarInteresse}>
              <label className="rotulo" htmlFor="nome-avise-me">
                Nome
              </label>
              <input
                id="nome-avise-me"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
              />

              <label className="rotulo" htmlFor="email-avise-me">
                E-mail
              </label>
              <input
                id="email-avise-me"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="seu@email.com"
              />

              <button className="botao botao-grande botao-secundario" type="submit">
                Avise-me
              </button>

              {mensagemInteresse && <p className="mensagem-avise-me">{mensagemInteresse}</p>}
            </form>
          ) : (
            <>
              <button className="botao botao-grande" onClick={handleAdicionarCarrinho}>
                Adicionar ao carrinho
              </button>
              {mensagemCarrinho && (
                <p className="mensagem-card" aria-live="polite">
                  {mensagemCarrinho}
                </p>
              )}
            </>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <ProdutoCard key={item.id} produto={item} onAdicionar={onAdicionar} />
        ))}
      </div>
    </section>
  )
}
