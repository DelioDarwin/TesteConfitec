export interface HistoricoEscolar {
    Id: number;
    Titulo: string;
    Conteudo: string;    
    usuario: Usuario;
}

export interface Escolaridade {
    Id: number;
    Descricao: string;
    usuario: Usuario;
}

export interface Usuario {
    Id: number;
    Nome: string;
    Sobrenome: string;
    Email: string;
    DataNascimento: string;
    escolaridadeId: number;
    escolaridade: Escolaridade;
    HistoricoEscolarId: number;
    HistoricoEscolar: HistoricoEscolar;
}