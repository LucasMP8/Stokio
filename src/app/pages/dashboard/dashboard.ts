import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly produtoService = inject(ProdutoService);
  private readonly cdr = inject(ChangeDetectorRef);

  produtos: Produto[] = [];
  erroCarregamento: string = '';

  totalEntradas: number = 0;
  totalSaidas: number = 0;
  totalDevolucoes: number = 0;
  totalPerdas: number = 0;
  dadosGrafico: dadoGraficoMensal[] = [
    { mes: 'Jun', entradas: 45, saidas: 32 },
    { mes: 'Jul', entradas: 58, saidas: 44 },
    { mes: 'Ago', entradas: 38, saidas: 41 },
    { mes: 'Set', entradas: 52, saidas: 35 },
    { mes: 'Out', entradas: 48, saidas: 46 },
    { mes: 'Nov', entradas: 55, saidas: 39 },
  ];

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.erroCarregamento = '';
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erroCarregamento = 'Não foi possível carregar os produtos do servidor.';
        this.cdr.detectChanges();
      },
    });
  }

  get tetoGrafico(): number {
    const valores = this.dadosGrafico.flatMap((d) => [d.entradas, d.saidas]);
    const maior = Math.max(...valores, 0);

    if (maior === 0) {
      return 20;
    }

    return Math.ceil(maior / 20) * 20;
  }

  get linhasEscala(): number[] {
    const teto = this.tetoGrafico;
    return [teto, teto * 0.75, teto * 0.5, teto * 0.25, 0];
  }

  calcularAltura(valor: number): number {
    return (valor / this.tetoGrafico) * 100;
  }

  get produtosAtivos(): Produto[] {
    return this.produtos.filter((p) => p.ativo);
  }

  get produtosInativos(): Produto[] {
    return this.produtos.filter((p) => !p.ativo);
  }

  get produtosEmAlerta(): Produto[] {
    return this.produtosAtivos.filter((p) => p.quantidade <= p.estoqueMinimo);
  }

  get totalEmEstoque(): number {
    return this.produtosAtivos.reduce((soma, p) => soma + p.quantidade, 0);
  }

  get custoEmEstoque(): number {
    return this.produtosAtivos.reduce((soma, p) => soma + p.precoCusto * p.quantidade, 0);
  }

  get potencialDeVenda(): number {
    return this.produtosAtivos.reduce((soma, p) => soma + p.precoVenda * p.quantidade, 0);
  }

  get lucroEstimado(): number {
    return this.potencialDeVenda - this.custoEmEstoque;
  }

  get margemMedia(): number {
    if (this.potencialDeVenda === 0) {
      return 0;
    }
    return (this.lucroEstimado / this.potencialDeVenda) * 100;
  }

  isCritico(produto: Produto): boolean {
    return produto.quantidade <= produto.estoqueMinimo / 2;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatarPercentual(valor: number): string {
    return `${valor.toFixed(1).replace('.', ',')}%`;
  }

  formatarUnidade(quantidade: number, unidade: string): string {
    const base = unidade.toLowerCase();
    return quantidade === 1 ? base : `${base}s`;
  }

  goToInventory(): void {
    this.router.navigate(['/inventory']);
  }
}

interface dadoGraficoMensal {
  mes: string;
  entradas: number;
  saidas: number;
}
