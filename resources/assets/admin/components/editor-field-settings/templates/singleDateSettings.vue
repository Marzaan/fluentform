<template>
    <div>
        <inputText
            v-model="item.single_field.settings.label"
            :listItem="{type: 'text', label: 'Label'}"
        />

        <radioButton 
            v-model="item.single_field.settings.label_placement"
            :listItem="{
                label: label_placement.label,
                options: label_placement.options,
                help_text: label_placement.help_text
            }"
        />

        <inputText
            v-model="item.attributes.placeholder"
            :listItem="{type: 'text', label: 'Placeholder'}"
        />

        <validationRules
            :editItem="item.single_field"
        />

        <customSelect
            v-model="item.single_field.settings.date_format"
            :listItem="{
                label: date_format.label,
                options: date_format.options
            }"
        />
    </div>
</template>

<script type="text/babel">

import inputText from './inputText.vue';
import customSelect from './select.vue';
import radioButton from './radioButton.vue';
import validationRules from './validationRules.vue';

export default {
    name: 'singleDateSettings',
    props: {
        item: {
            type: Object
        },
        label_placement: {
            type: Object
        },
        date_format: {
            type: Object
        }
    },
    components: {
        inputText,
        customSelect,
        radioButton,
        validationRules
    }
}
</script>

