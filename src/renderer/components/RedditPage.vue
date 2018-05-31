<template>
  <div class="wrapper">
    <b-list-group>
      <reddit-post-row :post="post" v-for="post in posts" :key="post.id"></reddit-post-row>
    </b-list-group>
  </div>
</template>

<script>
  export default {
    name: 'reddit-page',
    components: {
      'reddit-post-row': require('@/components/RedditPostRow').default
    },
    data: () => {
      return {
        posts: []
      }
    },
    mounted () {
      this.updatePosts()

      setInterval(() => {
        this.updatePosts()
      }, 15000)
    },
    methods: {
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

  body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: #ccc;
    padding: 10px 0;
  }

  .thumbnail {
    width: 100px;
    height: 80px;
    object-fit: cover;
  }
</style>
