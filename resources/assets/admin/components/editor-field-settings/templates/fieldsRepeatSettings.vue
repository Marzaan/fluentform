<template>
    <div class="el-form-item ff-repeater-setting">
        <elLabel class="ff-repeater-setting-label" :label="listItem.label" :helpText="listItem.help_text"></elLabel>
        <div class="address-field-option" v-for="(field, i) in editItem.fields" :key="i">
            <div class="field-options-settings">
                <div class="ff-repeater-header">
                    <div class="ff-repeater-title" @click="toggleAddressFieldInputs">{{ field.settings.label }}</div>
                    <div class="ff-repeater-action">
                        <i @click="toggleAddressFieldInputs" class="repeater-toggle mr-2 icon el-icon-caret-bottom"></i>
                        <action-btn>
                            <action-btn-add @click="increase(i)" size="mini"></action-btn-add>
                            <action-btn-remove @click="decrease(i)" size="mini"></action-btn-remove>
                        </action-btn>
                    </div>
                </div>
            </div>
            <div class="address-field-option__settings">
                <div class="el-form--label-top">
                    <div class="el-form-item">
                        <label class="el-form-item__label">
                            <span>{{ $t('Field Type') }}</span>
                        </label>
                        <div class="el-form-item__content">
                            <el-select class="w-100" @change="changeFieldType(field, i)" v-model="field.element">
                                <el-option v-for="(element,elementName) in available_elements" :key="elementName"
                                           :value="elementName" :label="$t(element)"></el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div v-if="field.element == 'select'">
                    <fieldOptionSettings :field="field" :child-fields="selectChildFields"></fieldOptionSettings>
                </div>
                <div v-if="field.element == 'input_mask'">
                    <fieldOptionSettings :field="field" :child-fields="inputMaskChildFields"></fieldOptionSettings>
                </div>
                <div v-if="field.element == 'input_text' || field.element == 'input_email' || field.element == 'input_number'">
                    <fieldOptionSettings :child-fields="inputChildFields" :field="field"></fieldOptionSettings>
                </div>
            </div>

        </div>
    </div>
</template>

<script type="text/babel">
    import elLabel from '../../includes/el-label.vue';
    import fieldOptionSettings from './fieldOptionSettings.vue';
    import validationRules from './validationRules.vue';
    import ActionBtn from '@/admin/components/ActionBtn/ActionBtn.vue';
    import ActionBtnAdd from '@/admin/components/ActionBtn/ActionBtnAdd.vue';
    import ActionBtnRemove from '@/admin/components/ActionBtn/ActionBtnRemove.vue';

    export default {
        name: 'customRepeaterFields',
        props: ['listItem', 'editItem'],
        components: {
            fieldOptionSettings,
            validationRules,
            elLabel,
            ActionBtn,
            ActionBtnAdd,
            ActionBtnRemove
        },
        data() {
            return {
                available_elements: {
                    'input_text': 'Text Field',
                    'input_email': 'Email Field',
                    'input_number': 'Numeric Field',
                    'select': 'Select Field',
                    'input_mask': 'Input Mask Field',
                },
                elementMaps: {
                    input_text: 'text',
                    input_email: 'email',
                    input_number: 'number',
                    select: 'select',
                    input_mask: 'text'
                },
                inputChildFields: ['label', 'value', 'placeholder'],
                selectChildFields: ['label', 'placeholder', 'advanced_options'],
                inputMaskChildFields: ['label', 'value', 'placeholder', 'temp_mask', 'data-mask', 'data-mask-reverse', 'temp_mask_list']
            }
        },
        methods: {
            changeFieldType(field, index) {
                let newCopy = this.getTypeSettings(field.element);
                newCopy.settings.label = field.settings.label;
                let freshCopy = _ff.cloneDeep(newCopy);
                this.$set(this.editItem.fields, index, freshCopy);
            },
            getTypeSettings(element) {
                let item = {
                    'element': element,
                    'attributes': {
                        'type': this.elementMaps[element],
                        'value': '',
                        'placeholder': '',
                        'data-mask': ''
                    },
                    'settings': {
                        'label': 'Column 1',
                        'help_message': '',
                        'validation_rules': {
                            required: {
                                'value': false,
                                'global': true,
                                'global_message': this.editItem.fields[0]?.settings?.validation_rules?.required?.global_message || '',
                                'message': 'This field is required'
                            }
                        }
                    },
                    'editor_options': {}
                };

                if (element == 'input_email') {
                    item.settings.validation_rules.email = {
                        value: true,
                        global: true,
                        message: 'This field must contain a valid email'
                    };
                }

                if (element == 'select') {
                    item.settings.advanced_options = [
                        {
                            label: 'Option 1',
                            value: 'Option 1'
                        },
                        {
                            label: 'Option 2',
                            value: 'Option 2'
                        }
                    ];
                }

                if (element == 'input_mask') {
                    item.settings.temp_mask = '';
                    item.settings['data-mask-reverse'] = 'no';
                    item.settings['data-clear-if-not-match'] = 'no';
                    item.settings.temp_mask_list = [
                        {
                            label: 'None',
                            value: ''
                        },
                        {
                            label: '(###) ###-####',
                            value: '(000) 000-0000'
                        },
                        {
                            label: '(##) ####-####',
                            value: '(00) 0000-0000'
                        },
                        {
                            label: '23/03/2018',
                            value: '00/00/0000'
                        },
                        {
                            label: '23:59:59',
                            value: '00:00:00'
                        },
                        {
                            label: '23/03/2018 23:59:59',
                            value: '00/00/0000 00:00:00'
                        },
                        {
                            label: 'Custom',
                            value: 'custom'
                        }
                    ];
                }

                return item;
            },
            highlightEl(el) {
                jQuery(el).addClass('highlighted').delay(1000).queue(function (next) {
                    jQuery(this).removeClass('highlighted');
                    next();
                });
            },
            increase(index) {
                const newCol = _ff.cloneDeep(this.getTypeSettings('input_text'));
                newCol.settings.label = `Column ${this.editItem.fields.length + 1}`;
                this.editItem.fields.splice(index + 1, 0, newCol);
              //  this.editItem.fields.push(newCol);
            },
            decrease(index) {
                if (this.editItem.fields.length > 1) {
                    this.editItem.fields.splice(index, 1);
                } else {
                    this.highlightEl(this.$refs.highlight);

                    this.$notify.error({
                        title: this.$t('Oops!'),
                        message: this.$t("The last item can not be deleted."),
                        offset: 30
                    });
                }
            },
            toggleAddressFieldInputs(event) {
                if (!jQuery(event.target).closest('.address-field-option').find('.address-field-option__settings').hasClass('is-open')) {
                    jQuery(event.target).closest('.address-field-option').find('.address-field-option__settings').addClass('is-open');
                    jQuery(event.target).closest('.address-field-option').find('.required-checkbox').addClass('is-open');
                } else {
                    jQuery(event.target).closest('.address-field-option').find('.address-field-option__settings').removeClass('is-open');
                    jQuery(event.target).closest('address-field-option').find('.required-checkbox').removeClass('is-open');
                }
            }
        }
    }
</script>
