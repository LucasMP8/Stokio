import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  nome: string = '';
  email: string = '';
  senha: string = '';

  constructor(private usuarioService: UsuarioService) {}

  cadastrar(): void {
    const novoUsuario: Usuario = {
      id: 0, 
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      perfil: 'user', 
    };

    this.usuarioService.cadastrar(novoUsuario);
    console.log('Usuários cadastrados:', this.usuarioService.listar());
  }
}
