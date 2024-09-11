import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.css'],
})
export class ForgotPasswordPage {
  forgotPasswordForm: FormGroup;
  otpForm: FormGroup;
  isOtpSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.forgotPasswordForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.authService.sendOtp(this.forgotPasswordForm.value).subscribe(
        () => {
          this.isOtpSent = true;
          this.presentAlert('OTP sent to your email.');
        },
        (error) => {
          this.presentAlert('Failed to send OTP. Please check your username and email.');
        }
      );
    }
  }

  onVerifyOtp() {
    if (this.otpForm.valid) {
      this.authService.verifyOtp({
        ...this.forgotPasswordForm.value,
        otp: this.otpForm.value.otp,
      }).subscribe(
        () => {
          this.router.navigate(['/reset-password'], { queryParams: { username: this.forgotPasswordForm.value.username } });
        },
        (error) => {
          this.presentAlert('Invalid OTP. Please try again.');
        }
      );
    }
  }
}
