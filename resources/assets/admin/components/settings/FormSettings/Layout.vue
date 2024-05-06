<template>
    <el-form ref="form-layout" label-position="top">
        <card id="settings">
            <card-head>
                <h5 class="title">{{ $t('Global Layout Settings') }}</h5>
            </card-head>
            <card-body>
                <el-row :gutter="24">
                    <el-col :md="12" :lg="8">
                        <!--Label Placement-->
                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Label Placement') }}

                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('Select the default label placement.') }}
                                        </p>
                                    </div>

                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-select class="w-100 ff-input-s1" v-model="layout.labelPlacement">
                                <el-option v-for="(label, value) in labelPlacementOptions" :key="value"
                                        :label="label" :value="value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :md="12" :lg="8">
                        <!-- Help message placement -->
                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Help Message Placement') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('Select the placement of help message.') }}
                                        </p>
                                    </div>

                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-select class="w-100 ff-input-s1" v-model="layout.helpMessagePlacement">
                                <el-option
                                    v-for="(label, value) in {'with_label': 'Next to Label', 'under_input': 'Below Input Element'}"
                                    :key="value"
                                    :label="label" :value="value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="8">
                        <!-- Error message placement -->
                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Error Message Placement') }}

                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('Select the placement of error message.') }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>

                            <el-select class="w-100 ff-input-s1" v-model="layout.errorMessagePlacement">
                                <el-option
                                    v-for="(label, value) in {'stackToBottom': 'Stack to Bottom', 'inline': 'Below Input Element'}"
                                    :key="value"
                                    :label="label" :value="value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </card-body>
        </card>

        <card id="email-summaries">
            <card-head>
                <h5 class="title">{{ $t('Email Summaries') }}</h5>
                <p class="text">
                    {{$t('Would you like to receive a weekly report showing how your forms are performing? Enable Email Summaries option and you will get a report every week to the provided email address')}}
                </p>
            </card-head>
            <card-body>
                <el-form-item class="ff-form-item">
                    <template slot="label">
                        {{ $t('Status') }}
                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                            <div slot="content">
                                <p>
                                    {{
                                        $t('Enable this feature to get weekly reports on how your forms are performing.')
                                    }}
                                </p>
                            </div>
                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                        </el-tooltip>
                    </template>
                    <el-checkbox true-label="yes" false-label="no" v-model="email_report.status"> {{
                            $t('Enable Email Summaries')
                        }}
                    </el-checkbox>
                </el-form-item>
                <template v-if="email_report.status == 'yes'">
                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Send To') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Specify the recipient of the weekly report.') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="email_report.send_to_type">
                            <el-radio label="admin_email">{{ $t('Site Admin') }}</el-radio>
                            <el-radio label="custom_email">{{ $t('Custom Email') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-row :gutter="24">
                        <el-col :span="24" v-if="email_report.send_to_type == 'custom_email'">
                            <el-form-item class="ff-form-item">
                                <label class="mb-3" style="display: block;">{{ $t('Enter Recipient Email Address') }}</label>
                                <el-input class="w-100" :placeholder="$t('Recipient Email Address')"
                                        v-model="email_report.custom_recipients"></el-input>
                                <p class="fs-14 mt-1">{{ $t('For multiple email addresses, use comma to separate them.') }}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="24" :md="12">
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Get Reports On') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Select the day to receive weekly report.') }}
                                            </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>
                                <el-select class="w-100 ff-input-s1" :placeholder="$t('Select Day')" v-model="email_report.sending_day">
                                    <el-option v-for="(sendDay,dayKey) in sending_days" :key="dayKey" :value="dayKey"
                                            :label="sendDay"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :sm="24" :md="12">
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Subject Line') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Enter the subject line of the email summaries') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input
                                    class="w-100"
                                    :placeholder="$t('Email Subject')"
                                    v-model="email_report.subject"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </template>
            </card-body>
        </card>

        <!-- Integration Failure Notification-->
        <card id="integration-failure-notification">
            <card-head>
                <h5 class="title">{{ $t('Integration Failure Email Notification') }}</h5>
                <p class="text">
                    {{$t('Enable Integration Failure Notification and you will get an email when any of your integration fails to run.')}}
                </p>
            </card-head>
            <card-body>
                <el-form-item class="ff-form-item">
                    <template slot="label" v-if="hasPro">
                        {{$t('Status')}}
                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                            <div slot="content">
                                <p>
                                    {{
                                        $t('Enable Integration Failure Email Notification to receive email notification whenever an integration fails to run.')
                                    }}
                                </p>
                            </div>
                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                        </el-tooltip>
                    </template>
                    <el-checkbox v-if="hasPro" true-label="yes" false-label="no" v-model="integration_failure_notification.status">
                        {{ $t('Enable Integration Failure Notification') }}
                    </el-checkbox>
                    <notice class="ff_alert_between" type="danger-soft" v-else>
                        <div>
                            <h6 class="title">{{$t('Integration Failure Email Notification is available in the pro version')}}</h6>
                            <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                        </div>
                        <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                            {{$t('Upgrade to Pro')}}
                        </a>
                    </notice>
                </el-form-item>
                <template v-if="integration_failure_notification.status == 'yes' && hasPro">
                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Send To') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Please specify who will get the email notification') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="integration_failure_notification.send_to_type">
                            <el-radio label="admin_email">{{ $t('Site Admin') }}</el-radio>
                            <el-radio label="custom_email">{{ $t('Custom Email') }}</el-radio>
                        </el-radio-group>
                        <div v-if="integration_failure_notification.send_to_type == 'custom_email'" class="mt-3">
                            <label class="mb-3" style="display: block;">{{ $t('Enter Recipient Email Address') }}</label>
                            <el-input class="ff_input_width" :placeholder="$t('Recipient Email Address')"
                                        v-model="integration_failure_notification.custom_recipients"></el-input>
                            <p class="fs-14 mt-1">{{ $t('For multiple email addresses, use comma to separate them') }}</p>
                        </div>
                    </el-form-item>
                </template>
            </card-body>
        </card>

        <!-- Default Messages -->
        <card id="default-messages">
            <card-head>
                <h5 class="title">{{$t('Validation Messages') }}</h5>
                <p class="text">
                    {{
                        $t("These messages will be used as default messages of all form. These messages will be ignored when field error message set as custom.")
                    }}
                </p>
            </card-head>
            <card-body>
                <template v-for="(field, fieldKey) in default_message_setting_fields">
                    <el-form-item>
                        <template slot="label">
                            {{ field.label }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ field.help_text }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>

                        <el-input
                            v-if="field.type === 'textarea'"
                            type="textarea"
                            :row="field.row ? field.row : 3"
                            :placeholder="field.placeholder|| $t('Global Message For ') + field.label"
                            v-model="default_messages[fieldKey]"
                        />
                        <el-input
                            v-else
                            :placeholder="field.placeholder|| $t('Global Message For ') + field.label"
                            v-model="default_messages[fieldKey]"
                        />
                    </el-form-item>
                </template>
            </card-body>
        </card>

        <card id="miscellaneous">
            <card-head>
                <card-head-group>
                    <h5 class="title">{{ $t('Miscellaneous') }}</h5>
                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>{{ $t('These settings will be applied to all new forms.') }}</p>
                        </div>
                        <i class="ff-icon ff-icon-info-filled text-primary ml-2"></i>
                    </el-tooltip>
                </card-head-group>
            </card-head>
            <card-body>
                <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                    <template slot="label">
                        <span>
                            {{ $t('Disable IP Logging') }}

                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('If this option is turned on, the user\'s IP address will not be saved with the form data.') }}<br>
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </span>
                    </template>

                    <el-switch class="el-switch-lg" v-model="misc.isIpLogingDisabled"></el-switch>
                </el-form-item>

                <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                    <template slot="label">
                        <span>
                            {{ $t('Disable Form Analytics') }}

                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enable this to prevent tracking unique views and submission counts.') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </span>
                    </template>

                    <el-switch class="el-switch-lg" v-model="misc.isAnalyticsDisabled"></el-switch>
                </el-form-item>

                <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                    <template slot="label">
                        <span>
                            <span>
                                {{ $t('Enable Honeypot Security') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{
                                                $t('Enable Honeypot Security for better spam protection')
                                            }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </span>
                            <p class="text-note mt-1">{{ $t('Recommended Settings: Enabled') }}</p>
                        </span>
                    </template>

                    <el-switch class="el-switch-lg" active-value="yes" inactive-value="no"
                               v-model="misc.honeypotStatus"></el-switch>
                </el-form-item>

                <template v-if="akismet_available">
                    <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                        <template slot="label">
                            <span>
                                <span>
                                    {{ $t('Enable Akismet Integration') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{
                                                    $t('If you enable this then Fluent Forms will verify the form submission with Akismet. It will save you from spam form submission.')
                                                }}
                                            </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </span>
                                <p class="text-note mt-1">{{ $t('Recommended Settings: Enabled') }}</p>
                            </span>
                        </template>

                        <el-switch class="el-switch-lg" active-value="yes" inactive-value="no"
                                   v-model="misc.akismet_status"></el-switch>
                    </el-form-item>

                    <el-form-item v-if="misc.akismet_status == 'yes'">
                        <template slot="label">
                            {{ $t('Spam Validation') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <h3>{{ $t('Spam Validation') }}</h3>
                                    <p>
                                        {{ $t('Please select what will be happened once a submission marked as spam') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="misc.akismet_validation">
                            <el-radio label="mark_as_spam">{{ $t('Mark as Spam') }}</el-radio>
                            <el-radio label="validation_failed">{{ $t('Make the form submission as failed') }}</el-radio>
                        </el-radio-group>

                    </el-form-item>

                </template>

                <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                    <template slot="label">
                        <span>
                            {{ $t('Classic Editor Button') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enabling this option will have form inserter button inside classic editor.') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </span>
                    </template>

                    <el-switch class="el-switch-lg" active-value="yes" inactive-value="no"
                               v-model="misc.classicEditorButton"></el-switch>
                </el-form-item>

                <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                    <template slot="label">
                        <span>
                            <span>
                                {{ $t('Enable No-Conflict Mode') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{
                                                $t('Enable this to prevent conflicts cause by other plugins scripts.')
                                            }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </span>
                            <p class="text-note mt-1">{{ $t('Recommended Settings: Enabled') }}</p>
                        </span>
                    </template>
                    <el-switch class="el-switch-lg" active-value="yes" inactive-value="no"
                               v-model="misc.noConflictStatus"></el-switch>
                </el-form-item>

                <el-form-item class="ff-form-item-flex ff-form-item ff-form-setting-label-width">
                    <template slot="label">
                        <span>
                            {{ $t('Enable Auto Tab - Index') }}
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enable this to switch between form fields using Tab.') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </span>
                    </template>
                    <el-switch class="el-switch-lg" active-value="yes" inactive-value="no"
                               v-model="misc.tabIndex"></el-switch>
                </el-form-item>

                <el-form-item class="ff-form-item">
                    <template slot="label">
                        {{ $t('Geo-Location Provider') }}
                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                            <div slot="content">
                                <p>
                                    {{
                                        $t('If you use advanced phone field and enable auto country ditect then may configure this.')
                                    }}
                                </p>
                            </div>
                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                        </el-tooltip>
                    </template>
                    <el-row :gutter="24" v-if="hasPro">
                        <el-col :sm="24" :md="12">
                            <el-select class="w-100 ff-input-s1" v-model="misc.geo_provider">
                                <el-option
                                    v-for="(provider, providerUrl) in geo_providers"
                                    :key="providerUrl" :value="providerUrl"
                                    :label="provider.label"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :sm="24" :md="12">
                            <template v-if="misc.geo_provider && geo_providers[misc.geo_provider].has_token">
                                <el-input type="password" :placeholder="$t('GEO API Token')" v-model="misc.geo_provider_token"></el-input>
                            </template>
                        </el-col>
                        <el-col :span="24">
                            <p v-if="misc.geo_provider && geo_providers[misc.geo_provider].token_instruction" class="text-note" style="margin-top: -14px;">{{geo_providers[misc.geo_provider].token_instruction}}</p>
                        </el-col>
                    </el-row>
                    <notice class="ff_alert_between" type="danger-soft" v-else>
                        <div>
                            <h6 class="title">{{$t('Geo-Location provider is available in the pro version')}}</h6>
                            <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                        </div>
                        <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                            {{$t('Upgrade to Pro')}}
                        </a>
                    </notice>
                </el-form-item>

                <!-- File Upload Location -->
                <el-form-item class="ff-form-item">
                    <template slot="label">
                        {{$t('File Upload Location')}}
                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                            <div slot="content">
                                <p>
                                    {{$t('Select where to store uploaded files.')}}
                                </p>
                            </div>
                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                        </el-tooltip>
                    </template>
                    <el-row v-if="hasPro" :gutter="24">
                        <el-col :sm="24" :md="12">
                            <el-select class="w-100 ff-input-s1" v-model="misc.file_upload_locations">
                                <el-option
                                    v-for="location in file_upload_optoins"
                                    :key="location.value" :value="location.value"
                                    :label="location.label">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <notice class="ff_alert_between" type="danger-soft" v-else>
                        <div>
                            <h6 class="title">{{$t('File Upload Location is available in the pro version')}}</h6>
                            <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                        </div>
                        <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                            {{$t('Upgrade to Pro')}}
                        </a>
                    </notice>
                </el-form-item>

                <!-- Enable captcha in All form -->
                <div class="el-form-item-wrap">
                    <el-form-item class="ff-form-item-flex ff-form-item mb-3 ff-form-setting-label-width">
                        <template slot="label">
                            <span>
                                <span>
                                    {{ $t('Auto Load Captcha') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{
                                                    $t('Enable this to automatically load Captcha in all forms.')
                                                }}
                                            </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </span>
                                <p class="text-note mt-1">{{ $t('For using Captcha, enable Captcha first.') }}</p>
                            </span>
                        </template>
                        <el-switch class="el-switch-lg" :disabled="!hasCaptcha"
                                v-model="misc.autoload_captcha"></el-switch>
                    </el-form-item>

                    <el-radio-group v-model="misc.captcha_type" v-if="misc.autoload_captcha">
                        <el-radio :disabled="!captcha_status.recaptcha" label="recaptcha">{{ $t('Google ReCaptcha') }}</el-radio>
                        <el-radio :disabled="!captcha_status.hcaptcha"  label="hcaptcha">{{ $t('hCaptcha') }}</el-radio>
                        <el-radio :disabled="!captcha_status.turnstile"  label="turnstile">{{ $t('Turnstile') }}</el-radio>
                    </el-radio-group>
                </div>
                <!-- Toggle Admin Top Navigation -->
                <div class="el-form-item-wrap">
                    <el-form-item class="ff-form-item-flex ff-form-item mb-3 ff-form-setting-label-width">
                        <template slot="label">
                            <span>
                                {{ $t('Admin Top Navigation') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('Toggle Admin Top Navigation on or off and Save the Settings. Please reload the page after changing this option.') }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </span>
                        </template>
                        <el-switch active-value="yes" inactive-value="no" class="el-switch-lg"
                                v-model="misc.admin_top_nav_status"></el-switch>
                    </el-form-item>
                </div>

                <el-form-item class="ff-form-item">
                    <template slot="label">
                        {{ $t('Email Footer Text') }}
                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                            <div slot="content">
                                <p>
                                    {{
                                        $t('Set custom email footer text here. (HTML is supported)')
                                    }}
                                </p>
                            </div>
                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                        </el-tooltip>
                    </template>

                    <el-input
                        type="textarea"
                        :rows="3"
                        :placeholder="$t('Email Footer Text')"
                        v-model="misc.email_footer_text">
                    </el-input>
                </el-form-item>
            </card-body>
        </card>
    </el-form>
</template>

<script type="text/babel">
    import Card from '@/admin/components/Card/Card.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import Notice from '@/admin/components/Notice/Notice.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
    import { scrollTop } from '@/admin/helpers';

    export default {
        name: 'FormLayout',
        components: {
            Card,
            CardHead,
            CardBody,
            Notice,
            CardHeadGroup
        },
        props: {
            data: {
                required: true
            },
            email_report: {
                required: true
            },
            integration_failure_notification: {
                required: true
            },
            file_upload_optoins: {
                required: true
            },
            captcha_status: {
                required: true
            },
	        default_message_setting_fields: {
		        required: true
	        },
        },
        data() {
            return {
                labelPlacementOptions: {
                    'top': 'Top Aligned',
                    'left': 'Left Aligned',
                    'right': 'Right Aligned'
                },
                helpMessagePlacementOptions: {
                    'with_label': 'Beside Label as Tooltip',
                    'under_input': 'Below Input Box'
                },
                errorMessagesPlacement: {
                    'inline': 'Show error messages after each input',
                    'stackToBottom': 'Show all error messages after submit button as stack'
                },
                akismet_available: window.FluentFormApp.akismet_activated,
                layout: {},
                misc: {},
	            default_messages: {},
                sending_days: {
                    Mon: 'Monday',
                    Tue: 'Tuesday',
                    Wed: 'Wednesday',
                    Thu: 'Thursday',
                    Fri: 'Friday',
                    Sat: 'Saturday',
                    Sun: 'Sunday'
                },
                geo_providers: {
                    'ipinfo.io': {
                        label: 'ipinfo.io',
                        has_token: true,
                        token_instruction: 'For high volume of users, you can add an API token.'
                    }
                },
                hasPro: !!window.FluentFormApp.has_pro
            }
        },
        computed:{
            hasCaptcha(){
                return !!this.captcha_status.hcaptcha || !!this.captcha_status.recaptcha || !!this.captcha_status.turnstile;
            }
        },
        methods:{
            scrollTo() {
                let pageScollLink = jQuery('.ff-page-scroll');
                let hash = window.location.hash;
                if(hash.indexOf('fluent_forms_settings')){
                    pageScollLink.each(function(){
                        jQuery(this).on("click", function(e){
                            let targetId = jQuery(this).attr("data-section-id");
                            e.preventDefault();

                            jQuery(targetId).addClass('highlight-border');

                            const $settingsOption = jQuery('.ff_global_settings_option');

                            if ($settingsOption.length) {
	                            const menuHeight = jQuery('.ff_header').first()?.outerHeight() || 0;
	                            const wpAdminBarHeight = jQuery('#wpadminbar').outerHeight() || 0;
                                const top = jQuery(targetId).offset().top + $settingsOption.scrollTop() - (wpAdminBarHeight + menuHeight + $settingsOption.position().top);
                                scrollTop(top, 'fast', '.ff_global_settings_option').then((_) => {
                                    if(targetId.length) {
                                        setTimeout(() => {
                                            jQuery(targetId).not(this).removeClass('highlight-border');
                                        }, 500);
                                    }
                                })
                            }
                        });
                    });
                }
            }
        },
        mounted() {
            // init page scroll
            this.scrollTo();

            this.layout = this.data.layout;

	        for (const fieldKey in this.default_message_setting_fields) {
		        if (!(fieldKey in this.data.default_messages)) {
			        this.$set(this.data.default_messages, fieldKey, this.default_message_setting_fields[fieldKey].value);
		        }
	        }
	        this.default_messages = this.data.default_messages

            if (!this.data.misc.akismet_validation) {
                this.$set(this.data.misc, 'akismet_validation', 'mark_as_spam');
            }

            if(!this.data.misc.geo_provider) {
                this.$set(this.data.misc, 'geo_provider', 'ipinfo.io');
            }
            if(!this.data.misc.file_upload_locations) {
                this.$set(this.data.misc, 'file_upload_locations', 'default');
            }
            if(!this.data.misc.admin_top_nav_status) {
                this.$set(this.data.misc, 'admin_top_nav_status', 'yes');
            }

            this.misc = this.data.misc;
        }
    }
</script>

