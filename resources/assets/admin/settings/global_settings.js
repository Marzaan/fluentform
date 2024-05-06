import Vue from 'vue';
import locale from 'element-ui/lib/locale';
import lang from 'element-ui/lib/locale/lang/en';

import GlobalSettings from './GlobalSettings.vue';
import reCaptcha from './reCaptcha.vue';
import hCaptcha from './hCaptcha.vue';
import turnstile from './turnstile.vue';
import pdf_settings from './Pdf.vue';
import GeneralIntegrationSettings from './GeneralIntegrationSettings.vue';
import DoubleOptinSettings from './DoubleOptinSettings.vue';
import ManagersSettings from './ManagersSettings.vue';
import InventoryManager from './InventoryManager.vue';


import License from './License.vue';
import globalSearch from '../global_search'

import Errors from '@/common/Errors';
global.Errors = Errors;

import notifier from '@/admin/notifier';

import {
    Button,
    Radio,
    RadioGroup,
    Form,
    FormItem,
    Input,
    Tooltip,
    Row,
    Col,
    Select,
    Option,
    OptionGroup,
    Switch,
    Dialog,
    Loading,
    Notification,
    Checkbox,
    CheckboxGroup,
    ColorPicker,
    InputNumber,
    Table,
    TableColumn,
    Tag,
    Popover,
    Pagination,
    Skeleton,
    SkeletonItem
} from 'element-ui';
import e from 'jquery-datetimepicker';
import { handleSidebarActiveLink } from '@/admin/helpers';

locale.use(lang);
Vue.use(Button);
Vue.use(Form);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(FormItem);
Vue.use(Loading.directive);
Vue.use(InputNumber);
Vue.use(ColorPicker);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Dialog);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tag);
Vue.use(Popover);
Vue.use(Pagination);
Vue.use(Skeleton);
Vue.use(SkeletonItem);

Vue.prototype.$notify = Notification;
Vue.prototype.$loading = Loading.service;

Vue.mixin({
    methods: {
        $t(str) {
            let transString = window.FluentFormApp.form_settings_str[str];
            if(transString) {
                return transString;
            }
            return str;
        },

        ...notifier
    }
})

new Vue({
    el: '#ff_global_settings_option_app',
    components: {
        globalSearch,
        settings: GlobalSettings,
        re_captcha: reCaptcha,
        h_captcha: hCaptcha,
        turnstile: turnstile,
        pdf_settings: pdf_settings,
        'general-integration-settings': GeneralIntegrationSettings,
        'double_optin_settings': DoubleOptinSettings,
        managers: ManagersSettings,
        inventory_manager: InventoryManager,
        license: License

    },
    data: {
        component: 'settings',
        App: window.FluentFormApp,
        settings_key: ''
    },
    methods: {
        setRoute($el, $originalEl = false) {
            // get component by hash
            let hash = $el.data('hash');
            let component = hash;
            if ($el.data('component')) {
                component = $el.data('component');
            }
            if (this.$options.components[component]) {
                this.settings_key = jQuery($el).attr('data-settings_key');
                this.component = component;
                // set route hash
                location.hash = hash;
            } else if ($originalEl &&
                $originalEl.hasClass('ff-payment-settings-root')
            ) {
                location.href = $el.attr('href');
                return 'redirected';
            }
            return '';
        },
        maybeGetFirstSubLink($el) {
            if (
                $el.attr('href') === '#' &&
                $el.parent().hasClass('has_sub_menu') &&
                $el.parent().find('ul.ff_list_submenu li:first a').length
            ) {
                $el = $el.parent().find('ul.ff_list_submenu li:first a');
            }
            return $el;
        }
    },
    created() {
        let hash = location.hash.substr(1) || 'settings';
        let $el = jQuery('.ff_settings_list li').find('a[data-hash=' + hash + ']').first();
        if ($el.length) {
            $el = this.maybeGetFirstSubLink($el);
            this.setRoute($el);
            handleSidebarActiveLink($el.parent(), true , true);
        }
        const that = this;
        jQuery('.ff_settings_list li a').on('click', function (e) {
            $el = jQuery(this);
            if($el.attr('href') === '#') e.preventDefault();
            if (that.setRoute(that.maybeGetFirstSubLink($el), $el) === 'redirected') {
                return;
            }
            handleSidebarActiveLink($el.parent())
        });
    }
});

