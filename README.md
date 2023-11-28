# Ekan Beneficiary

O projeto foi gerado na versão 17.0.0.
Antes de rodar o servidor de desenvolvimento, baixar as dependencias do projeto.
Certifique-se de estar usando a versão 18.18.0 do Nodejs.
Rode a atualização de dependencias com o seguinte comando p/ garantir a equivalência do lock json: `npm ci`

## json-server

Caso queira testar o servidor com o mock rode o seguinte comando para subir o json server: `npm run s:mock`

## Servidor de Desenvolvimento (Angular)

Para subir o servidor de desenvolvimento rode o seguinte comando `npm run start` e navegue para `http://localhost:4200/` na sua url do seu browser.

## Build

Para rodar o build execute o seguinte comando `npm run build` e depois navegue para dentro da pasta 
`dist/ek-beneficiary` para checar os artefatos gerados.

## Testes Unitários

Para rodar os teste unitários execute o seguinte comando no terminal `npm run test`, apesar de não ter implementado nenhum teste específico.

## Further help - Explicação Projeto

A aplicação foi criada na versão 17 já com o objetivo de gerenciar o estado usando as novas features do framework, como os Signals,
combinado de programação reativa utilizando o RXJS para chamadas HTTP. 

Como se trata de um simples CRUD, não foi separado as camadas de services para lógicas de component e chamadas HTTP,
logo tudo foi englobado em um único service modular com instância simulando um "singleton".

Foi utilizado a biblioteca do bootstrap para uma simples demonstração em virtude da criação de estilos de acordo com seu design system por motivos de fácil manipulação e "baixa escalabilidade".
*Dentre outras que não estão presentes aqui (Angular Material, Material Design, PrimeNG, até mesmo Tailwind CSS UI Kit)*
