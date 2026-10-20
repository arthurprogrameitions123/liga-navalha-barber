import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { ComandaService } from '../../services/comanda.service';

@Component({
  selector: 'app-comanda',
  standalone: true,
  imports: [CurrencyPipe, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
  template: `
    <ion-header><ion-toolbar>
      <ion-title>Comanda</ion-title>
      <ion-buttons slot="end"><ion-button (click)="voltar()">voltar</ion-button></ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      @for (s of c.itens(); track s.id) {
        <div class="item">
          <strong>{{ s.nome }}</strong>
          <span [class.riscado]="c.temComboDesconto()">{{ s.preco | currency:'BRL' }}</span>
        </div>
      }
      @if (c.temComboDesconto()) { <div class="aviso">Combo: R$ {{ c.desconto() }} off</div> }
      <div class="total">
        <div class="linha"><span>Cheio</span><span>{{ c.cheio() | currency:'BRL' }}</span></div>
        <div class="linha g"><span>Total</span><span>{{ c.total() | currency:'BRL' }}</span></div>
      </div>
      <ion-button expand="block" color="warning" [disabled]="!c.itens().length" (click)="fechar()">Fechar comanda</ion-button>
    </ion-content>`,
  styles: [`
    .item{display:flex;justify-content:space-between;padding:10px 12px;margin-bottom:8px;border-radius:12px;background:#262626;border:1px solid #404040}
    .riscado{text-decoration:line-through;color:#94a3b8}
    .aviso{background:#e0f2fe;color:#075985;border-radius:10px;padding:10px 12px;font-weight:600;margin:8px 0}
    .total{margin:12px 0;padding-top:10px;border-top:1px dashed #525252}
    .linha{display:flex;justify-content:space-between;margin:4px 0}.g{font-size:1.1rem;font-weight:800}`],
})
export class ComandaPage {
  constructor(public c: ComandaService, private router: Router) {}
  voltar() { this.router.navigateByUrl('/servicos'); }
  async fechar() { await this.c.fechar(); this.router.navigateByUrl('/servicos'); }
}
