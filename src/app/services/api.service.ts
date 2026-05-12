import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }
  apiPrefix: string = 'https://api.nate-griffith.com';
  apiPrefixLocal: string = 'http://localhost:5000';
  useLocalApi = false;
  baseUrl = this.useLocalApi ? this.apiPrefixLocal : this.apiPrefix;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  getReview(code: string): Observable<any> {
    const body = JSON.stringify({ code });
    return this.http.post(`${this.baseUrl}/review`, body, { headers: this.headers });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  getAlbumTiers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/album-tiers`);
  }

  postToTier(data: Record<string, string>): Observable<any> {
    const body = JSON.stringify(
      {
        type: data['type'],
        tier: data['tier'],
        title: data['title'],
        artist: data['artist']
      });
    return this.http.post(`${this.baseUrl}/tiers`, body, { headers: this.headers });
  }

  getMovieTiers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/movie-tiers`);
  }

  getMSLeaderboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/minesweeper`);
  }

  updateMSLeaderboard(username: string, password: string, score: number, difficulty: string): Observable<any> {
    const body = JSON.stringify({ username, password, score, difficulty });
    return this.http.post(`${this.baseUrl}/minesweeper`, body, { headers: this.headers });
  }

  getWeather(): Observable<any> {
    return this.http.get(`${this.baseUrl}/weather`);
  }

  puzzleGuess(guess: string, level: number): Observable<any> {
    const body = JSON.stringify({ guess, level });
    return this.http.post(`${this.baseUrl}/puzzle/guess`, body, { headers: this.headers });
  }

  loginUser(username: string, password: string): Observable<any> {
    const body = JSON.stringify({ username, password });
    return this.http.post(`${this.baseUrl}/login`, body, { headers: this.headers });
  }

  createUser(username: string, password: string): Observable<any> {
    const body = JSON.stringify({ username, password });
    return this.http.post(`${this.baseUrl}/create-user`, body, { headers: this.headers });
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
    return this.http.post(`${this.baseUrl}/update-user`, body, { headers: this.headers });
  }

  purchaseShape(user: User, shape: string, price: number) {
    const body = JSON.stringify(
      {
        username: user.username,
        shape: shape,
        price: price
      }
    );
    return this.http.post(`${this.baseUrl}/purchase-shape`, body, { headers: this.headers });
  }

  getTierUpdates(){
    return this.http.get(`${this.baseUrl}/recent-updates`);
  }
}
