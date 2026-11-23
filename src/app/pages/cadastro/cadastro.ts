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

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  validarNome(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valorSemNumeros = input.value.replace(/\d/g, '');
    input.value = valorSemNumeros;
    this.nome = valorSemNumeros;
  }

  cadastrar(): void {
    this.msgErro = '';

    const nomeLimpo = this.nome.trim();
    const emailLimpo = this.email.trim();

    if (!nomeLimpo || !emailLimpo || !this.senha.trim()) {
      this.msgErro = 'Preencha todos os campos obrigatórios';
      return;
    }

    if (/\d/.test(nomeLimpo)) {
      this.msgErro = 'O nome não pode conter números';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpo)) {
      this.msgErro = 'Insira um email válido';
      return;
    }

    if (this.senha.length < 6) {
      this.msgErro = 'Insira uma senha de pelo menos seis caracteres';
      return;
    }

    const novoUsuario: Usuario = {
      id: 0,
      nome: nomeLimpo,
      email: emailLimpo,
      senha: this.senha,
      perfil: 'user',
    };

    this.usuarioService.cadastrar(novoUsuario);
    this.router.navigate(['/dashboard']);
  }
}
