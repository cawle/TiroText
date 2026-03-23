import { Injectable, NgZone } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly supabaseService: SupabaseService, private ngZone: NgZone) {
    this.supabaseService.supabase.auth.getSession().then(({ data: { session } }) => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(session?.user ?? null);
      });
    });

    this.supabaseService.supabase.auth.onAuthStateChange((_event, session) => {
      this.ngZone.run(() => {
        this.currentUserSubject.next(session?.user ?? null);
      });
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async signInWithGoogle() {
    return this.supabaseService.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
  }

  async signIn(email: string, password: string) {
    return this.supabaseService.supabase.auth.signInWithPassword({ email, password });
  }

  async signUp(email: string, password: string, fullName: string) {
    return this.supabaseService.supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { full_name: fullName }
      }
    });
  }

  async signOut() {
    return this.supabaseService.supabase.auth.signOut();
  }
}
