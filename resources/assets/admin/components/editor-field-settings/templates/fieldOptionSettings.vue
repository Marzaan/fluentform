<template>
    <div>
        <el-form labelPosition="top" class="el-form-nested">
            <inputText v-if="childFields.indexOf('label') != -1" :listItem="{type: 'text', label: $t('Label')}" v-model="field.settings.label"></inputText>

            <radioButton v-if="childFields.indexOf('label_placement') != -1" :listItem="{label: $t('Label Placement'), options: labelPlacementOptions}" v-model="field.settings.label_placement"></radioButton>

            <inputDefaultValue v-if="childFields.indexOf('value') != -1" v-model="field.attributes.value" :listItem="{label: 'Default'}" :editItem="field"></inputDefaultValue>

            <inputText v-if="childFields.indexOf('placeholder') != -1" :listItem="{type: 'text', label: $t('Placeholder')}" v-model="field.attributes.placeholder"></inputText>

            <inputText v-if="childFields.indexOf('help_message') != -1" :listItem="{type: 'text', label: $t('Help Message')}" v-model="field.settings.help_message"></inputText>

            <inputText v-if="childFields.indexOf('maxlength') != -1 && field.attributes.maxlength" :listItem="{type: 'number', label: $t('Max text length')}" v-model="field.attributes.maxlength"></inputText>

            <customSelect v-if="childFields.indexOf('temp_mask_list') != -1" :listItem="{label: $t('Mask Input'), options: field.settings.temp_mask_list}" v-model="field.settings.temp_mask"></customSelect>

            <template v-if="field.settings.temp_mask == 'custom'">
                <custom-mask v-model="field.attributes['data-mask']" :listItem="{label: $t('Custom Mask'), help_text: $t('Write your own mask for this input'), type: 'text'}"></custom-mask>
                <input-yes-no-checkbox v-model="field.settings['data-mask-reverse']" :listItem="{label: $t('Activating a reversible mask'), help_text: $t('If you enable this then it the mask will work as reverse') }"></input-yes-no-checkbox>
                <input-yes-no-checkbox v-model="field.settings['data-clear-if-not-match']" :listItem="{label: $t('Clear if not match'), help_text: $t('Clear value if not match the mask') }"></input-yes-no-checkbox>
            </template>

            <advanced-options
                    class="ff_full_width_child"
                    v-if="childFields.indexOf('advanced_options') != -1 ||field.settings.advanced_options  != undefined "
                    :editItem="field" :list-item="{ label: 'Options', help_text: 'Provide Field Options'}"
                    :hasCalValue="true"
            ></advanced-options>

        </el-form>

        <validationRules :editItem="field"></validationRules>
    </div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex';

import inputText from './inputText.vue'
import customSelect from './select.vue'
import inputYesNoCheckbox from './inputYesNoCheckbox.vue'
import customMask from './customMask.vue'
import inputDefaultValue from './inputValue.vue'
import inputPopover from '../../input-popover.vue'
import validationRules from './validationRules.vue'
import advancedOptions from './advanced-options'
import InputCheckbox from '../../templates/inputCheckbox';
import radioButton from "./radioButton.vue";

export default {
    name: 'fieldOptionSettings',
    props: {
        field: {
            type: Object
        },
        childFields: {
            default() {
                return [
                    'label',
                    'value',
                    'placeholder',
                    'help_message',
                    'maxlength',
                    'label_placement'
                ]
            }
        }
    },
    components: {
        InputCheckbox,
        inputText,
        inputPopover,
        validationRules,
        inputDefaultValue,
        advancedOptions,
        customSelect,
        inputYesNoCheckbox,
	    customMask,
        radioButton,
    },
    computed: {
        ...mapGetters(['editorShortcodes']),
        labelPlacementOptions() {
            return this.field.settings.label_placement_options;
        }
    },
}
</script>

