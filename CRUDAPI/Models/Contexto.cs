using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CRUDAPI.Models
{
    public class Contexto : DbContext
    {
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<HistoricoEscolar> HistoricosEscolares { get; set; }
        public DbSet<Escolaridade> Escolaridades { get; set; }

        public Contexto(DbContextOptions<Contexto> opcoes) : base(opcoes)
        {
            
        }
        
        
    }
}