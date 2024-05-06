<template>
    <div class="fcc_design_preview">
        <div :class="'ffc_browser_' + device_type" class="browser-frame">
            <div class="browser-controls">
                <div class="window-controls">
                    <span class="close"></span>
                    <span class="minimise"></span>
                    <span class="maximise"></span>
                </div>
                <div class="page-controls">
                    <span class="white-container dashicons dashicons-arrow-left-alt2"></span>
                    <span class="white-container dashicons dashicons-arrow-right-alt2"></span>
                </div>
                <span v-if="has_pro" class="url-bar white-container">
                    {{ preview_url }}
                </span>
                <span v-else class="url-bar bar-warning white-container">
                    {{ $t('Design Customization is only available on Pro Version of Fluent Forms.') }}<a target="_blank"
                                                                                              rel="noopener"
                                                                                              href="https://fluentforms.com/conversational-form">{{ $t('Buy Pro') }}</a>
                </span>
            </div>
            <div style="min-height: 600px;" v-loading="loading_iframe" id="fcc_iframe_holder"></div>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <el-switch
                v-model="device_type"
                active-value="desktop"
                inactive-value="mobile"
                :active-text="$t('Desktop')"
                :inactive-text="$t('Mobile')">
            </el-switch>
        </div>
    </div>
</template>

<script type="text/babel">
export default {
    name: 'DesignPreview',
    props: ['form_id', 'design_settings', 'has_pro', 'fonts', 'meta_settings'],
    data() {
        return {
            iframe: false,
            loading_iframe: true,
            preview_url: window.ffc_conv_vars.preview_url,
            device_type: 'desktop',
            last_font: ''
        }
    },
    watch: {
        design_settings: {
            handler(settings) {
                this.generateCss(settings);
            },
            deep: true
        },
        device_type(value) {
            if (this.iframe) {
                if (this.design_settings.hide_media_on_mobile == 'yes') {
                    (this.iframe.contents().find('body'))[0].classList.add('ffc_media_hide_mob_yes');
                } else {
                    (this.iframe.contents().find('body'))[0].classList.remove('ffc_media_hide_mob_yes');
                }
            }
        }
    },
    methods: {
        initIframe() {
            const that = this;
            this.iframe = jQuery('<iframe/>', {
                id: 'fcc_design_preview',
                src: this.preview_url + '&doing_preview=1',
                style: 'display:none;width:100%;height:600px',
                load: function () {
                    const frame = jQuery(this);
                    frame.show();
                    that.generateCss(that.design_settings);
                    that.loading_iframe = false;
                }
            });

            jQuery('#fcc_iframe_holder').html(this.iframe);
        },
        pushCSS(css) {
            if (this.iframe) {
                this.iframe.contents().find('head').find('#ffc_generated_css').html(css);
            }
        },
        generateCss(settings) {
            let css = '';
            let prefix = '.ff_conv_app_' + this.form_id;
            css += `${prefix} { background-color: ${settings.background_color}; }`;

            if (settings.answer_color) {
                css += `${prefix} .ffc-counter-div span { color: ${settings.answer_color}; }`;
                css += `${prefix} .ffc-counter-div .counter-icon-span svg { fill: ${settings.answer_color} !important; }`;
                css += `${prefix} .f-label-wrap, ${prefix} .f-answer { color: ${settings.answer_color} !important; }`;
                css += `${prefix} .f-label-wrap .f-key { border-color: ${settings.answer_color} !important; }`;
                css += `${prefix} .f-label-wrap .f-key-hint { border-color: ${settings.answer_color} !important; }`;
                css += `${prefix} .f-answer .f-radios-wrap ul li { background-color: ${this.hexToRGBA(settings.answer_color, '0.1')} !important; border: 1px solid ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-radios-wrap ul li:focus { background-color: ${this.hexToRGBA(settings.answer_color, .3)} !important }`;
                css += `${prefix} .f-answer .f-radios-wrap ul li:hover { background-color: ${this.hexToRGBA(settings.answer_color, .3)} !important }`;
                css += `${prefix} .f-answer .f-radios-wrap ul li.f-selected .f-key { background-color: ${settings.answer_color} !important; color: white; }`;
                css += `${prefix} .f-answer .f-radios-wrap ul li.f-selected .f-key-hint { background-color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-radios-wrap ul li.f-selected svg { fill: ${settings.answer_color} !important; }`;
                css += `${prefix} .f-answer input, ${prefix} .f-answer textarea{ color: ${settings.answer_color} !important; box-shadow: ${settings.answer_color}  0px 1px; }`;
                css += `${prefix} .f-answer input:focus, ${prefix} .f-answer textarea:focus { box-shadow: ${settings.answer_color}  0px 2px !important; }`;
                css += `${prefix} .f-answer textarea::placeholder, ${prefix} .f-answer input::placeholder { color: ${settings.answer_color} !important; }`;
                css += `${prefix} .text-success { color: ${settings.answer_color} !important; }`;

                css += `${prefix} .f-answer .f-matrix-table tbody td { background-color: ${this.hexToRGBA(settings.answer_color, '0.1')}; }`;
                css += `${prefix} .f-answer .f-matrix-table input { border-color: ${this.hexToRGBA(settings.answer_color, '0.8')}; }`;
                css += `${prefix} .f-answer .f-matrix-table input.f-radio-control:checked::after { background-color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-matrix-table input:focus::before { border-color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-matrix-table input.f-checkbox-control:checked { background-color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-matrix-table tbody tr::after { border-right-color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-matrix-table .f-table-cell.f-row-cell { box-shadow: ${this.hexToRGBA(settings.answer_color, '0.1')} 0px 0px 0px 100vh inset; }`;
                
                css += `${prefix} .f-answer .ff_file_upload_field_wrap { background-color: ${this.hexToRGBA(settings.answer_color, '0.1')}; border-color: ${this.hexToRGBA(settings.answer_color, '0.8')}; }`;
                css += `${prefix} .f-answer .ff_file_upload_field_wrap:hover { background-color: ${this.hexToRGBA(settings.answer_color, '0.3')};}`;
                css += `${prefix} .f-answer .ff_file_upload_field_wrap:focus-within { background-color: ${this.hexToRGBA(settings.answer_color, '0.3')}; }`;
                css += `${prefix} .f-answer .ff-upload-preview { border-color: ${this.hexToRGBA(settings.answer_color, '0.8')}; }`;
                css += `${prefix} .f-answer .ff-upload-preview .ff-upload-thumb { background-color: ${this.hexToRGBA(settings.answer_color, '0.3')}; }`;
                css += `${prefix} .f-answer .ff-upload-preview .ff-upload-details { border-left-color: ${this.hexToRGBA(settings.answer_color, '0.8')}; }`;
                css += `${prefix} .f-answer .ff-upload-preview .ff-upload-details .ff-el-progress { border-left-color: ${this.hexToRGBA(settings.answer_color, '0.8')}; }`;
                css += `${prefix} .f-answer .ff-upload-preview .ff-upload-details .ff-el-progress { background-color: ${this.hexToRGBA(settings.answer_color, '0.1')}; }`;
                css += `${prefix} .f-answer .ff-upload-preview .ff-upload-details .ff-el-progress .ff-el-progress-bar { background-color: ${settings.answer_color}; }`;

                css += `${prefix} .f-answer .f-star-wrap .f-star-field-wrap::before { background-color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-star-wrap .f-star-field-wrap .f-star-field .f-star-field-star .symbolOutline { fill: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-star-wrap .f-star-field-wrap .f-star-field .f-star-field-rating { color: ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .f-star-wrap .f-star-field-wrap.is-hovered .symbolFill { fill: ${this.hexToRGBA(settings.answer_color, '0.1')}; }`;
                css += `${prefix} .f-answer .f-star-wrap .f-star-field-wrap.is-selected .symbolFill { fill: ${settings.answer_color}; }`;

                css += `${prefix} .f-answer .f-payment-summary-wrap tbody td { background-color: ${this.hexToRGBA(settings.answer_color, '0.1')}; }`;
                css += `${prefix} .f-answer .f-payment-summary-wrap tfoot th { background-color: ${this.hexToRGBA(settings.answer_color, '0.1')}; }`;
                
                css += `${prefix} .f-answer .stripe-inline-holder { border-bottom: 1px solid ${settings.answer_color}; }`;
                css += `${prefix} .f-answer .StripeElement--focus { border-bottom: 2.5px solid ${settings.answer_color}; }`;

                css += `${prefix} .ff_conv_input .f-info { color: ${settings.answer_color}; }`;

                css += `${prefix} .f-answer .el-slider__runway {background-color: ${settings.answer_color};}`
            }

            if (settings.question_color) {
                css += `${prefix} .fh2 .f-text { color: ${settings.question_color}; }`
                css += `${prefix} .fh2 .f-tagline, ${prefix} .f-sub .f-help { color: ${this.hexToRGBA(settings.question_color, '0.70')}; }`
                css += `${prefix} .fh2 .stripe-inline-header { color: ${settings.question_color}; }`
            }

            if (settings.button_color) {
                css += `${prefix} .q-inner .o-btn-action, ${prefix} .footer-inner-wrap .f-nav { background-color: ${settings.button_color}; }`;
                css += `${prefix} .q-inner .o-btn-action span, ${prefix} .footer-inner-wrap .f-nav a { color: ${settings.button_text_color}; }`;
                css += ` ${prefix} .f-enter .f-enter-desc { color: ${settings.button_color}; }`;
                css += `${prefix} .footer-inner-wrap .f-nav a svg { fill: ${settings.button_text_color}; }`;
                css += `${prefix} .vff-footer .f-progress-bar { background-color: ${this.hexToRGBA(settings.button_color, .3)}; }`;
                css += `${prefix} .vff-footer .f-progress-bar-inner { background-color: ${settings.button_color}; }`;
                css += `${prefix} .q-inner .o-btn-action:hover { background-color: ${settings.button_color + 'D6'}; }`;
                css += `${prefix} .q-inner .o-btn-action:focus::after { border-radius: 6px; inset: -3px; box-shadow: ${settings.button_color} 0px 0px 0px 2px; }`;
            }

            if (settings.background_image) {
                let opacity = 1;
                let imagePropertyCss = '';
                if (settings.background_brightness && settings.background_brightness > 0) {
                    opacity = (1 - settings.background_brightness / 100).toFixed(2);
                } else if (settings.background_brightness < 0) {
                    opacity = settings.background_brightness;
                    css += `${prefix}:before { background-color: rgb(0, 0, 0); }`;
                    opacity = ((opacity * -1) / 100).toFixed(2);
                    imagePropertyCss = `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity})), `;
                }

                css += `${prefix}:before { content: ' '; opacity: ${opacity}; background-image: ${imagePropertyCss} url("${settings.background_image}"); }`;
            }

            css += `${prefix} .f-answer .f-radios-wrap ul li.f-selected .f-key { color: ${settings.background_color}; }`;

            if (settings.disable_branding == 'yes') {
                css += `${prefix} .footer-inner-wrap .f-nav a.ffc_power { display: none !important; }`;
            }

            if (settings.key_hint == 'yes') {
                css += `${prefix} .f-radios .f-key { display: flex !important; }`;
            }

            this.generateFont(settings.font_family);

            this.$emit('css_generated', css);
            this.pushCSS(css);
			// Add background color on iframe
			jQuery('#fcc_design_preview').css({"background-color": settings.background_color});
        },
        hexToRGBA(hex, opacity) {

            if (hex.indexOf('rgb(') !== -1) {
                return hex.replace('rgb(', 'rgba(')
                    .replace(')', ',' + opacity + ')');
            }

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            const values = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;

            if (!values) {
                return `rgba(0,0,0, ${opacity})`;
            }

            return `rgba(${values.r},${values.g},${values.b}, ${opacity})`;
        },

        generateFont(fontFamily) {
            if (!this.iframe) {
                return false;
            }

            if(this.last_font == fontFamily) {
                return false;
            }

            this.last_font = fontFamily;

            let prefix = '.ff_conv_app.ff_conv_app_' + this.form_id;

            let googleFont = this.fonts.google[fontFamily];

            if (googleFont) {
                const variations = googleFont.variants.join(',');
                let fontSrc = "https://fonts.googleapis.com/css?family=" + encodeURI(fontFamily) + ":" + variations;
                let fontSheet = this.iframe.contents().find('#ffc_google_font');

                if (fontSheet.length) {
                    fontSheet[0].href = fontSrc;
                } else {
                    const fontDom = document.createElement('link');
                    fontDom.id = 'ffc_google_font';
                    fontDom.href = fontSrc;
                    fontDom.rel = 'stylesheet';
                    fontDom.type = 'text/css';
                    (this.iframe.contents().find('head'))[0].append(fontDom);
                }

                let fontCss = `${prefix} { font-family: '${fontFamily}',${googleFont.category}; }`;
                this.meta_settings.font_css = fontCss;
                this.iframe.contents().find('head').find('#ffc_font_css').html(fontCss);
                this.meta_settings.google_font_href = fontSrc;
            } else {
                this.meta_settings.google_font_href = '';
                let defaultCss = '';
                if(fontFamily) {
                    let systemFont = this.fonts.system[fontFamily];
                    if(systemFont) {
                        defaultCss = `${prefix} { font-family: '${fontFamily}',${systemFont.fallback}; }`;
                    }
                }
                this.meta_settings.font_css = defaultCss;
                this.iframe.contents().find('head').find('#ffc_font_css').html(defaultCss);
            }
        }
    },
    mounted() {
        this.initIframe();
    }
}
</script>
