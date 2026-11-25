import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto';
import { MovimentacaoService } from '../../services/movimentacao.service';
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
  private readonly movimentacaoService = inject(MovimentacaoService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly mesesAbreviados = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  produtos: Produto[] = [];
  erroProdutos: string = '';

  private readonly resumoMovimentacoes = computed(() => {
    const movimentacoes = this.movimentacaoService.movimentacoes();
    let entradas = 0;
    let saidas = 0;
    let vendas = 0;
    let perdas = 0;

    for (const mov of movimentacoes) {
      if (mov.tipo === 'entrada') {
        entradas += mov.quantidade;
      } else if (mov.tipo === 'saida') {
        saidas += mov.quantidade;
        if (mov.motivo === 'venda') {
          vendas += mov.quantidade;
        } else if (mov.motivo === 'perda' || mov.motivo === 'uso-interno') {
          perdas += mov.quantidade;
        }
      }
    }

    return { entradas, saidas, vendas, perdas };
  });

  private readonly dadosGraficoCalculados = computed<dadoGraficoMensal[]>(() => {
    const movimentacoes = this.movimentacaoService.movimentacoes();
    const hoje = new Date();
    const meses: {
      ano: number;
      mesIndex: number;
      mes: string;
      entradas: number;
      saidas: number;
    }[] = [];

    for (let i = 5; i >= 0; i--) {
      const ref = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        ano: ref.getFullYear(),
        mesIndex: ref.getMonth(),
        mes: this.mesesAbreviados[ref.getMonth()],
        entradas: 0,
        saidas: 0,
      });
    }

    for (const mov of movimentacoes) {
      const dataMov = new Date(mov.data);
      if (Number.isNaN(dataMov.getTime())) {
        continue;
      }

      const bucket = meses.find(
        (m) => m.ano === dataMov.getFullYear() && m.mesIndex === dataMov.getMonth(),
      );

      if (!bucket) {
        continue;
      }

      if (mov.tipo === 'entrada') {
        bucket.entradas += mov.quantidade;
      } else if (mov.tipo === 'saida') {
        bucket.saidas += mov.quantidade;
      }
    }

    return meses.map(({ mes, entradas, saidas }) => ({ mes, entradas, saidas }));
  });

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.erroProdutos = '';
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erroProdutos = 'Não foi possível carregar os produtos do servidor.';
        this.cdr.detectChanges();
      },
    });
  }

  get erroCarregamento(): string {
    return this.erroProdutos || this.movimentacaoService.erro() || '';
  }

  get totalEntradas(): number {
    return this.resumoMovimentacoes().entradas;
  }

  get totalSaidas(): number {
    return this.resumoMovimentacoes().saidas;
  }

  get totalVendas(): number {
    return this.resumoMovimentacoes().vendas;
  }

  get totalPerdas(): number {
    return this.resumoMovimentacoes().perdas;
  }

  get dadosGrafico(): dadoGraficoMensal[] {
    return this.dadosGraficoCalculados();
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
