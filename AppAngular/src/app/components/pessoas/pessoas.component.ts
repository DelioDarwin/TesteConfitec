import { PessoasService } from './../../pessoas.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Usuario } from 'src/app/Usuario';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['./pessoas.component.css']
})
export class PessoasComponent implements OnInit {
  formulario: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null), 
    sobrenome: new FormControl(null),
    email: new FormControl(null),
    datanascimento: new FormControl(null),
    escolaridadeId: new FormControl(null),
    historicoEscolarId: new FormControl(null),
    titulo: new FormControl(null),
    conteudo: new FormControl(null)
  });
  submitted = false;

  tituloFormulario: string;
  usr: Usuario[];
  nome: string;
  id: number;


  visibilidadeTabela: boolean = true;
  visibilidadeFormulario: boolean = false; 
  
  modalRef: BsModalRef;

  constructor(private pessoasService: PessoasService,
    private modalService: BsModalService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.pessoasService.PegarTodos().subscribe((resultado) => {
      console.log(resultado);
      this.usr = resultado;
    }); 

    
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formulario.controls;
  }

  ExibirFormularioCadastro(): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;
    this.tituloFormulario = 'Informações Pessoais';    

    this.formulario = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
      sobrenome:  ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      datanascimento: ['', Validators.required],
      escolaridadeId: ['', Validators.required],
      historicoEscolarId: [''],
      titulo: ['', Validators.required],
      conteudo: ['', Validators.required],
      },
      {validator: this.dateLessThan('datanascimento')});     

  }


  dateLessThan(datanascimento: string) {
    let dataHoje = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[datanascimento];      
      if (f.value > dataHoje) {        
        return {          
          dates: "Data de nascimento não pode ser maior que a data hoje"
        };
      }
      return {};
    }
}

  ExibirFormularioAtualizacao(id): void {
    this.visibilidadeTabela = false;
    this.visibilidadeFormulario = true;

    this.pessoasService.PegarPeloId(id).subscribe((resultado) => {
      this.tituloFormulario = `Atualizar Aluno: [${resultado.Id} - ${resultado.Nome}]`;      
      let dataFormatada =  new Date(resultado.DataNascimento).toISOString().split('T')[0];

      this.formulario = this.formBuilder.group({
        id: [resultado.Id],
        nome: [resultado.Nome, Validators.required],
        sobrenome: [resultado.Sobrenome, Validators.required],
        email: [resultado.Email, [Validators.required, Validators.email]],
        datanascimento: [dataFormatada, Validators.required],
        escolaridadeId: [resultado.escolaridadeId.toString()],
        historicoEscolarId: [resultado.HistoricoEscolarId.toString()],
        titulo: [resultado.HistoricoEscolar.Titulo, Validators.required],
        conteudo: [resultado.HistoricoEscolar.Conteudo, Validators.required],
        },
        {validator: this.dateLessThan('datanascimento')});
      
    });

  }



  EnviarFormulario(): void {

    this.submitted = true;

    if (this.formulario.invalid) {
      return;
    }

    const modelo = this.formulario.value;
    const idModelo = modelo['id'];
    var dataItem;

    console.log(modelo);
    console.log(idModelo);

    if (idModelo == '' || idModelo == null || idModelo == undefined) //Inclusao
    {
      
      dataItem = {
        nome: modelo['nome'],
        sobrenome: modelo['sobrenome'],
        email: modelo['email'],
        datanascimento: modelo['datanascimento'],
        escolaridadeId: modelo['escolaridadeId'],
        historicoescolar: {
           titulo:  modelo['titulo'],
           conteudo:  modelo['conteudo']
         }
      }
    }
    else  //Alteração
    {
      dataItem = {
        id: modelo['id'],
        nome: modelo['nome'],
        sobrenome: modelo['sobrenome'],
        email: modelo['email'],
        datanascimento: modelo['datanascimento'],
        escolaridadeId: modelo['escolaridadeId'],
        historicoescolarid: modelo['historicoEscolarId'] ,
        historicoescolar: {
           id: modelo['historicoEscolarId'],
           titulo:  modelo['titulo'],
           conteudo:  modelo['conteudo']
         }
      }
    }
    
    console.log(dataItem);

    if (dataItem.id > 0) {
      dataItem.escolaridadeId = Number(dataItem.escolaridadeId);
      this.pessoasService.AtualizarAluno(dataItem).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Os dados do Aluno foram alterados');
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.usr = registros;
        });
      });
    } else {
      dataItem.escolaridadeId = Number(dataItem.escolaridadeId);
      this.pessoasService.SalvarAluno(dataItem).subscribe((resultado) => {
        this.visibilidadeFormulario = false;
        this.visibilidadeTabela = true;
        alert('Os dados do Aluno foram incluidos');
        this.pessoasService.PegarTodos().subscribe((registros) => {
          this.usr = registros;
        });
      });
    }
  }

  Voltar(): void {
    this.visibilidadeTabela = true;
    this.visibilidadeFormulario = false;
  }

  ExibirConfirmacaoExclusao(id, nome, conteudoModal: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(conteudoModal);
    this.id = id;
    this.nome = nome;
  }

  ExcluirPessoa(){
    this.pessoasService.ExcluirAluno(this.id).subscribe(resultado => {
      this.modalRef.hide();
      alert('Aluno excluído com sucesso');
      this.pessoasService.PegarTodos().subscribe(registros => {
        this.usr = registros;
      });
    });
  }

  // downloadHistorico(id): void {
  //   this.pessoasService.DownloadHistorico(id).subscribe(x => {
  //     console.log(x);
  //     const data = `data:application/pdf;base64,${x}`;
  
  //     var link = document.createElement('a');
  //     link.href = data;
  //     link.download = "test.pdf";
  //     link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  //   });
  // }


  downloadHistorico(id): void {
   this.pessoasService.DownloadHistorico(id).subscribe(x => {
    const data= 'data:application/pdf;base64,${x}';
      // let url = window.URL.createObjectURL(res);
      let a = document.createElement('a');
      a.href = data;
      a.download = "Download PDF";
      a.click();
      window.URL.revokeObjectURL(data);
      a.remove();
  });
  }
}
