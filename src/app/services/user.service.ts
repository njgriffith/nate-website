import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppService } from './prod-app.service';

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

    constructor(private apiService: ApiService, private appService: AppService) { }

    login(username: string, password: string) {
        return this.apiService.loginUser(username, password).pipe(
            tap((response: any) => {
                this.setUser(username, password, response?.user_data ?? {});
            })
        );
    }

    setUser(username: string, password: string, userData: Record<string, any>) {
        this.user.isLoggedIn = true;
        this.user.username = username;
        this.user.password = password;
        this.user.puzzleLevel = userData['puzzle_level'] ?? 0;
        this.user.easy = userData['ms_easy_best'] ?? undefined;
        this.user.medium = userData['ms_medium_best'] ?? undefined;
        this.user.hard = userData['ms_hard_best'] ?? undefined;
        this.user.expert = userData['ms_expert_best'] ?? undefined;
        this.user.master = userData['ms_master_best'] ?? undefined;
        this.user.balance = userData['balance'] ?? 0;
        this.user.shapesOwned = userData['shapes_owned'] ?? [];
        this.user.miningTools = userData['mining_tools'] ?? [];

        this.userSubject.next(this.user);
        this.appService.setPuzzleTitle(this.appService.levelTitles[this.user.puzzleLevel]);
    }

    refreshUser() {
        this.userSubject.next(this.user);
    }

    updateUserBackend(): boolean {
        this.apiService.updateUser(this.user).subscribe({
            next: () => {
                this.userSubject.next(this.user);
                return true;
            },
            error: () => {
                return false;
            }
        });
        return false;
    }
    createUser(username: string, password: string) {
        return this.apiService.createUser(username, password).pipe();
    }
}
