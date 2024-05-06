<template>
    <div class="post-settings">
        <div class="setting_header el-row">
            <div class="el-col el-col-24 el-col-md-12">
                <h2>{{ $t('Post Settings') }}</h2>
            </div>
            <div class="action-buttons clearfix mb15 el-col el-col-24 el-col-md-12">
                <el-button
                    type="success"
                    size="medium"
                    class="pull-right"
                    :loading="saving"
                    @click="saveSettings"
                >{{ $t('Save Settings') }}</el-button>
            </div>
        </div>

        <el-form  label-width="120px" label-position="left">
            <el-form-item :label="$t('Post Type')">
                <el-input disabled :value="formSettings.post_settings.post_type" />
            </el-form-item>

            <el-form-item :label="$t('Post Status')">
                <el-select v-model="formSettings.post_settings.post_status" style="width:100%;">
                    <el-option
                        v-for="status in postStatuses"
                        :key="status"
                        :value="status"
                        :label="$t(status) | ucFirst"
                    />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('Comment Status')">
                <el-select v-model="formSettings.post_settings.comment_status" style="width:100%;">
                    <el-option value="open" :label="$t('Open')" />
                    <el-option value="closed" :label="$t('Closed')" />
                </el-select>
            </el-form-item>

            <el-form-item :label="$t('Default Category')" v-if="formSettings.post_settings.default_category">
                <el-select
                    v-model="formSettings.post_settings.default_selected_category"
                    style="width:100%;"
                    clearable
                >
                    <el-option
                        :value="formSettings.post_settings.default_category.category_id"
                        :label="formSettings.post_settings.default_category.category_name"
                    />
                </el-select>
            </el-form-item>
            
            <h2>{{ $t('Post Fields Mapping') }}</h2>
            <hr style="border:0;border-bottom:1px solid #EBEEF5;margin-bottom:20px;">
            <template v-for="item in formSettings.post_settings.field_mappings">
                <el-form-item :label="item.admin_label">
                    <el-select v-model="item.post_field" style="width:100%;">
                        <el-option
                            :key="postField"
                            :label="postField"
                            :value="postField"
                            v-for="postField in formSettings.post_settings.post_fields"
                        />
                    </el-select>
                </el-form-item>
            </template>

        </el-form>

        <div class="action-buttons clearfix mt15 el-col el-col-24">
            <el-button
                type="success"
                size="medium"
                class="pull-right"
                :loading="saving"
                @click="saveSettings"
            >{{ $t('Save Settings') }}</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PostSettings',
        data() {
            return {
                formSettings: {
                    post_settings: {
                        post_type: '',
                        post_status: '',
                        field_mappings: []
                    }
                },
                postStatuses: [
                    'draft',
                    'pending',
                    'private',
                    'public'
                ],
                saving: false
            };
        },
        methods: {
            fetchSettings() {
                const url = FluentFormsGlobal.$rest.route('getFormSettings', window.FluentFormApp.form_id);
            
                FluentFormsGlobal.$rest.get(url, {meta_key: 'formSettings'})

                .then(response => {
                    if (response[0] && response[0].value) {
                        response[0].value.id = response[0].id;
                        this.formSettings = response[0].value;
                        this.mapFormFieldsWithPostFields();
                    }
                })
                .catch(e => {
                    console.log(e);
                })
                .finally(() => {
                    // ...
                });
            },
            saveSettings() {
                this.saving = true;

                const url = FluentFormsGlobal.$rest.route('storeFormSettings', window.FluentFormApp.form_id);
            
                FluentFormsGlobal.$rest.post(url, {
                    meta_key: 'formSettings',
                    meta_id: this.formSettings.id,
                    value: JSON.stringify(this.formSettings)
                })
                .then(response => {
                    this.$success(response.message);
                })
                .catch(e => {
                    console.log(e);
                })
                .finally(() => {
                    this.saving = false;
                });
            },
            mapFormFieldsWithPostFields() {

                let existingFieldMappings = {
                    ...this.formSettings.post_settings.field_mappings
                };

                this.formSettings.post_settings.field_mappings = [];

                jQuery.each(this.$attrs.inputs, (i, el) => {
                    let post_field = undefined;

                    jQuery.each(existingFieldMappings, (i, field) => {
                        if (field.form_field === el.attributes.name) {
                            post_field = field.post_field;
                        }
                    });

                    this.formSettings.post_settings.field_mappings.push({
                        admin_label: el.admin_label,
                        form_field: el.attributes.name,
                        post_field: post_field
                    });
                });
            }
        },
        created() {
            this.fetchSettings();
            jQuery('head title').text('Post Feed Settings - Fluent Forms');
        }
    };    
</script>
