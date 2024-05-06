<template>
    <div class="ff_settings_notifications">
        <!-- Notification Editor -->
        <el-form label-position="top">
            <card>
                <card-head>
                    <card-head-group class="justify-between">
                        <h5 class="title">{{ $t('Email Notifications') }}</h5>
                        <btn-group>
                            <btn-group-item>
                                <video-doc btn_size="medium" :btn_text="$t('Learn More')"
                                           route_id="formEmailSettings"></video-doc>
                            </btn-group-item>
                            <btn-group-item>
                                <el-button
                                    v-if="selected"
                                    @click="discard"
                                    type="info"
                                    icon="ff-icon ff-icon-arrow-left"
                                    size="medium"
                                    class="el-button--soft"
                                >
                                    {{ $t('Back') }}
                                </el-button>
                                <el-button
                                    v-else
                                    @click="add"
                                    type="info"
                                    size="medium"
                                    icon="ff-icon ff-icon-plus"
                                >
                                    {{ $t('Add Notification') }}
                                </el-button>
                            </btn-group-item>
                        </btn-group>
                    </card-head-group>
                </card-head>
                <card-body>
                    <template v-if="!selected">
                        <!-- Notification Table: 1 -->
                        <div class="ff-table-container">
                            <el-skeleton :loading="loading" animated :rows="6">
                                <el-table :data="notifications">
                                    <el-table-column width="180" :label="$t('Status')">
                                        <template slot-scope="scope">
                                            <span class="mr-3" v-if="scope.row.value.enabled">{{ $t('Enabled') }}</span>
                                            <span class="mr-3 text-danger" v-else>{{ $t('Disabled') }}</span>
                                            <el-switch
                                                :width="40"
                                                @change="handleActive(scope.$index)"
                                                v-model="scope.row.value.enabled"
                                            ></el-switch>
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="value.name" :label="$t('Name')"></el-table-column>

                                    <el-table-column prop="value.subject" :label="$t('Subject')"></el-table-column>

                                    <el-table-column width="130" :label="$t('Actions')" class-name="action-buttons">
                                        <template slot-scope="scope">
                                            <btn-group size="sm">
                                                <btn-group-item>
                                                    <el-tooltip :content="$t('Duplicate notification settings')"
                                                                placement="top">
                                                        <el-button
                                                            class="el-button--icon"
                                                            @click="clone(scope.$index)"
                                                            type="primary"
                                                            icon="ff-icon-plus"
                                                            size="mini"
                                                        ></el-button>
                                                    </el-tooltip>
                                                </btn-group-item>
                                                <btn-group-item>
                                                    <el-button
                                                        class="el-button--icon"
                                                        @click="edit(scope.$index)"
                                                        type="success"
                                                        icon="ff-icon-setting"
                                                        size="mini"
                                                    ></el-button>
                                                </btn-group-item>
                                                <btn-group-item>
                                                    <remove @on-confirm="remove(scope.$index, scope.row.id)">
                                                        <el-button
                                                            class="el-button--icon"
                                                            size="mini"
                                                            type="danger"
                                                            icon="ff-icon-trash"
                                                        />
                                                    </remove>
                                                </btn-group-item>
                                            </btn-group>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-skeleton>
                        </div><!-- .ff_table_wrap -->

                        <div style="margin-top: 50px;" v-if="!has_fluentsmtp && !smtp_closed" class="ff_smtp_suggest">
                            <span @click="closeSmtp()" class="ff_smtp_close">
                                <i class="el-icon el-icon-close"></i>
                            </span>
                            <p>{{
                                    $t('For better email deliver ability, we recommend to use FluentSMTP Plugin(completely free & Opensource). FluentSMTP connects with your Email Service Provider natively and makes sure your emails including form notifications are being delivered ')
                                }} 💯. {{ $t('Built by Fluent Forms devs for you.') }}</p>
                            <a class="el-button el-button--info el-button--medium"
                               :href="smtp_page_url">{{ $t('Setup SMTP') }}</a>
                        </div>
                    </template>

                    <template v-if="selected">
                        <!--Notification name-->
                        <el-form-item class="ff-form-item" :label="$t('Name')">
                            <el-input v-model="selected.value.name"></el-input>
                        </el-form-item>

                        <!--send to-->
                        <el-form-item class="ff-form-item is-required"
                                      :class="errors.has('sendTo.type') ? 'is-error' : ''">
                            <template slot="label">
                                {{ $t('Send To') }}

                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{
                                                $t('Enter the email address you would like the notification email sent to.')
                                            }}
                                        </p>
                                    </div>

                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-radio-group v-model="selected.value.sendTo.type">
                                <el-radio label="email">{{ $t('Enter Email') }}</el-radio>
                                <el-radio label="field">{{ $t('Select a Field') }}</el-radio>
                                <el-radio v-if="!!has_pro" label="routing">
                                    {{ $t('Configure Routing') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{
                                                    $t('Allows notification to be sent to different email addresses depending on values selected in the form.')
                                                }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </el-radio>
                            </el-radio-group>

                            <error-view field="sendTo.type" :errors="errors"></error-view>
                        </el-form-item>

                        <!--additional field based on the send to selection-->
                        <template v-if="selected.value.sendTo.type === 'email'">
                            <el-form-item
                                :label="$t('Send to Email')"
                                class="conditional-items ff-form-item"
                                :class="errors.has('sendTo.email') ? 'is-error' : ''"
                            >
                                <el-input v-model="selected.value.sendTo.email"></el-input>

                                <error-view field="sendTo.email" :errors="errors"></error-view>
                            </el-form-item>
                        </template>

                        <template v-else-if="selected.value.sendTo.type ==='field'">
                            <el-form-item
                                :label="('Send to Field')"
                                class="conditional-items ff-form-item"
                                :class="errors.has('sendTo.field') ? 'is-error' : ''"
                            >
                                <el-select class="w-100" v-model="selected.value.sendTo.field"
                                           :placeholder="$t('Select an email field')">
                                    <el-option
                                        v-for="(item, index) in emailFields"
                                        :key="index"
                                        :label="item.admin_label"
                                        :value="item.attributes.name">
                                    </el-option>
                                </el-select>

                                <error-view field="sendTo.field" :errors="errors"></error-view>
                            </el-form-item>
                        </template>

                        <div class="conditional-items" v-else-if="selected.value.sendTo.type == 'routing'">
                            <routing-filter-fields :fields="inputs"
                                                   :routings="selected.value.sendTo.routing"></routing-filter-fields>
                            <error-view field="sendTo.routing" :errors="errors"></error-view>
                        </div>

                        <!--Subject-->
                        <el-form-item :label="$t('Subject')" class="is-required ff-form-item"
                                      :class="errors.has('subject') ? 'is-error' : ''">

                            <input-popover fieldType="text" v-model="selected.value.subject"
                                           :data="editorShortcodes"></input-popover>

                            <error-view field="subject" :errors="errors"></error-view>
                        </el-form-item>

                        <!--message-->
                        <el-form-item :label="$t('Email Body')" class="is-required ff-form-item"
                                      :class="errors.has('message') ? 'is-error' : ''">
                            <input-popover
                                :rows="10"
                                v-if="selected.value.asPlainText == 'yes'"
                                fieldType="textarea"
                                v-model="selected.value.message"
                                :placeholder="$t('Email Body HTML')"
                                :data="editorShortcodes"
                            ></input-popover>
                            <wp_editor
                                v-else
                                :editorShortcodes="emailBodyeditorShortcodes"
                                :height="200"
                                v-model="selected.value.message">
                            </wp_editor>
                            <error-view field="message" :errors="errors"></error-view>
                            <el-checkbox class="mt-3" true-label="yes" false-label="no"
                                         v-model="selected.value.asPlainText">
                                {{ $t('Send Email as RAW HTML Format') }}
                            </el-checkbox>
                        </el-form-item>

                        <!-- FilterFields -->
                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Conditional Logics') }}

                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('Allow this feed conditionally') }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>
                            <FilterFields
                                :fields="inputs"
                                :conditionals="selected.value.conditionals"
                                :hasPro="has_pro">
                            </FilterFields>

                            <notice class="ff_alert_between" type="danger-soft" v-if="!has_pro">
                                <div>
                                    <h6 class="title">{{ $t('Conditional Logics is a Pro Feature') }}</h6>
                                    <p class="text">{{ $t('Please upgrade to pro to unlock this feature.') }}</p>
                                </div>
                                <a target="_blank"
                                   href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree"
                                   class="el-button el-button--danger el-button--small">
                                    {{ $t('Upgrade to Pro') }}
                                </a>
                            </notice>
                        </el-form-item>
                        <el-form-item class="ff-form-item" v-if="attachmentFields.length && selected.value.attachments">
                            <template slot="label">
                                {{ $t('Email Attachments') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('Select the field that you want to attach in the email') }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-checkbox-group v-model="selected.value.attachments">
                                <el-checkbox v-for="attachmentField in attachmentFields"
                                             :key="attachmentField.attributes.name"
                                             :label="attachmentField.attributes.name">
                                    {{ attachmentField.admin_label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <!-- Media Attachments -->
                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Media File Attachments') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        {{ $t('Add Additional Media File Attachments for the email') }}
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>
                            <el-button
                                style="width: 350px;"
                                :disabled="!has_pro"
                                plain
                                icon="el-icon el-icon-upload"
                                @click="mediaAttachments()"
                                class="el-button--upload"
                            >
                                <span>{{ $t('Upload Media') }}</span>
                                <span v-if="!has_pro" class="text-danger ml-2">{{ $t('(Require Pro Version)') }}</span>
                            </el-button>

                            <div class="mt-4" v-if="selected.value.media_attachments.length" style="width: 350px;">
                                <div class="ff_file_upload_result"
                                     v-for="(attachment, index) in selected.value.media_attachments" :key="index">
                                    <div class="ff_file_upload_preview">
                                        <img  v-if="attachment.type != 'pdf'" :src="attachment.url" :alt="attachment.name"/>
                                    </div>
                                    <div class="ff_file_upload_data">
                                        <el-button
                                            class="el-button--icon"
                                            type="danger"
                                            icon="el-icon-delete"
                                            size="mini"
                                            @click="removeMediaAttachments(index)"
                                        ></el-button>
                                        <div class="ff_file_upload_description">
                                            {{ attachment.name }}
                                        </div>
                                        <div class="ff_file_upload_size">
                                            {{ attachment.size }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item v-if="pdf_feeds.length">
                            <template slot="label">
                                {{ $t('PDF Attachments') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <h3>{{ $t('PDF Attachments') }}</h3>
                                        <p>
                                            {{ $t('You can select PDF attachments from your created PDF templates') }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-checkbox-group v-model="selected.value.pdf_attachments">
                                <el-checkbox v-for="feed in pdf_feeds" :key="feed.id" :label="feed.id">{{ feed.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <p class="text-warning mb-4" v-show="hasAttachment">
                            {{ $t('You should use SMTP so send attachment via email otherwise, It may go to spam') }}
                        </p>

                        <el-form-item class="ff-form-item" v-if="hasPaymentField">
                            <template slot="label">
                                {{ $t('Send Email') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>{{ $t('Please Select when the email will be sent for Payment Forms') }}</p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-radio-group v-model="selected.value.feed_trigger_event">
                                <el-radio label="payment_success">{{ $t('After Payment Success') }}</el-radio>
                                <el-radio label="payment_form_submit">{{ $t('After Form Submit') }}</el-radio>
                            </el-radio-group>

                            <p class="mt-2 text-note" style="max-width: 700px;">{{
                                    $t('Please Note, for offline payment this settings will not work. Pending offline payment form notifications is sent instantly, we will remove this after our next major release, so this settings will also work for offline payments.')
                                }}</p>

                        </el-form-item>

                        <el-collapse class="el-collapse-settings" v-model="activeNotificationCollapse">
                            <el-collapse-item :title="$t('Advanced')" name="advanced">
                                <!--from name-->
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('From Name') }}

                                        <el-tooltip class="item" placement="bottom-start"
                                                    popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{
                                                        $t('Enter the name you would like the notification email sent from, or select the name from available name fields.')
                                                    }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <input-popover fieldType="text"
                                                   v-model="selected.value.fromName"
                                                   :data="editorShortcodes"
                                    ></input-popover>
                                    <p v-if="selected.value.fromName">
                                        {{
                                            $t('It will only be visible in the email if \"From Email\" value is available')
                                        }}</p>
                                </el-form-item>

                                <!--from email-->
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('From Email') }}

                                        <el-tooltip class="item" placement="bottom-start"
                                                    popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Enter the email address you would like the notification email sent from, or select the email from available email form fields.') }}
                                                </p>
                                            </div>
                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <input-popover
                                        fieldType="text"
                                        v-model="selected.value.fromEmail"
                                        :data="fromEmailShortcodes"
                                    ></input-popover>
                                    <p v-if="selected.value.fromEmail">
                                        {{ $t('It\'s not recommended to change from email. Please use your domain\'s email / SMTP main email. Otherwise email may failed to send.') }}
                                    </p>
                                </el-form-item>

                                <!--reply to-->
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Reply To') }}

                                        <el-tooltip class="item" placement="bottom-start"
                                                    popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Enter the email address you would like to be used as the reply to address for the notification email.') }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <input-popover fieldType="text"
                                                   v-model="selected.value.replyTo"
                                                   :data="emailShortcodes"
                                    ></input-popover>
                                </el-form-item>

                                <!--BCC-->
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('BCC') }}
                                        <el-tooltip class="item" placement="bottom-start"
                                                    popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{
                                                        $t('Enter a comma separated list of email addresses you would like to receive a BCC of the notification email.')
                                                    }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <input-popover fieldType="text"
                                                   v-model="selected.value.bcc"
                                                   :data="emailShortcodes"
                                    ></input-popover>
                                </el-form-item>
                                <!--CC-->
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('CC') }}

                                        <el-tooltip class="item" placement="bottom-start"
                                                    popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Enter a comma separated list of email addresses you would like to receive a CC of the notification email.') }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <input-popover
                                        fieldType="text"
                                        v-model="selected.value.cc"
                                        :data="emailShortcodes"
                                    ></input-popover>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                    </template>
                </card-body>
            </card>

            <div v-if="selected">
                <el-button
                    :loading="loading"
                    @click="store"
                    type="primary"
                    icon="el-icon-success">
                    {{ loading ? $t('Saving ') : $t('Save ') }} {{ $t('Notification') }}
                </el-button>
            </div>
        </el-form>
    </div>
</template>

<script type="text/babel">
import remove from '../confirmRemove.vue';
import inputPopover from '../input-popover.vue';
import wpEditor from '@/common/_wp_editor';
import FilterFields from './Includes/FilterFields.vue';
import RoutingFilterFields from './Includes/RoutingFilterFields';
import ErrorView from '@/common/errorView.vue';
import VideoDoc from '@/common/VideoInstruction.vue';
import Card from '@/admin/components/Card/Card.vue';
import CardHead from '@/admin/components/Card/CardHead.vue';
import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
import Notice from '@/admin/components/Notice/Notice.vue';

export default {
    name: 'EmailNotifications',
    props: ['form_id', 'inputs', 'has_pro', 'has_pdf', 'editorShortcodes'],
    components: {
        remove,
        inputPopover,
        FilterFields,
        ErrorView,
        'wp_editor': wpEditor,
        RoutingFilterFields,
        VideoDoc,
        Card,
        CardHead,
        CardHeadGroup,
        CardBody,
        BtnGroup,
        BtnGroupItem,
        Notice
    },
    data() {
        return {
            loading: true,
            selected: null,
            selectedIndex: null,
            notifications: [],
            pdf_feeds: [],
            extra_attachment: [],
            mock: {
                value: {
                    name: 'New Notification',
                    sendTo: {
                        type: 'email',
                        email: null,
                        field: null,
                        routing: [
                            {
                                input_value: '',
                                field: null,
                                operator: '=',
                                value: null
                            }
                        ],
                    },
                    fromName: '',
                    fromEmail: '',
                    replyTo: '',
                    bcc: '',
                    subject: '',
                    message: '',
                    conditionals: {
                        status: false,
                        type: 'all',
                        conditions: [
                            {
                                field: null,
                                operator: '=',
                                value: null
                            }
                        ]
                    },
                    enabled: true,
                    pdf_attachments: [],
                    attachments: [],
                    media_attachments: [],
                    feed_trigger_event: 'payment_success'

                }
            },
            errors: new Errors,
            // emailShortcodes: [],
            activeNotificationCollapse: '',
            has_fluentsmtp: !!window.FluentFormApp.has_fluent_smtp,
            smtp_page_url: window.FluentFormApp.fluent_smtp_url,
            smtp_closed: false
        }
    },
    computed: {
        emailFields() {
            return _ff.filter(this.inputs, (input) => {
                return input.attributes.type === 'email';
            });
        },

        attachmentFields() {
            return _ff.filter(this.inputs, (input) => {
                return input.attributes && input.attributes.type === 'file';
            });
        },

        emailShortcodes() {
            const inputEmails = {
                title: 'Input Emails',
                shortcodes: {}
            };
            _ff.each(this.inputs, (input, key) => {
                const code = `{inputs.${key}}`;
                if (input.attributes.type === 'email') {
                    inputEmails.shortcodes[code] = input.admin_label;
                }
            });

            return [inputEmails];
        },

        fromEmailShortcodes() {
            const freshCopy = _ff.cloneDeep(this.emailShortcodes);
            freshCopy[0].shortcodes = {
                '{admin_email}': 'Admin Email',
                ...freshCopy[0].shortcodes
            };
            return freshCopy;
        },
        emailBodyeditorShortcodes() {
            const freshCopy = _ff.cloneDeep(this.editorShortcodes);
            freshCopy[0].shortcodes = {
                ...freshCopy[0].shortcodes,
                '{all_data}': 'All Data',
                '{all_data_without_hidden_fields}': 'All Data Without Hidden Fields'
            };
            return freshCopy;
        },
        hasAttachment() {
            let pdfAttachment = this.selected.value.pdf_attachments && this.selected.value.pdf_attachments.length
            let inputAttachment = this.selected.value.attachments && this.selected.value.attachments.length;
            let fileAttachment = this.selected.value.media_attachments && this.selected.value.media_attachments.length;
            return !!inputAttachment || !!fileAttachment || !!pdfAttachment;
        },
        hasPaymentField() {
            let inputs = _ff.filter(this.inputs, (input) => {
                return input.element === 'payment_method';
            });
            return !!inputs.length;
        },
    },
    methods: {
        removeMediaAttachments(index) {
            this.selected.value.media_attachments.splice(index, 1);
        },
        mediaAttachments() {
            if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
                wp.media.editor.send.attachment = (props, attachment) => {
                    if (attachment.url) {
                        this.selected.value.media_attachments.push({
                            name: attachment.filename,
                            url: attachment.url,
                            size: attachment.filesizeHumanReadable,
                            type: attachment.subtype
                        })
                    }
                };
                wp.media.editor.open();
                return false;
            }
        },
        add() {
            this.selectedIndex = this.notifications.length;
            this.selected = _ff.cloneDeep(this.mock);
        },
        clone(index) {
            let freshCopy = _ff.cloneDeep(this.notifications[index]);

            freshCopy.value.name = null;
            freshCopy.id = null;

            if (!freshCopy.value.conditionals
                || !freshCopy.value.conditionals.conditions
                || !freshCopy.value.conditionals.conditions.length
            ) {
                freshCopy.value.conditionals = this.mock.value.conditionals;
            }

            if (!freshCopy.value.pdf_attachments) {
                freshCopy.value.pdf_attachments = [];
            }

            if (!freshCopy.value.attachments) {
                freshCopy.value.attachments = [];
            }
            if (!freshCopy.value.media_attachments) {
                freshCopy.value.media_attachments = [];
            }
            if (!freshCopy.value.feed_trigger_event) {
                freshCopy.value.feed_trigger_event = 'payment_success';
            }

            this.selected = freshCopy;
            this.selectedIndex = this.notifications.length + 1;
        },
        edit(index) {
            let notification = this.notifications[index];
            if (!notification.value || !notification.value.name || !notification.value.sendTo) {
                this.selected = _ff.cloneDeep(this.mock);
                this.selectedIndex = index;
                return;
            }

            this.selected = notification;

            if (!this.selected.value.attachments) {
                this.$set(this.selected.value, 'attachments', []);
            }
            if (!this.selected.value.media_attachments) {
                this.$set(this.selected.value, 'media_attachments', []);
            }
            if (!this.selected.value.pdf_attachments) {
                this.$set(this.selected.value, 'pdf_attachments', []);
            }
            if (!this.selected.value.feed_trigger_event) {
                this.$set(this.selected.value, 'feed_trigger_event', 'payment_success');
            }

            this.selectedIndex = index;
        },
        discard() {
            this.selected = null;
            this.selectedIndex = null;
            this.errors.clear();
        },
        handleActive(index) {
            let notification = this.notifications[index];

            let id = notification.id;

            delete (notification.id);

            const data = {
                form_id: this.form_id,
                meta_key: 'notifications',
                value: JSON.stringify(notification.value),
                meta_id: id,
                action: 'fluentform-save-form-email-notification'
            };

            FluentFormsGlobal.$post(data)
                .then(response => {
                    notification.id = response.id;

                    let handle = notification.value.enabled ? 'enabled' : 'disabled';

                    this.$success(this.$t('Successfully ' + handle + ' the notification.'));
                })
                .catch(e => {
                    notification.id = id;
                });
        },
        remove(index, id) {
            const url = FluentFormsGlobal.$rest.route('deleteFormSettings', this.form_id);

            FluentFormsGlobal.$rest.delete(url, {meta_id: id})
                .then(response => {
                    this.notifications.splice(index, 1);
                    this.$success(this.$t('Successfully removed the notification.'));
                })
                .catch(e => {
                });
        },
        fetchNotifications() {
            let data = {
                meta_key: 'notifications',
                is_multiple: true,
            };

            const url = FluentFormsGlobal.$rest.route('getFormSettings', this.form_id);

            FluentFormsGlobal.$rest.get(url, data)
                .then(response => {
                    this.notifications = response;
                })
                .catch(e => {
                })
                .finally(_ => {
                    this.loading = false;
                });
        },
        fetchEmailTemplates() {
            FluentFormsGlobal.$get({
                action: 'fluentform_pdf_admin_ajax_actions',
                form_id: window.FluentFormApp.form_id,
                route: 'feed_lists'
            })
                .then(response => {
                    this.pdf_feeds = response.data.pdf_feeds;
                })
                .fail(error => console.log(error));
        },
        store() {
            this.loading = true;
            this.errors.clear();

            let id = this.selected.id;

            delete (this.selected.id);

            const data = {
                form_id: this.form_id,
                meta_key: 'notifications',
                value: JSON.stringify(this.selected.value),
                meta_id: id,
                action: 'fluentform-save-form-email-notification'
            };

            FluentFormsGlobal.$post(data)
                .then(response => {
                    this.selected.id = response.id;

                    this.notifications.splice(this.selectedIndex, 1, this.selected);

                    this.$success(this.$t('Successfully saved the notification.'));

                    this.selected = null;
                    this.selectedIndex = null;
                })
                .catch(errors => {
                    this.errors.record(errors?.responseJSON);
                    this.selected.id = id;
                })
                .always(() => {
                    this.loading = false
                });
        },
        closeSmtp() {
            this.smtp_closed = true;
            if (localStorage) {
                localStorage.setItem('fluentsmtp_closed', 'yes');
            }

        }
    },

    mounted() {
        // Back to all notifications by clicking on menu item
        jQuery('[data-hash="email_notifications"]').on('click', this.discard);
        jQuery('head title').text('Email Notifications - Fluent Forms');
        if (localStorage) {
            this.smtp_closed = !!localStorage.getItem('fluentsmtp_closed');
        }
    },
    beforeMount() {
        this.fetchNotifications();
        this.has_pdf && this.fetchEmailTemplates();
    },
    beforeCreate() {
        ffSettingsEvents.$emit('change-title', 'Email Notification Settings');
    }
};
</script>
