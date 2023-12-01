# Ekan Exame Beneficiário

O projeto foi gerado na versão 17.0.0 do Angular Framework.<br/>
Antes de rodar o servidor de desenvolvimento, baixar as dependencias do projeto.<br/>
Certifique-se de estar usando a versão 18.18.0 do Nodejs.<br/>
Rode o seguinte comando para garantir a equivalência do lock json file ao baixar as libs: `npm ci`

## json-server

Antes de subir o servidor de mock, caso queira testar sem o uso da API, é necessário realizar <br/> duas configurações bem simples: <br/><br/>
Certifique-se que para os dados serem apresentados em tela é necessário navegar até o arquivo <br/> *BeneficiaryService* 
e procurar pela propriedade `hasMock` e atribuir o valor *Booleano* `true`,  a fim <br/> do método checar e setar manualmente
as seguintes porpriedades referente a data: `addedDate`, `updateDate`, <br/> os quais serão setados automaticamente na criação do recurso
ao bater na api do Java Spring Boot. <br/><br/>
Também se certifique de alterar o valor da propriedade `url` do mesmo arquivo *BeneficiaryService* para `http://localhost:3000`, com o objetivo 
da aplicação agora apontar para o json-server. Caso queira voltar, <br/> basta retornar o valor incialmente setado `http://localhost:8080` <br/><br/>

Pronto, agora só rodar o seguinte comando no terminal `npm run s:mock` para sua aplicação <br/> rodar na porta *3000* com o json-server.

## Servidor de Desenvolvimento (Angular)

Para subir o servidor de desenvolvimento rode o seguinte comando `npm run start` e navegue para `http://localhost:4200/` na sua url do seu browser.

## Build

Para rodar o build execute o seguinte comando `npm run build` e depois navegue para dentro da pasta <br/> `dist/ek-beneficiary` para checar os artefatos gerados.

## Testes Unitários

Para rodar os teste unitários execute o seguinte comando no terminal `npm run test`, apesar de não ter implementado nenhum teste específico.

## Further help - Explicação Projeto

A aplicação foi criada na versão 17 já com o objetivo de gerenciar o estado usando as novas features do framework, como os Signals,
combinado de programação reativa utilizando o RXJS para chamadas HTTP. 

Como se trata de um simples CRUD, não foi separado as camadas de services para lógicas de component e chamadas HTTP,
logo tudo foi englobado em um único service modular com instância simulando um "singleton".

Foi utilizado a biblioteca do bootstrap para uma simples demonstração em virtude da criação de estilos de acordo com seu design system por motivos de fácil manipulação e "baixa escalabilidade". <br/>
*Dentre outras que não estão presentes aqui (Angular Material, Material Design, PrimeNG, até o Tailwind CSS UI Kit)*
