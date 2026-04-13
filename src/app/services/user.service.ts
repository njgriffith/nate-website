import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface User {
    isLoggedIn: boolean;
    username: string;
    password: string;
    puzzleLevel: number;
    easy: number | undefined;
    medium: number | undefined;
    hard: number | undefined;
    expert: number | undefined;
    master: number | undefined;
    balance: number;
    shapesOwned: string[];
    miningTools: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private passwordSubject = new BehaviorSubject<string>('');
    password$ = this.passwordSubject.asObservable();

    user: User = {
        isLoggedIn: false,
        username: '',
        password: '',
        puzzleLevel: 0,
        easy: undefined,
        medium: undefined,
        hard: undefined,
        expert: undefined,
        master: undefined,
        balance: 0,
        shapesOwned: [],
        miningTools: []
    };
    private userSubject = new BehaviorSubject<User>(this.user);
    user$ = this.userSubject.asObservable();

    constructor(private apiService: ApiService) { }

    login(username: string, password: string) {
        if (password !== undefined) {
            this.passwordSubject.next(password);
        }
        return this.apiService.loginUser(username, password).pipe(
            tap((response: any) => {
                this.setUser(username, response?.user_data ?? {});
            })
        );
    }

    setUser(username: string, userData: Record<string, any>) {
        this.user.isLoggedIn = true;
        this.user.username = username;
        this.user.password = this.passwordSubject.value;
        this.user.puzzleLevel = userData['puzzle'] ?? 0;
        this.user.easy = userData['easy'] ?? undefined;
        this.user.medium = userData['medium'] ?? undefined;
        this.user.hard = userData['hard'] ?? undefined;
        this.user.expert = userData['expert'] ?? undefined;
        this.user.master = userData['master'] ?? undefined;
        this.user.balance = userData['balance'] ?? 0;
        this.user.shapesOwned = userData['shapes_owned'] ?? [];
        this.user.miningTools = userData['mining_tools'] ?? [];

        this.userSubject.next(this.user);
    }

    updateUserBackend() {
        this.apiService.updateUser(this.user).subscribe({
            next: () => {
                alert('user updated successfully');
                this.userSubject.next(this.user);
            },
            error: () => {
                console.log('error updating user');
            }
        });
    }

    setPassword(password: string) {
        this.passwordSubject.next(password);
    }
}
