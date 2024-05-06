<template>
    <div class="ff-landing-page-settings">
        <card>
            <el-skeleton :loading="loading" animated :rows="6">
                <card-head>
                    <card-head-group class="justify-between">
                        <div>
                            <h5 class="title">{{ $t('Landing Page') }}</h5>
                            <p class="text" v-if="settings.status != 'yes'">{{ (' Publish forms on a dedicated landing page for more conversion.') }}</p>
                        </div>
                        <btn-group v-if="!error_text" size="sm">
                            <btn-group-item>
                                <a 
                                    v-show="share_url && settings.status == 'yes'"
                                    target="_blank" 
                                    rel="noopener" 
                                    :href="final_share_url" 
                                    class="el-button el-button--info el-button--icon el-button--medium el-button--soft"
                                    :title="$t('Share')"
                                >
                                    <i class="el-icon-share"></i>
                                </a>
                            </btn-group-item>
                            <btn-group-item>
                                <a 
                                    v-show="share_url && settings.status == 'yes'" 
                                    class="el-button el-button--primary el-button--icon el-button--medium el-button--soft"
                                    @click="fullScreen"
                                    :title="$t('Toggle Fullscreen')"
                                >
                                    <i class="el-icon-full-screen"></i>
                                </a>
                            </btn-group-item>
                            <btn-group-item>
                                <el-button
                                    :loading="saving"
                                    type="primary"
                                    icon="el-icon-success"
                                    @click="saveSettings()"
                                    size="medium"
                                >
                                    {{saving ? $t('Saving ') : $t('Save ') }}
                                </el-button>
                            </btn-group-item>
                        </btn-group>
                    </card-head-group>
                </card-head>
                <card-body>
                    <el-checkbox 
                        v-model="settings.status" 
                        true-label="yes"
                        @change="offFullScreen" 
                        false-label="no"
                    >
                        {{ $t('Enable Form Landing Page Mode') }}
                    </el-checkbox>

                    <p>{{error_text}}</p>

                    <div v-if="settings.status == 'yes'" class="ff_landing">
                        <div class="ff_landing_sidebar">
                            <div class="ffc_sidebar_header">
                                <tab>
                                    <tab-item :class="{active : active_tab == 'design'}" @click="active_tab = 'design'">
                                        <tab-link>
                                            {{ $t('Design') }}
                                        </tab-link>
                                    </tab-item>
                                    <tab-item :class="{active : active_tab == 'share'}" @click="active_tab = 'share'">
                                        <tab-link>
                                            {{ $t('Share') }}
                                        </tab-link>
                                    </tab-item>
                                </tab>
                            </div>
                            <div v-if="settings && active_tab == 'design'" class="ff_landing_settings_wrapper ffc_sidebar_body">
                                <el-form ref="form" :model="settings" label-position="top">
                                    <el-form-item class="ff-form-item">
                                        <el-radio-group v-model="settings.design_style">
                                            <el-radio v-for="(layoutName, layoutCode) in layouts" :key="layoutCode" :label="layoutCode">{{layoutName}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <div class="el-form-item">
                                        <LayoutPref :pref="settings"></LayoutPref>
                                    </div>

                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('BG Color') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Choose Custom Color for your form page') }}
                                                    </p>
                                                </div>
                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>
                                        <el-color-picker @active-change="(color) => { settings.custom_color = color; }" v-model="settings.custom_color"></el-color-picker>
                                    </el-form-item>

                                    <template v-for="(item, i) in settings.form_shadow">
                                        <ff_boxshadow :valueItem="item" :key="i"/>
                                    </template>

                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('BG Image') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Page Background Image') }}
                                                    </p>
                                                </div>
                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>
                                        <photo-uploader enable_clear="yes" design_mode="horizontal" v-model="settings.background_image" />
                                    </el-form-item>

                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Form Logo') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('You may upload your logo and it will show on the top of the page') }}
                                                    </p>
                                                </div>
                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>
                                        <photo-uploader enable_clear="yes" design_mode="horizontal" v-model="settings.logo" />
                                    </el-form-item>

                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Featured Image') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Featured Image will be shown in social media share preview') }}
                                                    </p>
                                                </div>
                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>
                                        <photo-uploader enable_clear="yes" design_mode="horizontal" v-model="settings.featured_image" />
                                    </el-form-item>

                                </el-form>
                                <el-form ref="form" :model="settings" label-position="top">
                                    <div class="ff_landing_page_items">

                                        <el-form-item class="ff-form-item">
                                            <template slot="label">
                                                {{ $t('Page Heading') }}
                                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                    <div slot="content">
                                                        <p>
                                                            {{ $t('This will show at the top of your page') }}
                                                        </p>
                                                    </div>
                                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                                </el-tooltip>
                                            </template>
                                            <el-input :placeholder="$t('eg: My Awesome Form')" v-model="settings.title"/>
                                        </el-form-item>

                                        <el-form-item class="ff-form-item">
                                            <template slot="label">
                                                {{ $t('Description') }}
                                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                    <div slot="content">
                                                        <p>
                                                            {{ $t('This will show at the top of your page after form title') }}
                                                        </p>
                                                    </div>
                                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                                </el-tooltip>
                                            </template>
                                            <wp-editor :height="100" v-model="settings.description" />
                                        </el-form-item>

                                        <el-form-item v-if="share_url">
                                            <template slot="label">
                                                {{ $t('Security Code') }}
                                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                    <div slot="content">
                                                        <p>
                                                            {{ $t('Add a Security Code to make your shareable URL extra secure.') }}
                                                        </p>
                                                    </div>
                                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                                </el-tooltip>
                                            </template>
                                            <el-input v-model="settings.share_url_salt" />
                                        </el-form-item>

                                        <el-form-item>
                                            <el-button
                                                :loading="saving"
                                                type="primary"
                                                icon="el-icon-success"
                                                @click="saveSettings()">
                                                {{saving ? $t('Saving ') : $t('Save ')}} {{ $t('Settings') }}
                                            </el-button>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </div>
                            <div class="ff_landing_settings_wrapper ffc_sidebar_body" v-else-if="active_tab == 'share'">
                                <p>{{ $t('Share your form by unique URL or copy and paste the shortcode to embed in your page and post') }}</p>
                            </div>
                        </div>
                        <div class="ff_landing_preview ffc_design_container">
                            <template v-if="active_tab == 'design'">
                                <browser :settings="settings" v-if="final_share_url && show_frame" :preview_url="final_share_url" @change-device-type="changeDeviceType"/>
                            </template>
                            <share v-else-if="final_share_url" :share_url="final_share_url" :form_id="form_id"  />
                        </div>
                    </div>

                </card-body>
            </el-skeleton>
        </card>
    </div>
</template>

<script type="text/babel">
    import WpEditor from '@/common/_wp_editor';
    import PhotoUploader from '@/common/PhotoUploader';
    import ConversionStylePref from "@/admin/conversion_templates/ConversionStylePref";
    import Browser from './_Browser';
    import Share from './_Sharing';
    import Ff_boxshadow from './BoxShadow';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import Tab from '@/admin/components/Tab/Tab.vue';
    import TabItem from '@/admin/components/Tab/TabItem.vue';
    import TabLink from '@/admin/components/Tab/TabLink.vue';

    export default {
        name: 'landing_pages',
        components: {
            Ff_boxshadow,
            WpEditor,
            PhotoUploader,
            Browser,
            Share,
            LayoutPref : ConversionStylePref,
            Card,
            CardHead,
            CardBody,
            CardHeadGroup,
            BtnGroup,
            BtnGroupItem,
            Tab,
            TabItem,
            TabLink
        },
        data() {
            return {
                loading: false,
                saving: false,
                settings: false,
                form_id: window.FluentFormApp.form_id,
                error_text: '',
                share_url: '',
                color_schemas: {
                    '#4286c4' : 'Blue',
                    '#32373c' : 'Dark Gray',
                    '#67c23a' : 'Green',
                    '#19a59f': 'darkcyan',
                    '#d34342' : 'Red',
                    '#999999' : 'Gray',
                    'custom': 'Custom'
                },
                layouts: {
                    modern: 'Boxed',
                    classic: 'Classic'
                },
                active_tab: 'design',
                show_frame: true,
                setup: false
            }
        },
        computed: {
            final_share_url() {
                if(this.settings.share_url_salt) {
                    return this.share_url + '&form='+this.settings.share_url_salt;
                } else {
                    return this.share_url;
                }
            }
        },
        watch: {
            'settings.share_url_salt': function (value, oldValue){
                this.settings.share_url_salt = this.string_to_slug(value);
            },
            'settings.design_style': function (){
                this.setup && this.saveSettings(true);
            },
            'settings.layout': function (){
                this.saveSettings(true);
            },
            'settings.media': function (){
                this.saveSettings(true);
            },
            'settings.background_image': function (){
                this.setup && this.saveSettings(true);
            }
        },
        methods: {
            saveSettings(silence) {
                this.saving = true;
                this.show_frame = false;

                let data = {
                    action: 'ff_store_landing_page_settings',
                    form_id: this.form_id,
                    settings: this.settings
                };

                FluentFormsGlobal.$post(data)
                    .then(response => {
                        this.share_url = response.data.share_url;
                        if(!silence) {
                            this.$success(response.data.message);
                        }

                        this.setup = true;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.saving = false;
                        this.show_frame = true;
                    });
            },
            fetchSettings() {
                this.loading = true;
                
                let data = {
                    action: 'ff_get_landing_page_settings',
                    form_id: this.form_id
                };

                FluentFormsGlobal.$get(data)
                    .then(response => {
                        this.share_url = response.data.share_url;
                        const settings = response.data.settings;
                        if(settings.color_schema != 'custom') {
                            settings.custom_color = settings.color_schema;
                            settings.color_schema = 'custom';
                        }
                        settings.remember_device_type = settings.remember_device_type || 'desktop';

                        if (!settings.form_shadow || !settings.form_shadow.length) {
                            settings.form_shadow = [
                                {
                                    label : this.$t('Outer Shadow'),
                                    position: "",
                                    horizontal: "0",
                                    vertical: "30",
                                    blur: "40",
                                    spread: "0",
                                    color :"rgb(0 0 0 / 25%)"
                                },
                                {
                                    label : this.$t('Inner Shadow'),
                                    position: "inset",
                                    horizontal: "0",
                                    vertical: "4",
                                    blur: "0",
                                    spread: "0",
                                    color : "#a1c5e5",
                                },
                            ];
                        }
                        this.settings = settings;
                        this.settings.brightness = parseInt(this.settings.brightness);
                        this.settings.media_x_position = parseInt(this.settings.media_x_position);
                        this.settings.media_y_position = parseInt(this.settings.media_y_position);

                    })
                    .fail(error => {
                        if (!error.responseJSON) {
                            this.error_text = 'Looks like you do not have latest version of Fluent Forms Pro Installed. Please install latest version of Fluent Forms Pro to use this feature';
                            return;
                        }
                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            string_to_slug (text) {
                return text
                    .toString()                     // Cast to string
                    .toLowerCase()                  // Convert the string to lowercase letters
                    .normalize('NFD')       // The normalize() method returns the Unicode Normalization Form of a given string.
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-');        // Replace multiple - with single -

            },
            fullScreen() {
                const $body = jQuery('body');
                let wasFullScreen = $body.hasClass('ff_full_screen');
                if (window.localStorage) {
                    if (wasFullScreen) {
                        window.localStorage.setItem('ff_landing_is_full_screen', 'no');
                    } else {
                        window.localStorage.setItem('ff_landing_is_full_screen', 'yes');
                    }
                }
                $body.toggleClass('ff_full_screen');
            },
            offFullScreen(status) {
                if (status !== 'yes') {
                    jQuery('body').removeClass('ff_full_screen');
                    if (window.localStorage) {
                        window.localStorage.setItem('ff_landing_is_full_screen', 'no');
                    }
                }
	            this.saveSettings(true);
            },
            changeDeviceType (type) {
                this.settings.remember_device_type = type;
            }
        },
        mounted() {
            this.fetchSettings();
            jQuery('head title').text('Landing Page Settings - Fluent Forms');
            
            if (window.localStorage) {
                if (window.localStorage.getItem('ff_landing_is_full_screen') == 'yes') {
                    jQuery('body').addClass('ff_full_screen').addClass('folded');
                }
            } else {
                jQuery('body').addClass('ff_full_screen').addClass('folded');
            }
        }
    };
</script>
