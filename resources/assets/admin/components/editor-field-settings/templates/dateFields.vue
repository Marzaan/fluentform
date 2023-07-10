<template>
    <div>
        <template v-if="editItem.settings.date_type === 'single'">
            <singleDateSettings
                :item="editItem"
                :label_placement="editorElements.label_placement"
                :date_format="editorElements.date_format"
            />
        </template>
        <template v-else>
            <div class="el-form--label-top">
                <inputText
                    v-model="editItem.multi_field.settings.label"
                    :listItem="{type: 'text', label: 'Label'}"
                />

                <customSelect
                    v-model="editItem.multi_field.settings.date_format"
                    :listItem="{
                        label: editorElements.multi_date_format?.label,
                        help_text: editorElements.multi_date_format?.help_text,
                        options: editorElements.multi_date_format?.options
                    }"
                />

                <inputText
                    v-show="isCustomFormat"
                    :error="checkValidation"
                    v-model="editItem.multi_field.settings.custom_format"
                    :listItem="{
                        type: 'text',
                        label: editorElements.custom_format?.label,
                        options: editorElements.custom_format?.options,
                        help_text: editorElements.custom_format?.help_text
                    }"
                />
                
                <dateFieldSettings
                    :format="getFormat()"
                    :label="listItem.label"
                    :fields="editItem.multi_field.fields"
                />

                <radioButton
                    v-model="editItem.multi_field.settings.label_placement"
                    :listItem="{
                        label: editorElements.label_placement?.label,
                        options: editorElements.label_placement?.options,
                        help_text: editorElements.label_placement?.help_text
                    }"
                />
                
            </div>
        </template>
    </div>
</template>

<script>
import fieldOptionSettings from './fieldOptionSettings.vue';
import singleDateSettings from './singleDateSettings.vue';
import dateFieldSettings from './dateFieldSettings.vue';
import inputText from './inputText.vue';
import customSelect from './select.vue';
import radioButton from './radioButton.vue';

export default {
    name: 'dateFields',
    props: ['listItem', 'editItem'],
    components: {
        fieldOptionSettings,
        singleDateSettings,
        dateFieldSettings,
        inputText,
        customSelect,
        radioButton,
    },
    data() {
        return {
            editorElements: FluentFormApp.element_customization_settings,
            maxYear: this.editItem.multi_field?.fields?.year?.settings?.validation_rules?.max,
            minYear: this.editItem.multi_field?.fields?.year?.settings?.validation_rules?.min,
        }
    },
    watch: {
        'editItem.multi_field.settings.date_format': {
            handler() {
                this.updateYearValues();
            },
        },
        'editItem.multi_field.settings.custom_format': {
            handler() {
                this.updateYearValues();
            },
        },
    },
    computed: {
        isCustomFormat() {
            const dateFormat = this.editItem.multi_field?.settings?.date_format;
            return dateFormat === 'custom';
        },
        checkValidation() {
            const customFormat = this.editItem.multi_field?.settings?.custom_format;
            if (!this.isFormatAvailable(customFormat)) {
                return {
                    message: 'Invalid format',
                };
            }
            return false;
        }
    },
    methods: {
        getFormat() {
            let dateFormat = this.editItem.multi_field?.settings?.date_format;
            if (dateFormat === 'custom') {
                const customFormat = this.editItem.multi_field?.settings?.custom_format;
                dateFormat = this.isFormatAvailable(customFormat) ? customFormat : '';
            }
            return dateFormat || 'Y';
        },
        isFormatAvailable(format) {
            return this.editorElements.custom_format.format_mapping[format];
        },
        isShortYear() {
            const dateFormat = this.getFormat();
            return /y/.test(dateFormat);
        },
        updateYearValues() {
            let minYear = this.minYear.value;
            let maxYear = this.maxYear.value;
            if (this.isShortYear()) {
                minYear = minYear.slice(-2);
                maxYear = maxYear.slice(-2);
            } else {
                minYear = ('20' + minYear).slice(-4);
                maxYear = ('20' + maxYear).slice(-4);
            }
            this.$set(this.maxYear, 'value', maxYear);
            this.$set(this.minYear, 'value', minYear);
        },
    }
}
</script>
