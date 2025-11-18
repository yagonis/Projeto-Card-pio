const express = require('express');
const { PrismaClient } = require('@prisma/client'); // Importa o Prisma
const cors = require('cors'); //Importa o CORS

const app = express();
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient(); // Instancia o cliente
app.use(express.json());

// ... (configuração de CORS, etc.)

app.post('/api/pedido', async (req, res) => {
    try {
        const { cart, address } = req.body;

        // 1. Validar e recalcular o total (Mais importante!)
        // Nunca confie no preço vindo do front-end.
        let totalCalculado = 0;
        const itensParaCriar = [];

        for (const itemDoCarrinho of cart) {
            // Busca o produto no DB pelo nome para pegar o preço real
            const produtoDoDB = await prisma.produto.findUnique({
                where: { nome: itemDoCarrinho.name }
            });

            if (!produtoDoDB) {
                return res.status(400).send({ message: `Produto ${itemDoCarrinho.name} não encontrado.` });
            }

            // Soma ao total e prepara o item para o DB
            totalCalculado += Number(produtoDoDB.preco) * itemDoCarrinho.quantity;
            itensParaCriar.push({
                quantidade: itemDoCarrinho.quantity,
                produtoId: produtoDoDB.id
            });
        }

        // 2. Criar o pedido e os itens em UMA transação
        // Esta é a mágica do Prisma: ele faz tudo de uma vez.
        // Se falhar ao criar um item, ele desfaz a criação do pedido.
        const novoPedido = await prisma.pedido.create({
            data: {
                enderecoCliente: address,
                totalPedido: totalCalculado,
                
                // Cria os "ItensPedido" relacionados
                itens: {
                    create: itensParaCriar.map(item => ({
                        quantidade: item.quantidade,
                        produto: { connect: { id: item.produtoId } } // Conecta ao produto existente
                    }))
                }
            },
            // Inclui os itens criados na resposta (opcional)
            include: {
                itens: true 
            }
        });

        res.status(201).send(novoPedido);

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erro ao processar pedido." });
    }
});

app.listen(3000, () => console.log('Servidor com Prisma rodando na porta 3000'));