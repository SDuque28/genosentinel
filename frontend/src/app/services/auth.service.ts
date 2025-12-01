import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/genosentinel/auth';
  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.tokenSubject = new BehaviorSubject<string | null>(this.getToken());
    this.token$ = this.tokenSubject.asObservable();
    console.log('AuthService initialized. Token exists:', !!this.getToken());
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Attempting login for:', credentials.username);
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Login successful, storing token');
        this.setToken(response.token);
      })
    );
  }

  logout(): void {
    console.log('Logging out, removing token');
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      console.log('Getting token from localStorage:', token ? 'Token exists' : 'No token');
      return token;
    }
    return null;
  }

  private setToken(token: string): void {
    console.log('Setting token in localStorage');
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
    this.tokenSubject.next(token);
  }

  isAuthenticated(): boolean {
    const authenticated = !!this.getToken();
    console.log('Is authenticated:', authenticated);
    return authenticated;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    console.log('Creating auth headers. Token present:', !!token);
    if (token) {
      console.log('Token preview:', token.substring(0, 20) + '...');
    }
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }
}