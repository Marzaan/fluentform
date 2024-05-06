<template>
    <card>
        <card-head>
            <h5 class="title">{{ $t('Slack Integration') }}</h5>
        </card-head>
        <card-body>
            <el-skeleton :loading="loading" animated :rows="6">
                <el-form label-position="top">
                    <el-form-item class="ff-form-item ff-form-item-flex">
                        <span slot="label" style="width: 120px;">
                            {{ $t('Integrate Slack') }}
                        </span>
                        <el-switch class="el-switch-lg" v-model="slack.enabled"></el-switch>
                    </el-form-item>

                    <template v-if="slack.enabled">
                        <el-form-item class="ff-form-item" :label="$t('Slack Title')">
                            <el-input :placeholder="$t('optional')" v-model="slack.textTitle"></el-input>
                        </el-form-item>

                        <el-form-item class="conditional-items ff-form-item">
                            <template slot="label">
                                {{ $t('Webhook URL') }}

                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{$t('The')}}
                                            <a href="https://api.slack.com/incoming-webhooks" target="_blank">
                                                {{ $t('slack webhook URL') }}
                                            </a> 
                                            {{ $t(' where Fluent Forms will send JSON payload.') }}
                                        </p>
                                    </div>

                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-input placeholder="https://hooks.slack.com/services/..." v-model="slack.webhook">
                            </el-input>
                        </el-form-item>

                        <el-form-item v-if="formattedFields"  class="conditional-items ff-form-item">
                            <template slot="label">
                                {{$t('Select Fields')}}
                            </template>
                            <el-checkbox class="mb-2" :disabled="!hasPro" :indeterminate="isIndeterminate" v-model="slack.checkAll"  @change="handleCheckAllChange">{{ $t('Check all') }}</el-checkbox>

                            <el-checkbox-group v-model="slack.fields">
                                <el-checkbox
                                    v-for="(value, i) in formattedFields"
                                    :label="value"
                                    :key="value + i"
                                    @change="handleCheckedChange"
                                    :disabled="!hasPro"
                                ></el-checkbox>
                            </el-checkbox-group>
                            <div v-show="!hasPro" class="mt-3 text-danger">
                                {{ $t('Select Fields is a pro feature. Please') }}
                                <a href="https://fluentforms.com/pricing/?utm_source=plugin&utm_medium=wp_install&utm_campaign=ff_upgrade&theme_style=twentytwentythree" target="_blank">{{$t('Upgrade to Pro')}}.</a>
                            </div>
                        </el-form-item>

                        <el-form-item class="ff-form-item" :label="$t('Slack Footer message')">
                            <el-input :placeholder="$t(`Default is 'fluentform'`)" v-model="slack.footerText"></el-input>
                        </el-form-item>
                    </template>

                    <div>
                        <el-button type="primary" icon="el-icon-success" @click="save">
                            {{loading ? $t('Saving ') : $t('Save ')}} {{ $t('Settings') }}
                        </el-button>
                    </div>
                </el-form>
            </el-skeleton>
        </card-body>
    </card>
</template>

<script>
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import Card from '@/admin/components/Card/Card.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';

    export default {
        name: "Slack",
        props: ['form_id','inputs'],
        components: { 
            Card,
            CardHead,
            CardBody,
            CardHeadGroup,
            BtnGroup,
            BtnGroupItem
        },
        data() {
            return {
                loading: false,
                saving: false,
                slack: {
                    enabled: false,
                    webhook: null,
                    textTitle:'',
                    footerText:'',
                    fields:[],
                    checkAll:'',
                },
                formattedFields:[],
                hasPro : window.FluentFormApp.hasPro,
                isIndeterminate: false,
                errors: new Errors
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.slack.fields = val ? this.formattedFields : [];
                this.isIndeterminate = false;
            },
            handleCheckedChange(value) {
                let checkedCount = this.slack.fields.length;
                this.slack.checkAll = checkedCount === this.formattedFields.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.formattedFields.length;
            },
            fetch() {
                this.loading = true;

                const url = FluentFormsGlobal.$rest.route('getFormSettings', this.form_id);
            
                FluentFormsGlobal.$rest.get(url, {meta_key: 'slack'})
                    .then(response => {
                        if (response[0]) {
                            this.slack = response[0].value;
                            this.slack.id = response[0].id;
                            if(!this.slack.fields){
                                this.$set(this.slack , 'fields', []);
                            }
                            if(!this.slack.checkAll){
                                this.$set(this.slack , 'checkAll', '');
                            }
                        }
                        this.formattedFields = response.formattedFields ? response.formattedFields : [];
    
                    })
                    .catch(e => {
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            save() {
                this.saving = true;

                let data = {
                    meta_key: 'slack',
                    value: JSON.stringify(this.slack),
                    meta_id: this.slack.id,
                };

                const url = FluentFormsGlobal.$rest.route('storeFormSettings', this.form_id);
            
                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.slack.id = response.id;

                        this.$success(response.message);
                    })
                    .catch(error => {
                        this.errors.record(error);
                    })
                    .finally(() => {
                        this.saving = false;
                    });
            }
        },
        mounted() {
            this.fetch();
        },
        beforeCreate() {
            jQuery('head title').text('Slack Settings - Fluent Forms');
            ffSettingsEvents.$emit('change-title', 'Slack Settings');
        }
    }
</script>
