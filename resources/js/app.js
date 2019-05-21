
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap')

window.Vue = require('vue')

import { Form, HasError, AlertError } from 'vform';
import moment from 'moment';

import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '10px',
  thickness: '3px',
})

import vSelect from 'vue-select'

Vue.component('v-select', vSelect)

import Swal from 'sweetalert2'
window.swal = Swal;

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
window.toast = Toast;

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import VueRouter from 'vue-router'
Vue.use(VueRouter)

let routes = [
    { path: '/dashboard',  component: require('./components/Dashboard.vue').default },
    { path: '/developer',  component: require('./components/Developer.vue').default },
    { path: '/posts',  component: require('./components/Posts.vue').default },
    { path: '/category',  component: require('./components/Category.vue').default },
    { path: '/users',  component: require('./components/Users.vue').default },
    { path: '/roles',  component: require('./components/Role.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '*', component: require('./components/NotFound.vue').default }
  ]
  

const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
  })

Vue.filter('capitalize', function(value){
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('dateMod', function(value){
  return moment(value).format('D MMMM YYYY');
})

window.Fire = new Vue();
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

Vue.component(
  'passport-clients',
  require('./components/passport/Clients.vue').default
);

Vue.component(
  'passport-authorized-clients',
  require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
  'passport-personal-access-tokens',
  require('./components/passport/PersonalAccessTokens.vue').default
);

Vue.component(
  'not-found',
  require('./components/NotFound.vue').default
);

Vue.component('pagination', require('laravel-vue-pagination'));



/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data: {
      search : ''
    },
    methods: {
      searchit: _.debounce( () => {
        Fire.$emit('searching');
        }, 1000),

      printme() {
        window.print();
      }
    }
});
