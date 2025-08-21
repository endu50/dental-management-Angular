import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet,RouterLink,RouterLinkActive} from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { AuthService } from './auth-service.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent,FooterComponent,RouterLink,RouterLinkActive], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'DentalDanaClinick';
   isLoggedIn :boolean=false;
   Role : any;
  /**
   *
   */
  constructor(private auth: AuthService, private router: Router) { 
    
    
  }
  ngOnInit(): void {
      
// const token = localStorage.getItem('token');
// if (token) {
//   const decoded: any = jwtDecode(token);
//   const now = Date.now();
//   if (decoded.exp * 1000 > now) {
//     this.auth.startLogoutTimer(decoded.exp); // ✅ only pass seconds
//   } else {
//     this.auth.logout();
//   }
// }

  const activityEvents = ['mousemove','mousedown','keypress','touchstart','scroll'];
  activityEvents.forEach(e => window.addEventListener(e, () => this.auth.updateLastActivity(), {passive:true}));

  // optionally initialize lastActivity from storage
  const stored = localStorage.getItem('lastActivity');
  if (stored) this.auth.updateLastActivity(); // or parse/assign
    //   if (this.auth.isTokenExpired()) {
    //   alert('Session expired. You will be logged out.');
    //   this.auth.logout();  // clear localStorage or token
    //   this.router.navigate(['/login']);  // redirect to login
    // }
  
  // Subscribe to reactive login state (keeps UI in sync)
  this.auth.isLoggedIn$.subscribe(status => {
    this.isLoggedIn = status;
    console.log("is logged in"+ this.isLoggedIn);
    // optionally update UI or trigger other behaviors
  });

  // Subscribe to role if you need to show/hide items
  this.auth.currentUserRole$.subscribe(role => {
     this.Role= role;
     console.log("the RolE"+ this.Role);
  });

  }
 
}
