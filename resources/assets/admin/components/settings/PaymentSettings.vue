<template>
    <div class="ff-payment-settings">
        <card>
            <card-head>
                <h5 class="title">{{ $t('Payment Settings') }}</h5>
            </card-head>
            <card-body>
                <div v-loading="loading" class="ff-payment-settings-wrapper">
                    <el-form v-if="settings" label-position="top">
                        <el-form-item class="ff-form-item" :label="$t('Currency')">
                            <el-select class="ff_input_width" filterable v-model="settings.currency" :placeholder="('Select Currency')">
                                <el-option
                                        v-for="(currencyName, currenyKey) in currencies"
                                        :key="currenyKey"
                                        :label="currencyName"
                                        :value="currenyKey">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item class="ff-form-item" :label="$t('Transaction Type')">
                            <el-radio-group v-model="settings.transaction_type">
                                <el-radio label="product">{{ $t('Products / Services') }}</el-radio>
                                <el-radio label="donation">{{ $t('Donations') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-row :gutter="20" class="mb-4">
                            <el-col :span="8">
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Customer Email') }}
                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p> {{ $t('Please select the customer email field from your form\'s email inputs. It\'s optional field but recommended.')  }} </p>
                                            </div>
                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <el-select class="w-100" autoComplete="new_password" v-model="settings.receipt_email" clearable filterable :placeholder="$t('Select an email field')">
                                        <el-option
                                            v-for="(item, index) in emailFields"
                                            :key="index"
                                            :label="item.admin_label"
                                            :value="item.attributes.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Customer Name') }}
                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p> {{ $t('Please select the customer name field from your form inputs.It\'s optional ield but recommended.If user is logged in then this data will be picked from logged in user.') }} </p>
                                            </div>
                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <input-popover
                                        v-model="settings.customer_name"
                                        :placeholder="$t('Customer Name')"
                                        icon="el-icon-arrow-down"
                                        :data="editorShortcodes"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Customer Address') }}
                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>{{ ('Please select the customer address field from your form\'s address inputs. It\'s required for payments in India.') }} </p>
                                            </div>
                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <el-select class="w-100" v-model="settings.customer_address" clearable filterable :placeholder="$t('Select an address field')">
                                        <el-option
                                            v-for="(item, index) in addressFields"
                                            :key="index"
                                            :label="item.admin_label"
                                            :value="item.attributes.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <div class="ff_card_block" v-if="payment_methods.stripe">
                            <div class="ff_card_block_head">
                                <h5>{{ $t('Stripe Settings') }}</h5>
                            </div>

                            <el-form-item class="ff-form-item" :label="$t('Stripe Meta Data')">
                                <el-checkbox true-label="yes" false-label="no" v-model="settings.push_meta_to_stripe">{{
                                        $t('Push Form Data to Stripe')
                                    }}
                                </el-checkbox>
                            </el-form-item>

                            <div v-if="settings.push_meta_to_stripe == 'yes'" class="mb-4">
                                <h6 class="mb-3">{{ $t('Please Map meta Data for Stripe') }}</h6>
                                <dropdown-label-repeater
                                    :settings="settings"
                                    :field="{ key: 'stripe_meta_data' }"
                                    :editorShortcodes="editorShortcodes"
                                />
                            </div>

                            <el-form-item class="ff-form-item" label="">
                                <template slot="label">
                                    {{ $t('Stripe Account') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>{{ $t('You can select which stripe account credential will be used for this form.Select "Custom Stripe Credential" for a different stripe account than global.')  }} </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>
                                <el-radio-group v-model="settings.stripe_account_type">
                                    <el-radio label="global">{{ $t('As per global settings') }}</el-radio>
                                    <el-radio label="custom">{{ $t('Custom Stripe Credentials') }}</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <div class="ff_payment_mode_wrap mb-4" v-if="settings.stripe_account_type == 'custom'">
                                <el-form-item class="ff-form-item" label="">
                                    <template slot="label">
                                        {{ $t('Payment Mode') }}
                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>{{ $t('Select the payment mode.for testing purposes you should select Test Mode otherwise select Live mode.') }} </p>
                                            </div>
                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <el-radio-group v-model="settings.stripe_custom_config.payment_mode">
                                        <el-radio label="live">{{ $t('Live Mode') }}</el-radio>
                                        <el-radio label="test">{{ $t('Test Mode') }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>

                                <h4>
                                    {{ $t('Please provide your ') }}
                                    <span class="text-danger">
                                        {{settings.stripe_custom_config.payment_mode | ucFirst}} {{ $t(' API keys') }}
                                    </span>
                                </h4>

                                <el-form-item class="ff-form-item" :label="$t('Publishable key')">
                                    <template slot="label">
                                        {{settings.stripe_custom_config.payment_mode | ucFirst}} {{ $t(' Publishable key') }}
                                    </template>
                                    <el-input
                                        type="text"
                                        v-model="settings.stripe_custom_config.publishable_key"
                                        :placeholder="$t('Publishable key')"/>
                                </el-form-item>

                                <el-form-item class="ff-form-item" label="">
                                    <template slot="label">
                                        {{settings.stripe_custom_config.payment_mode | ucFirst}} {{ $t(' Secret key') }}
                                    </template>
                                    <el-input type="password" v-model="settings.stripe_custom_config.secret_key"
                                            :placeholder="$t('Secret key')"/>
                                </el-form-item>
                                <p>
                                    {{ $t('You can find the API keys to ') }}
                                    <a target="_blank" rel="noopener" href="https://dashboard.stripe.com/apikeys">{{ $t('Stripe Dashboard') }}</a>
                                </p>
                            </div>

                            <el-form-item class="ff-form-item" :label="$t('Stripe Payment Receipt')">
                                <el-checkbox true-label="yes" false-label="no" v-model="settings.disable_stripe_payment_receipt">
                                    {{ $t('Disable Payment Receipt Email by Stripe(no recommended)') }}
                                </el-checkbox>
                            </el-form-item>

                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Statement Descriptor') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>{{ $t('Provide the statement descriptor. If you keep it empty then your form name will be set.(Contains between 5 and 22 characters)') }} </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>
                                <el-input :placeholder="$t('Statement Description')" type="text" maxlength="22" v-model="settings.stripe_descriptor" />
                            </el-form-item>
                        </div>

                        <div class="ff_card_block mt-4" v-if="payment_methods.paypal">
                            <div class="ff_card_block_head">
                                <h5>{{ $t('PayPal Settings') }}</h5>
                            </div>
                            <el-form-item class="ff-form-item" label="">
                                <template slot="label">
                                    {{ $t('PayPal Account') }}
                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>{{ $t('You can select which PayPal account email will be used for this form.Select "Custom PayPal ID" for a different PayPal account than global.')}} </p>
                                        </div>
                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>
                                <el-radio-group v-model="settings.paypal_account_type">
                                    <el-radio label="global">{{ $t('As per global settings') }}</el-radio>
                                    <el-radio label="custom">{{ $t('Custom PayPal ID') }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <template v-if="settings.paypal_account_type == 'custom'">
                                <el-form-item class="ff-form-item" label="">
                                    <template slot="label">
                                        {{ $t('Payment Mode') }}
                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p> {{ $t('Select the payment mode. for testing purposes you should select Test Mode otherwise select Live mode.') }}</p>
                                            </div>
                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <el-radio-group v-model="settings.custom_paypal_mode">
                                        <el-radio label="live">{{ $t('Live Mode') }}</el-radio>
                                        <el-radio label="test">{{ $t('Test Mode') }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item class="ff-form-item" label="PayPal Email">
                                    <el-input type="email" v-model="settings.custom_paypal_id" :placeholder="$t('Custom PayPal Email')" />
                                </el-form-item>
                            </template>
                        </div>

                        <div class="mt-4">
                            <el-button icon="el-icon-success" :loading="saving" @click="saveSettings()" type="primary">
                                {{saving ? $t('Saving ') : $t('Save ')}} {{ $t('Settings') }}
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </card-body>
        </card>
    </div>
</template>

<script type="text/babel">
    import DropdownLabelRepeater from './GeneralIntegration/_DropdownLabelRepeater';
    import FieldGeneral from './GeneralIntegration/_FieldGeneral';
    import inputPopover from '../input-popover.vue';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';

    export default {
        name: 'payment-settings',
        props: ['form', 'editorShortcodes', 'inputs'],
        components: {
            DropdownLabelRepeater,
            FieldGeneral,
            inputPopover,
            Card,
            CardHead,
            CardBody
        },
        data() {
            return {
                saving: false,
                settings: false,
                loading: false,
                currencies: [],
                payment_methods: [],
                addressFields: []
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
            getSettings() {
                this.loading = true;
                FluentFormsGlobal.$get({
                    action: 'fluentform_handle_payment_ajax_endpoint',
                    form_id: this.form.id,
                    route: 'get_form_settings'
                })
                    .then(response => {
                        this.settings = response.data.settings;
                        this.currencies = response.data.currencies;
                        this.payment_methods = response.data.payment_methods;
                        this.addressFields = response.data.addressFields;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            saveSettings() {
                this.saving = true;
                FluentFormsGlobal.$post({
                    action: 'fluentform_handle_payment_ajax_endpoint',
                    form_id: this.form.id,
                    route: 'save_form_settings',
                    settings: this.settings
                })
                    .then(response => {
                        this.$success(response.data.message);
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.saving = false;
                    });
            }
        },
        mounted() {
            this.getSettings();
            jQuery('head title').text('Payment Settings - Fluent Forms');
        }
    }
</script>
