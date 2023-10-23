import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from './Usuario';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Blob } from 'buffer';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  
};

// let options = { headers : {
//   'Authorization': this.headers.headers.Authorization,
//   'responseType': 'blob'
//  }};


@Injectable({
  providedIn: 'root',
})
export class PessoasService {
 url = 'https://localhost:5001/api/usuario';
 urlDownload = 'https://localhost:5001/api/usuario/GerarPDF';

  constructor(private http: HttpClient) {}

  PegarTodos(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  PegarPeloId(id: number): Observable<Usuario> {
    const apiUrl = `${this.url}/${id}`;
    return this.http.get<Usuario>(apiUrl);
  }

  // DownloadHistorico(id: number): Observable<Usuario> {
  //   const apiUrl = `${this.urlDownload}/${id}`;
  //   return this.http.get<Usuario>(apiUrl);
  // }

  DownloadHistorico (id: number){
    const apiUrl = `${this.urlDownload}/${id}`;
    //  const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/PDF');
  
    return this.http.post<string>(apiUrl, { headers: headers, responseType: 'blob'});
  }

  SalvarAluno(modelo: any): Observable<any> {
    delete modelo["id"];
    return this.http.post<any>(this.url, modelo, httpOptions);
  }


  AtualizarAluno(modelo: any): Observable<any> {     
    return this.http.put<any>(this.url, modelo, httpOptions);
  }

  ExcluirAluno(id: number): Observable<any> {
    const apiUrl = `${this.url}/${id}`;
    return this.http.delete<number>(apiUrl, httpOptions);
  }

  Excluir(): Observable<Usuario[]> {
    return this.http.delete<Usuario[]>(this.url);
  }
}
