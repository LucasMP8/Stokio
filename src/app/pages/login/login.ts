import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  senha: string = '';
  msgErro: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  entrar(): void {
    this.msgErro = '';

    if (!this.email.trim() || !this.senha.trim()) {
      this.msgErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const usuarioEncontrado = this.usuarioService.autenticar(
      this.email,
      this.senha
    );

    if (!usuarioEncontrado) {
      this.msgErro = 'Email ou senha inválidos.';
      return;
    }

    this.router.navigate(['/dashboard']);
  }
}