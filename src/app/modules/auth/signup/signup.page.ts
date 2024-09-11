import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.css'],
})
export class SignupPage {
  signupForm: FormGroup;
  otpForm: FormGroup;
  isOtpSent = false;
  email = '';
  isModalOpen = false;
  modalMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.email = this.signupForm.get('email')?.value;
      this.authService.register(this.signupForm.value).subscribe(
        () => {
          this.isOtpSent = true;
          this.authService.sendOtp(this.email).subscribe();
        },
        (error) => {
          this.showModal('Signup failed: ' + error.error.message);
        }
      );
    } else {
      this.showModal('Please fill in all required fields.');
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      this.authService.verifyOtp({ email: this.email, otp: this.otpForm.value.otp }).subscribe(
        () => {
          this.router.navigate(['/login']);
        },
        (error) => {
          this.showModal('OTP verification failed: ' + error.error.message);
        }
      );
    } else {
      this.showModal('Please enter the OTP.');
    }
  }

  showModal(message: string) {
    this.modalMessage = message;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
