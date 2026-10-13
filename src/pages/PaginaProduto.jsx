import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ProdutoCard from '../components/ProdutoCard'

export default function PaginaProduto({ produtos, onAdicionar, onAdicionarListaEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const precoValido = produto ? Number.isFinite(Number(produto.price)) : false
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagemEspera, setMensagemEspera] = useState('')

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
    .filter((item) => item.category === produto.category && item.id !== produto.id)
    .slice(0, 4)

  function enviarListaEspera(evento) {
    evento.preventDefault()

    if (!nome.trim() || !email.trim()) {
      return
    }

    onAdicionarListaEspera({ produtoId: produto.id, nome: nome.trim(), email: email.trim() })
    setNome('')
    setEmail('')
    setMensagemEspera('Você foi adicionado à lista de espera.')
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
          <p className="detalhe-preco">
            {precoValido ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}` : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">{produto.estoque} unidades disponíveis</p>

          {!precoValido && (
            <p className="aviso aviso-erro" style={{ marginBottom: '1rem' }}>
              Produto temporariamente indisponível: o preço está sendo definido pelo time de suprimentos.
            </p>
          )}

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={produto.estoque === 0 || !precoValido}
          >
            {precoValido ? 'Adicionar ao carrinho' : 'Preço em atualização'}
          </button>

          {produto.estoque === 0 && (
            <form onSubmit={enviarListaEspera} className="cupom" style={{ marginTop: '1rem' }}>
              <label className="rotulo">Avise-me quando voltar</label>
              <input
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                placeholder="Seu nome"
                style={{ marginBottom: '0.5rem' }}
              />
              <input
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                placeholder="Seu e-mail"
                style={{ marginBottom: '0.5rem' }}
              />
              <button type="submit" className="botao botao-secundario">
                Quero receber aviso
              </button>
              {mensagemEspera && <p className="mensagem-cupom">{mensagemEspera}</p>}
            </form>
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
