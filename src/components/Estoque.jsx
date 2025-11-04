import React, { useEffect, useState } from 'react'

const Estoque = () => {
    const [produtos, setProdutos] = useState([])
    const [form, setForm] = useState({
        nome: '',
        quantidade_min: '',
        quantidade: '',
        quantidade_max: '',
        preco_unit: ''
    })
    const [editId, setEditId] = useState(null)

    // Carregar produtos
    const fetchProdutos = async () => {
        const res = await fetch("http://localhost:8000/produtos")
        const data = await res.json()
        setProdutos(data)
    }

    useEffect(() => {
        fetchProdutos()
    }, [])

    // Atualizar formulário
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Criar ou editar produto
    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = editId ? `http://localhost:8000/produtos/${editId}` : "http://localhost:8000/produtos"
        const method = editId ? "PUT" : "POST"
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                quantidade_min: Number(form.quantidade_min),
                quantidade: Number(form.quantidade),
                quantidade_max: Number(form.quantidade_max),
                preco_unit: parseFloat(form.preco_unit)
            })
        })
        if (res.ok) {
            setForm({ nome:'', quantidade_min:'', quantidade:'', quantidade_max:'', preco_unit:'' })
            setEditId(null)
            fetchProdutos()
        } else {
            alert("Erro ao salvar produto")
        }
    }

    // Editar produto
    const handleEdit = (p) => {
        setForm({
            nome: p.nome,
            quantidade_min: p.quantidade_min,
            quantidade: p.quantidade,
            quantidade_max: p.quantidade_max,
            preco_unit: p.preco_unit
        })
        setEditId(p.id_produto)
    }

    // Deletar produto
    const handleDelete = async (id) => {
        if (window.confirm("Deseja realmente deletar?")) {
            const res = await fetch(`http://localhost:8000/produtos/${id}`, { method: "DELETE" })
            if (res.ok) fetchProdutos()
        }
    }

    return (
        <div className='container-tabelas'>
            <section className='secao-produtos'>
                <h2>Produtos</h2>
                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
                    <input name="quantidade_min" type="number" placeholder="Quantidade mínima" value={form.quantidade_min} onChange={handleChange} required />
                    <input name="quantidade" type="number" placeholder="Quantidade" value={form.quantidade} onChange={handleChange} required />
                    <input name="quantidade_max" type="number" placeholder="Quantidade máxima" value={form.quantidade_max} onChange={handleChange} required />
                    <input name="preco_unit" type="number" step="0.01" placeholder="Preço unitário" value={form.preco_unit} onChange={handleChange} required />
                    <button type="submit">{editId ? "Atualizar" : "Adicionar"}</button>
                </form>

                <table className='tabela-produtos'>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>Qtd Min</td>
                            <td>Qtd</td>
                            <td>Qtd Max</td>
                            <td>Preço</td>
                            <td>Ações</td>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(p => (
                            <tr key={p.id_produto}>
                                <td>{p.nome}</td>
                                <td>{p.quantidade_min}</td>
                                <td>{p.quantidade}</td>
                                <td>{p.quantidade_max}</td>
                                <td>{p.preco_unit}</td>
                                <td>
                                    <button onClick={() => handleEdit(p)}>Editar</button>
                                    <button onClick={() => handleDelete(p.id_produto)}>Deletar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            {/* <section className='secao-movimentacao'>
                <h2>Movimentações</h2>
                <table className='tabela-movimentacao'>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>Cliente</td>
                            <td>Quantidade</td>
                            <td>Movimentação</td> 
                            <td>Data</td>
                            <td>Contato</td>
                            <td>Custo Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </section> */}
        </div>
    )
}

export default Estoque