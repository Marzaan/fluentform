<template>
    <withLabel :item="item">
        <div class="ff_with_arrow">
            <select class="select el-input__inner">
                <option>{{defaultVal || item.settings.placeholder || item.attributes.placeholder}}</option>
            </select>
        </div>
    </withLabel>
</template>

<script type="text/babel">
import withLabel from './withLabel.vue';
import find from 'lodash/find';

export default {
    name: 'customSelect',
    props: ['item'],
    computed :{
        defaultVal() {
            let value = this.item.attributes.value;
            let option = find(this.item.settings.advanced_options, { value: value });

            return option ? option.label : ( value ? value : null);
        }
    },
    components: {
        withLabel
    }
}
</script>
