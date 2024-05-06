import Vue from 'vue';
import PreviewApp from './preview/App.vue'
import globalSearch from './global_search';
import {
    Loading,
    Button,
    Select,
    Option,
    Notification
} from 'element-ui';

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;

Vue.use(Button);
Vue.use(Select);
Vue.use(Option);

Vue.mixin({
    methods: {
        $t(str) {
            let transString = window.fluent_preview_vars?.i18n[str];
            if (transString) {
                return transString;
            }
            return str;
        }
    }
});

new Vue({
    el: '#ff_form_preview_app',
    components: {
        PreviewApp,
        globalSearch
    }
});
