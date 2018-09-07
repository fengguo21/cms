import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import store from './store'
import router from './router.config'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
/*import tinymce from './tiny/tinymce4.7.5/tinymce.min.js'

Vue.prototype.tinymce = tinymce*/
Vue.use(require('element-ui'))
Vue.prototype.$axios = axios

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
    router,
    store,
    ...App
})

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export { app, router, store }
