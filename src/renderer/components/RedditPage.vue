<template>
  <div class="wrapper">
    <b-tabs vertical no-fade>
      <b-tab title="reddit" active>
        <b-list-group class="non-webview">
          <reddit-post-row :post="post" v-for="post in posts" :key="post.id"></reddit-post-row>
        </b-list-group>
      </b-tab>
      <b-tab title="yahoo" class="webview">
        <webview id="foo" src="https://baseball.fantasysports.yahoo.com/b1/17196"></webview>
      </b-tab>
      <b-tab title="closermonkey" class="webview">
        <webview id="foo" src="http://closermonkey.com"></webview>
      </b-tab>
    </b-tabs>
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
            const firstId = this.posts.length > 0 ? this.posts[0].id : null
            this.posts = resp.data.data.children.map((e) => {
              return e.data
            })
            if (firstId && this.posts[0].id !== firstId) {
              this.notify(this.posts[0])
            }
          })
      },
      notify (post) {
        let myNotification = new Notification('New r/fantasybaseball Post', {
          body: post.title
        })

        myNotification.onclick = () => {
          console.log('Notification clicked')
        }
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

  html, body, .wrapper, .tabs {
    height: 100vh;
  }

  .tab-pane.webview {
    display: block !important;
  }
  .tab-pane webview {
    width: 0px; height: 0px; flex: 0 1;
  }
  .tab-pane.show {
    height: 100%;
  }
  .tab-pane.show webview {
    width: 100%;
    height: 100%;
  }

  .tab-content {
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: #ccc;
    padding: 10px 0;
    height: 100%;
  }

  .thumbnail {
    width: 100px;
    height: 80px;
    object-fit: cover;
  }
</style>
