# Como testar o projeto localmente

Este guia serve apenas como lembrete para executar o My Habitica Pets na sua máquina.

O site publicado não é alterado ao executar estes comandos. A produção só muda depois de um novo deploy.

## O que precisa ser iniciado novamente

Sempre que você fechar os terminais, reiniciar o computador ou encerrar o VS Code, será necessário iniciar novamente:

- o backend Java;
- o servidor do frontend.

O comando `npm install` não precisa ser executado toda vez. Use-o apenas na primeira execução ou quando as dependências do frontend mudarem.

## 1. Iniciar o backend

Abra um terminal do VS Code na raiz do projeto e execute:

```bash
cd backend
```

Configure as credenciais do Habitica nesse terminal:

```bash
export HABITICA_USER_ID="COLOQUE_SEU_ID_AQUI"
export HABITICA_API_KEY="COLOQUE_SUA_CHAVE_AQUI"
```

Inicie o backend:

```bash
mvn spring-boot:run
```

Deixe esse terminal aberto. Para verificar se o backend está funcionando, acesse:

<http://localhost:8080/cards>

Se o terminal apresentar algum erro relacionado à versão do Java, execute antes:

```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

Depois, tente novamente o comando `mvn spring-boot:run`.

## 2. Iniciar o frontend

Sem fechar o backend, abra um segundo terminal na raiz do projeto.

Na primeira execução, instale as dependências:

```bash
cd frontend
npm install
```

Nas próximas vezes, basta entrar na pasta:

```bash
cd frontend
```

Compile o frontend:

```bash
npm run build
```

Inicie o servidor local:

```bash
python3 -m http.server 5500 --directory dist
```

Deixe esse segundo terminal aberto e acesse:

<http://localhost:5500>

## Ao alterar o código

- Se alterar somente o backend, pare-o com `Control + C` e execute novamente `mvn spring-boot:run`.
- Se alterar o frontend, pare o servidor com `Control + C`, execute novamente `npm run build` e depois reinicie `python3 -m http.server 5500 --directory dist`.

## Encerrar o projeto local

Em cada um dos dois terminais, pressione:

```text
Control + C
```

## Segurança

Nunca coloque o `HABITICA_API_KEY` diretamente no código e não envie essa chave ao GitHub.
