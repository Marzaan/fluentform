<template>
    <div :style="wrapperStyle" class="ff_custom_button">
        <button
            class="ff-btn"
            :class="[btnSize, btnStyleClass]"
            v-if="item.settings.button_ui.type == 'default'"
            v-html="item.settings.button_ui.text"
            :style="btnStyles">
        </button>
        <img v-else :src="item.settings.button_ui.img_url" :alt="$t('Submit Button')" style="max-width: 200px;">
        <div v-html="extraHtml"></div>
    </div>
</template>

<script type="text/babel">

    export default {
        name: 'customButton',
        props: ['item'],
        computed: {
            btnStyles() {
                if(this.item.settings.button_style != '') {
                    return {
                        backgroundColor: this.item.settings.background_color,
                        color: this.item.settings.color,
                    }
                }

                let defaultStyles = this.item.settings.normal_styles;

                let currentState = 'normal_styles';
                if(this.item.settings.current_state == 'hover_styles') {
                    currentState = 'hover_styles';
                }

                if(!this.item.settings[currentState]) {
                    return defaultStyles;
                }

                let styles = JSON.parse(JSON.stringify(this.item.settings[currentState]));

                if(styles.borderRadius) {
                    styles.borderRadius = styles.borderRadius+'px';
                } else {
                    delete(styles.borderRadius);
                }

                if(!styles.minWidth) {
                    delete(styles.minWidth);
                }

                return { ...defaultStyles, ...styles};
            },
            btnStyleClass() {
                return this.item.settings.button_style;
            },
            btnSize() {
                return 'ff-btn-' + this.item.settings.button_size
            },
            wrapperStyle() {
                let styles = {};
                styles.textAlign = this.item.settings.align;
                return styles;
            },
            extraHtml(){
                if (this.item.element === 'custom_submit_button'){
                    return  '<style>.ff_default_submit_button_wrapper {display: none !important;}</style>'
                }
            }
        }
    }
</script>
