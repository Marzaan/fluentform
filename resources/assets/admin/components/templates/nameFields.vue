<template>
<div>
    <label v-if="item.settings.label" class="label-block" :class="item.settings.required ? 'is-required' : ''">{{ item.settings.label }}</label>

    <el-row :gutter="30">
        <template v-for="(field, key) in item.fields">
            <el-col :key="key" :md="is_conversion_form ? 24 : 24 / columns" v-if="field.settings.visible" :class="'ff-el-form-'+item.settings.label_placement" class="address-field-wrapper">
                <component :is="guessElTemplate(field)" :item="field"></component>
            </el-col>
        </template>
    </el-row>
</div>
</template>

<script type="text/babel">
import inputText from './inputText.vue'

export default {
    name: 'nameFields',
    props: ['item'],
    components: {
        'ff_inputText': inputText
    },
    computed: {
        columns() {
            let count = 0;
            _ff.each(this.item.fields, (element) => {
                if (element.settings.visible) {
                    count++;
                }
            });
            return count;
        }
    }
}
</script>