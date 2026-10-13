import { useState } from 'react'
import { Link, useParams } from 'react-router'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarInteresse }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemInteresse, setMensagemInteresse] = useState('')

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
            <button className="botao botao-grande" onClick={() => onAdicionar(produto)}>
              Adicionar ao carrinho
            </button>
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
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
