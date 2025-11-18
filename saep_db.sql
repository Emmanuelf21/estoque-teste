-- Database: saep_db

-- DROP DATABASE IF EXISTS saep_db;

CREATE DATABASE saep_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE login (
    id_login SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(11),
    nome VARCHAR(100)
);

CREATE TABLE produto (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco_unit DECIMAL(10,2) NOT NULL,
    quantidade NUMERIC NOT NULL,
    qtd_minima NUMERIC NOT NULL,
    qtd_maxima NUMERIC NOT NULL
);

CREATE TABLE historico (
    id_historico SERIAL PRIMARY KEY,
    fk_produto INT NOT NULL REFERENCES produto(id_produto) ON DELETE CASCADE,
    tipo_movimentacao VARCHAR(100) NOT NULL,
    qtd_movimentada NUMERIC NOT NULL,
    custo_total DECIMAL(10,2) NOT NULL,
    fk_usuario INT NOT NULL REFERENCES login(id_login) ON DELETE CASCADE,
    data_movimentacao DATE NOT NULL
);

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