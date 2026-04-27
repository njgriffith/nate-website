import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { User, UserService } from '../../services/user.service';
import { concatMap, from } from 'rxjs';

@Component({
  selector: 'stuff-i-like',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stuff-i-like.component.html',
  styleUrl: './stuff-i-like.component.css'
})
export class StuffILikeComponent {
  constructor(private apiService: ApiService, private appService: AppService, private userService: UserService) { }
  isAdmin: boolean = false;
  editView: boolean = false;
  lists: string[] = ['Albums', 'Movies', 'Stuff On This Site'];
  selectedList: string = this.lists[0];

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

  stuffOnThisSite: Record<string, any[]> = {
    "Labor of Love": ['Media Player', 'Puzzle'],
    "Really Cool": ['Shape Store', 'Mine Nate Coin', 'Catalog', 'Archive', 'Stuff I Like', 'Internet', 'Minesweeper'],
    "Decent": ['Weather', 'Stats', 'Command Line', 'Settings'],
    "Uninteresting": ['Login', 'Recycle']
  };

  shiftedItems: { title: string, artist?: string, type: 'Album' | 'Movie', tier: string }[] = [];
  updateSuccessCount: number = 0;

  albumTiers: string[] = Object.keys(this.albums);
  songTiers: string[] = Object.keys(this.songs);
  movieTiers: string[] = Object.keys(this.movies);
  stuffOnThisSiteTiers: string[] = Object.keys(this.stuffOnThisSite);

  selectedTier: string = this.albumTiers[0];
  filterText: string = '';
  singleReviewView: boolean = false;
  selectedReview: any = {};
  mobile: boolean = false;

  ngOnInit() {
    this.userService.user$.subscribe((user: User) => {
      this.isAdmin = user.isLoggedIn && user.username === 'nate';
    });
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

      for (let tier of this.albumTiers) {
        for (let entry of this.albums[tier]) {
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

      for (let tier of this.movieTiers) {
        for (let entry of this.movies[tier]) {
          let cleanedPath = entry.title.replaceAll(' ', '-');
          if (cleanedPath[0] === '-') cleanedPath = cleanedPath.substring(1);
          entry.posterPath = 'assets/movie-posters/' + cleanedPath.replace(/[^a-zA-Z0-9-]/g, "") + '.jpg';
          // console.log(entry.posterPath);
        }
      }
    });
  }

  toggleEditView() {
    if (!this.isAdmin) return;
    this.editView = !this.editView;
  }

  updateSelectedList() {
    this.selectedTier = this.selectedList === 'Albums' ? this.albumTiers[0] : this.selectedList === 'Movies' ? this.movieTiers[0] : this.stuffOnThisSiteTiers[0];
  }

  toReview(album: any) {
    if (!album.reviewKey || this.editView) return;
    this.apiService.getReview(album.reviewKey).subscribe((response) => {
      this.selectedReview.id = album.reviewKey;
      this.selectedReview.artist = album.artist;
      this.selectedReview.title = album.title;
      this.selectedReview.coverPath = album.coverPath;
      this.selectedReview.review = response.review;
      this.singleReviewView = true;
    });
  }

  isItemInFilter(item: any): boolean {
    const filter = this.filterText.toLowerCase().trim();
    if (filter === '') return true;
    if (this.selectedList === 'Albums') return item.title.toLowerCase().includes(filter) || item.artist.toLowerCase().includes(filter);
    else if (this.selectedList === 'Movies') return item.title.toLowerCase().includes(filter);
    else if (this.selectedList === 'Stuff On This Site') return item.toLowerCase().includes(filter);
    return false;
  }

  openApp(name: string) {
    this.appService.openApp(name);
  }

  changeItemTier(entry: any, entryIndex: number, direction: -1 | 1) {
    let context: string = this.selectedList;
    let currentTier: string = this.selectedTier;
    let currentTierIndex: number = -1;

    if (context === 'Albums') {
      currentTierIndex = this.albumTiers.findIndex(tier => tier === currentTier);
    }
    else if (context === 'Movies') {
      currentTierIndex = this.movieTiers.findIndex(tier => tier === currentTier);
    }

    if (currentTierIndex === -1) return;
    let newTierIndex: number = currentTierIndex + direction;
    if (newTierIndex < 0) return;

    if (context === 'Albums') {
      this.albums[this.albumTiers[currentTierIndex]].splice(entryIndex, 1);
      this.albums[this.albumTiers[newTierIndex]].unshift(entry);
      const existingEntry = this.shiftedItems.find(item => item.type === 'Album' && item.title === entry.title && item.artist === entry.artist);
      if (existingEntry) {
        existingEntry.tier = this.albumTiers[newTierIndex];
      } else {
        this.shiftedItems.push({
          title: entry.title,
          artist: entry.artist,
          type: 'Album',
          tier: this.albumTiers[newTierIndex]
        })
      }
    }
    else if (context === 'Movies') {
      this.movies[this.movieTiers[currentTierIndex]].splice(entryIndex, 1);
      this.movies[this.movieTiers[newTierIndex]].unshift(entry);
      const existingEntry = this.shiftedItems.find(item => item.type === 'Movie' && item.title === entry.title);
      if (existingEntry) {
        existingEntry.tier = this.movieTiers[newTierIndex];
      } else {
        this.shiftedItems.push({
          title: entry.title,
          type: 'Movie',
          tier: this.movieTiers[newTierIndex]
        })
      }
    }
  }
  saveTierChanges() {
    this.updateSuccessCount = 0;
    from(this.shiftedItems).pipe(
      concatMap((item: any) => {
        if (item.tier === "Royal Court"){
          item.tier = "the_best_plus";
        }
        else{
          item.tier = item.tier.toLowerCase().replaceAll(" ", "_");
        }
        return this.apiService.postToTier({
          type: item.type,
          title: item.title,
          artist: item.artist,
          tier: item.tier
        });
      })
    ).subscribe((response: any) => {
      if (response.response){
        this.updateSuccessCount++;
      }
      else{
        console.error('failed to update', response);
      }
    });
  }
}
