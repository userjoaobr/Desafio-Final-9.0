GymPoint

App para gestão de academias.
1. Esta aplicação será formada por:

backend - Este  é api da aplicação.
frontend - Aplicação web.
mobile - Aplicativo móvel.

Installing the dependencies

yarn ou npm install
To start the project
yarn start ou npm start


# ios
react-native run-ios --simulator "iPhone X"

# android
react-native run-android


Você pode consultar a documentação e verificar informações sobre os endpoints.

Funcionalidades
A seguir, estarão listadas as funcionalidades já implementadas no projeto.

Autenticação;
Manutenção de Alunos;
Manutenção de Matrículas;
Envio de e-mail para o aluno
Manutenção de Planos;
Manutenção de Pedidos de Auxílio
Envio de e-mail para o aluno quando houver resposta
Realização de Check-ins;
Limite de 5 checkins a cada 7 dias
Instruções para o backend
Você precisará ter instalado na sua máquina o Node.js, o Yarn e o Docker. Feitas as configurações, seguem os passos para executar o backend da aplicação:

Executar o comando yarn para fazer o dowload de todas as dependências necessárias para executar o projeto;

Iremos instalar duas imagens de dois bancos de dados: Postgres, para armazenar nossas tabelas; e o Redis, um banco extremamente performático, que será utilizado para envio de e-mails com filas. Abaixo, seguem os respectivos comandos para realizar o download:

sudo docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
docker run --name redis -p 6379:6379 -d -t redis:alpine

Execute yarn queue para que a fila de processamento de emails esteja funcionando.

Execute as migrations para que as tabelas sejam criadas:

yarn sequelize db:migrate
Se quiser, também pode gerar alguns dados, como usuário administrador e planos, executando os seeds:

yarn sequelize db:seed:all
Com isso, você terá o email admin@gympoint.com e a senha 123456 para fazer autenticação e 3 planos cadastrados.

Após isso, execute yarn dev para que o backend esteja funcionando.

Instruções para o frontend
Executar o comando yarn para fazer o dowload de todas as dependências necessárias para executar o projeto yarn install. Crie um  arquivo `.env.development.local` (preenchendo as variáveis encontradas no `.env.example`);

Feitos os downloads de todas as dependências, execute yarn start para iniciar a aplicação;
