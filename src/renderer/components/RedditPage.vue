<template>
  <div class="wrapper">
    <h2>r/fantasybaseball/new</h2>
    <b-list-group>
      <b-list-group-item v-for="post in posts" :key="post.id">
        <b-media>
          <b-img slot="aside" :src="thumb(post)" alt="" class="thumbnail" />
          <h3>{{ post.title }}</h3>
          <p>
            ({{ post.score }})
            {{ post.domain }}
            Submitted <timeago :since="post.created_utc * 1000"></timeago>
            
            {{ post.num_comments }} comment(s)
          </p>
        </b-media>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
  export default {
    name: 'reddit-page',
    data: () => {
      return {
        posts: []
      }
    },
    mounted () {
      this.updatePosts()
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      thumb (post) {
        return !post.thumbnail.startsWith('http') ? 'static/reddit.png' : post.thumbnail
      },
      updatePosts () {
        this.$http.get('https://www.reddit.com/r/fantasybaseball/new.json')
          .then((resp) => {
            this.posts = resp.data.data.children.map((e) => {
              return e.data
            })
          })
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  .thumbnail {
    width: 100px;
    height: 80px;
    object-fit: cover;
  }
</style>
