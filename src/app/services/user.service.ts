import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AppService } from './app.service';
import { user } from '../../environments/environment';

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
    miningTools: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    user: User = user;
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
        this.user.miningTools = userData['mining_tools'] ?? { "employees": [0, 0, 0, 0, 0], "ore_detector": 0 };

        this.userSubject.next(this.user);
        this.appService.setPuzzleTitle(this.appService.levelTitles[this.user.puzzleLevel]);
    }

    refreshUser() {
        this.userSubject.next(this.user);
    }

    updateUserBackend(): Observable<any> {
        return this.apiService.updateUser(this.user).pipe(
            tap(() => this.userSubject.next(this.user))
        );
    }
    createUser(username: string, password: string) {
        return this.apiService.createUser(username, password).pipe();
    }

    purchaseShape(shape: string, price: number){
        return this.apiService.purchaseShape(this.user, shape, price);
    }
}
