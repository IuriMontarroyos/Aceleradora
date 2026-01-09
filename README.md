AgilStore – Sistema de Gerenciamento de Inventário

Aplicação desenvolvida em Node.js com Express para gerenciamento automatizado de inventário de produtos de uma loja de eletrônicos.
O sistema substitui o controle manual em planilhas, permitindo cadastro, consulta, atualização, exclusão e persistência de dados de forma simples e organizada.

Funcionalidades
1. Adicionar Produto

Permite cadastrar novos produtos no inventário informando:

Nome do produto

Categoria

Quantidade em estoque

Preço

Cada produto recebe automaticamente um ID único, gerado pelo sistema.

2. Listar Produtos

Exibe todos os produtos cadastrados em uma tabela contendo:

ID

Nome

Categoria

Quantidade em estoque

Preço

Os dados são carregados automaticamente ao abrir a aplicação.

3. Buscar Produto

Permite buscar produtos:

Pelo ID

Por parte do nome

Pela categoria

Caso nenhum produto seja encontrado, o sistema exibe uma mensagem informativa.

4. Atualizar Produto

Permite atualizar um produto existente a partir do seu ID:

Nome

Categoria

Quantidade

Preço

O sistema valida a existência do ID antes de aplicar as alterações.

5. Excluir Produto

Remove um produto do inventário pelo ID informado.
O sistema valida se o produto existe antes da exclusão.

6. Persistência de Dados

Os dados do inventário são armazenados em um arquivo JSON (products.json), garantindo que as informações não sejam perdidas ao encerrar a aplicação.

Tecnologias Utilizadas

JavaScript (ES Modules)

Node.js

Express.js

HTML5

CSS3

Armazenamento em arquivo JSON

Fetch API (para comunicação frontend ↔ backend)

Estrutura do Projeto
agilstore/
│
├── app.js
├── products.js
├── data/
│   └── products.json
├── public/
│   ├── index.html
│   └── style.css
└── README.md

Como Executar o Projeto Localmente
Pré-requisitos

Node.js instalado (versão 18 ou superior recomendada)

Passo a passo

Clone o repositório:

git clone https://github.com/IuriMontarroyos/Aceleradora/tree/master


Instale as dependências:

npm install


Inicie o servidor:

node app.js


Acesse no navegador:

http://localhost:3000

Observações Técnicas

O sistema utiliza Express com rotas REST simples.

A lógica de geração de IDs é controlada na classe Products, garantindo unicidade mesmo após recarregar dados do JSON.

A separação entre frontend e backend foi mantida para facilitar manutenção e evolução do projeto.

A aplicação foi desenvolvida priorizando clareza de código e aderência aos requisitos funcionais do desafio.

Possíveis Evoluções

Filtros e ordenações por preço, quantidade ou categoria

Confirmação visual para exclusão de produtos

Interface para edição direta via modal

Migração da persistência para banco de dados

Implementação de testes automatizados
