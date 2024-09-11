// src/app/modules/auth/auth.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'; // <-- Ensure this is imported

import { AuthRoutingModule } from './auth-routing.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,  // <-- Ensure this is included
    IonicModule,
    AuthRoutingModule
  ],
  declarations: [
   
  ]
})
export class AuthModule { }
