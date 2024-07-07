
# DevKit

## Conceito

Acelerador de criação de aplicações com microservices usando wampark

## Arquitetura

A aplicação é divida em dois microservices principais:

1. gateway - microservice responsável por tratar toda e qualquer requisição para aplicação

2. containers - microservice da aplicação (que pode conter um ou mais microservices)

## Gateway
Possui toda a arquitetura para tratamento de requisições da aplicação.
O gateway ainda tem uma opção de checar licença em um outro gateway de licenciamento.

`process.env.LICENSE=UUID`

# Gateaway para validar a licença
indica que a aplicação deve checar licença para cada request

```
process.env.LICENSE_GATEWAY=https://localhost:6000
process.env.LICENSE_ON=true
```
container=gateway
porta=5001


`package.json`

```json
	"tenancy":  {
	"enabled":  true,
	"gateway":  "https://localhost:5001",
}
```

### Gateway API

### Public API

#### GET healthcheck
Indica para o container [kubernetes ou docker] o estado da aplicação.

### Private API
Autenticação via JWT Bearer

#### GET /tenant
lista os tenants

#### POST /tenant
cria um tenant
```js
{
	_id: UUID,
	name:  "Cliente 1",
	databaseName:  "app_cliente1",
	domain:  "cliente1",
	enabled:  true
}
```
 
#### PUT /tenant/:id
atualiza um tenant

#### GET /tenant/:id
retorna um tenant

#### DELETE /tenant/:id
remove um tenant

## Tipos

### Multi-tenant
`package.json`
tenancy.enabled=true

Indica para gateway que a aplicação deve ser controlada por Tenancy.
Redireciona a requisição para o Tenancy indicado no request.
Nota: Mantem um banco de dados por Tenant


### Single
`package.json`
tenancy.enabled=false

Indica para gateway que a aplicação responde qualquer request diretamente. Bypass do gateway.

## Containers

container=product
porta=5001
API da aplicação

### Containers API

#### GET healthcheck
Indica para o container [kubernetes ou docker] o estado da aplicação.


# TODO

1. Impelmentar logs
2. Configurar CI/CD do gitlab


# Instalar Certificados SSL/TLS

Para gerar um certificado SSL no macOS que você pode usar em seu projeto, você pode usar o utilitário `openssl` que vem pré-instalado na maioria das distribuições Unix, incluindo o macOS. Abaixo estão os passos para gerar um certificado autoassinado:

### Passo 1: Gerar a Chave Privada

Abra o Terminal e execute o seguinte comando para gerar uma chave privada:

```sh
openssl genrsa -out private-key.pem 2048
```

### Passo 2: Criar um Certificado de Assinatura de Solicitação (CSR)

Crie um CSR (Certificate Signing Request) usando a chave privada gerada:

```sh
openssl req -new -key private-key.pem -out certificate.csr
```

Durante este processo, você será solicitado a fornecer algumas informações como país, estado, localidade, organização, unidade organizacional e nome comum (Common Name). Para o nome comum, você pode usar o domínio do seu servidor ou "localhost" se estiver gerando o certificado para desenvolvimento local.

```plaintext
Country Name (2 letter code) [AU]:BR
State or Province Name (full name) [Some-State]:Bahia
Locality Name (eg, city) []:Salvador
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Tag Tech
Organizational Unit Name (eg, section) []:Development
Common Name (e.g. server FQDN or YOUR name) []:localhost
Email Address []:rafael@tag.mx
```

### Passo 3: Gerar o Certificado Autoassinado

Use o CSR para gerar um certificado autoassinado:

```sh
openssl x509 -req -in certificate.csr -signkey private-key.pem -out certificate.pem -days 365
```

Este comando gera um certificado que é válido por 365 dias.

