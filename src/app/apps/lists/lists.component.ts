import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {
  listData: any = {};
  lists: string[] = [];
  selectedList: string = '';
  listType: string = '';
  listToDisplayMap: any = {
    '50_albums': 'Top 50 Albums of All Time',
    '25_albums_2020s': 'Top 25 Albums of the 2020s',
    '50_movies': 'Top 50 Movies of All Time'
  }
  displayToListMap: any = {
    'Top 50 Albums of All Time': '50_albums',
    'Top 25 Albums of the 2020s': '25_albums_2020s',
    'Top 50 Movies of All Time': '50_movies'
  };


  constructor(private apiService: ApiService) {}

  ngOnInit(){
    this.apiService.getLists().subscribe((response) => {
      this.listData = response['data'];
      this.lists = Object.keys(this.listData);
      this.selectedList = this.listToDisplayMap[this.lists[0]];
      this.changeType();
    });
  }

  changeType(){
    if (this.selectedList.includes('Albums')) this.listType = 'albums';
    if (this.selectedList.includes('Movies')) this.listType = 'movies';
  }
}
