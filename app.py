from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import psycopg2.extras

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

DB_USER = 'postgres'
DB_PASS = 'senai103'
DB_HOST = 'localhost'
DB_NAME = 'saep_db'
DB_PORT = '5432'

def get_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        senha = data.get('senha')

        # checagem básica
        if not email or not senha:
            return jsonify({'detail': 'Email e senha são obrigatórios'}), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id_login, email
            FROM login
            WHERE email = %s AND senha = %s
        """, (email, senha))

        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if user:
            return jsonify({'msg': 'Login efetuado com sucesso'}), 200
        else:
            return jsonify({'detail': 'Usuário ou senha inválidos'}), 401

    except Exception as e:
        print("❌ ERRO NO LOGIN:", e)  # <-- aparece no terminal Flask
        return jsonify({'detail': 'Erro interno no servidor', 'erro': str(e)}), 500

@app.route('/movimentacoes', methods=['GET'])
def listar_movimentacoes():
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cursor.execute("""
            SELECT 
                h.id_historico AS id,
                p.nome AS produto,
                l.email AS usuario,
                h.qtd_movimentada AS quantidade,
                h.tipo_movimentacao AS movimentacao,
                TO_CHAR(h.data_movimentacao, 'DD/MM/YYYY') AS data,
                h.custo_total
            FROM historico h
            JOIN produto p ON p.id_produto = h.fk_produto
            JOIN login l ON l.id_login = h.fk_usuario
            ORDER BY h.data_movimentacao DESC;
        """)

        movimentacoes = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(movimentacoes), 200

    except Exception as e:
        print("❌ ERRO AO LISTAR MOVIMENTAÇÕES:", e)
        return jsonify({'error': 'Erro ao buscar movimentações', 'detalhes': str(e)}), 500

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cursor.execute("""
            SELECT 
                id_produto AS id,
                nome,
                preco_unit AS preco,
                quantidade AS qtd,
                qtd_minima AS qtd_min,
                qtd_maxima AS qtd_max                
            FROM produto
        """)
        produtos = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(produtos), 200

    except Exception as e:
        print("❌ ERRO AO LISTAR FILMES:", e)
        return jsonify({'error': 'Erro ao buscar produtos', 'detalhes': str(e)}), 500

@app.route('/produtos', methods=['POST'])
def criar_produto():
    try:
        data = request.get_json()
        nome = data.get('nome')
        preco = data.get('preco')
        qtd = data.get('qtd')
        qtd_min = data.get('qtd_min')
        qtd_max = data.get('qtd_max')

        if not nome or preco is None:
            return jsonify({'error': 'Nome e preço são obrigatórios'}), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO produto (nome, preco_unit, quantidade, qtd_minima, qtd_maxima)
            VALUES (%s, %s, %s, %s, %s)
        """, (nome, preco, qtd, qtd_min, qtd_max))

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'msg': 'Produto criado com sucesso'}), 201

    except Exception as e:
        print("❌ ERRO AO CRIAR PRODUTO:", e)
        return jsonify({'error': 'Erro ao criar produto', 'detalhes': str(e)}), 500

# ==========================================================
# 🔹 PUT - Atualizar produto existente
# ==========================================================
@app.route('/produtos/<int:id_produto>', methods=['PUT'])
def atualizar_produto(id_produto):
    try:
        data = request.get_json()
        nome = data.get('nome')
        preco = data.get('preco')
        qtd = data.get('qtd')
        qtd_min = data.get('qtd_min')
        qtd_max = data.get('qtd_max')

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE produto
            SET nome = %s,
                preco_unit = %s,
                quantidade = %s,
                qtd_minima = %s,
                qtd_maxima = %s
            WHERE id_produto = %s
        """, (nome, preco, qtd, qtd_min, qtd_max, id_produto))

        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Produto não encontrado'}), 404

        cursor.close()
        conn.close()

        return jsonify({'msg': 'Produto atualizado com sucesso'}), 200

    except Exception as e:
        print("❌ ERRO AO ATUALIZAR PRODUTO:", e)
        return jsonify({'error': 'Erro ao atualizar produto', 'detalhes': str(e)}), 500


# ==========================================================
# 🔹 DELETE - Excluir produto
# ==========================================================
@app.route('/produtos/<int:id_produto>', methods=['DELETE'])
def excluir_produto(id_produto):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM produto WHERE id_produto = %s", (id_produto,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'error': 'Produto não encontrado'}), 404

        cursor.close()
        conn.close()

        return jsonify({'msg': 'Produto excluído com sucesso'}), 200

    except Exception as e:
        print("❌ ERRO AO EXCLUIR PRODUTO:", e)
        return jsonify({'error': 'Erro ao excluir produto', 'detalhes': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)