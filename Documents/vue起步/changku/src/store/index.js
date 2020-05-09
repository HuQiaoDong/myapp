import Vue from "vue";
import Vuex from "vuex";
import types from "./TYPES.js";
import { getIndexData } from "../api/home.js";
Vue.use(Vuex);
console.log(types);

export default new Vuex.Store({
    state: {
        indexData: null
    },
    mutations: {
        [types.INIT_INDEX_DATA](state, playload) {
            state.indexData = playload.data;
        }
    },
    actions: {
        [types.INIT_INDEX_DATA](context, data) {
            console.log(context, data);
            var indexData = JSON.parse(window.localStorage.getItem('indexData'));
            if (indexData && Date.now() > indexData.expires) {
                context.commit(types.INIT_INDEX_DATA, { data: indexData.data })
            } else {
                getIndexData().then(function(response) {
                    console.log(response.data.data);

                    window.localStorage.setItem(
                        'indexData',
                        JSON.stringify({
                            expires: Date.now() + 10 * 60 * 1000,
                            data: response.data.data,
                        })
                    );
                    context.commit(types.INIT_INDEX_DATA, { data: response.data.data })
                })
            }
            // setTimeout(() => {
            //     context.commit(types.INIT_INDEX_DATA, {
            //         data
            //     });
            // }, 3000);

        }
    },
    modules: {}
});