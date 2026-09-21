import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-review',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './item-review.component.html',
  styleUrl: './item-review.component.css'
})
export class ItemReviewComponent {
  @Input() reviewItem: { id: string, artist?: string, title: string, review: string, coverPath: string } = { 
    id: '',
    title: '',
    review: '',
    coverPath: ''
  };
  @Output() back = new EventEmitter<boolean>();

  reviewFontSize: number = 12;
  coverUrl: string = '';
  showMoodBoard: boolean = true;
  moodBoardImages: string[] = [];

  moodBoardMapper: Record<string, string[]> = {
    "ants_from_up_there": [
      'boston',
      'hike',
      'knight',
      'outside',
      'play',
      'cry'
    ],
    'volcanic_bird_enemy': [
      'cold',
      'puppet',
      'roach',
      'moon',
      'faces',
      'static'
    ],
    "tx_j_crossroads": [
      'god',
      'kneeling',
      'light',
      'storm',
      'up',
      'christ'
    ],
    'blood_visions': [
      'garage',
      'party',
      'surf',
      'jay',
      'loded'
    ],
    "not_available": [
      "residents",
      'faces',
      'masks',
      'seal',
      'lizard',
      'puppet'
    ],
    'STGSTV': [
      'space',
      'static',
      'spirit',
      'faceless',
      'fairy',
      'field'
    ],
    'building_nothing': [
      'store',
      'interstate',
      'mist',
      'diner',
      'gas'
    ],
    'magical_mystery': [
      'mirror',
      'storm',
      'strawberries',
      'fool',
      'smoke',
      'whatever'
    ],
    'congratulations': [
      'surf',
      'flowers',
      'plants',
      'kids',
      'cats',
      'forest'
    ],
    'skinny_fists': [
      'help',
      'fire',
      'clouds',
      'ali',
      'mary',
      'soldier',
      'mother'
    ],
    'to_be_kind': [
      'wastes',
      'fire',
      'dust',
      'occult',
      'preist',
      'sacrafice',
      'comet'
    ],
    'TPAB': [
      'davis',
      'selma',
      'water',
      'collins',
      '3k',
      'nwa',
      'gaye'
    ]
  };

  ngOnInit(){
    this.getCoverUrl(this.reviewItem.coverPath);
    if (this.moodBoardMapper[this.reviewItem.id] !== undefined){
      this.moodBoardImages = this.moodBoardMapper[this.reviewItem.id];
    }
  }

  goBack(){
    this.back.emit(true);
  }

  getCoverUrl(query: string) {
    this.coverUrl = `https://nate-griffith.com/covers/${query}`;
  }
}
