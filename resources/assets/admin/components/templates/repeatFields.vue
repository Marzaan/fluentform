<template>
<el-form-item class="repeat-field" :class="{ 'is-required': !isMultiCol && required, ['ff-el-form-'+item.settings.label_placement]: item.settings.label_placement }">
    <elLabel slot="label" :label="item.settings.label"></elLabel>
    <div class="repeat-field--item">
        <el-form-item v-for="(field, key, i) in item.fields" :key="i" :class="{ 'is-required' : field.settings.validation_rules.required.value }">
            <elLabel v-if="isMultiCol" slot="label" :label="field.settings.label"></elLabel>
            <el-input v-if="field.element != 'select'" :value="field.attributes.value" :placeholder="field.attributes.placeholder"></el-input>
            <div v-else>
                <el-select :placeholder="field.attributes.placeholder" :value="field.attributes.value"></el-select>
            </div>
        </el-form-item>
    </div>
    <div :class="{'repeat-field-actions': isMultiCol }">
        <action-btn>
            <action-btn-add size="mini"></action-btn-add>
            <action-btn-remove size="mini"></action-btn-remove>
        </action-btn>
    </div>
</el-form-item>
</template>

<script>
import ActionBtn from '../ActionBtn/ActionBtn.vue';
import ActionBtnAdd from '../ActionBtn/ActionBtnAdd.vue';
import ActionBtnRemove from '../ActionBtn/ActionBtnRemove.vue';
import elLabel from '../includes/el-label.vue';


export default {
    name: 'repeat_fields',
    props: ['item'],
    components: {
        elLabel,
        ActionBtn,
        ActionBtnAdd,
        ActionBtnRemove
    },
    computed: {
        firstField() {
            return this.item.fields[0];
        },
        isMultiCol() {
            return this.item.fields.length > 1;
        },
        required() {
            return this.firstField.settings.validation_rules.required.value;
        }
    },
}
</script>
