import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  nom?: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private KEY_USERS = 'miniapp_users';
  private KEY_CURRENT = 'miniapp_current';
  private userSubject = new BehaviorSubject<User | null>(this.loadCurrent());
  user$ = this.userSubject.asObservable();

  private loadUsers(): User[] {
    try {
      return JSON.parse(localStorage.getItem(this.KEY_USERS) || '[]');
    } catch {
      return [];
    }
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(this.KEY_USERS, JSON.stringify(users));
  }

  private loadCurrent(): User | null {
    try {
      return JSON.parse(localStorage.getItem(this.KEY_CURRENT) || 'null');
    } catch {
      return null;
    }
  }

  register(user: User): 'OK' | 'EMAIL_EXISTS' {
    const users = this.loadUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return 'EMAIL_EXISTS';
    }
    users.push(user);
    this.saveUsers(users);
    this.setUser(user);
    return 'OK';
  }

  login(email: string): boolean {
    const users = this.loadUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.setUser(found);
      return true;
    }
    return false;
  }

  setUser(user: User) {
    localStorage.setItem(this.KEY_CURRENT, JSON.stringify(user));
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.userSubject.value;
  }

  clearUser() {
    localStorage.removeItem(this.KEY_CURRENT);
    this.userSubject.next(null);
  }
}
