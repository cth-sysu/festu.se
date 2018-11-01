<template>
  <div id="app">
    <div id="nav">
      <a href="/" class="home"><i class="fas fa-lg fa-home"></i></a>
      <router-link to="/kalas">Kalas</router-link>
      <router-link to="/orv">Orvregister</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
@import url('https://use.fontawesome.com/releases/v5.4.2/css/regular.css');
@import url('https://use.fontawesome.com/releases/v5.4.2/css/solid.css');
@import url('https://use.fontawesome.com/releases/v5.4.2/css/fontawesome.css');
@import 'assets/style.scss';

body {
  margin: 0;
}
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  display: flex;
  justify-content: center;
  align-items: center;
  & a {
    flex: 0 1 128px;
    margin: 16px 8px;
    font-size: 16px;
    line-height: 40px;
    color: #777;
    text-decoration: none;
    transition: .15s ease-in-out;
    border-bottom: 1px solid transparent;
    &.router-link-active {
      color: initial;
      border-bottom: 1px solid #2c3e50;
    }
  }
  & .home {
    position: absolute;
    top: 0;
    left: 0;
    margin: 16px;
    color: #2c3e50;
  }
}
</style>
