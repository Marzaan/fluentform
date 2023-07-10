<template>
    <div class="el-form--label-top">
        <p><strong>{{ label }}</strong></p>

        <div class="dates-field-option" v-for="(field, i) in fields" v-if="isFormatAvailable(i)">
            <i @click="toggleDateFieldInputs" class="el-icon-caret-bottom el-icon-clickable pull-right"></i>

            <el-link type="primary" :underline="false">
                <b> {{ field.settings.title }} </b>
            </el-link>

            <div class="dates-field-option__settings">
                <fieldOptionSettings
                    :field="field"
                />
            </div>
        </div>
    </div>
</template>

<script>
import fieldOptionSettings from './fieldOptionSettings.vue';

export default {
    name: 'dateFieldSettings',
    props: ['format', 'label', 'fields'],
    components: {
        fieldOptionSettings,
    },
    computed: {
        isFormatAvailable() {
            return (key) => {
                switch (key) {
                    case 'hour':
                        return /h|H/.test(this.format);
                    case 'minute':
                        return /i/.test(this.format);
                    case 'ampm':
                        return /K/.test(this.format);
                    case 'day':
                        return /d|j/.test(this.format);
                    case 'month':
                        return /n|m|M|F/.test(this.format);
                    case 'year':
                        return /y|Y/.test(this.format);
                }
            };
        }
    },
    methods: {
        toggleDateFieldInputs(event) {
            if (!jQuery(event.target).parent().find('.dates-field-option__settings').hasClass('is-open')) {
                jQuery(event.target).removeClass('el-icon-caret-bottom');
                jQuery(event.target).addClass('el-icon-caret-top');
                jQuery(event.target).parent().find('.dates-field-option__settings').addClass('is-open');
                jQuery(event.target).parent().find('.required-checkbox').addClass('is-open');
            } else {
                jQuery(event.target).removeClass('el-icon-caret-top');
                jQuery(event.target).addClass('el-icon-caret-bottom');
                jQuery(event.target).parent().find('.dates-field-option__settings').removeClass('is-open');
                jQuery(event.target).parent().find('.required-checkbox').removeClass('is-open');
            }
        }
    }
}
</script>
