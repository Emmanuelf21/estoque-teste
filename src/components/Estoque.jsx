import React, { useEffect } from 'react'

const Estoque = () => {
    useEffect(() => {

    }, [])
    return (
        <div className='container-tabelas'>
            <section className='secao-produtos'>
                <table className='tabela-produtos'>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>Quantidade mínima</td>
                            <td>Quantidade</td>
                            <td>Quantidade máxima</td>
                            <td>Preço unitário</td>
                            <td>Ações</td>
                        </tr>
                    </thead>
                    <tbody>
                        {/* loop com os produtos */}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td> {/* botões de editar e deletar */}
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className='secao-movimentacao'>
                <h2>Movimentações</h2>
                <table className='tabela-movimentacao'>
                    <thead>
                        <tr>
                            <td>Produto</td>
                            <td>Cliente</td>
                            <td>Quantidade</td>
                            <td>Movimentação</td> {/* entrada ou saída */}
                            <td>Data</td>
                            <td>Contato</td>
                            <td>Custo Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {/* loop com as movimentações */}
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
            </section>

        </div>
    )
}

export default Estoque