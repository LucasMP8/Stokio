import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  msgErro: string = '';
  ambosVaziosErro: boolean = false;

  formularioLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required]),
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  emailFormatoInvalido(): boolean {
    const email = this.formularioLogin.get('email');
    return Boolean(email && email.hasError('email') && (email.touched || email.dirty));
  }

  campoVazio(campo: string): boolean {
    if (this.ambosVaziosErro) {
      return false;
    }
    const controle = this.formularioLogin.get(campo);
    return Boolean(
      controle && controle.hasError('required') && (controle.touched || controle.dirty),
    );
  }

  limparErroGeral(): void {
    this.msgErro = '';
    this.ambosVaziosErro = false;
  }

  entrar(): void {
    this.msgErro = '';
    this.ambosVaziosErro = false;

    const email = (this.formularioLogin.value.email ?? '').trim();
    const senha = (this.formularioLogin.value.senha ?? '').trim();

    if (!email && !senha) {
      this.ambosVaziosErro = true;
      this.msgErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    if (!email || !senha) {
      this.msgErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.usuarioService.autenticar(email, senha).subscribe({
      next: (usuarioEncontrado) => {
        if (!usuarioEncontrado) {
          this.msgErro = 'Email ou senha inválidos.';
          this.cdr.detectChanges();
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.msgErro =
          'Não foi possível conectar ao servidor. Verifique se o JSON-Server está ativo.';
        this.cdr.detectChanges();
      },
    });
  }
}
