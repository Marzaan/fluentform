<template>
    <div class="ff_double_optin_wrap">
        <el-skeleton :loading="loading" animated :rows="10" :class="loading ? 'ff_card' : ''">
            <card v-if="!hasPro">
                <card-head>
                    <h5 class="title">{{$t('Global Double Optin Settings')}}</h5>
                </card-head>
                <card-body>
                    <notice class="ff_alert_between" type="danger-soft">
                        <div>
                            <h6 class="title">{{$t('This is a Pro Feature')}}</h6>
                            <p class="text">{{$t('Please upgrade to pro to unlock this feature.')}}</p>
                        </div>
                        <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                            {{$t('Upgrade to Pro')}}
                        </a>
                    </notice>
                </card-body>
            </card>

            <el-form label-position="top" v-if="settings" :data="settings">
                <card>
                    <card-head>
                        <h5 class="title">{{$t('Global Double Optin Settings')}}</h5>
                    </card-head>
                    <card-body>
                        <el-form-item class="ff-form-item">
                            <el-checkbox :true-label="$t('yes')" :false-label="$t('no')" v-model="settings.enabled">
                                {{ $t('Enable Double Optin Module') }}
                            </el-checkbox>
                        </el-form-item>
                        <template v-if="settings.enabled == 'yes'">
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Global Email Subject') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Email Subject for double optin email.') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"/>
                                    </el-tooltip>
                                </template>
                                <el-input popper-class="ff_tooltip_wrap" :placeholder="$t('Email Subject')"
                                        v-model="settings.email_subject"/>
                            </el-form-item>

                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Global Optin Email Body') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Enter the content you would like the user to ') }}<br>
                                                {{ $t('send via email for confirmation.') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"/>
                                    </el-tooltip>
                                </template>
                                <el-input v-if="settings.asPlainText == 'yes'" v-model="settings.email_body" type="textarea" :rows="12"></el-input>
                                <wp-editor v-else :height="250"
                                        v-model="settings.email_body"/>

                                <el-checkbox class="mt-3 mb-2" :true-label="$t('yes')" :false-label="$t('no')" v-model="settings.asPlainText">
                                    {{ $t('Send Email as RAW HTML Format') }}
                                </el-checkbox>

                                <p class="text-note">{{ $t('Use #confirmation_url# smartcode for double optin confirmation URL') }}</p>

                            </el-form-item>

                            <!--from name-->
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('From Name') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Enter the name you would like the notification email sent from') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input popper-class="ff_tooltip_wrap" placeholder="From Name"
                                        v-model="settings.fromName"/>
                                <p v-if="settings.fromName">
                                    {{ $t('It will only be visible in the email if "From Email" value is available') }}
                                </p>
                            </el-form-item>

                            <!--from email-->
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('From Email') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Enter the email address you would like the notification email sent from.') }}
                                            </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input popper-class="ff_tooltip_wrap" :placeholder="$t('From Email')"
                                        v-model="settings.fromEmail"/>
                                <p v-if="settings.fromEmail">{{
                                        $t('It\'s not recommended to change from email. Please use your domain\'s email / SMTP main email. Otherwise email may failed to send.')
                                    }}</p>
                            </el-form-item>

                            <!--reply to-->
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Reply To') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Enter the email address you would like to be used as the reply to address for the notification email.')}}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input popper-class="ff_tooltip_wrap" :placeholder="$t('Reply To Email')"
                                        v-model="settings.replyTo"/>
                            </el-form-item>

                            <el-form-item class="ff-form-item">
                                <el-checkbox :true-label="$t('yes')" :false-label="$t('no')" v-model="settings.auto_delete_status">
                                    {{ $t('Automatically delete unconfirmed entries if not confirmed in certain days') }}
                                </el-checkbox>
                            </el-form-item>

                            <el-form-item v-if="settings.auto_delete_status == 'yes'">
                                <template slot="label">
                                    {{ $t('Waiting Days') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('How many days, it will wait before deleting the unconfirmed entries') }}
                                            </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"/>
                                    </el-tooltip>
                                </template>
                                <el-input-number v-model="settings.auto_delete_day_span" :min="1"></el-input-number>
                            </el-form-item>
                        </template>
                    </card-body>
                </card>

                <div class="mt-4" v-if="hasPro">
                    <el-button v-loading="saving" type="primary" icon="el-icon-success" @click="save">
                        {{ $t('Save Settings') }}
                    </el-button>
                </div>
            </el-form>

            <div v-else-if="need_update">
                <h2>{{ $t('Please update Fluent Forms Pro Addon to latest version') }}</h2>
            </div>
        </el-skeleton>
    </div>
</template>

<script type="text/babel">
    import wpEditor from '@/common/_wp_editor';
    import Card from '@/admin/components/Card/Card.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import Notice from '@/admin/components/Notice/Notice.vue';

    export default {
        name: 'DoubleOptinSettings',
        components: {
            wpEditor,
            Card,
            CardHead,
            CardBody,
            Notice
        },
        data() {
            return {
                settings: false,
                hasPro: !!window.FluentFormApp.has_pro,
                loading: true,
                saving: false,
                need_update: false
            }
        },
        methods: {
            save() {
                this.saving = true;
                FluentFormsGlobal.$post({
                    action: 'fluentform_save_global_double_optin',
                    settings: this.settings
                })
                    .then((response) => {
                        this.$success(response.data.message);
                    })
                    .fail((errors) => {
                        console.log(errors);
                    })
                    .always(() => {
                        this.saving = false;
                    });
            },
            fetch() {
                this.loading = true;
                FluentFormsGlobal.$get({
                    action: 'fluentform_get_global_double_optin'
                })
                    .then(response => {
                        this.settings = response.data.settings;
                    })
                    .fail((errors) => {
                        if (errors.status == 400) {
                            this.need_update = true;
                        }
                    })
                    .always(() => {
                        this.loading = false;
                    });
            }
        },
        mounted() {
            if (this.hasPro) {
                this.fetch();
            } else {
                this.loading = false;
            }
        }
    }
</script>
