import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';

const ALL_CATEGORIES = gql`
  query allCategories {
    queryCategory {
      id
      name
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($post: AddPostInput!) {
    addPost(input: [$post]) {
      post {
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
        commentsAggregate {
          count
        }
      }
    }
  }
`;

declare let $: any;

@Component({
  selector: 'create-post-modal',
  templateUrl: './createpostmodal.component.html',
})
export class CreatePostModalComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  categories: any;
  title: string = '';
  category: string;
  tags: string;
  message: string;

  private querySubscription: Subscription;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    $('.ui.modal').modal('show');
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: ALL_CATEGORIES,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        console.log('data', data);
        this.categories = data.queryCategory;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  getReplies(post: any) {
    return post?.commentsAggregate?.count;
  }

  getLikes() {
    return Math.floor(Math.random() * 10);
  }

  getTags(post: any) {
    return post?.tags?.trim().split(/\s+/) || [];
  }

  avatar(img: string | null | undefined) {
    return (
      '/assets' + (img ?? Math.floor(Math.random() * (9 - 1) + 1) + '.svg')
    );
  }

  close() {
    $('.ui.modal').modal('hide');
  }

  addPost() {
    $('.ui.modal').modal('hide');
    const post = {
      text: this.message,
      title: this.title,
      tags: this.tags,
      category: { id: this.category },
      author: { username: 'TestUser' },
      datePublished: new Date().toISOString(),
      comments: [],
    };
    this.apollo
      .mutate({
        mutation: ADD_POST,
        variables: {
          post: post,
        },
      })
      .subscribe(
        ({ data }) => {
          console.log('got data', data);
        },
        (error) => {
          console.log('there was an error sending the query', error);
        }
      );
  }
}
