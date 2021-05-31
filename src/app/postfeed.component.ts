import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const ALL_POSTS = gql`
  query allPosts {
    queryPost(order: { desc: datePublished }) {
      id
      title
      tags
      datePublished
      category {
        id
        name
      }
      author {
        username
        displayName
        avatarImg
      }
      commentsAggregate {
        count
      }
    }
  }
`;

@Component({
  selector: 'post-feed',
  templateUrl: './postfeed.component.html',
  styleUrls: ['./app.component.css'],
})
export class PostFeedComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  posts: any;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: ALL_POSTS,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        console.log('data', data);
        this.posts = data.queryPost;
      });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  getReplies(post: any) {
    return post?.commentsAggregate?.count;
  }

  getLikes() {
    return 4;
  }

  getTags(post: any) {
    return post?.tags?.trim().split(/\s+/) || [];
  }

  avatar(img: string | null | undefined) {
    // return img ?? "/assets/" + Math.floor(Math.random() * (9 - 1) + 1) + ".svg"
    return '/assets' + img;
  }
}
