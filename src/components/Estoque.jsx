import React, { useEffect, useState } from 'react'
import './Estoque.css'

const Estoque = () => {
    const [produtos, setProdutos] = useState([])
    const [movimentacoes, setMovimentacoes] = useState([])

    const [form, setForm] = useState({
        nome: '',
        qtd_min: '',
        qtd: '',
        qtd_max: '',
        preco: ''
    })
    const [editId, setEditId] = useState(null)
    const fetchHistorico = async () => {
    const fetchHistorico = async () => {
        try {
            const res = await fetch("http://localhost:5000/movimentacoes")
            const data = await res.json()
            setMovimentacoes(data)
        } catch (err) {
            console.error("Erro ao carregar histórico: ", err)
        }
    }
    // 🔹 Carregar produtos
    const fetchProdutos = async () => {
        try {
            const res = await fetch("http://localhost:5000/produtos")
            const data = await res.json()
            setProdutos(data)
        } catch (err) {
            console.error("Erro ao carregar produtos:", err)
        }
    }

    useEffect(() => {
        fetchProdutos()
        fetchHistorico()
    }, [])

    // 🔹 Atualizar formulário
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // 🔹 Criar ou editar produto
    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editId
            ? `http://localhost:5000/produtos/${editId}`
            : "http://localhost:5000/produtos"
        const method = editId ? "PUT" : "POST"

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.nome,
                    preco: parseFloat(form.preco),
                    qtd: parseInt(form.qtd),
                    qtd_min: parseInt(form.qtd_min),
                    qtd_max: parseInt(form.qtd_max)
                })
            })

            if (res.ok) {
                setForm({ nome: '', qtd_min: '', qtd: '', qtd_max: '', preco: '' })
                setEditId(null)
                fetchProdutos()
            } else {
                const errData = await res.json()
                alert(`Erro: ${errData.error || 'Falha ao salvar produto'}`)
            }
        } catch (err) {
            console.error("Erro ao salvar produto:", err)
        }
    }

    // 🔹 Editar produto
    const handleEdit = (p) => {
        setForm({
            nome: p.nome,
            qtd_min: p.qtd_min,
            qtd: p.qtd,
            qtd_max: p.qtd_max,
            preco: p.preco
        })
        setEditId(p.id)
    }

    // 🔹 Deletar produto
    const handleDelete = async (id) => {
        if (window.confirm("Deseja realmente deletar este produto?")) {
            try {
                const res = await fetch(`http://localhost:5000/produtos/${id}`, { method: "DELETE" })
                if (res.ok) fetchProdutos()
                else alert("Erro ao deletar produto")
            } catch (err) {
                console.error("Erro ao deletar produto:", err)
            }
        }
    }
    // Novo estado
    const [formMov, setFormMov] = useState({
        fk_produto: '',
        tipo_movimentacao: 'entrada',
        qtd_movimentada: '',
        custo_total: '',
        fk_usuario: 1 // Exemplo — pode vir do login do usuário
    })

    // Atualizar campos do formulário de movimentação
    const handleChangeMov = (e) => {
        setFormMov({ ...formMov, [e.target.name]: e.target.value })
    }

    // Enviar movimentação
    const handleSubmitMovimentacao = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:5000/movimentacoes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fk_produto: parseInt(formMov.fk_produto),
                    tipo_movimentacao: formMov.tipo_movimentacao,
                    qtd_movimentada: parseFloat(formMov.qtd_movimentada),
                    custo_total: parseFloat(formMov.custo_total),
                    fk_usuario: formMov.fk_usuario,
                    data_movimentacao: new Date().toISOString().split("T")[0]
                })
            })

            if (res.ok) {
                alert("Movimentação registrada com sucesso!")
                setFormMov({ fk_produto: '', tipo_movimentacao: 'entrada', qtd_movimentada: '', custo_total: '', fk_usuario: 1 })
                fetchHistorico()
                fetchProdutos()
            } else {
                const err = await res.json()
                alert(`Erro ao registrar movimentação: ${err.error || res.statusText}`)
            }
        } catch (error) {
            console.error("Erro ao salvar movimentação:", error)
        }
    }

    return (
        <div className="estoque-container">
            <section className="secao-produtos">
                <h2>📦 Controle de Estoque</h2>

                <form className="form-produto" onSubmit={handleSubmit}>
                    <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
                    <input name="qtd_min" type="number" placeholder="Qtd mínima" value={form.qtd_min} onChange={handleChange} required />
                    <input name="qtd" type="number" placeholder="Quantidade" value={form.qtd} onChange={handleChange} required />
                    <input name="qtd_max" type="number" placeholder="Qtd máxima" value={form.qtd_max} onChange={handleChange} required />
                    <input name="preco" type="number" step="0.01" placeholder="Preço unitário" value={form.preco} onChange={handleChange} required />
                    <button type="submit">{editId ? "Atualizar" : "Adicionar"}</button>
                </form>

                {/* 📋 Tabela de produtos */}
                <table className="tabela-produtos">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Produto</th>
                            <th>Qtd Min</th>
                            <th>Qtd</th>
                            <th>Qtd Max</th>
                            <th>Preço</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map((p, index) => (
                            <tr
                                key={p.id}
                                className={Number(p.qtd) <= Number(p.qtd_min) ? 'estoque-baixo' : ''}
                            >
                                <td>{index + 1}</td>
                                <td>{p.nome}</td>
                                <td>{p.qtd_min}</td>
                                <td>{p.qtd}</td>
                                <td>{p.qtd_max}</td>
                                <td>R$ {Number(p.preco).toFixed(2)}</td>
                                <td>
                                    {Number(p.qtd) <= Number(p.qtd_min)
                                        ? <span className="alerta">⚠️ Estoque baixo</span>
                                        : <span className="ok">✅ OK</span>}
                                </td>
                                <td>
                                    <button className="btn-editar" onClick={() => handleEdit(p)}>Editar</button>
                                    <button className="btn-deletar" onClick={() => handleDelete(p.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* 🧾 Tabela de movimentações (mantida e estilizada, mas sem lógica ainda) */}
            <section className="secao-movimentacao">
                <h2>📊 Movimentações</h2>
                <form className="form-movimentacao" onSubmit={handleSubmitMovimentacao}>
                    <select name="fk_produto" value={formMov.fk_produto} onChange={handleChangeMov} required>
                        <option value="">Selecione um produto</option>
                        {produtos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>

                    <select name="tipo_movimentacao" value={formMov.tipo_movimentacao} onChange={handleChangeMov}>
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                    </select>

                    <input
                        name="qtd_movimentada"
                        type="number"
                        step="1"
                        placeholder="Quantidade"
                        value={formMov.qtd_movimentada}
                        onChange={handleChangeMov}
                        required
                    />

                    <input
                        name="custo_total"
                        type="number"
                        step="0.01"
                        placeholder="Custo total"
                        value={formMov.custo_total}
                        onChange={handleChangeMov}
                        required
                    />

                    <button type="submit">Registrar</button>
                </form>
                <table className="tabela-movimentacao">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Usuário</th>
                            <th>Quantidade</th>
                            <th>Movimentação</th>
                            <th>Data</th>
                            <th>Custo Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.length > 0 ? (
                            movimentacoes.map((m, index) => (
                                <tr key={m.id}>
                                    <td>{m.produto}</td>
                                    <td>{m.usuario}</td>
                                    <td>{m.quantidade}</td>
                                    <td
                                        style={{
                                            color: m.movimentacao.toLowerCase() === "entrada" ? "green" : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {m.movimentacao}
                                    </td>
                                    <td>{m.data}</td>
                                    <td>R$ {Number(m.custo_total).toFixed(2)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                                    Nenhuma movimentação registrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

        </div>
    )
}
}

export default Estoque
