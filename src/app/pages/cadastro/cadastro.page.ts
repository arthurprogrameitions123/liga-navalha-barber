import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonInput, IonItem } from '@ionic/angular';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton],
  template: `
    <ion-content class="ion-padding">
      <h1 class="titulo">Criar conta</h1>
      <ion-item>
        <ion-input label="E-mail" type="email" (ionInput)="email = $any($event).detail.value ?? ''"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Senha" type="password" (ionInput)="senha = $any($event).detail.value ?? ''"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Confirmar senha" type="password" (ionInput)="confirma = $any($event).detail.value ?? ''"></ion-input>
      </ion-item>
      @if (erro()) { <p class="erro">{{ erro() }}</p> }
      <ion-button expand="block" color="warning" (click)="cadastrar()">Cadastrar</ion-button>
      <ion-button expand="block" fill="clear" color="warning" (click)="voltar()">Já tenho conta</ion-button>
    </ion-content>`,
  styles: [`.titulo{color:#ca8a04;margin:48px 0 24px}.erro{color:#f87171}`],
})
export class CadastroPage {
  email = '';
  senha = '';
  confirma = '';
  erro = signal('');

  constructor(private router: Router) {}

  async cadastrar() {
    if (this.senha.length < 6) return this.erro.set('A senha precisa ter pelo menos 6 caracteres.');
    if (this.senha !== this.confirma) return this.erro.set('As senhas não conferem.');
    try {
      this.erro.set('');
      await createUserWithEmailAndPassword(auth, this.email.trim(), this.senha);
      this.router.navigateByUrl('/servicos');
    } catch (e: any) {
      console.error(e);
      this.erro.set('Erro: ' + (e?.code ?? 'desconhecido'));
    }
  }

  voltar() { this.router.navigateByUrl('/login'); }
}
