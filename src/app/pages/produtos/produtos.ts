import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Produto } from '../../models/produto';
import { EstoqueService } from '../../services/estoque.service';
import { ProdutoInput, ProdutoService, Situacao } from '../../services/produto.service';

const POR_PAGINA = 8;

type CampoProduto = keyof ProdutoInput;

@Component({
  selector: 'app-produtos',
  standalone: false,
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos {
  private readonly produtoService = inject(ProdutoService);
  private readonly estoqueService = inject(EstoqueService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const estoqueId = Number(params.get('estoque'));
      if (estoqueId) {
        this.filtroEstoque.set(estoqueId);
        this.filtrosAbertos.set(true);
        this.pagina.set(1);
      }
    });
  }

  protected readonly estoques = this.estoqueService.estoques;
  protected readonly nextId = this.produtoService.nextId;

  protected readonly situacoes: { valor: Situacao; rotulo: string }[] = [
    { valor: 'em-estoque', rotulo: 'Em estoque' },
    { valor: 'estoque-baixo', rotulo: 'Estoque baixo' },
    { valor: 'sem-estoque', rotulo: 'Sem estoque' },
  ];

  protected readonly filtrosAbertos = signal(false);
  protected readonly filtroSituacao = signal<Situacao | ''>('');
  protected readonly filtroEstoque = signal<number | ''>('');
  protected readonly pagina = signal(1);

  protected readonly produtosFiltrados = computed(() =>
    this.produtoService
      .produtos()
      .filter(
        (p) =>
          (!this.filtroSituacao() || this.produtoService.situacao(p) === this.filtroSituacao()) &&
          (!this.filtroEstoque() || p.estoqueId === this.filtroEstoque()),
      ),
  );

  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.produtosFiltrados().length / POR_PAGINA)),
  );

  protected readonly produtosDaPagina = computed(() => {
    const inicio = (this.pagina() - 1) * POR_PAGINA;
    return this.produtosFiltrados().slice(inicio, inicio + POR_PAGINA);
  });

  protected readonly resumo = computed(() => {
    const produtos = this.produtoService.produtos();
    const soma = (valor: (p: Produto) => number) => produtos.reduce((t, p) => t + valor(p), 0);
    return {
      categorias: new Set(produtos.map((p) => p.categoria)).size,
      totalProdutos: produtos.length,
      valorVenda: soma((p) => p.precoVenda * p.quantidade),
      unidades: soma((p) => p.quantidade),
      valorCusto: soma((p) => p.precoCusto * p.quantidade),
      estoqueBaixo: produtos.filter((p) => this.produtoService.situacao(p) === 'estoque-baixo')
        .length,
      semEstoque: produtos.filter((p) => this.produtoService.situacao(p) === 'sem-estoque').length,
    };
  });

  protected readonly modalAberto = signal(false);
  protected readonly editandoId = signal<number | null>(null);

  private readonly inteiro = [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)];

  protected readonly form = this.fb.group({
    nome: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(60)]),
    estoqueId: this.fb.control<number | null>(null, Validators.required),
    precoVenda: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    quantidade: this.fb.control<number | null>(null, this.inteiro),
    estoqueMinimo: this.fb.control<number | null>(null, this.inteiro),
    precoCusto: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    categoria: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(40)]),
  });

  nomeEstoque(id: number): string {
    return this.estoqueService.getById(id)?.nome ?? '—';
  }

  situacao(produto: Produto): Situacao {
    return this.produtoService.situacao(produto);
  }

  rotuloSituacao(produto: Produto): string {
    const valor = this.situacao(produto);
    return this.situacoes.find((s) => s.valor === valor)!.rotulo;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarQuantidade(produto: Produto): string {
    const unidade = produto.unidade.toLowerCase();
    return `${produto.quantidade} ${produto.quantidade === 1 ? unidade : `${unidade}s`}`;
  }

  alternarFiltros(): void {
    this.filtrosAbertos.update((aberto) => !aberto);
  }

  filtrarPorSituacao(valor: string): void {
    this.filtroSituacao.set(valor as Situacao | '');
    this.pagina.set(1);
  }

  filtrarPorEstoque(valor: string): void {
    this.filtroEstoque.set(valor ? Number(valor) : '');
    this.pagina.set(1);
  }

  limparFiltros(): void {
    this.filtroSituacao.set('');
    this.filtroEstoque.set('');
    this.pagina.set(1);
  }

  proximaPagina(): void {
    this.pagina.update((p) => (p >= this.totalPaginas() ? 1 : p + 1));
  }

  abrirCadastro(): void {
    this.editandoId.set(null);
    this.form.reset();
    this.modalAberto.set(true);
  }

  abrirEdicao(produto: Produto): void {
    this.editandoId.set(produto.id);
    this.form.reset({
      nome: produto.nome,
      estoqueId: produto.estoqueId,
      precoVenda: produto.precoVenda,
      quantidade: produto.quantidade,
      estoqueMinimo: produto.estoqueMinimo,
      precoCusto: produto.precoCusto,
      categoria: produto.categoria,
    });
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    this.modalAberto.set(false);
    this.editandoId.set(null);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const dados: ProdutoInput = {
      nome: v.nome,
      categoria: v.categoria,
      estoqueId: Number(v.estoqueId),
      precoVenda: Number(v.precoVenda),
      precoCusto: Number(v.precoCusto),
      quantidade: Number(v.quantidade),
      estoqueMinimo: Number(v.estoqueMinimo),
    };
    const id = this.editandoId();
    if (id === null) {
      this.produtoService.add(dados);
    } else {
      this.produtoService.update(id, dados);
    }
    this.fecharModal();
  }

  invalido(campo: CampoProduto): boolean {
    const controle = this.form.controls[campo];
    return controle.invalid && controle.touched;
  }

  @HostListener('document:keydown.escape')
  aoPressionarEsc(): void {
    if (this.modalAberto()) {
      this.fecharModal();
    }
  }
}
