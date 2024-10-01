import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';  // Service to interact with backend

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  userStats: any;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserStats().subscribe(stats => {
      this.userStats = stats;
    });
  }
}
