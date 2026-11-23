import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';

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

  msgErro: string = '';
  msgSucesso: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  cadastrar(): void {
    this.msgErro = '';
    this.msgSucesso = '';

    if (!this.nome.trim() || !this.email.trim() || !this.senha.trim()) {
      this.msgErro = 'Preencha todos os campos obrigatórios';
      return;
    }

    if (this.senha.length < 6) {
      this.msgErro = 'Insira uma senha de pelo menos seis caracteres';
      return;
    }
    const novoUsuario: Usuario = {
      id: 0,
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      perfil: 'user',
    };

    this.usuarioService.cadastrar(novoUsuario);
    this.router.navigate(['/inventory'])
    console.log('Usuários cadastrados:', this.usuarioService.listar());
  }
}
