import Vue from 'vue';
import locale from 'element-ui/lib/locale';
import lang from 'element-ui/lib/locale/lang/en';

import {
    Row,
    Col,
    Button,
    ButtonGroup,
    RadioGroup,
    RadioButton,
    Input,
    Checkbox,
    Select,
    Option,
    Radio,
    Table,
    TableColumn,
    Switch,
    Pagination,
    Loading,
    Message,
    Notification,
    DatePicker,
    Skeleton,
    SkeletonItem,
    Dialog,
    Form,
    FormItem,
    Tooltip
} from 'element-ui';

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Input);
Vue.use(Switch);
Vue.use(Checkbox);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(Option);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Radio);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Skeleton);
Vue.use(SkeletonItem);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tooltip);

import App from './App.vue';
import globalSearch from '../global_search';
import notifier from '../notifier';

locale.use(lang);

Vue.mixin({
    methods: {
        $t(str) {
            let transString = window.fluent_forms_global_var.admin_i18n[str];
            if(transString) {
                return transString;
            }
            return str;
        },
        ...notifier
    },
});
new Vue({
    el: "#ff_all_entries",
    components: {
        globalSearch,
        'ff-all-entries': App
    }
});
