# TesteConfitec

Teste Confitec - Tecnologias utilizadas: **Angular 16, Bootstrap, .Net Core 3.1 e .Net Entity Framework Core**

Criador: **Delio Darwin**... 


...**Configuração:**

1 - Crie um banco de dados SQL Server como o nome: Confitec;

2 - Abra o terminal para a aplicação WebAPI .Net Core (CRUDAPI) e execute os dois comandos de migrations do entity framework para geração da estrutura de banco de dados:

      dotnet ef migrations add ContextFactory
      dotnet ef database update
      
3 - Rode o script SQL para geração dos niveis de escolaridade:

      insert into [dbo].[Escolaridades] values ('Infantil')
      insert into [dbo].[Escolaridades] values ('Fundamental')
      insert into [dbo].[Escolaridades] values ('Médio')
      insert into [dbo].[Escolaridades] values ('Superior')

3 - Execute a aplicação backend WebAPI pelo terminal através do comando: 

      dotnet run
      
4 - Execute a aplicação frontend Angular 16 pelo terminal através do comando: 

       ng serve
