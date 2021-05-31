import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { DateTime } from 'luxon';

const GET_POST = gql`
  query getPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      text
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
      comments {
        id
        text
        commentsOn {
          comments {
            id
            text
            author {
              username
              displayName
              avatarImg
            }
          }
        }
        author {
          username
          displayName
          avatarImg
        }
      }
    }
  }
`;

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./app.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  post: any;
  dateStr: any = 'at some unknown time';

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_POST,
        variables: {
          id: id,
        },
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        console.log('data', data);
        this.post = data.getPost;
        if (data.getPost.datePublished) {
          this.dateStr =
            DateTime.fromISO(data.getPost.datePublished).toRelative() ??
            this.dateStr;
        }
      });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  getTags(post: any) {
    return post?.tags?.trim().split(/\s+/) || [];
  }

  avatar(img: string | null | undefined) {
    // return img ?? "/assets/" + Math.floor(Math.random() * (9 - 1) + 1) + ".svg"
    return '/assets' + img;
  }
}
