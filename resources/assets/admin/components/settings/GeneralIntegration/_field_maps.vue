<template>
    <div class="ff_merge_fields">
        <table v-if="appReady" class="ff_inner_table w-100">
            <thead>
                <tr>
                    <th class="text-left" width="50%" style="padding-bottom: 14px;">{{field.field_label_remote}}</th>
                    <th class="text-left" width="50%" style="padding-bottom: 14px;">{{field.field_label_local}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(primary_field, primary_index) in field.primary_fileds" :key="primary_index">
                    <td>
                        <div :class="(primary_field.required) ? 'is-required' : ''" class="el-form-item">
                            <label class="el-form-item__label">{{primary_field.label}}</label>
                        </div>
                    </td>
                    <td>
                        <div class="el-form-item">
                            <el-select
                                v-if="primary_field.input_options == 'emails'"
                                v-model="settings[primary_field.key]"
                                :placeholder="$t('Select a Field')"
                                style="width:100%"
                                clearable
                            >
                                <template v-for="(option, index) in inputs">
                                    <el-option
                                        v-if="option.attributes.type === 'email' || option.attributes.type === 'hidden'"
                                        :key="index"
                                        :value="option.attributes.name"
                                        :label="option.admin_label"
                                    ></el-option>
                                </template>
                            </el-select>

                            <el-select
                                v-else-if="primary_field.input_options == 'all'"
                                v-model="settings[primary_field.key]"
                                :placeholder="$t('Select a Field')"
                                style="width:100%"
                                clearable
                            >
                                <el-option
                                    v-for="(option, index) in inputs"
                                    :key="index"
                                    :value="option.attributes.name"
                                    :label="option.admin_label"
                                ></el-option>
                            </el-select>


                            <template v-else>
                                <field-general
                                    :editorShortcodes="editorShortcodes"
                                    v-model="settings[primary_field.key]"
                                ></field-general>
                            </template>

                            <div style="color: #999;font-size: 12px;line-height: 15px;font-style: italic;"
                                class="primary_field_help_text"
                                v-if="primary_field.help_text"
                            >{{ primary_field.help_text }}</div>

                            <error-view field="fieldEmailAddress" :errors="errors"></error-view>
                        </div>
                    </td>
                </tr>
                <template v-for="default_field in field.default_fields">
                    <tr v-if="field.default_fields" :key="default_field.name">
                        <td>
                            <div :class="(default_field.required) ? 'is-required' : ''" class="el-form-item">
                                <label class="el-form-item__label">{{default_field.label}}</label>
                            </div>
                        </td>
                        <td>
                            <div class="el-form-item">
                                <field-general
                                    :editorShortcodes="editorShortcodes"
                                    v-model="settings.default_fields[default_field.name]"
                                ></field-general>
                                <error-view field="default_fields" :errors="errors"></error-view>
                            </div>
                        </td>
                    </tr>
                </template>
                <tr v-for="(field_name, field_index) in merge_fields" :key="field_index">
                    <td>
                        <div class="el-form-item">
                            <label class="el-form-item__label">{{ field_name }}</label>
                        </div>
                    </td>
                    <td>
                        <div class="el-form-item">
                            <field-general
                                :editorShortcodes="editorShortcodes"
                                v-model="merge_model[field_index]"
                            ></field-general>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script type="text/babel">
    import ErrorView from '../../../../common/errorView';
    import FieldGeneral from './_FieldGeneral'

    export default {
        name: 'field_maps',
        components: {
            ErrorView,
            FieldGeneral
        },
        props: ['settings', 'merge_fields', 'field', 'inputs', 'errors', 'merge_model', 'editorShortcodes'],
        data() {
            return {
                appReady: false
            }
        },
        mounted() {
            if (Array.isArray(this.merge_model) || !this.merge_model) {
                this.$emit('merge-model');
            }
            this.appReady = true;
        }

    };
</script>
