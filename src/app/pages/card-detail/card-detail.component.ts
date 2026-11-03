import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StoreCard } from '../../models/store-card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.css'],
})
export class CardDetailComponent implements OnInit {
  card?: StoreCard;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.card = this.cardService.getCardById(id);
    });
  }

  goBack(): void {
    this.router.navigate(['/inventory']);
  }
}
