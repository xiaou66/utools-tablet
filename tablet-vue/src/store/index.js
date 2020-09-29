import Vue from 'vue'
import Vuex from 'vuex'
import keys from './keys'
import colorConfigure from './colorConfigure'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    keys,
    colorConfigure
  }
})
