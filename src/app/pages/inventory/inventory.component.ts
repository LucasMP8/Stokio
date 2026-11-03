import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { StoreCard, StoreCardInput } from '../../models/store-card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  searchTerm = '';

  /** Controle do formulário (modal) de criação/edição. */
  isFormOpen = false;
  editingId: number | null = null;
  form: StoreCardInput = this.emptyForm();

  private subscription?: Subscription;

  constructor(
    private cardService: CardService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscription = this.cardService.searchTerm$.subscribe((term) => (this.searchTerm = term));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get cards(): StoreCard[] {
    return this.cardService.searchCards(this.searchTerm);
  }

  get nextIdPreview(): number {
    return Math.max(0, ...this.cardService.getCards().map((c) => c.id)) + 1;
  }

  trackById(_index: number, card: StoreCard): number {
    return card.id;
  }

  openCreate(): void {
    this.editingId = null;
    this.form = this.emptyForm();
    this.isFormOpen = true;
  }

  openEdit(card: StoreCard, event?: Event): void {
    event?.stopPropagation();
    this.editingId = card.id;
    this.form = { cardName: card.cardName, name: card.name, description: card.description };
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingId = null;
  }

  save(ngForm: NgForm): void {
    if (ngForm.invalid) {
      ngForm.control.markAllAsTouched();
      return;
    }

    if (this.editingId === null) {
      this.cardService.addCard(this.form);
    } else {
      this.cardService.updateCard(this.editingId, this.form);
    }
    this.closeForm();
  }

  viewDetails(card: StoreCard): void {
    this.router.navigate(['/inventory', card.id]);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isFormOpen) {
      this.closeForm();
    }
  }

  private emptyForm(): StoreCardInput {
    return { cardName: '', name: '', description: '' };
  }
}
