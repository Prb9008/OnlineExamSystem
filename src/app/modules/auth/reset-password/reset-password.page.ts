import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.css'],
})
export class ResetPasswordPage {
  resetPasswordForm: FormGroup;
  token: string='';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
    });

    // Get the token from the URL parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value.newPassword).subscribe(
        () => {
          // Handle success, e.g., navigate to login page
          this.router.navigate(['/login']);
        },
        (error) => {
          // Handle error, e.g., show an error message
          console.error('Reset Password error', error);
        }
      );
    }
  }
}
