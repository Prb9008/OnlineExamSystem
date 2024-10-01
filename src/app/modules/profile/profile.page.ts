import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';  // Service to interact with backend

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.profileForm = this.fb.group({
      mobile_number: [''],
      education: [''],
      role: [''],
      profile_picture: [null]
    });
  }

  ngOnInit() {
    // Fetch user profile from backend
    this.userService.getProfile().subscribe((data) => {
      this.profileForm.patchValue({
        mobile_number: data.mobile_number,
        education: data.education,
        role: data.role
      });
    });
  }

  // Handle file input change
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Submit updated profile
  onSubmit() {
    const formData = new FormData();
    formData.append('mobile_number', this.profileForm.get('mobile_number')?.value);
    formData.append('education', this.profileForm.get('education')?.value);
    formData.append('role', this.profileForm.get('role')?.value);
    if (this.selectedFile) {
      formData.append('profile_picture', this.selectedFile);
    }

    this.userService.updateProfile(formData).subscribe(response => {
      console.log('Profile updated successfully', response);
    });
  }
}
