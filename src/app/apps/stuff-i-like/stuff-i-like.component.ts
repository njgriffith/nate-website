import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'stuff-i-like',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stuff-i-like.component.html',
  styleUrl: './stuff-i-like.component.css'
})
export class StuffILikeComponent {
  constructor(private apiService: ApiService) { }

  lists: string[] = ['Albums', 'Movies', 'Songs'];
  selectedList: string = this.lists[0];
  albumTiers: Record<string, any[]> = {
    "Royal Court": [],
    "The Best": [],
    "The Best-": [],
    "Amazing+": [],
    "Amazing": [],
    "Amazing-": [],
    "Great+": [],
    "Great": [],
    "Great-": []
  };
  tierNames: string[] = Object.keys(this.albumTiers);
  selectedTier: string = this.tierNames[0];
  filterText: string = '';
  singleReviewView: boolean = false;
  selectedReview: any = {};

  ngOnInit() {
    this.apiService.getAlbumTiers().subscribe((data: any) => {
      let loadedData = data['data'];

      this.albumTiers['Royal Court'] = loadedData['the_best_plus'] || [];
      this.albumTiers['The Best'] = loadedData['the_best'] || [];
      this.albumTiers['The Best-'] = loadedData['the_best_minus'] || [];
      this.albumTiers['Amazing+'] = loadedData['amazing_plus'] || [];
      this.albumTiers['Amazing'] = loadedData['amazing'] || [];
      this.albumTiers['Amazing-'] = loadedData['amazing_minus'] || [];
      this.albumTiers['Great+'] = loadedData['great_plus'] || [];
      this.albumTiers['Great'] = loadedData['great'] || [];
      this.albumTiers['Great-'] = loadedData['great_minus'] || [];

      for (let tier of this.tierNames){
        for (let entry of this.albumTiers[tier]){
          let cleanedPath = entry.artist.replaceAll(' ', '-') + '-' + entry.title.replaceAll(' ', '-');
          entry.coverPath = 'assets/album-covers/' + cleanedPath.replace(/[^a-zA-Z0-9-]/g, "") + '.jpg';
          // console.log(entry.coverPath);
        }
      }
    });
  }

  toReview(album: any){
    if (!album.reviewKey) return;
    this.apiService.getReview(album.reviewKey).subscribe((response) => {
      const data = response;
      this.selectedReview.id = album.reviewKey;
      this.selectedReview.artist = data['data']['artist'];
      this.selectedReview.title = data['data']['title'];
      this.selectedReview.coverPath = album.coverPath;
      this.selectedReview.review= data['review'];
      this.singleReviewView = true;
    });
  }

  isAlbumInFilter(album: any): boolean {
    const filter = this.filterText.toLowerCase().trim();
    if (filter === '') return true;
    return album.title.toLowerCase().includes(filter) || album.artist.toLowerCase().includes(filter);
  }
}
