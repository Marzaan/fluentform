<template>
    <div class="settings_app">
        <el-skeleton :loading="!app_ready" animated :rows="10">
            <router-view
                v-if="app_ready"
                :form_id="form_id"
                :form="form"
                :inputs="inputs"
                :has_pro="hasPro"
                :has_pdf="hasPDF"
                :editorShortcodes="editorShortcodes"
            ></router-view>
        </el-skeleton>
	    <global-search/>
    </div>
</template>

<script type="text/babel">
    import { scrollTop, handleSidebarActiveLink } from '@/admin/helpers';
	import globalSearch from '../../global_search'
    export default {
        name: 'settings_app',
	    components: {
			globalSearch
	    },
        data() {
            return {
                app_ready: false,
                form_id: window.FluentFormApp.form_id,
                form: {
                    id: window.FluentFormApp.form_id,
                },
                hasPro: !!window.FluentFormApp.hasPro,
                hasPDF: !!window.FluentFormApp.hasPDF,
                editorShortcodes: [],
                inputs: {}
            }
        },
        methods: {
            fetchInputs() {
                const url = FluentFormsGlobal.$rest.route('getFormFields', this.form_id);

                FluentFormsGlobal.$rest.get(url)
                    .then(response => {
                        this.inputs = Object.assign({}, response);
                        this.app_ready = true;
                    })
                    .catch(e => {
                    });
            },
            fetchAllEditorShortcodes() {
                const url = FluentFormsGlobal.$rest.route('getFormShortcodes', this.form_id);

                FluentFormsGlobal.$rest.get(url, {input_only: true})
                    .then(response => {
                        let allShortCodes = response;
                        if (allShortCodes[0] && allShortCodes[0]['shortcodes']) {
                            delete allShortCodes[0]['shortcodes']['{all_data}'];
                            delete allShortCodes[0]['shortcodes']['{all_data_without_hidden_fields}'];
                        }

                        this.editorShortcodes = allShortCodes;
                        this.app_ready = true;
                    })
                    .catch(e => {
                    });
            },
            scrollTo() {
                let pageScrollLink = jQuery('.ff-page-scroll');
                pageScrollLink.each(function(){
                    jQuery(this).on("click", function(e){
                        let targetHash = e.target.hash;
                        e.preventDefault();

                        jQuery(targetHash).addClass('highlight-border');

                        const $settingsForm = jQuery('.ff_settings_form');
                        if ($settingsForm.length) {
	                        const ffMenuHeight = jQuery('.ff_form_wrap .form_internal_menu').first()?.outerHeight() || 0;
	                        const wpAdminBarHeight = jQuery('#wpadminbar').outerHeight() || 0;
                            const top = jQuery(targetHash).offset().top + $settingsForm.scrollTop() - (wpAdminBarHeight + ffMenuHeight + $settingsForm.position().top);
                            scrollTop(top, 'fast', '.ff_settings_form').then((_) => {
                                jQuery('head title').text( e.target.textContent.trim() + ' - Fluent Forms');
                                if(targetHash.length) {
                                    setTimeout(() => {
                                        jQuery(targetHash).not(this).removeClass('highlight-border');
                                    }, 500);
                                }
                            })
                        }

                    });
                });
            },
            maybeSetRoute($el) {
                // set root route if route not set yet
                if ('/' === $el.data('route_key') && this.$route.path !== '/') {
                    this.$router.push({ path: '/' })
                }
            }
        },
        mounted() {
            this.fetchInputs();
            this.fetchAllEditorShortcodes();

            const $el = jQuery('.ff_settings_list a[data-route_key="' + this.$route.path + '"]');
            if ($el.length) {
                this.maybeSetRoute($el)
                handleSidebarActiveLink($el.parent())
            } else {
                const $firstLink = jQuery('.ff_settings_list li:first-child').first();
                const firstLoad  = true
                handleSidebarActiveLink($firstLink,false ,firstLoad)
            }

            const that = this;
            jQuery('.ff_settings_list a').on('click', function (e) {
                const $el = jQuery(this);
                if ($el.attr('href') === '#' || '/' === $el.data('route_key')){
                    e.preventDefault();
                }
                that.maybeSetRoute($el)
                handleSidebarActiveLink($el.parent())
            });

            jQuery('head title').text('Settings & Integrations - Fluent Forms');
            (new ClipboardJS('.copy')).on('success', (e) => {
                this.$copy();
            });

            // init scrolling page
            this.scrollTo();

        }
    }
</script>
