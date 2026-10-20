import { Injectable, computed, signal } from '@angular/core';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type CategoriaServico = 'cabelo' | 'barba' | 'bigode';

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  categoria: CategoriaServico;
  esgotado?: boolean;
  combo?: boolean;
}

const SEED: Servico[] = [

  // CABELO
  { id: 'corte', nome: 'Corte degradê', preco: 45, categoria: 'cabelo' },
  { id: 'low-fade', nome: 'Low Fade', preco: 40, categoria: 'cabelo' },
  { id: 'mid-fade', nome: 'Mid Fade', preco: 45, categoria: 'cabelo' },
  { id: 'high-fade', nome: 'High Fade', preco: 50, categoria: 'cabelo' },
  { id: 'social', nome: 'Corte social', preco: 35, categoria: 'cabelo' },
  { id: 'buzz-cut', nome: 'Buzz Cut', preco: 30, categoria: 'cabelo' },

  // BARBA
  { id: 'barba', nome: 'Barba tradicional', preco: 30, categoria: 'barba' },
  { id: 'barba-degrade', nome: 'Barba degradê', preco: 35, categoria: 'barba' },
  { id: 'barba-desenhada', nome: 'Barba desenhada', preco: 40, categoria: 'barba' },

  // BIGODE
  { id: 'bigode-aparar', nome: 'Aparar bigode', preco: 15, categoria: 'bigode' },
  { id: 'bigode-modelar', nome: 'Modelagem de bigode', preco: 20, categoria: 'bigode' },
];

export const DESCONTO_COMBO = 10;

@Injectable({ providedIn: 'root' })
export class ComandaService {
  servicos = signal<Servico[]>([]);
  selecionados = signal<string[]>([]);

  itens = computed(() => this.servicos().filter(s => this.selecionados().includes(s.id)));
  cheio = computed(() => this.itens().reduce((t, s) => t + s.preco, 0));
  // Regra do print: Corte degradê + Barba avulsos => R$ 10 off
  temComboDesconto = computed(() => {
    const ids = this.selecionados();
    return ids.includes('corte') && ids.includes('barba') && !ids.includes('combo');
  });
  desconto = computed(() => (this.temComboDesconto() ? DESCONTO_COMBO : 0));
  total = computed(() => this.cheio() - this.desconto());


async carregar() {
  this.servicos.set(SEED);
}


  alternar(s: Servico) {
    if (s.esgotado) return; // esgotado não entra na comanda
    this.selecionados.update(ids => (ids.includes(s.id) ? ids.filter(i => i !== s.id) : [...ids, s.id]));
  }

  async fechar() {
    await addDoc(collection(db, 'comandas'), {
      uid: auth.currentUser?.uid ?? null,
      itens: this.itens().map(s => ({ id: s.id, nome: s.nome, preco: s.preco })),
      cheio: this.cheio(),
      desconto: this.desconto(),
      total: this.total(),
      criadoEm: serverTimestamp(),
    });
    this.selecionados.set([]);
  }
}
