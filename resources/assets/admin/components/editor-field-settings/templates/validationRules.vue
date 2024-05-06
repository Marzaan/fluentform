<template>
<el-form :labelPosition="labelPosition" :labelWidth="labelWidth" class="el-form-nested">

    <template v-for="(repoItem, key) in editorRepo">
        <div v-if="key in validation_rules" :key="key" :class="validation_rules[key].value ? 'ff_validation_rule_warp' : ''">
            <component :is="guessElTemplate(repoItem)"
                   v-model="validation_rules[key].value"
                   :editItem="editItem"
                   :listItem="repoItem">
            </component>

            <ff_inputRadio
                v-if="isTabularGrid"
                v-model="validation_rules.required.per_row"
                :listItem="tabularGridRequiredRow" />

            <transition name="slide-fade">
                <div v-if="validation_rules[key].value" class="ff_validation_rule_error_choice">
                    <div class="ff_validation_rule_error_label_wrap">
                        <label class="el-form-item__label">
                            <span v-if="validation_rules[key].global == true "> {{$t('Global')}} </span>
                            <span v-else> {{$t('Custom')}} </span>
                            {{$t('Error Message')}}
                            <el-tooltip popper-class="ff_tooltip_wrap"
                                        :content="`${$t('This message will be shown if validation fails for')} ${repoItem.label}. Configure Global Message from: Global settings > Validation Messages`"
                                        placement="top">
                                <i class="tooltip-icon el-icon-info"></i>
                            </el-tooltip>
                        </label>
                        <el-switch
                                class="ff-switch-sm"
                                inactive-color="#409eff"
                                v-model="validation_rules[key].global"
                        />
                    </div>
                    <transition name="slide-fade">
                        <div style="max-height: 60px;">
                            <el-form-item>
                                <el-input v-if="!validation_rules[key].global" v-model="validation_rules[key].message" type="text"></el-input>
	                            <el-input v-else disabled readonly v-model="validation_rules[key].global_message" type="text"></el-input>
                            </el-form-item>
                        </div>
                    </transition>
                </div>
            </transition>
        </div>
    </template>
</el-form>
</template>

<script>
import select from './select.vue'
import inputText from './inputText.vue'
import inputRadio from './inputRadio.vue'
import maxFileSize from './maxFileSize.vue'
import inputCheckbox from './inputCheckbox.vue'
import elLabel from '../../includes/el-label.vue'

const validationRepository = FluentFormApp.validation_rule_settings;

const composeFieldOptions = (args = []) => (obj = {}) => {
    let listOpt = {};
    args.map(prop => {
        if (validationRepository.hasOwnProperty(prop)) {
            listOpt[prop] = validationRepository[prop];
        }
    });
    return { ...listOpt, ...obj };
};

export default {
    name: 'validationRules',
    props: {
        editItem: Object,
        labelPosition: {
            type: String,
            default: 'top'
        },
        labelWidth: {
            type: String,
            default: ''
        },
    },
    components: {
        elLabel,
        ff_select: select,
        ff_inputText: inputText,
        ff_inputRadio: inputRadio,
        ff_maxFileSize: maxFileSize,
        ff_inputCheckbox: inputCheckbox,
    },
    data() {
        return {
            tabularGridRequiredRow: {
                label: 'Required as per row?',
                help_text: 'tabularGridRequiredRow',
                options: [
                    {
                        label: 'Yes',
                        value: true
                    },
                    {
                        label: 'No',
                        value: false
                    },
                ]
            },
           /**
            * deifne rules here if they are possible duplicates in dictionary
            * wrap validation rules in an object named with the `element` value
            */
            extraRepo: {
                /*
                input_text: {
                    example_rule: { // you must have the key available
                        template: 'inputText',
                        type: 'text',
                        label: 'Example Rule',
                        help_text: 'Example help text'
                    }
                }
                */
            }
        }
    },
    computed: {
        isTabularGrid() {
            return (this.editItem.element == 'tabular_grid') && this.validation_rules.required.value;
        },

        validation_rules() {
            return this.editItem.settings.validation_rules;
        },

        rulesKeys() {
            return Object.keys( this.validation_rules );
        },

        editorRepo() {
            const attachExtras = composeFieldOptions( this.rulesKeys );
            return attachExtras( this.extraRepo[this.editItem.element] );
        }
    }
}
</script>
