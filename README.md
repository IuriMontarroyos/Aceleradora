AgilStore — Gerenciamento de Estoque
Visão Geral

O AgilStore é uma aplicação web desenvolvida como parte de um desafio técnico, com o objetivo de automatizar o controle de estoque de uma loja de eletrônicos.

A aplicação foi criada para substituir o controle manual, permitindo o gerenciamento de produtos de forma simples e organizada, com foco em clareza de código, funcionamento correto e facilidade de manutenção.

Funcionalidades Implementadas

Cadastro de produtos com ID único gerado automaticamente

Listagem de todos os produtos cadastrados

Busca de produtos por ID, nome ou categoria

Atualização das informações de um produto existente

Remoção de produtos do estoque

Persistência de dados em arquivo JSON

Decisões de Desenvolvimento

Uso de Node.js com Express para criação do servidor e das rotas

Persistência simples em arquivo JSON, garantindo que os dados sejam mantidos entre execuções

Organização do projeto em arquivos separados para facilitar leitura e entendimento

Validação básica dos dados antes de salvar alterações no estoque

Tecnologias Utilizadas

JavaScript (Node.js)

Express.js

HTML5

CSS3

Estrutura do Projeto
agilstore/
├── app.js
├── products.js
├── data/
│   └── products.json
├── public/
│   ├── index.html
│   └── style.css
└── README.md

Como Executar
npm install
node app.js


A aplicação ficará disponível em:

http://localhost:3000

Considerações Finais

Este projeto foi desenvolvido seguindo os requisitos do desafio, priorizando simplicidade, organização e funcionamento correto das funcionalidades propostas.
