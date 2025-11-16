# Requisitos funcionais

## Usuário
Requisito 001
Login
Usuário precisa conseguir logar no sistema, a partir de um usuário e senha


## Produto
Requisito 003
Cadastro de produto
O sistema deve permitir cadastrar os novos produtos adquiridos pela empresa.

Requisito 004
Visualizar produto
O sistema deve permitir visualizar todos os produtos que estiverem cadastrados, assim como a quantidade disponível em estoque.

Requisito 005
Gerenciar Produto
O sistema deve permitir adicionar ou remover a quantidade de produtos cadastrados no estoque

Requisito 006
Controle de Estoque (Mínimo)
O sistema deve permitir cadastrar uma quantidade mínima de produtos

Requisito 007
Alerta de nível de estoque
O sistema deve exibir um aviso para o usuário, informando quando o estoque do produto estiver chegando a um nível crítico, definido de acordo com o produto em questão

## Administrador
Requisito 008
Histórico de movimentações
O sistema deve permitir verificar o histórico de movimentações realizadas dentro do sistema, exibindo todas as transações realizadas (cadastro de produtos, adição de estoque, remoção de estoque).
O histórico deve conter qual produto foi alterado, qual foi o usuário que fez a alteração, a data da alteração e a quantidade de produtos que foi alterada.



# Conectar ao banco criado antes de criar as tabelas:
CREATE DATABASE saep_db;

-- Tabela de Login
```
CREATE TABLE login (
    id_login SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL
);
```
-- Tabela de Cliente
```
CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(11),
    nome VARCHAR(100)
);
```

-- Tabela de Produto
```
CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco_unit DECIMAL(10,2) NOT NULL,
    quantidade NUMERIC NOT NULL,
    qtd_minima NUMERIC NOT NULL,
    qtd_maxima NUMERIC NOT NULL
);
```

-- Tabela de Histórico
```
CREATE TABLE historico (
    id_historico SERIAL PRIMARY KEY,
    fk_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    tipo_movimentacao VARCHAR(100) NOT NULL,
    qtd_movimentada NUMERIC NOT NULL,
    custo_total DECIMAL(10,2) NOT NULL,
    fk_usuario INT NOT NULL REFERENCES login(id_login) ON DELETE CASCADE,
    data_movimentacao DATE NOT NULL
);
```
## Inserindo os dados nas tabelas
```
insert into login(email, senha)
values('usuario@teste.com', 'senai103@'),
('administrador@teste.com', 'senai103@'),
('cliente@teste.com', 'senai103@');

insert into cliente(email, telefone, nome)
values('cliente1@teste.com', '11912345678', 'Jorge'),
('cliente2@teste.com', '11987654321', 'Patrício'),
('cliente3@teste.com', '11911223344', 'Ana Carolina');

INSERT INTO produto (nome, preco_unit, quantidade, qtd_minima, qtd_maxima)
VALUES
('Teclado Mecânico Redragon', 349.90, 15, 5, 50),
('Mouse Logitech G203', 249.90, 45, 10, 100),
('Monitor Gamer AOC 27"', 1999.00, 13, 5, 30),
('Cabo HDMI 2.0 2m', 99.90, 20, 10, 100),
('Headset HyperX Cloud Stinger', 499.00, 9, 5, 40);

INSERT INTO historico (fk_produto, tipo_movimentacao, qtd_movimentada, custo_total, fk_usuario, data_movimentacao)
VALUES
-- Entradas (compras ou reposições de estoque)
(1, 'entrada', 20, 6998.00, 2, '2025-11-01'),  -- Teclado Mecânico
(2, 'entrada', 50, 12495.00, 2, '2025-11-02'), -- Mouse Logitech
(3, 'entrada', 15, 29985.00, 2, '2025-11-02'), -- Monitor Gamer
(4, 'entrada', 30, 2997.00, 2, '2025-11-03'),  -- Cabo HDMI
(5, 'entrada', 10, 4990.00, 2, '2025-11-03'),  -- Headset

-- Saídas (vendas para clientes)
(1, 'saida', 3, 1049.70, 1, '2025-11-03'),  -- venda de teclados
(2, 'saida', 5, 1249.50, 1, '2025-11-03'),  -- venda de mouses
(3, 'saida', 2, 3998.00, 3, '2025-11-03'),  -- venda de monitores
(4, 'saida', 10, 999.00, 1, '2025-11-03'),  -- venda de cabos
(5, 'saida', 1, 499.00, 3, '2025-11-03');   -- venda de headset
```
