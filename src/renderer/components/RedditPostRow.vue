<template>
  <b-list-group-item class="reddit-item">
    <b-media>
      <b-img slot="aside" :src="thumb(post)" alt="" class="thumbnail" />
      <h3 :id="post.id">
        <span v-html="post.title"></span>
        <small>
          <b-badge variant="light" v-text="post.score" class="badge-score"></b-badge>
          <b-badge variant="light" pill v-text="post.domain" class="badge-domain"></b-badge>
          <b-badge variant="light" pill class="badge-timeago">
            <timeago :since="post.created_utc * 1000"></timeago>
          </b-badge>
          
          <b-badge variant="light" pill class="badge-comments" @click="open('https://www.reddit.com' + post.permalink)">
            {{ post.num_comments }} 
            <span v-if="post.num_comments == 1">comment</span>
            <span v-else>comments</span>
          </b-badge>
        </small>
      </h3>
      <b-popover disabled hide :target="post.id" placement="bottomleft">
        {{ latestComment }}
      </b-popover>
    </b-media>
  </b-list-group-item>
</template>

<script>
  const diff = require('deep-diff').diff
  export default {
    props: ['post'],
    data: () => {
      return {
        comments: []
        // badgeClasses: {
        //   'twitter.com': 'twitter',
        //   'self.fantasybaseball': 'reddit',
        //   'rotoworld.com': 'rotoworld',
        //   'realnews.rotoworld.com': 'rotoworld',
        //   'cbssports.com': 'cbs'
        // }
      }
    },
    computed: {
      latestComment: function () {
        if (this.commentsWithoutStickies.length === 0) {
          return null
        }

        var newest = null
        var timestamp = 1727764969
        for (const idx in this.commentsWithoutStickies) {
          const comment = this.commentsWithoutStickies[idx]
          const check = this.findNewest(comment)
          if (check !== null && check.created < timestamp) {
            newest = check
            timestamp = check.created
          }
        }
        return newest.body
      },
      commentsWithoutStickies: function () {
        return this.comments.filter((e) => {
          return !e.stickied
        })
      }
    },
    name: 'reddit-post-row',
    watch: {
      post: {
        handler: function (val, oldVal) {
          // if (val.num_comments > 50) {
          //   return
          // }

          const diffs = diff(oldVal, val, (path, key) => {
            if (key === 'score' || key === 'ups' || key === 'subreddit_subscribers') {
              return true
            }
            return false
          })

          for (const idx in diffs) {
            const d = diffs[idx]
            const field = d.path[0]
            console.log(val.title + ' (' + field + ') from ' + d.lhs + ' to ' + d.rhs)

            if (field === 'num_comments') {
              this.updateComments(this.displayComment)
            }
          }
        },
        deep: true
      }
    },
    mounted () {
      this.updateComments()
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      thumb (post) {
        return !post.thumbnail.startsWith('http') ? 'static/reddit.png' : post.thumbnail
      },
      updateComments (callback) {
        const url = 'https://www.reddit.com/r/fantasybaseball/comments/' + this.post.id + '.json?sort=new'
        this.$http.get(url)
          .then((resp) => {
            this.comments = resp.data[1].data.children.map((e) => {
              return e.data
            })
            if (callback !== undefined) {
              callback()
            }
          })
      },
      findNewest (comment) {
        if (comment.children !== undefined) {
          return null
        }
        if (comment.replies === '') {
          return comment
        }

        var newest = null
        var timestamp = 1727764969
        for (const idx in comment.replies.data.children) {
          const listing = comment.replies.data.children[idx]
          const check = this.findNewest(listing.data)
          if (check !== null && check.created < timestamp) {
            newest = check
            timestamp = check.created
          }
        }
        return newest
      },
      displayComment () {
        this.$root.$emit('bv::show::popover', this.post.id)
        setTimeout(() => {
          this.$root.$emit('bv::hide::popover', this.post.id)
        }, 14000)
      }
    }
  }
</script>

<style>
  .thumbnail {
    width: 75px;
    height: 60px;
    object-fit: cover;
  }

  .reddit-item h3 {
    font-size: 24px;
  }
  .reddit-item h3 small {
    font-size: 70%;
    display: block;
  }
  .badge-comments {
    cursor: pointer;
  }
  .badge-comments:hover {
    background-color: #ccc;
  }

  .popover-body {
    background-color: #000;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    width: 500px;
  }
  .popover .arrow::after {
    border-bottom-color: #000;
  }
</style>
