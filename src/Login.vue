<template>
  <form method="post" class="login">
    <img alt="OrvU" src="./assets/orvu.png">
    <label for="username">Username</label>
    <input type="text" name="username">
    <label for="password">Password</label>
    <input type="password" name="password">
    <input type="submit" value="Login">
  </form>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');

.login {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  & img {
    max-width: 256px;
    margin: 32px 0;
  }
  & input {
    outline: none;
    font-size: 14px;
    margin-bottom: 16px;
  }
  & input[type=submit] {
    border: none;
    padding: 8px 16px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.25);
  }
}
</style>
