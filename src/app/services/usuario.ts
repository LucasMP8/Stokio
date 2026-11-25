import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  cadastrar(novoUsuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, novoUsuario);
  }

  autenticar(email: string, senha: string): Observable<Usuario | undefined> {
    const params = new HttpParams().set('email', email).set('senha', senha);

    return this.http.get<Usuario[]>(this.apiUrl, { params }).pipe(map((usuarios) => usuarios[0]));
  }
}
