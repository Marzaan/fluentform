<template>
    <div class="edit_entry_view">
        <el-form v-if="has_pro" :data="entry" label-position="top">
            <template v-for="(field, fieldKey) in parsedFields">
                <el-form-item :label="labels[fieldKey]" :key="fieldKey">
                    <component
                        v-if="field.component"
                        v-model="entry[fieldKey]"
                        :type="field.type"
                        :field="field.field"
                        :is="field.component">
                    </component>
                    <div v-else>
                        <p>{{field.field.admin_label}} {{ $t('is Not Editable') }}</p>
                    </div>
                </el-form-item>
            </template>

            <div class="el-dialog__footer text-left mt-3">
                <span class="dialog-footer">
                    <el-button v-loading="saving" @click="updateEntry()" type="primary">
                        {{ $t('Update Entry') }}
                    </el-button>
                    <el-button @click="closeModel()" type="text" class="el-button--text-light">
                        {{ $t('Cancel') }}
                    </el-button>
                </span>
            </div>
        </el-form>

        <notice class="ff_alert_between mt-4" type="danger-soft" v-else>
            <div>
                <h6 class="title">{{$t('This is a Pro Feature')}}</h6> 
                <p class="text">{{$t('Please upgrade to pro to unlock this feature.')}}</p>
            </div>
            <a target="_blank" :href="upgrade_url" class="el-button el-button--danger el-button--small">
                {{$t('Upgrade to Pro')}}
            </a>
        </notice>
    </div>
</template>

<script type="text/babel">
    import each from 'lodash/each';

    import MultiTextLine from './EntryEditor/MultiText';
    import TextLine from './EntryEditor/Text';
    import AddressEditor from './EntryEditor/AddressEditor';
    import SelectField from './EntryEditor/SelectField';
    import RadioField from './EntryEditor/RadioField';
    import CheckboxField from './EntryEditor/CheckboxField';
    import TermsField from './EntryEditor/TermsField';
    import RepeatField from './EntryEditor/RepeatField';
    import MultiFile from './EntryEditor/MultiFile';
    import Notice from '@/admin/components/Notice/Notice.vue';

    export default {
        name: 'edit_entry',
        props: ['form_id', 'entry_id', 'submission', 'fields', 'labels'],
        components: {
            MultiTextLine,
            TextLine,
            AddressEditor,
            SelectField,
            RadioField,
            CheckboxField,
            TermsField,
            RepeatField,
            MultiFile,
            Notice
        },
        data() {
            return {
                entry: JSON.parse(this.submission.response),
                saving: false,
                has_pro: !!window.fluent_form_entries_vars.has_pro,
                upgrade_url: window.fluent_form_entries_vars.upgrade_url
            }
        },
        computed: {
            parsedFields() {
                let fields = {};
                each(this.fields, (field, index) => {
                    fields[index] = this.getEditType(field);
                });
                return fields;
            }
        },
        methods: {
            closeModel() {
                this.$emit('close', 1);
            },
            updateEntry() {
                this.saving = true;
                FluentFormsGlobal.$post({
                    action: 'fluentform_update_entry',
                    form_id: this.form_id,
                    entry_id: this.entry_id,
                    entry: JSON.stringify(this.entry)
                })
                    .then(response => {
                        this.$notify.success({
                            message: response.data.message,
                            offset: 30
                        });
                        this.$emit('reloadData', 1);
                        this.$emit('close', 1);
                    })
                    .fail(error => {
                        this.$notify.error({
                            message: 'Something is wrong when saving the field',
                            offset: 30
                        });
                        console.log(error);
                    })
                    .always(() => {
                        this.saving = false;
                    })
            },
            getEditType(field) {
                let element = field.element;
                switch (element) {
                    case 'input_email':
                    case 'post_title':
                    case 'input_text':
                    case 'input_url':
                    case 'input_password':
                    case 'input_date':
                    case 'input_number':
                    case 'phone':
                        return {
                            component: 'text-line',
                            type: field.raw.attributes.type,
                            field: field
                        }
                        break;
                    case 'net_promoter_score':
                        return {
                            component: 'text-line',
                            type: 'number',
                            field: field
                        }
                        break;
                    case 'rangeslider':
                        return {
                            component: 'text-line',
                            type: 'number',
                            field: field
                        }
                        break;
                    case 'textarea':
                        return {
                            component: 'text-line',
                            type: 'textarea',
                            field: field
                        }
                        break;
                    case 'input_hidden':
                        return {
                            component: 'text-line',
                            type: 'text',
                            field: field
                        }
                        break;
                    case 'select_country':
                        field.raw.options = window.fluent_form_entries_vars.available_countries;
                        return {
                            component: 'select-field',
                            type: 'select',
                            field: field
                        }
                    case 'address':
	                case 'input_name':
                        return {
                            component: 'address-editor',
                            type: 'address',
                            field: field
                        }
                        break;
                    case 'select':
                        field.raw.options = this.extractOptions(field.raw);
                        return {
                            component: 'select-field',
                            type: 'select',
                            field: field
                        }
                        break;
                    case 'input_radio':
                    case 'ratings':
                    case 'net_promoter':
                        field.raw.options = this.extractOptions(field.raw);
                        return {
                            component: 'radio-field',
                            type: 'radio',
                            field: field
                        }
                        break;
                    case 'input_checkbox':
                        field.raw.options = this.extractOptions(field.raw);
                        return {
                            component: 'checkbox-field',
                            type: 'checkbox',
                            field: field
                        }
                        break;
                    case 'terms_and_condition':
                    case 'gdpr_agreement':
                        return {
                            component: 'terms-field',
                            type: 't_and_c',
                            field: field
                        }
                        break;
                    case 'repeater_field':
                        return {
                            component: 'repeat-field',
                            type: 'repeat_field',
                            field: field
                        }
                        break;
                    case 'input_image':
                    case 'input_file':
                        return {
                            component: 'multi-file',
                            type: 'file-load',
                            field: field
                        }
                        break;
                    default:
                        return {
                            component: '',
                            type: element,
                            field: field
                        };
                }
            },
            extractOptions(element) {
                let options = element.options;
                if(!options) {
                    let formattedOptions = {};
                    each(element.settings.advanced_options, (optionItem) => {
                        formattedOptions[optionItem.value] = optionItem.label;
                    });
                    return formattedOptions;
                }
                return options;
            }
        }
    }
</script>
