<template>
  <b-container fluid>
    <b-row>
      <b-col md="auto">
        <b-nav vertical class="w-25">
          <b-nav-item active><router-link to="/">/</router-link></b-nav-item>
          <b-nav-item><router-link to="yahoo">/</router-link></b-nav-item>
          <b-nav-item><router-link to="closermonkey">/</router-link></b-nav-item>
        </b-nav>
      </b-col>

      <b-col>
        <router-view></router-view>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  export default {
    name: 'baseball-alerts'
  }
</script>

<style>
  /* CSS */
</style>
