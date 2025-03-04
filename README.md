<h1 align="center"> Projeto API - 5  º Semestre </h1>

<p align="center">
     <a href ="#objetivo">Objetivo</a>  |
     <a href ="#requisitos">Requisitos</a>  |
     <a href ="#tecnologias">Tecnologias</a>  |
     <a href ="#backlog">Backlog</a>  |
      <a href ="#mvp">MVP</a>  |
     <a href ="#equipe">Equipe</a>
   </p>

<span id="objetivo">
  
## 🎯 Objetivo
Desenvolver um aplicativo móvel para o lançamento de reembolso de despesas, garantindo praticidade e precisão no registro das informações.

<span id="requisitos">
  
## 📍 Requisitos funcionais
- Permitir o registro de despesas informando: 
    - Tipo de despesa
    - Data da despesa
    - Valor ou quantidade
- Permitir o anexo de comprovantes de despesa
- Permitir a inserção de uma descrição para a despesa
- Exibir alerta caso o valor da despesa esteja a cima do limite permitido
- Permitir o acompanhamento do status de aprovação das solicitações de reembolso
- Integrar com o sistema corporativo para fornecer e receber os seguintes dados:
    - Informações do solicitante (Nome, Centro de Custo, Projeto)
    - Detalhes da despesa (Data, Valor, Quantidade, Descrição, Anexo)

## 📍 Requisitos não-funcionais
- Manual do Usuário
- Documentação API - Application Programming Interface
- Modelagem de Banco de Dados

<span id="tecnologias">
  
## ⚙️ Tecnologias Utilizadas

| ![TypeScript](https://img.shields.io/badge/-TypeScript-0D1117?style=for-the-badge&logo=typescript) | ![JavaScript](https://img.shields.io/badge/-JavaScript-0D1117?style=for-the-badge&logo=javascript) | ![REACT](https://img.shields.io/badge/-React-0D1117?style=for-the-badge&logo=react) | ![React Native](https://img.shields.io/badge/-React%20Native-0D1117?style=for-the-badge&logo=react) |
| --- | --- | --- | --- |
| ![Android](https://img.shields.io/badge/-Android-0D1117?style=for-the-badge&logo=android) | ![FIGMA](https://img.shields.io/badge/Figma-0D1117?style=for-the-badge&logo=figma) | ![Microsoft](https://img.shields.io/badge/Microsoft_Office-0D1117?style=for-the-badge&logo=microsoft-office) |

<span id="backlog">
  
## 📊 Product Backlog

<details>
 <summary>User Story</summary>
   
| Rank | Prioridade | User Story | Estimativa(Horas) | Sprint | Requisito do Parceiro | Critério de aceitação |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Alta | Eu, como funcionário, quero registrar minhas despesas relacionadas às minhas funções na empresa e solicitar reembolso, para garantir o reembolso adequado. | 12 | 1 | RF1 | Permitir o registro de despesas informando o tipo, a data, o valor ou quantidade e a qual projeto pertence. |
| 2 | Alta | Eu, como funcionário, quero registrar minhas despesas e solicitar reembolso de forma prática pelo meu dispositivo móvel, para facilitar o processo. | 15 | 1 | RF6 | Desenvolver uma aplicação para uma plataforma móvel, como smartphones ou tablets, garantindo praticidade. |
| 3 | Alta | Eu, como gestor, quero acessar as despesas dos projetos e funcionários, bem como suas solicitações de reembolso, para gerenciar os pedidos e monitorar os gastos da empresa. | 12 | 1 | RF6 | Integrar com o sistema corporativo para fornecer e receber informações do solicitante (Nome, Centro de Custo, Projeto) e detalhes da despesa (Data, Valor, Quantidade, Descrição, Anexo). |
| 4 | Alta | Eu, como usuário, quero criar e acessar minha conta no aplicativo, para utilizar as funcionalidades conforme meu perfil (gestor ou funcionário). | 10 | 1 | RF6 | Os usuários devem ter acesso apenas às funcionalidades e informações correspondentes às permissões definidas para seus papéis no sistema. |
| 5 | Média | Eu, como gestor, quero acessar os comprovantes e descrições das despesas dos solicitantes, para validar as solicitações de reembolso. | 13 | 2 | RF2, RF3 | Permitir o anexo de comprovantes e a inserção de descrições detalhadas para cada despesa. |
| 6 | Média | Eu, como funcionário, quero visualizar o status de aprovação das minhas solicitações de reembolso, para acompanhar o andamento do processo. | 9 | 2 | RF5 | Permitir o acompanhamento do status de aprovação das solicitações de reembolso. |
| 7 | Média | Eu, como gestor, quero acessar o histórico das solicitações de reembolso para acompanhar e analisar registros anteriores. | 8 | 1 | RF5 | Permitir que o gestor visualize um histórico das solicitações de reembolso. O histórico deve incluir informações detalhadas, como data, status, valor e solicitante. |
| 8 | Média | Eu, como gestor, quero definir e comunicar os limites de reembolso para cada projeto, garantindo controle financeiro. | 5 | 2 | RF4 | Permitir que o gestor defina um limite de reembolso para cada categoria de despesa (por exemplo, alimentação). |
| 9 | Média | Eu, como gestor, quero que o sistema calcule automaticamente o valor das despesas com base nos valores e quantidades informados, para visualizar com precisão os gastos de cada projeto e solicitante. | 5 | 2 | RF1, RF4, RF6 | O sistema deve calcular automaticamente o total das despesas por solicitante e por projeto, considerando os valores e quantidades de cada item no registro de despesas. |
| 10 | Média | Eu, como usuário, quero que meus dados sejam autenticados ao acessar minha conta, garantindo segurança no aplicativo. | 12 | 3 | RF6 | Exigir autenticação de usuário para acessar a conta. Os dados de login devem ser validados antes de permitir o acesso ao aplicativo. |
| 11 | Média | Eu, como usuário, quero um aplicativo com interface amigável, para melhorar a experiência de uso. | 20 | 2 | RF4 | O aplicativo deve possuir uma interface intuitiva. Os elementos visuais devem seguir um design padronizado, com botões, ícones e cores que facilitem a usabilidade. O sistema deve fornecer confirmações e alertas para ações do usuário. |
| 12 | Baixa | Eu, como funcionário, quero ser alertado quando minhas despesas ultrapassarem o limite da empresa, para evitar solicitações fora das regras. | 5 | 2 | RF4 | Exibir o valor limite definido para cada categoria de despesa e alertar o usuário de forma clara e intuitiva caso o valor da despesa ultrapasse o limite estabelecido. |
| 13 | Baixa | Eu, como usuário, quero ter acesso ao manual do usuário, para entender o funcionamento do aplicativo. | 10 | 3 | RNF1 | Destinado ao usuário final, explica como utilizar um sistema ou produto (Apresentação do sistema; instalação ou acesso; interface e funcionalidades; passo a passo de uso; perguntas frequentes e resolução de erros comuns; contato e suporte.). |

</details>

<div style="display: flex;">
  <img src="https://github.com/user-attachments/assets/b5448131-7067-4751-81be-069a6ea4493e" width="450"/>
  <img src="https://github.com/user-attachments/assets/af5f993d-5503-4104-bea1-5046054e9a13" width="450"/>
</div>

<span id="mvp">
  
## MVP - Mínimo Produto Viável
<div style="display: flex;">
  <img src="https://github.com/user-attachments/assets/fd2e83db-c9b8-413b-8c05-cc9bda5a2e08" width="450">
</div>


<!-- 
<span id="prototipo">
## 📲 Protótipo Figma

<span id="modelagem-bd">
## 📂 Modelagem de Banco de Dados

<span id="videos-entregas">
## 📽️ Vídeos de Entrega das Sprints
<details>
     <summary>Sprints</summary>
     
     Sprint 1
     
     Sprint 2
     
     Sprint 3
</details>

<span id="instalação">
## 📥 Guia de Instalação -->

<span id="equipe">

## 👥 Equipe

<br>

|Nome|Função|GitHub|
| -------- |-------- |-------- |
|**Ana Luísa Andrade**|Developer Team|[![](https://bit.ly/3f9Xo0P)](https://github.com/LuisaAndrade28)|
|**Dianne Faria**|Developer Team| [![](https://bit.ly/3f9Xo0P)](https://github.com/DianneFaria)|
|**Gustavo Sena**|Developer Team|[![](https://bit.ly/3f9Xo0P)](https://github.com/gustavosenamp)|
|**Julia Gonzalez**|Developer Team|[![](https://bit.ly/3f9Xo0P)](https://github.com/juliagonzalezmoreira)|
|**Maria Luiza Guedes**|Product Owner|[![](https://bit.ly/3f9Xo0P)](https://github.com/mluizaguedes)|
|**Pedro Henrique Ribeiro**|Developer Team|[![](https://bit.ly/3f9Xo0P)](https://github.com/pedrohenribeiro)|
|**Sofia Lessa**|Scrum Master|[![](https://bit.ly/3f9Xo0P)](https://github.com/sofialessaa)|
