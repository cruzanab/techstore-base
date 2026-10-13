import { Link } from 'react-router'
import { formatarPreco } from '../utils/formatarPreco'

export default function SugestaoItem({ produto, onAdicionar }) {
  const precoValido = Number.isFinite(Number(produto.price))

  return (
    <div className="sugestao">
      <Link to={`/produto/${produto.id}`} className="card-link">
        <div className="sugestao-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="sugestao-imagem" />
        </div>
      </Link>

      <div className="sugestao-info">
        <Link to={`/produto/${produto.id}`} className="card-link">
          <p className="sugestao-titulo">{produto.title}</p>
        </Link>
        <p className="preco preco-pequeno">
          {precoValido ? formatarPreco(produto.price) : 'Preço indisponível'}
        </p>
      </div>

      <button
        className="botao botao-pequeno"
        onClick={() => onAdicionar(produto)}
        disabled={!precoValido}
      >
        {precoValido ? 'Comprar' : 'Indisponível'}
      </button>
    </div>
  )
}
