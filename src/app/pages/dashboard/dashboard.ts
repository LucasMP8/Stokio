import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly router = inject(Router);

  produtos: Produto[] = [
    {
      id: 1,
      codigo: 'SKU-001',
      nome: 'Café Torrado 500g',
      categoria: 'Alimentos',
      precoCusto: 12.5,
      precoVenda: 19.9,
      quantidade: 35,
      estoqueMinimo: 10,
      unidade: 'Pacote',
      ativo: true,
      estoqueId: 1,
    },
    {
      id: 2,
      codigo: 'SKU-002',
      nome: 'Refrigerante Cola 2L',
      categoria: 'Bebidas',
      precoCusto: 5.2,
      precoVenda: 9.5,
      quantidade: 8,
      estoqueMinimo: 10,
      unidade: 'Unidade',
      ativo: true,
      estoqueId: 1,
    },
    {
      id: 3,
      codigo: 'SKU-003',
      nome: 'Detergente Neutro',
      categoria: 'Limpeza',
      precoCusto: 1.8,
      precoVenda: 3.5,
      quantidade: 50,
      estoqueMinimo: 15,
      unidade: 'Unidade',
      ativo: true,
      estoqueId: 2,
    },
    {
      id: 4,
      codigo: 'SKU-004',
      nome: 'Sabão em Pó 1kg',
      categoria: 'Limpeza',
      precoCusto: 9.0,
      precoVenda: 15.9,
      quantidade: 4,
      estoqueMinimo: 8,
      unidade: 'Caixa',
      ativo: true,
      estoqueId: 2,
    },
    {
      id: 5,
      codigo: 'SKU-005',
      nome: 'Biscoito Recheado',
      categoria: 'Alimentos',
      precoCusto: 2.1,
      precoVenda: 4.2,
      quantidade: 0,
      estoqueMinimo: 12,
      unidade: 'Pacote',
      ativo: false,
      estoqueId: 3,
    },
  ];

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


