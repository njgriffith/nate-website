import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getReview(code: string): Observable<any> {
    const body = JSON.stringify({ code });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/review`, body, { headers });
  }

  getStats(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/stats');
  }

  getAlbumTiers(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/album-tiers');
  }

  getMovieTiers(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/movie-tiers');
  }

  getMSLeaderboard(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/minesweeper');
  }

  updateMSLeaderboard(username: string, password: string, score: number, difficulty: string): Observable<any> {
    const body = JSON.stringify({ username, password, score, difficulty });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/minesweeper`, body, { headers });
  }

  getWeather(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/weather');
  }

  puzzleGuess(guess: string, level: number): Observable<any> {
    const body = JSON.stringify({ guess, level });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/puzzle/guess`, body, { headers });
  }

  loginUser(username: string, password: string): Observable<any> {
    const body = JSON.stringify({ username, password });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/login`, body, { headers });
  }

  createUser(username: string, password: string): Observable<any> {
    const body = JSON.stringify({ username, password });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/create-user`, body, { headers });
  }

  updateUser(user: User): Observable<any> {
    const body = JSON.stringify(
      {
        username: user.username, 
        password: user.password, 
        puzzle_level: user.puzzleLevel, 
        balance: user.balance, 
        shaped_owned: user.shapesOwned,
        mining_tools: user.miningTools, 
        easy: user.easy, 
        medium: user.medium, 
        hard: user.hard,
        expert: user.expert, 
        master: user.master
      }
    );
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/update-user`, body, { headers });
  }
}
