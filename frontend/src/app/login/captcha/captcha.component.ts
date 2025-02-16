// captcha.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {
  code: string = '';
  isValidCaptcha: boolean = false;

  @Output() captchaValidated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha(): void {
    const captchaContainer = document.getElementById('captcha');
    if (captchaContainer) captchaContainer.innerHTML = '';

    const charsArray =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    const lengthOtp = 6;
    const captcha: string[] = [];
    for (let i = 0; i < lengthOtp; i++) {
      const index = Math.floor(Math.random() * charsArray.length);
      if (captcha.indexOf(charsArray[index]) === -1) {
        captcha.push(charsArray[index]);
      } else {
        i--;
      }
    }

    const canv = document.createElement('canvas');
    canv.id = 'captchaCanvas';
    canv.width = 150;
    canv.height = 50;
    const ctx = canv.getContext('2d');
    if (ctx) {
      ctx.font = '30px Georgia';
      ctx.fillStyle = 'black';
      ctx.fillText(captcha.join(''), 10, 35);
    }

    this.code = captcha.join('');
    if (captchaContainer) captchaContainer.appendChild(canv);
  }

  validateCaptcha(event: Event): void {
    event.preventDefault();
    const inputElement = document.getElementById('cpatchaTextBox') as HTMLInputElement;
    if (inputElement.value === this.code) {
      this.isValidCaptcha = true;
    } else {
      this.isValidCaptcha = false;
      this.createCaptcha();
    }
    this.captchaValidated.emit(this.isValidCaptcha);
  }
}