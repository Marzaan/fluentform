<template>
    <div class="dropdown_label_repeater">
        <table v-if="!loading" class="ff-table">
            <thead>
            <tr>
                <th>{{field.field_label ||  $t('Field Label')}}</th>
                <th>{{field.value_label ||  $t('Field Value')}}</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, itemIndex) in settings[field.key]" :key="'item_'+itemIndex">
                <td>
                    <el-input :placeholder="field.field_label || $t('Field Label')" v-model="item.label"></el-input>
                </td>
                <td>
                    <field-general
                        :editorShortcodes="editorShortcodes"
                        v-model="item.item_value"
                    ></field-general>
                </td>
                <td>
                    <action-btn>
                        <action-btn-add @click="addItemAfter(itemIndex)"></action-btn-add>
                        <action-btn-remove v-if="settings[field.key].length > 1" @click="removeItem(itemIndex)"></action-btn-remove>
                    </action-btn>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/babel">
    import FieldGeneral from './_FieldGeneral';
    import ActionBtn from '@/admin/components/ActionBtn/ActionBtn.vue';
    import ActionBtnAdd from '@/admin/components/ActionBtn/ActionBtnAdd.vue';
    import ActionBtnRemove from '@/admin/components/ActionBtn/ActionBtnRemove.vue';

    export default {
        name: 'dropdown_label_repeater',
        props: ['settings', 'field', 'inputs', 'errors', 'editorShortcodes'],
        components: {
            FieldGeneral,
            ActionBtn,
            ActionBtnAdd,
            ActionBtnRemove
        },
        data() {
          return {
              loading: false
          }
        },
        methods: {
            addItemAfter(index) {
                this.loading = true;
                this.settings[this.field.key].splice( index + 1, 0, {
                    item_value: '',
                    label: ''
                });
                this.$nextTick(() => {
                    this.loading = false;
                });
            },
            removeItem(index) {
                this.loading = true;
                this.settings[this.field.key].splice(index, 1);
                this.$nextTick(() => {
                    this.loading = false;
                });
            }
        }
    }
</script>