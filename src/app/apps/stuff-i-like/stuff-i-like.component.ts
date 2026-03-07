import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'stuff-i-like',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stuff-i-like.component.html',
  styleUrl: './stuff-i-like.component.css'
})
export class StuffILikeComponent {
  constructor(private apiService: ApiService, private appService: AppService) { }
  lists: string[] = ['Albums', 'Movies', 'Songs'];
  selectedList: string = this.lists[1];

  albums: Record<string, any[]> = {
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
  movies: Record<string, any[]> = {
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
  songs: Record<string, any[]> = {
    "Royal Court": [],
    "The Best": [],
    "The Best-": []
  };

  albumTiers: string[] = Object.keys(this.albums);
  songTiers: string[] = Object.keys(this.songs);
  movieTiers: string[] = Object.keys(this.movies);


  selectedTier: string = this.albumTiers[1];
  filterText: string = '';
  singleReviewView: boolean = false;
  selectedReview: any = {};
  mobile: boolean = false;

  ngOnInit() {
    this.appService.mobile$.subscribe(isMobile => {
      this.mobile = isMobile;
    });
    this.apiService.getAlbumTiers().subscribe((data: any) => {
      let loadedData = data['data'];

      this.albums['Royal Court'] = loadedData['the_best_plus'] || [];
      this.albums['The Best'] = loadedData['the_best'] || [];
      this.albums['The Best-'] = loadedData['the_best_minus'] || [];
      this.albums['Amazing+'] = loadedData['amazing_plus'] || [];
      this.albums['Amazing'] = loadedData['amazing'] || [];
      this.albums['Amazing-'] = loadedData['amazing_minus'] || [];
      this.albums['Great+'] = loadedData['great_plus'] || [];
      this.albums['Great'] = loadedData['great'] || [];
      this.albums['Great-'] = loadedData['great_minus'] || [];

      for (let tier of this.albumTiers){
        for (let entry of this.albums[tier]){
          let cleanedPath = entry.artist.replaceAll(' ', '-') + '-' + entry.title.replaceAll(' ', '-');
          entry.coverPath = 'assets/album-covers/' + cleanedPath.replace(/[^a-zA-Z0-9-]/g, "") + '.jpg';
          // console.log(entry.coverPath);
        }
      }
    });

    this.apiService.getMovieTiers().subscribe((data: any) => {
      let loadedData = data['data'];

      this.movies['Royal Court'] = loadedData['the_best_plus'] || [];
      this.movies['The Best'] = loadedData['the_best'] || [];
      this.movies['The Best-'] = loadedData['the_best_minus'] || [];
      this.movies['Amazing+'] = loadedData['amazing_plus'] || [];
      this.movies['Amazing'] = loadedData['amazing'] || [];
      this.movies['Amazing-'] = loadedData['amazing_minus'] || [];
      this.movies['Great+'] = loadedData['great_plus'] || [];
      this.movies['Great'] = loadedData['great'] || [];
      this.movies['Great-'] = loadedData['great_minus'] || [];

      for (let tier of this.movieTiers){
        for (let entry of this.movies[tier]){
          let cleanedPath = entry.title.replaceAll(' ', '-');
          if (cleanedPath[0] === '-') cleanedPath = cleanedPath.substring(1);
          entry.posterPath = 'assets/movie-posters/' + cleanedPath.replace(/[^a-zA-Z0-9-]/g, "") + '.jpg';
          console.log(entry.posterPath);
        }
      }
    });
    this.songs['Royal Court'] = [
      {
        "title": "Long Season - Live",
        "artist": "Fishmans"
      },
      {
        "title": "I Love You Too, Death",
        "artist": "MGMT"
      },
      {
        "title": "Alvin Row",
        "artist": "Animal Collective"
      },
      {
        "title": "Bros",
        "artist": "Panda Bear"
      }
    ];
    this.songs['The Best'] = [
      {
        "title": "Long Season - Live",
        "artist": "Fishmans"
      },
      {
        "title": "I Love You Too, Death",
        "artist": "MGMT"
      },
      {
        "title": "Alvin Row",
        "artist": "Animal Collective"
      },
      {
        "title": "Bros",
        "artist": "Panda Bear"
      }
    ];
    this.songs['The Best-'] = [
      {
        "title": "Long Season - Live",
        "artist": "Fishmans"
      },
      {
        "title": "I Love You Too, Death",
        "artist": "MGMT"
      },
      {
        "title": "Alvin Row",
        "artist": "Animal Collective"
      },
      {
        "title": "Bros",
        "artist": "Panda Bear"
      }
    ];
    
  }

  updateSelectedList(){
    this.selectedTier = this.selectedList === 'Albums' ? this.albumTiers[0] : this.selectedList === 'Movies' ? this.movieTiers[0] : this.songTiers[0];
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
