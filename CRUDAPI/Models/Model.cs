using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CRUDAPI.Models {
    
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        public string Nome { get; set; }

        public string Sobrenome { get; set; }

        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }

        [ForeignKey("Escolaridade")]
        public int escolaridadeId { get; set; }
        public Escolaridade Escolaridade { get; set; }  

        [ForeignKey("HistoricoEscolar")]
        public int HistoricoEscolarId { get; set; }
        public HistoricoEscolar HistoricoEscolar { get; set; }  
    }

    public class HistoricoEscolar
    {
        [Key]
        public int Id { get; set; }

        public string Titulo { get; set; }

        public string Conteudo { get; set; }       

        public Usuario Usuario { get; set; }

    }

    public class Escolaridade
    {
        public int Id { get; set; }

        public string Descricao { get; set; }

        public Usuario Usuario { get; set; }

    }
    
}

