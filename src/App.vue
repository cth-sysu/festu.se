<template>
  <div id="app">
    <div id="nav">
      <router-link to="/parties">Kalas</router-link>
      <router-link to="/"><img src="./assets/logo.png"></router-link>
      <router-link to="/about">About FestU</router-link>
    </div>
    <div id="wrapper">
      <router-view/>
    </div>
    <div id="footer">
      <a href="http://www.ljudobildgruppen.se/"><img src="./assets/committees/lob.png"></a>
      <a href="http://www.svea.chs.chalmers.se"><img src="./assets/committees/svea.png"></a>
      <a href="http://www.pu.se"><img src="./assets/committees/pu.png"></a>
      <a href="http://www.cffc.se"><img src="./assets/committees/cffc.png"></a>
      <a href="http://www.chs.chalmers.se"><img src="./assets/committees/chs.png"></a>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
@import url('assets/style.scss');

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
  position: fixed;
  top: 0;
  width: 100%;
  height: 77px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
  border-bottom: 3px solid;
  border-image: linear-gradient(to right, red, purple, orange) 1;
  a {
    flex: 0 1 128px;
    margin: 4px;
    padding: 20px 0;
    font-size: 16px;
    color: #777;
    white-space: nowrap;
    text-decoration: none;
    text-shadow: 0 4px 6px rgba(20,20,20,0.2);
    transition: .15s ease-in-out;
    &:hover { transform: scale(1.1); }
    & img {
      max-width: 100%;
      -webkit-filter: opacity(0.8);
    }
    & img:hover { -webkit-filter: opacity(1); }
    &.router-link-exact-active {
      color: #000;
      & img { -webkit-filter: opacity(1); }
    }
  }
}
#wrapper {
  margin-top: 80px;
  min-height: calc(100vh - 83px);
}
#footer {
  overflow: hidden;
  padding: 8px;

  background-color: #f8f9fa;
  border-top: 3px solid;
  border-image: linear-gradient(to right, red, purple, orange) 1;

  display: flex;
  justify-content: space-around;
  align-items: center;
  & a { flex: 1; }
  & img { max-width: 100%; }
}
</style>
