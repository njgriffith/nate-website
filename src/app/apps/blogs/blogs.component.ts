import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  blogData: any = [];
  singleBlogView: boolean = false;

  blogId: string = '';
  blogTitle: string = '';
  blogContent: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getBlogs().subscribe((response) => {
      const data = response['data'];
      this.blogData = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
    });
  }

  getEntries(item: any) {
    return Object.entries(item);
  }

  asArray(value: unknown): any[] {
    return value as any[];
  }

  fullscreenImage(image: string){

  }

  toBlog(key: string) {
    let blog: any = null;
    for (let i = 0; i < this.blogData.length; i++) {
      if (this.blogData[i].id === key) {
        blog = this.blogData[i];
        break;
      }
    }
    if (!blog) return;
    this.blogId = key;
    this.blogTitle = blog.title;
    this.blogContent = blog.content;
    this.singleBlogView = true;
    console.log(this.blogContent)
  }
}
