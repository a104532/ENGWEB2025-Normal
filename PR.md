# Teste Engenharia Web 2025

## Transformação do dataset

Foi necessário fazer algum tratamento de dados do `dataset.json` usando a expressão regular`"ed\d{4}":`e substituindo as `{}`iniciais por `[]`. Chamando assim de `eurovisao.json`

> Inicializar o container `docker start mongoEW`

`docker cp eurovisao.json mongoEW:/tmp`

Executar o container:

`docker exec -it mongoEW sh`

Importar o dataset para o mongoDB:

`mongoimport -d eurovisao -c edicoes /tmp/dataset_books.json --jsonArray`

Verificar que o dataset foi importado:

```sh
mongosh
show dbs
use eurovisao
db.edicoes.countDocuments()
```

## Criação da API de Dados

### Gerar Estrutura

```bash
npx express-generator --view=pug apiDados
cd apiDados
npm install
npm install mongoose
```

> Nota: Apesar de ser gerado com suporte para `pug`, a API de dados não necessita de views.

### Estrutura e Lógica

1. Criadas as pastas `models/` e `controllers/`
2. No ficheiro dentro do `models` foi definido o modelo de dados com `mongoose`
3. No ficheiro do `controllers` foram implementadas as funções correspondentes às operações CRUD
4. Em `routes`, foram definidas as rotas conforme o enunciado
  
5. No `app.js` foi adicionada a ligação ao MongoDB:

6. A porta da API foi alterada no ficheiro `bin/www` para a pedida no enunciado.

### Testes

A API foi testada com o Postman para validar todas as rotas e operações.

---

## Criação da Interface do Utilizador

### Gerar Estrutura

```bash
npx express-generator --view=pug UI
cd UI
npm install
npm install axios
```

### Alterações Realizadas

- A porta foi alterada no `bin/www` para a pedida no enunciado.
- A comunicação com a API foi feita com `axios` para consumir os dados do backend.
- As views `.pug` foram editadas conforme os dados recebidos nas routes.

### 3.3 Estilização

Foi adicionada a biblioteca `w3.css` na pasta `public/stylesheets` para melhorar o aspeto visual da interface.

---
