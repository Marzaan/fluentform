import './helpers';

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vddl from 'vddl';
Vue.use(VueRouter);

import {
    Card,
    Button,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    ButtonGroup,
    Row,
    Col,
    Select,
    Option,
    Input,
    Table,
    TableColumn,
    Pagination,
    Popover,
    Loading,
    Message,
    Notification,
    Checkbox,
    RadioGroup,
    RadioButton,
    Switch,
    DatePicker,
    Dialog,
    Form,
    FormItem,
    Radio,
    CheckboxGroup,
    OptionGroup,
    Alert,
    Skeleton,
    SkeletonItem,
    Tooltip
} from 'element-ui';
Vue.use(Vddl);
Vue.use(Form);
Vue.use(Alert);
Vue.use(Radio);
Vue.use(OptionGroup);
Vue.use(CheckboxGroup);
Vue.use(FormItem);
Vue.use(Checkbox);
Vue.use(Card);
Vue.use(Popover);
Vue.use(Pagination);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Input);
Vue.use(Switch);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Row);
Vue.use(Col);
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dropdown)
Vue.use(Dialog)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
Vue.use(Tooltip)

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
// configure language
locale.use(lang);

import Acl from '@/common/Acl';

import Entries from './views/Entries.vue';
import Entry from './views/Entry.vue';
import VisualReports from './views/Reports/VisualReports.vue';
import notifier from './notifier';
import globalSearch from './global_search';

const routes = [
    {
        path: '/',
        name: 'form-entries',
        component: Entries,
        props: true
    },
    {
        path: '/entries/:entry_id',
        name: 'form-entry',
        component: Entry,
        props: true
    },
    {
        path: '/visual_reports',
        name: 'form-reports',
        component: VisualReports,
        props: true
    }
];

const router = new VueRouter({
    linkActiveClass: 'active',
    routes
});

window.ffEntriesEvents = new Vue();


function formatMoneyFunc(n, decimals, decimal_sep, thousands_sep)
{
    var c = isNaN(decimals) ? 2 : Math.abs(decimals),
        d = decimal_sep || '.',
        t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        sign = (n < 0) ? '-' : '',
        //extracting the absolute value of the integer part of the number and converting to string
        i = parseInt(n = Math.abs(n).toFixed(c)) + '',
        j = ((j = i.length) > 3) ? j % 3 : 0;
    return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

Vue.mixin({
    components: {
        globalSearch
    },
    methods: {
        $t(str) {
            let transString = window.fluent_form_entries_vars.form_entries_str[str];
            if(transString) {
                return transString;
            }
            return str;
        },
        $storeData(key, value) {
            var prevData = localStorage.getItem('ff_entry_data');

            if(!prevData) {
                prevData = {};
            } else {
                prevData = JSON.parse(prevData);
            }
            prevData[key] = value;
            localStorage.setItem('ff_entry_data', JSON.stringify(prevData));
        },
        $getFromStore(key, defaultValue) {
            var prevData = localStorage.getItem('ff_entry_data');
            if(!prevData) {
                return defaultValue;
            } else {
                prevData = JSON.parse(prevData);
            }
            return prevData[key] || defaultValue;
        },
        formatMoney(cents, currency) {

            if(!cents) {
                return '0';
            }

            if(!cents) {
                cents = 0;
            }

            if(currency) {
                currency = currency.toUpperCase();
            }

            const config = window.fluent_form_entries_vars.currency_config;
            const currencyConfigs = window.fluent_form_entries_vars.currency_symbols;

            let $symbol = config.currency_sign;
            if(currency) {
                $symbol = currencyConfigs[currency];
            } else {
                currency = config.currency;
            }


            let $position = config.currency_sign_position;

            let $decimalSeparator = '.';
            let $thousandSeparator = ',';
            if (config.currency_separator != 'dot_comma') {
                $decimalSeparator = ',';
                $thousandSeparator = '.';
            }
            let $decimalPoints = 2;
            if (cents % 100 == 0 && config.decimal_points == 0) {
                $decimalPoints = 0;
            }

            let amount = cents / 100;

            return $symbol + formatMoneyFunc(amount, $decimalPoints, $decimalSeparator, $thousandSeparator);
        },
        getPaymentStatusIcon(status) {
            if (status === 'pending') {
                return 'el-icon-time';
            } else if (status === 'active' || status === 'paid') {
                return 'el-icon-check';
            } else if (status === 'failed') {
                return 'el-icon-error';
            } else if (status === 'refunded') {
                return 'el-icon-warning';
            }

            return '';
        },

        hasPermission(permission) {
            return (new Acl).verify(permission);
        },

        ...notifier
    },
    filters: {
        ucFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        _startCase(string) {
            return _ff.startCase(string);
        },
        dateFormat(date, format) {
            if (!format) {
                format = 'MMM DD, YYYY';
            }

            const dateString = (date === undefined) ? null : date;
            const dateObj = moment(dateString);

            return dateObj.isValid() ? dateObj.format(format) : null;
        },
    }
});

// Global error handling...
import Errors from '../common/Errors'
import moment from "moment";

global.Errors = Errors;

const app = new Vue({
    router,
    beforeCreate() {
        ffEntriesEvents.$on('change-title', (module) => {
            jQuery('title').text(`${module} - Fluentform`);
        });
    }
}).$mount('#ff_form_entries_app');
