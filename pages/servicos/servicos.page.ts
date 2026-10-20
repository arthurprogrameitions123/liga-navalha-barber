
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar
} from '@ionic/angular';

import { signOut } from 'firebase/auth';

import {
  ComandaService,
  CategoriaServico
} from '../../services/comanda.service';

import { auth } from '../../services/firebase';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Navalha</ion-title>

        <ion-buttons slot="end">
          <ion-button (click)="sair()">Sair</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      @if (categoriaAtual === null) {

        <h2>Adicionar serviços</h2>
        <p class="subtitulo">Escolha uma categoria</p>

        <div class="categorias">

          <div class="categoria" (click)="abrirCategoria('cabelo')">
            <div class="icone">✂️</div>
            <h2>Cabelo</h2>
            <p>Cortes e estilos</p>
          </div>

          <div class="categoria" (click)="abrirCategoria('barba')">
            <div class="icone">🧔</div>
            <h2>Barba</h2>
            <p>Estilos de barba</p>
          </div>

          <div class="categoria" (click)="abrirCategoria('bigode')">
            <div class="icone">〰️</div>
            <h2>Bigode</h2>
            <p>Modelos de bigode</p>
          </div>

        </div>

      } @else {

        <ion-button fill="clear" (click)="voltarCategorias()">
          ← Voltar às categorias
        </ion-button>

        <h2>{{ tituloCategoria() }}</h2>
        <p class="subtitulo">Escolha o serviço desejado</p>

        <div class="servicos">

          @if (carregando) {
            <p>Carregando serviços...</p>
          } @else {

            @for (s of servicosDaCategoria(); track s.id) {

              <div
                class="item"
                [class.sel]="c.selecionados().includes(s.id)"
                [class.off]="s.esgotado"
                (click)="c.alternar(s)"
              >

                <div>
                  <strong>{{ s.nome }}</strong>

                  @if (c.selecionados().includes(s.id)) {
                    <div class="selecionado">Selecionado ✓</div>
                  }
                </div>

                <div class="preco">
                  R$ {{ s.preco.toFixed(2) }}
                </div>

              </div>

            } @empty {
              <p>Nenhum serviço encontrado nesta categoria.</p>
            }

          }

        </div>

      }

      <div class="rodape">
        <ion-button
          expand="block"
          color="warning"
          [disabled]="!c.selecionados().length"
          (click)="ir()"
        >
          Ver comanda ({{ c.selecionados().length }})
        </ion-button>
      </div>

    </ion-content>
  `,
  styles: [`
    .subtitulo {
      color: #999;
      margin-bottom: 20px;
    }

    .categorias {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .categoria {
      background: #262626;
      border: 1px solid #404040;
      border-radius: 15px;
      padding: 25px 12px;
      text-align: center;
      cursor: pointer;
      transition: 0.2s;
    }

    .categoria:active {
      transform: scale(0.96);
      border-color: #ca8a04;
    }

    .categoria h2 {
      margin: 10px 0 5px;
      font-size: 1.2rem;
    }

    .categoria p {
      color: #999;
      font-size: 0.85rem;
    }

    .icone {
      font-size: 2.5rem;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 12px;
      background: #262626;
      border: 1px solid #404040;
      cursor: pointer;
    }

    .item.sel {
      border-color: #ca8a04;
      background: #353020;
    }

    .item.off {
      opacity: 0.55;
    }

    .preco {
      font-weight: bold;
      color: #eab308;
    }

    .selecionado {
      color: #ca8a04;
      font-size: 0.8rem;
      margin-top: 5px;
    }

    .rodape {
      margin-top: 25px;
      padding-bottom: 15px;
    }
  `]
})
export class ServicosPage implements OnInit {

  categoriaAtual: CategoriaServico | null = null;
  carregando = true;

  constructor(
    public c: ComandaService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.carregando = true;

    try {
      await this.c.carregar();
    } catch (erro) {
      console.error('Erro ao carregar serviços:', erro);
    } finally {
      this.carregando = false;
    }
  }

  abrirCategoria(categoria: CategoriaServico) {
    this.categoriaAtual = categoria;
  }

  voltarCategorias() {
    this.categoriaAtual = null;
  }

  tituloCategoria(): string {
    const titulos: Record<CategoriaServico, string> = {
      cabelo: 'Cabelo',
      barba: 'Barba',
      bigode: 'Bigode'
    };

    return this.categoriaAtual
      ? titulos[this.categoriaAtual]
      : '';
  }

  servicosDaCategoria() {
    return this.c.servicos().filter(
      s => s.categoria === this.categoriaAtual
    );
  }

  ir() {
    this.router.navigateByUrl('/comanda');
  }

  async sair() {
    await signOut(auth);
    this.router.navigateByUrl('/login');
  }
}
