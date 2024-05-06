<template>
    <div class="ff_settings_form">
        <el-skeleton :loading="!formSettings" animated :rows="14" :class="!formSettings ? 'ff_card' : ''">
            <template v-if="formSettings">
                <!-- Confirmation Settings -->
                <card id="confirmation-settings">
                    <card-head>
                        <card-head-group class="justify-between">
                            <h5 class="title">{{ $t('Confirmation Settings') }}</h5>
                            <btn-group>
                                <btn-group-item>
                                    <video-doc btn_size="medium" :btn_text="$t('Learn More')" route_id="formConfirmation"/>
                                </btn-group-item>
                                <btn-group-item>
                                    <el-button
                                        :loading="loading"
                                        type="primary"
                                        icon="el-icon-success"
                                        @click="saveSettings"
                                        size="medium"
                                    >
                                        {{loading ? $t('Saving ') : $t('Save ')}} {{ $t('Settings') }}
                                    </el-button>
                                </btn-group-item>
                            </btn-group>
                        </card-head-group>
                    </card-head>
                    <card-body>
                        <!--confirmation settings form-->
                        <el-form label-position="top">
                            <add-confirmation
                                :pages="pages"
                                :editorShortcodes="editorShortcodes"
                                :confirmation="formSettings.confirmation"
                                :errors="errors">
                            </add-confirmation>
                        </el-form>
                    </card-body>
                </card>

                <!--Double Opt-in settings-->
                <card v-if="double_optin" id="double-optin-confirmation">
                    <card-head>
                        <h5 class="title">{{ $t('Double Optin Confirmation') }}</h5>
                    </card-head>
                    <card-body>
                        <el-checkbox true-label="yes" false-label="no" v-model="double_optin.status">
                            {{ $t('Enable Double Optin Confirmation before Form Data Processing')}}
                        </el-checkbox>

                        <el-form class="mt-4" v-if="double_optin.status == 'yes'" :data="double_optin" label-position="top">
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Primary Email Field') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Select the primary email field from the form fields. In the selected email field, the double optin email will be sent for verification.')}}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"/>
                                    </el-tooltip>
                                </template>

                                <el-select class="ff_input_width" v-model="double_optin.email_field" :placeholder="$t('Select an email field')">
                                    <el-option
                                        v-for="(item, index) in emailFields"
                                        :key="index"
                                        :label="item.admin_label"
                                        :value="item.attributes.name">
                                    </el-option>
                                </el-select>

                            </el-form-item>

                            <template v-if="double_optin.email_field">
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Initial Success Message') }}
                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Enter the text you would like the user to see just after initial form submission.')}}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"/>
                                        </el-tooltip>
                                    </template>
                                    <wp-editor
                                        :height="75"
                                        :editor-shortcodes="editorShortcodes"
                                        v-model="double_optin.confirmation_message"/>

                                    <p class="mt-1 fs-14">{{ $t('This message will be shown after the intial form submission') }}</p>
                                </el-form-item>

                                <el-form-item class="ff-form-item" :label="$t('Email Type')">
                                    <el-radio-group v-model="double_optin.email_body_type">
                                        <el-radio label="global">{{ $t('As Per Global Settings') }}</el-radio>
                                        <el-radio label="custom">{{ $t('Customized Double Optin Email') }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                                <template v-if="double_optin.email_body_type == 'custom'">
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Optin Email Subject') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Email Subject for double optin email. You can use any smart code in the email subject') }}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"/>
                                            </el-tooltip>
                                        </template>
                                        <el-input :placeholder="$t('Email Subject')" v-model="double_optin.email_subject"/>
                                    </el-form-item>
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Optin Email Body') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Enter the content you would like the user to send via email for confirmation.')}}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"/>
                                            </el-tooltip>
                                        </template>
                                        <input-popover
                                            :rows="10"
                                            v-if="double_optin.asPlainText == 'yes'" fieldType="textarea"
                                            v-model="double_optin.email_body"
                                            :placeholder="$t('Double Opt-in Email Body HTML')"
                                            :data="editorShortcodes"
                                        ></input-popover>
                                        <wp-editor v-else :height="150" :editor-shortcodes="editorShortcodes"
                                                v-model="double_optin.email_body"/>
                                        <el-checkbox class="mt-3" true-label="yes" false-label="no" v-model="double_optin.asPlainText">
                                            {{ $t('Send Email as RAW HTML Format') }}
                                        </el-checkbox>

                                        <p class="mt-2 fs-14">{{ $t('Use #confirmation_url# smartcode for double optin confirmation URL') }}</p>
                                    </el-form-item>
                                </template>

                                <div class="form_item">
                                    <el-checkbox true-label="yes" false-label="no" v-model="double_optin.skip_if_logged_in">
                                        {{ $t('Disable Double Optin for Logged in users') }}
                                    </el-checkbox>
                                </div>

                                <div v-if="hasFluentCRM" class="form_item">
                                    <el-checkbox true-label="yes" false-label="no" v-model="double_optin.skip_if_fc_subscribed">
                                        {{ $t('Disable Double Optin if contact email is subscribed in ')}}<b>FluentCRM</b>
                                    </el-checkbox>
                                </div>
                            </template>

                        </el-form>
                    </card-body>
                </card>

                <!--Admin approval settings-->
                <card v-if="admin_approval" id="admin_approval">
                    <card-head>
                        <h5 class="title">{{ $t('Admin approval') }}</h5>
                        <p class="text">
                            {{ $t('Enable admin approval email notifications to inform the admin of pending submissions from') }} <a href="?page=fluent_forms_settings#admin_approval">{{ $t('Global Settings') }}</a>. {{$t('After approve form data & email notification will be processed.You can configure an email for users declined submissions.') }}</p>
                    </card-head>
                    <card-body>

                        <el-form label-position="top">
                            <el-row :gutter="24">
                                <el-col>
                                    <el-checkbox true-label="yes" false-label="no"  v-model="admin_approval.status">
                                        {{ $t('Enable Admin approval before Form Data Processing')}}
                                    </el-checkbox>
                                </el-col>
                                <el-col v-if="admin_approval.status =='yes'">
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Approval Pending Message') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>{{ $t('Enter the text you would like the user to see just after the form submission.')}}</p>
                                                </div>
                                                <i class="ff-icon ff-icon-info-filled text-primary"/>
                                            </el-tooltip>
                                        </template>
                                        <wp-editor
                                                :height="75"
                                                :editor-shortcodes="editorShortcodes"
                                                v-model="admin_approval.approval_pending_message"/>

                                    </el-form-item>
                                    <!--Admin declined Email Notification to user-->
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Declined Submission Notification') }}
                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Select the primary email field from the form fields. In the selected email field, the double optin email will be sent for verification.')}}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"/>
                                            </el-tooltip>
                                        </template>

                                        <el-select class="ff_input_width" clearable v-model="admin_approval.email_field" :placeholder="$t('Select an email field')">
                                            <el-option
                                                    v-for="(item, index) in emailFields"
                                                    :key="index"
                                                    :label="item.admin_label"
                                                    :value="item.attributes.name">
                                            </el-option>
                                        </el-select>

                                    </el-form-item>

                                    <template v-if="admin_approval.email_field">
                                        <el-form-item class="ff-form-item">
                                            <template slot="label">
                                                {{ $t('Declined Email Subject') }}
                                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                    <div slot="content">
                                                        <p>
                                                            {{ $t('Email Subject for declined submission notification. You can use any smart code in the email subject') }}
                                                        </p>
                                                    </div>

                                                    <i class="ff-icon ff-icon-info-filled text-primary"/>
                                                </el-tooltip>
                                            </template>
                                            <el-input :placeholder="$t('Email Subject')" v-model="admin_approval.email_subject"/>
                                        </el-form-item>
                                        <el-form-item class="ff-form-item">
                                            <template slot="label">
                                                {{ $t('Declined Email Body') }}
                                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                    <div slot="content">
                                                        <p>
                                                            {{ $t('Enter the content you would like the user to send via email for notification of declined submission.')}}
                                                        </p>
                                                    </div>

                                                    <i class="ff-icon ff-icon-info-filled text-primary"/>
                                                </el-tooltip>
                                            </template>
                                            <input-popover
                                                    :rows="10"
                                                    v-if="admin_approval.asPlainText == 'yes'" fieldType="textarea"
                                                    v-model="admin_approval.email_body"
                                                    :placeholder="$t('Admin Approval declined Email Body HTML')"
                                                    :data="editorShortcodes"
                                            ></input-popover>
                                            <wp-editor v-else :height="150" :editor-shortcodes="editorShortcodes"
                                                       v-model="admin_approval.email_body"/>
                                            <el-checkbox class="mt-3" true-label="yes" false-label="no" v-model="admin_approval.asPlainText">
                                                {{ $t('Send Email as RAW HTML Format') }}
                                            </el-checkbox>

                                            <p class="mt-2 fs-14">{{ $t('Use #confirmation_url# smartcode for double optin confirmation URL') }}</p>
                                        </el-form-item>


                                    </template>
                                    <div class="form_item">
                                        <el-checkbox true-label="yes" false-label="no" v-model="admin_approval.skip_if_logged_in">
                                            {{ $t('Disable Admin Approval for Logged in users') }}
                                        </el-checkbox>
                                    </div>
                                </el-col>

                            </el-row>
                        </el-form>
                    </card-body>
                </card>

                <!-- Appearance Settings -->
                <card id="form-layout">
                    <card-head>
                        <card-head-group class="justify-between">
                            <h5 class="title">{{ $t('Form Layout') }}</h5>
                            <video-doc btn_size="medium" :btn_text="$t('Learn More')" route_id="formErrorMessage"/>
                        </card-head-group>
                    </card-head>
                    <card-body>

                        <!--Appearance settings form-->
                        <el-form label-position="top">
                            <el-row :gutter="24">
                                <el-col :sm="24" :md="6">
                                    <!--Label placement-->
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Label Alignment') }}

                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Select the default label placement. Labels can be top aligned above a field, left aligned to the left of a field, or right aligned to the right of a field.') }}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-select class="w-100 ff-input-s1" v-model="formSettings.layout.labelPlacement">
                                            <el-option
                                                v-for="(label, value) in labelPlacementOptions"
                                                :label="label"
                                                :key="value"
                                                :value="value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :sm="24" :md="6">
                                    <!--Help Message placement-->
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Help Message Position') }}

                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Select the default help message placement. Help messages can be placed beside label as a tooltip, or below each input.') }}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-select class="w-100 ff-input-s1" v-model="formSettings.layout.helpMessagePlacement">
                                            <el-option
                                                v-for="(label, value) in helpMessagePlacementOptions"
                                                :label="$t(label)"
                                                :key="value"
                                                :value="value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :sm="24" :md="6">
                                    <!--Error Message placement-->
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Error Message Position') }}

                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('Select the default error message placement. Error messages can be placed below each input, or stacked after the form submit button.')}}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-select class="w-100 ff-input-s1" v-model="formSettings.layout.errorMessagePlacement">
                                            <el-option
                                                v-for="(label, value) in errorMessagesPlacement"
                                                :label="$t(label)"
                                                :key="value"
                                                :value="value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :sm="24" :md="6">
                                    <!--Required asterisk mark position -->
                                    <el-form-item class="ff-form-item">
                                        <template slot="label">
                                            {{ $t('Asterisk Position') }}

                                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                                <div slot="content">
                                                    <p>
                                                        {{ $t('The asterisk marker position for the required elements.') }}
                                                    </p>
                                                </div>

                                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                            </el-tooltip>
                                        </template>

                                        <el-select class="w-100 ff-input-s1" v-model="formSettings.layout.asteriskPlacement">
                                            <el-option
                                                v-for="(label, value) in asteriskPlacementMock"
                                                :label="$t(label)"
                                                :key="value"
                                                :value="value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </card-body>
                </card>

                <!-- Form Restrictions -->
                <card id="scheduling-and-restrictions">
                    <card-head>
                        <card-head-group class="justify-between">
                            <h5 class="title">{{ $t('Scheduling & Restrictions') }}</h5>
                            <video-doc btn_size="medium" :btn_text="$t('Learn More')" route_id="formScheduling"/>
                        </card-head-group>
                    </card-head>
                    <card-body>
                        <!--Restriction settings form-->
                        <div class="ff_settings_section">
                            <div class="ff_settings_body">
                                <form_restriction :data="formSettings.restrictions" :has-pro="hasPro"></form_restriction>
                            </div>
                        </div>
                    </card-body>
                </card>

                <!-- Advanced form validation -->
                <card id="advanced-form-validation">
                    <card-head>
                        <h5 class="title">{{ $t('Advanced Form Validation') }}</h5>
                        <p class="text">
                            {{$t('You can set rules to the user input and based on the rules you can prevent the form submission. This is very useful feature for preventing spam / bot submissions.')}}
                            <a target="_blank" rel="noopener" href="https://wpmanageninja.com/docs/fluent-form/advanced-features-functionalities-in-wp-fluent-form/advanced-form-validation-in-wp-fluent-forms-wordpress-plugin/">
                                {{ $t('Learn More here')}}
                            </a>
                        </p>
                    </card-head>

                    <card-body>
                        <advanced-validation v-if="hasPro" :hasPro="hasPro" :inputs="inputs" :settings="advancedValidationSettings"></advanced-validation>

                        <notice class="ff_alert_between" type="danger-soft" v-if="!hasPro">
                            <div>
                                <h6 class="title">{{$t('Advanced Form Validation is available in the pro version')}}</h6>
                                <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                            </div>
                            <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                                {{$t('Upgrade to Pro')}}
                            </a>
                        </notice>
                    </card-body>
                </card>

                <!-- Survey Result -->
                <card id="survey-result">
                    <card-head>
                        <h5 class="title">{{ $t('Survey Result') }}</h5>
                    </card-head>
                    <card-body>
                        <survey-result v-if="hasPro" :data="formSettings.appendSurveyResult" :hasPro="hasPro"/>

                        <notice class="ff_alert_between" type="danger-soft" v-if="!hasPro">
                            <div>
                                <h6 class="title">{{$t('Survey Result is available in the pro version')}}</h6>
                                <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                            </div>
                            <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                                {{$t('Upgrade to Pro')}}
                            </a>
                        </notice>
                    </card-body>
                </card>

                <!-- Compliance Settings -->
                <card id="compliance-settings">
                    <card-head>
                        <card-head-group>
                            <h5 class="title">{{ $t('Compliance Settings') }}</h5>
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('If you enable this settings then your entry data will be deleted from database. It\'s useful for HIPPA/GDPR Compliance for some forms.') }}
                                    </p>
                                </div>

                                <i class="ff-icon ff-icon-info-filled text-primary ml-1"></i>
                            </el-tooltip>
                        </card-head-group>
                    </card-head>
                    <card-body>
                        <el-checkbox v-if="hasPro" true-label="yes" false-label="no"
                            v-model="formSettings.delete_entry_on_submission">
                            {{$t('Delete entry data after form submission')}}
                        </el-checkbox>

                        <p class="mt-3" v-if="formSettings.delete_entry_on_submission == 'yes'">
                            {{
                                $t('Your data will be deleted on form submission so no entry data, analytics and visual reporting will be available for this form')
                            }}
                        </p>

                        <div v-if="formSettings.delete_entry_on_submission != 'yes'" class="ff_auto_delete_section mt-3">
                            <el-checkbox
                                v-if="hasPro"
                                true-label="yes"
                                false-label="no"
                                v-model="formSettings.delete_after_x_days"
                            >
                                {{ $t('Enable auto delete old entries') }}
                            </el-checkbox>

                            <div v-if="formSettings.delete_after_x_days == 'yes'" class="el-form--label-top mt-3">
                                <div class="el-form-item ff-form-item">
                                    <label class="el-form-item__label">
                                        {{ $t('Specify how many days old entries will be deleted for this form') }}
                                    </label>
                                    <div class="el-form-item__content">
                                        <el-input-number :min="1" v-model="formSettings.auto_delete_days"/>
                                    </div>
                                    <p class="mt-2 text-danger" v-if="formSettings.auto_delete_days">
                                        {{ $t('Entries older than ') }}
                                        <b>{{formSettings.auto_delete_days}} {{ $t(' days ') }}</b>
                                        {{ $t('will be deleted automatically') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <notice class="ff_alert_between" type="danger-soft" v-if="!hasPro">
                            <div>
                                <h6 class="title">{{$t('Compliance Settings is available in the pro version')}}</h6>
                                <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                            </div>
                            <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                                {{$t('Upgrade to Pro')}}
                            </a>
                        </notice>
                    </card-body>
                </card>

                <!-- Other -->
                <card id="other">
                    <card-head>
                        <card-head-group>
                            <h5 class="title">{{ $t('Other') }}</h5>
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('If you enable this setting than a extra CSS Class will be add to Form.') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary ml-1"></i>
                            </el-tooltip>
                        </card-head-group>
                    </card-head>
                    <card-body class="el-form--label-top">
                        <div class="el-form-item ff-form-item" v-if="hasPro">
                            <label class="el-form-item__label">
                                {{ $t('Extra CSS Form Class') }}
                            </label>
                            <div class="el-form-item__content">
                                <el-input
                                    :placeholder="$t('extra css class')"
                                    v-model="formSettings.form_extra_css_class"
                                />
                            </div>
                        </div>
                        <notice class="ff_alert_between" type="danger-soft" v-else>
                            <div>
                                <h6 class="title">{{$t('Extra CSS Form Class is available in the pro version')}}</h6>
                                <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                            </div>
                            <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                                {{$t('Upgrade to Pro')}}
                            </a>
                        </notice>
                    </card-body>
                </card>

                <!-- Affiliate Setting -->
                <card v-if="affiliate_wp">
                    <card-head>
                        <h5 class="title">{{ $t('Affiliate') }}</h5>
                    </card-head>
                    <card-body class="el-form--label-top">
                        <div class="el-form-item ff-form-item">
                            <label class="el-form-item__label">
                                {{$t('Allow referrals')}}
                            </label>
                            <el-checkbox true-label="yes" false-label="no" v-model="affiliate_wp.status">
                                {{$t('Enable')}}
                            </el-checkbox>
                        </div>
                        <div class="el-form-item ff-form-item">
                            <label class="el-form-item__label">
                                {{$t('Allow referrals')}}
                            </label>
                            <el-select class="ff_input_width" v-model="affiliate_wp.selected_type" :placeholder="$t('Select type')">
                                <el-option
                                    v-for="(item, value) in affiliate_wp.types"
                                    :key="value"
                                    :value="value"
                                    :label="item.label"
                                >
                                </el-option>
                            </el-select>
                        </div>

                        <notice class="ff_alert_between" type="danger-soft" v-if="!hasPro">
                            <div>
                                <h6 class="title">{{$t('This is available in the pro version')}}</h6>
                                <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                            </div>
                            <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                                {{$t('Upgrade to Pro')}}
                            </a>
                        </notice>
                    </card-body>
                </card>

                <!-- per step save data for conversation form -->
                <card v-if="is_conversion_form && hasConvFormSaveAndResume" id="conv_form_per_step_save">
                    <card-head>
                        <card-head-group>
                            <h5 class="title">{{ $t('Conversational Form Per Step Save') }}</h5>
                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('If you enable this setting than this conversational form per step data will be saved') }}
                                    </p>
                                </div>
                                <i class="ff-icon ff-icon-info-filled text-primary ml-1"></i>
                            </el-tooltip>
                        </card-head-group>
                    </card-head>
                    <card-body class="el-form--label-top">
                        <div v-if="hasPro">
                            <div class="el-form-item ff-form-item ff-form-item-flex">
                                <label class="el-form-item__label" style="width: 390px;">
                                    {{ $t('Enable per step save') }}
                                </label>
                                <div class="el-form-item__content">
                                    <el-switch class="el-switch-lg" v-model="formSettings.conv_form_per_step_save" v-if="hasPro"/>
                                </div>
                            </div>
                            <transition name="slide-down">
                                <div v-if="formSettings.conv_form_per_step_save" class="el-form-item ff-form-item ff-form-item-flex">
                                    <label class="el-form-item__label" style="width: 390px;">
                                        {{ $t('Resume from last step') }}
                                    </label>
                                    <div class="el-form-item__content">
                                        <el-switch class="el-switch-lg" v-model="formSettings.conv_form_resume_from_last_step" v-if="hasPro"/>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <notice class="ff_alert_between" type="danger-soft" v-else>
                            <div>
                                <h6 class="title">{{$t('Conversation Form Per Step Save is available in the pro version')}}</h6>
                                <p class="text">{{$t('Upgrade to get access to all the advanced features.')}}</p>
                            </div>
                            <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                                {{$t('Upgrade to Pro')}}
                            </a>
                        </notice>
                    </card-body>
                </card>

                <div>
                    <el-button
                        :loading="loading"
                        type="primary"
                        icon="el-icon-success"
                        @click="saveSettings"
                    >
                        {{loading ? $t('Saving ') : $t('Save ')}} {{ $t('Settings') }}
                    </el-button>
                </div>
            </template>
        </el-skeleton>
    </div>
</template>

<script type="text/babel">
    import wpEditor from '@/common/_wp_editor';
    import form_restriction from './FormSettings/Restrictions';
    import SurveyResult from './FormSettings/SurveyResult';
    import errorView from '@/common/errorView';
    import AddConfirmation from './Includes/AddConfirmation.vue'
    import AdvancedValidation from "./Includes/AdvancedValidation";
    import VideoDoc from '@/common/VideoInstruction.vue';
    import inputPopover from '../input-popover.vue';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import Notice from '@/admin/components/Notice/Notice.vue';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';

    export default {
        name: 'FormSettings',
        props: {
            'form': Object,
            'form_id': [Number, String],
            'editor-shortcodes': {
                type: Array,
                default: []
            },
            'inputs': Object
        },
        components: {
            wpEditor,
            'form_restriction': form_restriction,
            errorView,
            AddConfirmation,
            SurveyResult,
            AdvancedValidation,
            VideoDoc,
            inputPopover,
            Card,
            CardHead,
            CardHeadGroup,
            CardBody,
            Notice,
            BtnGroup,
            BtnGroupItem
        },
        data() {
            return {
                savingSettings: false,
                loading: false,
                redirectToOptions: {
                    samePage: 'Same Page',
                    customPage: 'To a Page',
                    customUrl: 'To a Custom URL'
                },
                labelPlacementOptions: {
                    'top': 'Top',
                    'left': 'Left',
                    'right': 'Right'
                },
                helpMessagePlacementOptions: {
                    'with_label': 'Beside Label (Tooltip)',
                    'under_input': 'Below Input Fields',
                    'on_focus': 'Focus on Element',
                    'after_label': 'Before input'
                },
                errorMessagesPlacement: {
                    'inline': 'Below Input Fields',
                    'stackToBottom': 'Stacked after Form'
                },
                asteriskPlacementMock: {
                    '': 'None',
                    'asterisk-left': 'Left to Label',
                    'asterisk-right': 'Right to Label'
                },
                advancedValidationSettings: {
                    status: false,
                    type: 'all',
                    conditions: [
                        {
                            field: null,
                            operator: '=',
                            value: null
                        }
                    ],
                    error_message: ''
                },
                pages: [],
                formSettings: false,
                isPageLoading: true,
                errors: new Errors,
                delete_entry_on_submission: 'no',
                hasPro: !!window.FluentFormApp.hasPro,
                hasFluentCRM: !!window.FluentFormApp.hasFluentCRM,
                double_optin: false,
                affiliate_wp: false,
                admin_approval : false,
                is_conversion_form: !!window.FluentFormApp.is_conversion_form,
                conv_form_per_step_save: false,
                conv_form_resume_from_last_step: false,
                hasConvFormSaveAndResume: !!window.FluentFormApp.has_conv_form_save_and_resume
            }
        },
        computed: {
            emailFields() {
                return _ff.filter(this.inputs, (input) => {
                    return input.attributes.type === 'email';
                });
            }
        },
        methods: {
            setDefaultSettings() {
                this.formSettings = {
                    confirmation: {
                        redirectTo: 'samePage',
                        messageToShow: 'Thank you for your message. We will get in touch with you shortly',
                        customPage: null,
                        samePageFormBehavior: 'hide_form',
                        customUrl: null,
                    },
                    restrictions: {
                        limitNumberOfEntries: {
                            enabled: false,
                            numberOfEntries: null,
                            period: 'total',
                            limitReachedMsg: 'Maximum number of entries exceeded.',
                        },
                        scheduleForm: {
                            enabled: false,
                            start: null,
                            end: null,
                            pendingMsg: 'Form submission is not started yet.',
                            expiredMsg: 'Form submission is now closed.',
                        },
                        requireLogin: {
                            enabled: false,
                            requireLoginMsg: 'You must be logged in to submit the form.',
                        },
                        denyEmptySubmission: {
                            enabled: false,
                            message: 'Sorry, you cannot submit an empty form. Let\'s hear what you wanna say.'
                        },
                        restrictForm: {
                            enabled: false,
                            fields: {
                                ip: {
                                    status: false,
                                    values: '',
                                    message: 'Sorry! You can\'t submit a form from your IP address.',
                                    validation_type: 'fail_on_condition_met'
                                },
                                country: {
                                    status: false,
                                    values: [],
                                    message: 'Sorry! You can\'t submit a form the country you are residing.',
                                    validation_type: 'fail_on_condition_met'
                                },
                                keywords: {
                                    status: false,
                                    values: '',
                                    message: 'Sorry! Your submission contains some restricted keywords.'
                                }
                            },
                        }
                    },
                    layout: {
                        labelPlacement: 'top',
                        asteriskPlacement: 'asterisk-right',
                        helpMessagePlacement: 'with_label',
                        errorMessagePlacement: 'inline',
                        cssClassName: ''
                    }
                }
            },
            fetchSettings() {
                const url = FluentFormsGlobal.$rest.route('getGeneralFormSettings', this.form_id);

                FluentFormsGlobal.$rest.get(url)
                    .then(response => {
                        if (response.generalSettings) {
                            let settings = response.generalSettings;
                            if (!settings.confirmation)
                                settings.confirmation = {};
                            if (!settings.restrictions)
                                settings.restrictions = {};
                            if (!settings.layout)
                                settings.layout = {};

                            if (!settings.restrictions.limitNumberOfEntries)
                                settings.restrictions.limitNumberOfEntries = {};
                            if (!settings.restrictions.scheduleForm)
                                settings.restrictions.scheduleForm = {};
                            if (!settings.restrictions.requireLogin)
                                settings.restrictions.requireLogin = {};

                            if (!settings.restrictions.denyEmptySubmission)
                                settings.restrictions.denyEmptySubmission = {};

                            if (!settings.restrictions.restrictForm)
                                settings.restrictions.restrictForm = {};

                            if (!settings.appendSurveyResult) {
                                settings.appendSurveyResult = {
                                    enabled: false,
                                    showLabel: false,
                                    showCount: false
                                }
                            }

                            this.formSettings = settings;
                        } else {
                            this.setDefaultSettings();
                        }
                        this.advancedValidationSettings = response.advancedValidationSettings;

                        this.double_optin = response.double_optin;
                        this.admin_approval = response.admin_approval;
                        this.affiliate_wp = response.affiliate_wp;

                    })
                    .catch(e => {
                        this.setDefaultSettings();
                    })
                    .finally(() => {
                    });
            },
            fetchPages() {
                const url = FluentFormsGlobal.$rest.route('getFormPages', this.form_id);

                FluentFormsGlobal.$rest.get(url)
                    .then(response => {
                        this.pages = response;
                    })
                    .catch(e => {
                        this.loading = false;
                    })
            },
            saveSettings() {
                this.loading = true;

                const data = {
                    action: 'fluentform-save-settings-general-formSettings',
                    form_id: this.form_id,
                    formSettings: JSON.stringify(this.formSettings),
                    advancedValidationSettings: JSON.stringify(this.advancedValidationSettings),
                    double_optin: JSON.stringify(this.double_optin),
                    admin_approval: JSON.stringify(this.admin_approval),
                    affiliate_wp: JSON.stringify(this.affiliate_wp),
                }
                FluentFormsGlobal.$post(data)
                    .then(response => {
                        this.$success(response.message);
                    })
                    .catch(error => {
                        this.errors.record(error);
                    })
                    .always(() => {
                        this.loading = false;
                    });
            }
        },
        mounted() {
            this.fetchSettings();
            this.fetchPages();
            jQuery('head title').text('Confirmation Settings - Fluent Forms');
        },
        beforeCreate() {
            ffSettingsEvents.$emit('change-title', 'Form Settings');
        }
    };
</script>
