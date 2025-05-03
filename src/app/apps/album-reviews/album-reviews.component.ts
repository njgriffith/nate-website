import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-album-reviews',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './album-reviews.component.html',
  styleUrl: './album-reviews.component.css'
})
export class AlbumReviewsComponent {
  reviewData: any = [];
  sortKey: string = 'reviewed';
  sortDirection: 'asc' | 'desc' = 'desc';
  search: string = "";
  singleReviewView = false;

  selectedReview: any = {};

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getAllReviews().subscribe((response) => {
      const data = response['data'];
      this.reviewData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      this.sortReviews();
    });
  }


  sortReviews() {
    this.reviewData.sort((a: any, b: any) => {
      const aVal = a[this.sortKey];
      const bVal = b[this.sortKey];
      if (aVal === bVal) return 0;
      const compare = aVal > bVal ? 1 : -1;
      return this.sortDirection === 'asc' ? compare : -compare;
    });
  }

  setSort(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }
    else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortReviews();
  }

  filteredReviews() {
    if (!this.search) {
      return this.reviewData;
    }

    const lowerSearch = this.search.toLowerCase();
    return this.reviewData.filter((review: any) => {
      return (
        review.title.toLowerCase().includes(lowerSearch) ||
        review.artist.toLowerCase().includes(lowerSearch) ||
        String(review.score).includes(lowerSearch) ||
        review.released.includes(lowerSearch) ||
        review.reviewed.includes(lowerSearch)
      );
    });
  }

  toReview(id: string) {
    this.singleReviewView = true;
    this.apiService.getReview(id).subscribe((response) => {
      const data = response;
      this.selectedReview['id'] = id;
      this.selectedReview['artist'] = data['data']['artist'];
      this.selectedReview['title'] = data['data']['title'];
      this.selectedReview['cover'] = data['data']['cover'];
      this.selectedReview['review'] = data['review'];
      this.selectedReview['score'] = data['data']['score'];
    });
  }

  toRandomReview() {
    const randomNumber: number = Math.floor(Math.random() * this.reviewData.length);
    this.toReview(this.reviewData[randomNumber].id)
  }
}
