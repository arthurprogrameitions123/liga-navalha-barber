import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonInput, IonItem } from '@ionic/angular';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, IonItem, IonInput, IonButton],
  template: `
    <ion-content class="ion-padding">
      <h1 class="titulo">Navalha Barber</h1>
      <ion-item>
        <ion-input label="E-mail" type="email" placeholder="voce@email.com"
          (ionInput)="email = $any($event).detail.value ?? ''"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label="Senha" type="password"
          (ionInput)="senha = $any($event).detail.value ?? ''"></ion-input>
      </ion-item>
      @if (erro()) { <p class="erro">{{ erro() }}</p> }
      <ion-button expand="block" color="warning" (click)="entrar()">Entrar</ion-button>
      <ion-button expand="block" fill="clear" color="warning" (click)="criar()">Criar conta</ion-button>
    </ion-content>`,
  styles: [`.titulo{color:#ca8a04;margin:48px 0 24px}.erro{color:#f87171}`],
})
export class LoginPage {
  email = '';
  senha = '';
  erro = signal('');

  constructor(private router: Router) {}

  async entrar() {
    await this.run(() => signInWithEmailAndPassword(auth, this.email.trim(), this.senha));
  }

  criar() {
    this.router.navigateByUrl('/cadastro');
}

  private async run(fn: () => Promise<unknown>) {
    try {
      this.erro.set('');
      await fn();
      this.router.navigateByUrl('/servicos');
    } catch (e: any) {
      console.error(e);
      this.erro.set('Erro: ' + (e?.code ?? e?.message ?? 'desconhecido'));
    }
  }
}