# Desafio Técnico - Relatório de Vendas por Vendedor

Bem-vindo ao desafio técnico para a posição de **Engenheiro de Software**. Este projeto consiste na implementação de uma aplicação para uma empresa de Marketplace de produtos na internet. A empresa precisa consolidar todas as vendas realizadas por seus vendedores e exportar relatórios individuais em formato CSV. Este desafio é uma excelente oportunidade para demonstrar habilidades de organização, boas práticas de programação, uso de ferramentas escaláveis e implementação de arquiteturas baseadas em mensageria.

A aplicação foi projetada para consumir APIs de vendedores, produtos, clientes e vendas, consolidar os dados em relatórios por vendedor e exportar os resultados em CSVs. Para isso, a aplicação utiliza uma arquitetura escalável, dividida em dois serviços principais: **Job** e **Worker**, que se comunicam através de um broker de mensageria (RabbitMQ).

- - -

**Siga adiante no README para:**
<br>
1. Visão geral da arquitetura.
2. Instruções de configuração e execução.
3. Estrutura dos CSVs gerados.
4. Considerações sobre a escalabilidade e boas práticas adotadas.

### **Descrição da Arquitetura - Microserviço Job**

O **Job** é o primeiro microserviço na arquitetura e desempenha o papel de consumir a API de vendedores, processar os dados e enviá-los, vendedor por vendedor, para o broker de mensageria RabbitMQ. Ele foi desenvolvido com o **NestJS** e **TypeScript**, adotando boas práticas e funcionalidades nativas do framework, que é altamente indicado para construir aplicações baseadas em microserviços.

- - -

#### Detalhes do Microserviço **Job**

1. **Linguagem:** TypeScript.
2. **Framework:** NestJS, um framework modular e escalável para a construção de aplicações Node.js, especialmente projetado para microserviços.
3. **Ambiente:** Node.js 18, garantindo suporte às últimas funcionalidades de JavaScript/TypeScript e melhor performance.
4. **Containerização:**
    * Um **Dockerfile** otimizado está incluído no diretório do serviço, permitindo a construção e o empacotamento da aplicação como uma imagem Docker.
    * Isso simplifica o processo de implantação e escalabilidade.

- - -

#### Fluxo de Funcionamento

1. **Consumo da API de Vendedores:**
    * O microserviço consulta uma API externa que retorna os dados dos vendedores no formato JSON.
    * Cada vendedor é tratado individualmente, permitindo maior controle e escalabilidade no processamento.
2. **Publicação no Broker RabbitMQ:**
    * Após processar os dados do vendedor, o serviço publica uma mensagem no broker RabbitMQ.
    * Cada mensagem contém os detalhes de um único vendedor, organizados de forma estruturada.
    * Essa abordagem garante que cada vendedor seja processado de maneira independente, permitindo escalabilidade horizontal no processamento de mensagens.
3. **Preparação para o Worker:**
    * As mensagens publicadas no RabbitMQ são consumidas pelo microserviço **Worker**, responsável por consolidar os dados e gerar relatórios.

- - -

#### Objetivos do Microserviço **Job**

* **Modularidade:** Dividir as responsabilidades de forma clara, seguindo os princípios de arquitetura de microserviços.
* **Escalabilidade:** Capacidade de lidar com um grande número de vendedores, mesmo que a API de teste contenha poucos registros.
* **Fácil Implantação:** Dockerfile preparado para compilar e rodar a aplicação em ambientes de produção ou desenvolvimento.
* **Desempenho:** Publicação eficiente das mensagens no broker, permitindo um processamento fluido para o próximo microserviço.

### **Descrição da Arquitetura - Microserviço Worker**

O **Worker** é o segundo microserviço da arquitetura e é responsável por consumir as mensagens publicadas pelo **Job** no broker RabbitMQ, processar os dados recebidos e consolidá-los com informações de clientes, produtos e vendas. Esse microserviço utiliza um banco de dados PostgreSQL para persistência e propagação dos dados e adota uma estratégia de orquestração centralizada para garantir que todas as informações estejam sincronizadas e com suas relações corretamente estabelecidas.

- - -

#### Detalhes do Microserviço **Worker**

* **Linguagem:** TypeScript.
* **Framework:** NestJS, com funcionalidades nativas para microserviços e integração com RabbitMQ.
* **Banco de Dados:** PostgreSQL, utilizado para armazenar e consolidar os dados processados.
* **Mensageria:** RabbitMQ, responsável pela comunicação entre os serviços.
* **Containerização:**
    * Possui um **Dockerfile** que facilita a construção de imagens Docker e a implantação do serviço.

- - -

#### Fluxo de Funcionamento

1. **Consumo de Mensagens do Broker:**
    * O **Worker** consome as mensagens publicadas no broker RabbitMQ pelo microserviço **Job**.
    * Cada mensagem contém os detalhes de um vendedor, que são persistidos na tabela `wlPierCloudSeller`.
2. **Orquestração Centralizada:**
    * O serviço utiliza a classe `GeneralOrchestratorService` para gerenciar de forma sincronizada as chamadas às APIs de vendedores, clientes, produtos e vendas.
    * A orquestração é dividida em etapas que garantem que cada tipo de dado seja processado e armazenado antes de passar para a próxima etapa.
3. **Garantia de Relacionamentos:**
    * O método `ensureSellersExist` verifica a existência de registros na tabela de vendedores antes de processar as informações de produtos e vendas, garantindo que todas as relações sejam respeitadas.
    * Caso nenhum vendedor seja encontrado, o serviço realiza uma pausa de 2 segundos e tenta novamente, até atingir o limite de tentativas.
4. **Exportação de Dados:**
    * Após consolidar as informações, os dados são utilizados para gerar relatórios em formato CSV, um para cada vendedor.

- - -

#### Detalhes do GeneralOrchestratorService

* **Processo de Inicialização:**
    * A classe `GeneralOrchestratorService` é iniciada automaticamente quando o serviço **Worker** é iniciado.
    * Ela garante que o sistema esteja totalmente preparado antes do uso pelo usuário final.
* **Etapas de Orquestração:**
    1. **Clientes:** Consome a API de clientes e armazena os dados no banco de dados.
    2. **Vendedores:** Garante que a tabela de vendedores esteja populada.
    3. **Produtos:** Consome a API de produtos, associando-os aos vendedores.
    4. **Vendas:** Consome a API de vendas e associa os registros com os clientes, produtos e vendedores.
* **Log Detalhado:**
    * O `GeneralOrchestratorService` registra todas as etapas do processamento, incluindo sucessos, tentativas e erros, para facilitar a manutenção e depuração.

- - -

#### Objetivos do Microserviço **Worker**

* **Escalabilidade:**
    * Processa mensagens de forma assíncrona e paralela, permitindo lidar com grandes volumes de vendedores e dados.
* **Confiabilidade:**
    * Garante que os dados estejam completos e que todas as relações sejam respeitadas antes de exportar os relatórios.
* **Modularidade:**
    * Cada responsabilidade, como o processamento de clientes, produtos, vendas e vendedores, é encapsulada em serviços específicos.
* **Desempenho:**
    * O uso de RabbitMQ permite desacoplar os serviços, enquanto o PostgreSQL garante operações rápidas de leitura e escrita.

## Documentação de Execução do Projeto

### Introdução

Este projeto utiliza o **Docker Compose** para configurar, construir e orquestrar múltiplos serviços, permitindo que você execute facilmente o sistema com uma única ação. A aplicação é composta pelos seguintes serviços:
<br>
* **RabbitMQ**: Mensageria para comunicação entre os microserviços.
* **PostgreSQL**: Banco de dados para armazenamento das informações.
* **Job**: Microserviço responsável por consumir os dados de vendedores e publicar no broker RabbitMQ.
* **Worker**: Microserviço que consome mensagens do RabbitMQ, processa informações, e armazena no banco de dados.

- - -

### Pré-requisitos

1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados em sua máquina.
2. Clone este repositório localmente.

- - -

### Estrutura do `docker-compose.yml`

#### Serviços:

1. **RabbitMQ**:
<br>

    * Usa a imagem oficial `rabbitmq:3-management`.
    * Exposição de portas:
        * `5672`: Porta para conexões AMQP (protocolo de mensagens).
        * `15672`: Porta para a interface de gerenciamento.
    * Configuração de credenciais padrão (`guest`/`guest`).
    * Testa a saúde com o comando `rabbitmq-diagnostics ping`.
2. **PostgreSQL**:
<br>

    * Usa a imagem `postgres:15.0-alpine`.
    * Exposição da porta `3030` (internamente mapeada para `5432` no contêiner).
    * Configuração padrão:
        * Usuário: `postgres`.
        * Senha: `postgres`.
        * Banco de dados: `pier-Cloud`.
    * Verificação de saúde com o comando `pg_isready`.
3. **Job**:
<br>

    * Consome dados da API de vendedores e publica mensagens no RabbitMQ.
    * Configura as credenciais do RabbitMQ via variáveis de ambiente.
    * Saúde monitorada com o comando `nc -z localhost 3001`.
4. **Worker**:
<br>

    * Processa as mensagens recebidas do RabbitMQ, consulta APIs de vendas, produtos e clientes, e armazena as informações processadas no PostgreSQL.
    * Conexão com RabbitMQ e PostgreSQL.
    * Saúde monitorada com o comando `nc -z localhost 3000`.

#### Redes:

* **app-network**: Rede interna compartilhada entre RabbitMQ, Job e Worker.
* **postgres-network**: Rede exclusiva entre PostgreSQL e Worker.

- - -

### Como Executar

1. **Acesse o diretório do projeto**:
<br>
```
bash
Copiar código
 app
```

2. **Execute o Docker Compose**:
<br>
```
bash
Copiar código
docker compose up -d --build
```

3. **O que acontece?**
<br>

    * **Etapa 1**: Criação das redes `app-network` e `postgres-network`.
    * **Etapa 2**: Inicialização dos serviços:
        * **RabbitMQ**:
            * Disponibiliza o broker de mensagens.
            * Verifica se o serviço está funcional com `rabbitmq-diagnostics ping`.
        * **PostgreSQL**:
            * Inicializa o banco de dados com as configurações fornecidas.
            * Testa a conectividade com `pg_isready`.
        * **Job**:
            * Aguarda o RabbitMQ estar saudável antes de consumir dados da API de vendedores e publicar mensagens no broker.
        * **Worker**:
            * Aguarda que RabbitMQ, PostgreSQL e Job estejam saudáveis.
            * Processa as mensagens recebidas e persiste no banco de dados.
4. :
Para monitorar os logs de execução, utilize:

```
bash
Copiar código
docker compose logs -f
```

- - -

### Healthchecks

Os serviços são configurados com verificações de saúde para garantir que o sistema funcione corretamente:
<br>
* **RabbitMQ**:
    * Verifica se está respondendo a comandos administrativos (`rabbitmq-diagnostics ping`).
* **PostgreSQL**:
    * Confirma que o banco de dados está disponível (`pg_isready`).
* **Job**:
    * Confirma que o microserviço está acessível na porta `3001` (`nc -z localhost 3001`).
* **Worker**:
    * Valida a conectividade na porta `3000` (`nc -z localhost 3000`).

- - -

### Próximos Passos

Após a inicialização:
<br>
1. **Acesse a interface de gerenciamento do RabbitMQ**:
<br>

    * URL: http://localhost:15672.
    * Credenciais padrão: `guest` / `guest`.
2. **Confirme que os dados foram processados**:
<br>

    * Verifique se o PostgreSQL contém os registros processados.
    * Utilize ferramentas como `pgAdmin` ou execute consultas diretamente no banco.
3. :
Para desligar todos os contêineres:

```
bash
Copiar código
docker compose down
```

Agora, sua aplicação está configurada e pronta para uso. 🚀