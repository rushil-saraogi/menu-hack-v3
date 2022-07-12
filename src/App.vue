<template>
    <MenuLayout1 />
</template>

<script>
import '@/assets/tailwind.css';
import MenuLayout1 from './components/layout1/MenuLayout1.vue';

export default {
  name: 'App',

  components: {
    MenuLayout1
  }
}
</script>

<style>
/* Global styles */

@import url('https://fonts.googleapis.com/css2?family=Poppins&family=Source+Sans+Pro:wght@400;600;700&display=swap');

#app {
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 600px;
  margin: 0 auto;
}

.poppins {
  font-family: 'Poppins', sans-serif;
}

@keyframes jello {
  10% {
    background-color: rgb(252 211 77);
  }
}

.jello {
  animation-duration: 1.5s;
  animation-fill-mode: both;
  animation-name: jello;
  transform-origin: center;
}
</style>
