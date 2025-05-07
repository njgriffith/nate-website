import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  getAllReviews(): Observable<any> {
    return this.http.get(`https://api.nate-griffith.com/reviews`);
  }

  getReview(code: string): Observable<any> {
    const body = JSON.stringify({code});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/review`, body, { headers });
  }

  getBlogs(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/blogs');
  }

  getStats(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/stats');
  }

  getLists(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/lists');
  }

  signUp(email: string): Observable<any> {
    const body = JSON.stringify({email});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/signup`, body, { headers });
  }

  getMSLeaderboard(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/minesweeper');
  }

  updateMSLeaderboard(username: string, score: number, difficulty: string): Observable<any> {
    const body = JSON.stringify({username, score, difficulty});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/minesweeper`, body, { headers });
  }

  getWeather(): Observable<any> {
    return this.http.get('https://api.nate-griffith.com/weather');
  }

  adminLogin(password: string): Observable<any> {
    const body = JSON.stringify({password});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/admin`, body, { headers });
  }

  puzzleLoad(username: string): Observable<any> {
    const body = JSON.stringify({username});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/puzzle/load`, body, { headers });
  }

  puzzleSave(username: string, level: number): Observable<any> {
    const body = JSON.stringify({username, level});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/puzzle/save`, body, { headers });
  }

  puzzleGuess(guess: string, level: number): Observable<any> {
    const body = JSON.stringify({guess, level});
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`https://api.nate-griffith.com/puzzle/guess`, body, { headers });
  }
}
