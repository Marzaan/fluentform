<template>
    <div class="ff_pdf_wrap">
        <el-skeleton :loading="loading" animated :rows="10" :class="loading ? 'ff_card' : ''">
            <card>
                <card-head>
                    <h5 class="title">{{ $t('Global PDF Settings') }}</h5>
                    <p class="text">{{$t('This global settings will be set as default for your new PDF feed for any form. Then you can customize for a specific PDF generator feed')}}</p>
                </card-head>
                <card-body v-loading="loading">
                    <el-form class="ff_pdf_form_wrap" label-position="top">
                        <field-mapper
                            v-for="field in fields"
                            :key="field.key"
                            :field="field"
                            :errors="errors"
                            v-model="settings[field.key]"
                        />
                    </el-form>
                </card-body>
            </card>
            <div>
                <el-button
                    type="primary"
                    icon="el-icon-success"
                    @click="save"
                >
                    {{ $t('Save Settings') }}
                </el-button>
            </div>
        </el-skeleton>
    </div>
</template>

<script type="text/babel">
    import FieldMapper from "@/admin/components/settings/GeneralIntegration/FieldMapper";
    import Errors from '@/common/Errors';
    import Card from '@/admin/components/Card/Card.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';

    export default {
        name: "fluentorm_pdf",
        props: ["app"],
        components: {
            FieldMapper,
            Card, 
            CardHead, 
            CardBody 
        },
        data() {
            return {
                loading: false,
                settings: {},
                fields: {},
                errors: new Errors()
            };
        },
        methods: {
            save() {
                this.saving = true;
                FluentFormsGlobal.$post({
                    action: 'fluentform_pdf_admin_ajax_actions',
                    route: 'save_global_settings',
                    settings: this.settings
                })
                    .then(response => {
                        this.$success(response.data.message);
                    })
                    .fail(e => {
                        this.$fail(this.$t('Global settings save error, please reload.'));
                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            getGlobalPdfSettings() {
                this.loading = true;
                FluentFormsGlobal.$get({
                    action: 'fluentform_pdf_admin_ajax_actions',
                    route: 'get_global_settings'
                })
                    .then(response => {
                        this.settings = response.data.settings;
                        this.fields = response.data.fields;
                    })
                    .fail(e => {
                        this.$fail(this.$t('Global settings fetch error, please reload.'));
                    })
                    .always(() => {
                        this.loading = false;
                    });
            }
        },
        mounted() {
            this.getGlobalPdfSettings();
        }
    };
</script>
