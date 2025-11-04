from flask import Flask, request, jsonify
import psycopg2
import psycopg2.extras
from flask_cors import CORS  # importar CORS

from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from models import db, Produto, Historico
import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

db.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})

with app.app_context():
    db.create_all()


# Configuração do banco de dados PostgreSQL
db_config = {
    'host': 'localhost',
    'dbname': 'saep_db',
    'user': 'postgres',
    'password': 'senai103',
    'port': 5432
}

@app.route('/login', methods=['POST'])
def verificar_login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    if not email or not senha:
        return jsonify({'detail': 'Informe email e senha'}), 400

    try:
        conexao = psycopg2.connect(**db_config)
        cursor = conexao.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = "SELECT * FROM login WHERE email = %s AND senha = %s"
        cursor.execute(query, (email, senha))
        usuario = cursor.fetchone()

        cursor.close()
        conexao.close()

        if usuario:
            return jsonify({'msg': 'Usuário verificado com sucesso', 'id_login': usuario['id_login']}), 200
        else:
            return jsonify({'detail': 'Email ou senha incorretos'}), 401

    except Exception as e:
        print("Erro:", e)
        return jsonify({'detail': 'Erro no servidor'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)  # porta 8000 para combinar com seu fetch


# app.py

# ——— Endpoints para Produto ———

@app.route('/produtos', methods=['GET'])
def get_produtos():
    produtos = Produto.query.all()
    return jsonify([p.to_dict() for p in produtos]), 200

@app.route('/produtos/<int:id_produto>', methods=['GET'])
def get_produto(id_produto):
    p = Produto.query.get_or_404(id_produto)
    return jsonify(p.to_dict()), 200

@app.route('/produtos', methods=['POST'])
def create_produto():
    data = request.get_json()
    try:
        novo = Produto(
            nome = data['nome'],
            quantidade_min = data['quantidade_min'],
            quantidade = data['quantidade'],
            quantidade_max = data['quantidade_max'],
            preco_unit = data['preco_unit']
        )
        db.session.add(novo)
        db.session.commit()
        return jsonify(novo.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

# @app.route('/produtos/<int:id_produto>', methods=['PUT'])
# def update_produto(id_produto):
#     data = request.get_json()
#     p = Produto.query.get_or_404(id_produto)
#     try:
#         p.nome = data.get('nome', p.nome)
#         p.quantidade_min = data.get('quantidade_min', p.quantidade_min)
#         p.quantidade = data.get('quantidade', p.quantidade)
#         p.quantidade_max = data.get('quantidade_max', p.quantidade_max)
#         p.preco_unit = data.get('preco_unit', p.preco_unit)
#         db.session.commit()
#         return jsonify(p.to_dict()), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# @app.route('/produtos/<int:id_produto>', methods=['DELETE'])
# def delete_produto(id_produto):
#     p = Produto.query.get_or_404(id_produto)
#     try:
#         db.session.delete(p)
#         db.session.commit()
#         return jsonify({'message': 'Produto deletado'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400

# # ——— Endpoint para histórico / movimentações ———

# @app.route('/historico', methods=['GET'])
# def get_historico():
#     registros = Historico.query.all()
#     return jsonify([h.to_dict() for h in registros]), 200

# if __name__ == '__main__':
#     app.run(debug=True, port=8000)
