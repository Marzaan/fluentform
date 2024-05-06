<template>
    <div v-loading="loading" class="ff_feed_editor ff_full_width_feed">
        <el-tabs type="border-card">
            <el-tab-pane :label="$t('PDF Content')">
                <el-form v-if="feed.settings" label-position="top">
                    <field-mapper
                        :field="{ component: 'value_text', label: $t('Feed Title'), placeholder: $t('Feed Title') }"
                        :editorShortcodes="editorShortcodes"
                        :errors="errors"
                        v-model="feed.name"
                    >
                    </field-mapper>

                    <!-- form iteration loop -->
                    <field-mapper
                        v-for="field in settings_fields"
                        :key="field.key"
                        :field="field"
                        :errors="errors"
                        :editorShortcodes="editorShortcodes"
                        v-model="feed.settings[field.key]"
                     />
                </el-form>
                <el-button class="mt-4" v-loading="saving" @click="saveFeed()" type="primary" icon="el-icon-success">{{ $t('Save Feed') }}</el-button>
            </el-tab-pane>

            <el-tab-pane :label="$t('Appearance')">
                <el-form v-if="feed.appearance" label-position="top">
                    <field-mapper
                        v-for="field in appearance_fields"
                        :key="field.key"
                        :field="field"
                        :errors="errors"
                        :editorShortcodes="editorShortcodes"
                        v-model="feed.appearance[field.key]"
                    />
                </el-form>
                <el-button class="mt-4" v-loading="saving" @click="saveFeed()" type="primary" icon="el-icon-success">{{ $t('Save Feed') }}</el-button>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script type="text/babel">
    import FieldMapper from "./GeneralIntegration/FieldMapper";

    export default {
        name: 'EditAddPdf',
        props: ['edit_id', 'form_id', 'editorShortcodes'],
        components: {
            FieldMapper
        },
        data() {
            return {
                loading: true,
                saving: false,
                feed: {},
                settings_fields: [],
                appearance_fields: [],
                errors: new Errors()
            }
        },
        methods: {
            getFeed() {
                this.loading = true;
                FluentFormsGlobal.$get({
                    form_id: this.form_id,
                    feed_id: this.edit_id,
                    action: 'fluentform_pdf_admin_ajax_actions',
                    route: 'get_feed'
                })
                    .then(response => {
                        this.feed = response.data.feed;
                        this.settings_fields = response.data.settings_fields;
                        this.appearance_fields = response.data.appearance_fields;
                    })
                    .fail((error) => {
                        console.log(error);
                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            saveFeed() {
                this.saving = true;
                FluentFormsGlobal.$post({
                    form_id: this.form_id,
                    feed_id: this.edit_id,
                    action: 'fluentform_pdf_admin_ajax_actions',
                    route: 'save_feed',
                    feed: this.feed
                })
                    .then(response => {
                        this.$success(response.data.message);
                    })
                    .fail((error) => {
                        this.$fail(error.responseJSON.data.message);
                    })
                    .always(() => {
                        this.saving = false;
                    });
            }
        },
        mounted() {
            this.getFeed();
        }
    }
</script>
