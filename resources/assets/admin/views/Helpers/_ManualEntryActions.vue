<template>
    <div class="ff_email_resend_inline">
        <el-button v-if="element_type == 'button'" @click="openModal()" type="info" size="medium">
            {{ $t(btn_text) }}
        </el-button>
        <el-dialog
            top="60px"
            @before-close="resetData()"
            :append-to-body="true"
            :visible.sync="dialogVisible"
            :width="has_pro ? '70%' : '45%'"
        >
            <template slot="title">
                <h4>{{$t('Choose an Action/Integration Feed and Replay')}}</h4>
            </template>

            <div v-if="has_pro" class="mt-4">
                <div v-loading="loading" :element-loading-text="$t('Loading Feeds...')" class="ff_notification_feeds">
                    <el-checkbox class="mb-3" true-label="yes" false-label="no" v-model="verify_condition">
                        {{ $t('Check Conditional Logic when replaying a feed action') }}
                    </el-checkbox>

                    <el-table border stripe v-loading="sending" :data="feeds">
                        <el-table-column
                            width="180"
                            :label="$t('Integration Icon')">
                            <template slot-scope="scope">
                                <img v-if="scope.row.provider_logo" class="general_integration_logo"
                                     :src="scope.row.provider_logo" :alt="scope.row.provider"/>
                                <span class="general_integration_name" v-else>{{scope.row.provider}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('Integration Feed Name')">
                            <template slot-scope="scope">
                                {{scope.row.name}}
                                <span v-if="scope.row.has_condition"> {{ $t('(Conditional)') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('Status')"
                            width="120">
                            <template slot-scope="scope">
                                <span v-if="scope.row.enabled">{{ $t('Active') }}</span>
                                <span v-else>{{ $t('Draft') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            :label="$t('Actions')">
                            <template slot-scope="scope">
                                <el-button @click="replayFeed(scope.row.id, scope.row.action_id)" type="info" size="mini">
                                    {{ $t('Replay') }}
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="mt-4">
                    <div role="alert" class="el-alert el-alert--error is-dark"  v-if="error_message">
                        <div class="el-alert__content">
                            <span class="el-alert__title" v-html="error_message"></span>
                        </div>
                    </div>
                    <div role="alert" class="el-alert el-alert--success is-dark"  v-if="success_message">
                        <div class="el-alert__content">
                            <span class="el-alert__title" v-html="success_message"></span>
                        </div>
                    </div>
                </div>
            </div>

            <notice class="ff_alert_between mt-4" type="danger-soft" v-else>
                <div>
                    <h6 class="title">{{$t('This is a Pro Feature')}}</h6> 
                    <p class="text">{{$t('Please upgrade to pro to unlock this feature.')}}</p>
                </div>
                <a target="_blank" :href="upgrade_url" class="el-button el-button--danger el-button--small">
                    {{$t('Upgrade to Pro')}}
                </a>
            </notice>
        </el-dialog>
    </div>
</template>
<script type="text/babel">
    import Notice from '@/admin/components/Notice/Notice.vue';
    
    export default {
        name: 'ManualEntryActions',
        props: {
            entry_id: {
                default() {
                    return '';
                }
            },
            form_id: {
                required: true
            },
            entry_ids: {
                default() {
                    return []
                }
            },
            element_type: {
                default() {
                    return 'button'
                }
            },
            btn_text: {
                default() {
                    return 'Entry Actions'
                }
            }
        },
        components: {
            Notice
        },
        data() {
            return {
                has_pro: !!window.fluent_form_entries_vars.has_pro,
                dialogVisible: false,
                sending: false,
                error_message: '',
                success_message: '',
                feeds: [],
                loading: false,
                verify_condition: 'yes',
                upgrade_url: window.fluent_form_entries_vars.upgrade_url
            }
        },
        methods: {
            replayFeed(feedId, actionId) {
                if (this.sending) {
                    return;
                }
                this.sending = true;
                this.error_message = '';
                this.success_message = '';
                let data = {
                    action: 'ffpro_post_integration_feed_replay',
                    verify_condition: this.verify_condition,
                    logIds: [{
                        feed_id: feedId,
                        form_id: this.form_id,
                        entry_id: this.entry_id,
                        action_id: actionId
                    }]
                };
                FluentFormsGlobal.$post(data)
                    .then(response => {
                        this.$success(response.data.message);
                    })
                    .fail(error => {
                        if (!error.responseJSON && !error.responseText || error.responseText == '0') {
                            alert(this.$t('Looks like you are using older version of fluent forms pro. Please update to latest version'));
                            return;
                        }
                        this.$fail(error.responseJSON.data.message);
                    })
                    .always(() => {
                        this.sending = false;
                    });
            },
            resetData() {
                this.error_message = '';
                this.success_message = '';
                this.form = {
                    selected_notification_id: '',
                    send_to_type: 'default',
                    send_to_custom_email: ''
                }
            },
            getFeeds() {
                if (window.ff_form_entry_actions) {
                    this.feeds = window.ff_form_entry_actions;
                    return;
                }

                this.loading = true;
                FluentFormsGlobal.$get({
                    action: 'ffpro_get_integration_feeds',
                    form_id: this.form_id,
                    entry_id: this.entry_id
                })
                    .then(response => {
                        window.ff_form_entry_actions = response.data.feeds;
                        this.feeds = response.data.feeds;
                        this.action_id = response.data.action_id;
                    })
                    .fail((error) => {
                        if (!error.responseJSON && !error.responseText || error.responseText == '0') {
                            alert(this.$t('Looks like you are using older version of fluent forms pro. Please update to latest version'));
                            return;
                        }
                    })
                    .always(() => {
                        this.loading = false;
                    });

            },
            openModal() {
                this.dialogVisible = true;
                if (this.has_pro) {
                    this.getFeeds();
                }
            }
        }
    }
</script>
