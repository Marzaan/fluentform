<template>
    <withLabel :item="field">
        <el-input 
            :type="item.attributes?.type"
            :value="item.settings?.date_default_value"
            :placeholder="item.attributes?.placeholder">
        </el-input>
    </withLabel>
</template>

<script>
import withLabel from './withLabel.vue';

export default {
    name: 'inputDate',
    props: ['item', 'field'],
    components: {
        withLabel
    },
}
</script>