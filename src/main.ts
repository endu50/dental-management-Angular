import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient,withInterceptorsFromDi  } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/auth/auth.interceptor';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()), // ✅ Modern replacement for HttpClientModule
    provideRouter(routes),

  ]
}).catch(err => console.error(err));