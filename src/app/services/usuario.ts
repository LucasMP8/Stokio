import { Service } from '@angular/core';
import { Usuario } from '../models/usuario';

@Service()
export class UsuarioService {
  private usuarios: Usuario[] = [
    {
      id: 1,
      nome: 'Jason Durião',
      email: 'jasond@gmail.com',
      senha: 'vicecity',
      perfil: 'admin',
    },
    {
      id: 2,
      nome: 'Lucia Kamio',
      email: 'luciakamio@gmail.com',
      senha: '00000000',
      perfil: 'user',
    },
  ];

listar(): Usuario[] {
    return this.usuarios;
}

cadastrar(novoUsuario: Usuario): void{
    novoUsuario.id = this.usuarios.length  +1;
    this.usuarios.push(novoUsuario)
}

autenticar(email: string, senha: string): Usuario | undefined{
  return this.usuarios.find(
    (usuarios) => usuarios.email === email && usuarios.senha === senha
  );
} 

}
