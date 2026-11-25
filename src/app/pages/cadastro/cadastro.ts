import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  styleUrl: './cadastro.css',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  msgErro: string = '';
  todosVaziosErro: boolean = false;

  formularioCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.pattern(/^[^0-9]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  campoVazio(campo: string): boolean {
    if (this.todosVaziosErro) {
      return false;
    }
    const controle = this.formularioCadastro.get(campo);
    return Boolean(
      controle && controle.hasError('required') && (controle.touched || controle.dirty),
    );
  }

  emailFormatoInvalido(): boolean {
    const email = this.formularioCadastro.get('email');
    return Boolean(email && email.hasError('email') && (email.touched || email.dirty));
  }

  senhaCurta(): boolean {
    const senha = this.formularioCadastro.get('senha');
    return Boolean(senha && senha.hasError('minlength') && (senha.touched || senha.dirty));
  }

  limparErroGeral(): void {
    this.msgErro = '';
    this.todosVaziosErro = false;
  }

  validarNome(event: Event): void {
    this.limparErroGeral();
    const input = event.target as HTMLInputElement;
    const valorSemNumeros = input.value.replace(/\d/g, '');
    input.value = valorSemNumeros;
    this.formularioCadastro.get('nome')?.setValue(valorSemNumeros, { emitEvent: false });
  }

  cadastrar(): void {
    this.msgErro = '';
    this.todosVaziosErro = false;

    const nome = (this.formularioCadastro.value.nome ?? '').trim();
    const email = (this.formularioCadastro.value.email ?? '').trim();
    const senha = this.formularioCadastro.value.senha ?? '';

    if (!nome && !email && !senha.trim()) {
      this.todosVaziosErro = true;
      this.msgErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.formularioCadastro.invalid) {
      this.formularioCadastro.markAllAsTouched();
      return;
    }

    if (!nome || !email || !senha.trim()) {
      this.msgErro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const novoUsuario: Usuario = {
      nome,
      email,
      senha,
      perfil: 'user',
    };

    this.usuarioService.cadastrar(novoUsuario).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.msgErro =
          'Não foi possível realizar o cadastro. Verifique se o JSON-Server está ativo.';
        this.cdr.detectChanges();
      },
    });

    this.usuarioService.cadastrar(novoUsuario);
    this.router.navigate(['/dashboard']);
  }
}
