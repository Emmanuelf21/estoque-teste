# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Produto(db.Model):
    __tablename__ = 'produto'
    id_produto = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String, nullable=False)
    quantidade_min = db.Column(db.Integer, nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    quantidade_max = db.Column(db.Integer, nullable=False)
    preco_unit = db.Column(db.Numeric(12,2), nullable=False)

    def to_dict(self):
        return {
            'id_produto': self.id_produto,
            'nome': self.nome,
            'quantidade_min': self.quantidade_min,
            'quantidade': self.quantidade,
            'quantidade_max': self.quantidade_max,
            'preco_unit': float(self.preco_unit)
        }

class Historico(db.Model):
    __tablename__ = 'historico'
    id_historico = db.Column(db.Integer, primary_key=True)
    # supondo: produto_id, cliente_id, quantidade, tipo_movimentacao, data, contato, custo_total
    produto_id = db.Column(db.Integer, nullable=False)
    cliente = db.Column(db.String, nullable=True)
    quantidade = db.Column(db.Integer, nullable=False)
    tipo_movimentacao = db.Column(db.String, nullable=False)
    data = db.Column(db.DateTime, nullable=False)
    contato = db.Column(db.String, nullable=True)
    custo_total = db.Column(db.Numeric(12,2), nullable=False)

    def to_dict(self):
        return {
            'id_historico': self.id_historico,
            'produto_id': self.produto_id,
            'cliente': self.cliente,
            'quantidade': self.quantidade,
            'tipo_movimentacao': self.tipo_movimentacao,
            'data': self.data.isoformat(),
            'contato': self.contato,
            'custo_total': float(self.custo_total)
        }
