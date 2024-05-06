<template>
    <div class="panel__body--item"
        :class="['text-' + submitButton.settings.align, {'selected': !!editItem.uniqElKey && editItem.uniqElKey == submitButton.uniqElKey}]">
        <div @click="editSelected(submitButton)" class="item-actions-wrapper hover-action-middle">
            <div class="item-actions">
                <i @click="editSelected(submitButton)" class="el-icon el-icon-edit"></i>
            </div>
        </div>
        <!-- ADDED IN v1.2.6 -->
        <template v-if="submitButton.settings.button_ui">
            <button 
                class="ff-btn"
                :class="[btnSize, btnStyleClass]"
                v-if="submitButton.settings.button_ui.type == 'default'"
                v-html="submitButton.settings.button_ui.text"
                :style="btnStyles">
            </button>
            <img v-else :src="submitButton.settings.button_ui.img_url" :alt="$t('Submit Button')" style="max-width: 200px;">
        </template>

        <!-- Button before 1.2.6 -->
        <button
            class="ff-btn"
            :class="btnSize"
            v-if="submitButton.settings.btn_text"
            :style="btnStyles">
            {{ submitButton.settings.btn_text }}
        </button>
    </div>
</template>

<script>
export default {
    name: 'buttonSubmit',
    props: ['submitButton', 'editSelected', 'editItem'],
    computed: {
        btnStyles() {
            if(this.submitButton.settings.button_style != '') {
                return {
                    backgroundColor: this.submitButton.settings.background_color,
                    color: this.submitButton.settings.color,
                }
            }

            let defaultStyles = this.submitButton.settings.normal_styles;

            let currentState = 'normal_styles';
            if(this.submitButton.settings.current_state == 'hover_styles' && this.editItem.element == 'button') {
                currentState = 'hover_styles';
            }

            if(!this.submitButton.settings[currentState]) {
                return defaultStyles;
            }

            let styles = JSON.parse(JSON.stringify(this.submitButton.settings[currentState]));

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
            return this.submitButton.settings.button_style;
        },
        btnSize() {
            return 'ff-btn-' + this.submitButton.settings.button_size
        }
    }
}
</script>

