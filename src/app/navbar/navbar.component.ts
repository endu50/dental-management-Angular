import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  /**
   *
   */
  role: string | null = null;
  constructor( public authService:AuthService) { }

  ngOnInit(): void {
  this.authService.getRole().subscribe(role => {
    console.log("Role Updated:", role);
    this.role = role;  // <-- Assign to component variable
  });

     
   //  console.log("role"+ this.role);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

   logout()
   {
    this.authService.logout();
    window.location.reload();
   }
}
