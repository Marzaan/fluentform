<template>
    <div class="ff_routing_fields">
        <div v-if="!disabled">
            <table class="ff_routing_table">
                <tbody>
                    <tr v-for="(routing, key) in routings" :key="key">
                        <td>
                            <label class="ff_inline">
                                {{$t(labels.input_label)}}
                                <el-input v-if="input_type == 'text'" :placeholder="labels.input_placeholder" size="small" v-model="routing.input_value"/>
                                <el-select size="small" v-else-if="input_type == 'select'" v-model="routing.input_value" :placeholder="$t(labels.input_placeholder)">
                                    <el-option
                                        v-for="(item,itemValue) in inputOptions"
                                        :key="itemValue"
                                        :label="item"
                                        :value="itemValue">
                                    </el-option>
                                </el-select>
                            </label>
                        </td>
                        <td>
                            If
                        </td>
                        <td>
                            <el-select size="small" v-model="routing.field" style="width: 100%" @change="routing.value = ''">
                                <el-option v-for="(field, key) in fields" :key="key"
                                           :label="field.admin_label" :value="key"
                                ></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select size="small" v-model="routing.operator">
                                <el-option value="=" :label="$t('equal')"></el-option>
                                <el-option value="!=" :label="$t('not equal')"></el-option>
                                <template v-if="fields[routing.field] && !Object.keys(fields[routing.field].options).length">
                                    <el-option value=">" :label="$t('greater than')"></el-option>
                                    <el-option value="<" :label="$t('less than')"></el-option>
                                    <el-option value=">=" :label="$t('greater than or equal')"></el-option>
                                    <el-option value="<=" :label="$t('less than or equal')"></el-option>
                                    <el-option value="contains" :label="$t('contains')"></el-option>
                                    <el-option value="doNotContains" :label="$t('do not contains')"></el-option>
                                    <el-option value="startsWith" :label="$t('starts with')"></el-option>
                                    <el-option value="endsWith" :label="$t('ends with')"></el-option>
                                    <el-option value="test_regex" :label="$t('Regex Match')"></el-option>
                                </template>
                            </el-select>
                        </td>
                        <td>
                            <el-select size="small"
                                       v-if="fields[routing.field] && Object.keys(fields[routing.field].options).length"
                                       v-model="routing.value" style="width: 100%">
                                <el-option v-for="(label, value) in fields[routing.field].options" :key="value"
                                           :label="label" :value="value"
                                ></el-option>
                            </el-select>
                            <el-input size="small" v-else :placeholder="$t('Enter a value')" v-model="routing.value"></el-input>
                        </td>
                        <td>
                            <action-btn>
                                <action-btn-add @click="add(key)" size="mini"></action-btn-add>
                                <action-btn-remove @click="remove(key)" size="mini" v-if="routings.length > 1"></action-btn-remove>
                            </action-btn>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <coming-soon v-else :visibility.sync="comingSoon"/>

    </div>
</template>

<script type="text/babel">
    import ComingSoon from '../../modals/ItemDisabled';
    import ActionBtn from '@/admin/components/ActionBtn/ActionBtn.vue';
    import ActionBtnAdd from '@/admin/components/ActionBtn/ActionBtnAdd.vue';
    import ActionBtnRemove from '@/admin/components/ActionBtn/ActionBtnRemove.vue';

    export default {
        name: 'RoutingFilterFields',
        components: {
            ComingSoon,
            ActionBtn,
            ActionBtnAdd,
            ActionBtnRemove
        },
        props: {
            routings: {
                type: Array,
                required: true,
                default() {
                    return []
                }
            },
            fields: {
                type: Object,
                required: true,
                default() {
                    return {}
                }
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            labels: {
                default: () => ({
                    input_label: 'Send To',
                    input_placeholder: 'Email Address'
                })
            },
            input_type: {
                type: String,
                default: 'text'
            },
            input_options: {
                type: Object|Array,
                required: false,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                defaultRules: {
                    input_value: '',
                    field: '',
                    operator: '=',
                    value: null
                },
                inputOptions: [],
                comingSoon: false,
            }
        },
        methods: {
            add(index) {
                this.routings.splice(index + 1, 0, {...this.defaultRules});
            },
            remove(index) {
                this.routings.splice(index, 1);
            }
        },
        mounted() {
            if (!this.routings || !this.routings.length) {
                this.routings.push({...this.defaultRules});
            }

            this.$nextTick(() => {
                this.inputOptions = this.input_options;
            })

            Object.keys(this.fields).forEach((key) => {
                const field = this.fields[key];
                if (field.element == "quiz_score") {
                    field.options = [];
                }
            });
        }
    };
</script>
