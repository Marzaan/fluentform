<template>
    <div class="ff_card entry_submission_order_data">
        <card-head>
            <h6> {{ $t('Subscriptions (Recurring Payments)') }} </h6>
        </card-head>

        <card-body>
            <div
                :key="subscriptionIndex"
                class=""
                v-for="(subscription, subscriptionIndex) in subscriptions"
            >
                <div class="ff_subscription_data">
                    <div class="ff_subscription_data_item">
                        <p class="ff_subscription_data_item_title">
                            {{ subscription.plan_name }}
                            <span class="ff_subscription_data_item_name">
                                ({{ subscription.item_name }})
                            </span>
                            <span class="ff_sub_id">#{{subscription.id}}</span>
                        </p>
                        <div class="ff_subscription_data_item_payment">
                            <span class="pay_amount" v-html="mayBeHandleDiscount(subscription.recurring_amount)"/>
                            <span>/ {{ subscription.billing_interval }}</span><span v-if="subscription.quantity > 1"> x {{subscription.quantity}}</span>
                            <span :class="'ff_badge ff_badge_' + subscription.status">
                                <i :class="getPaymentStatusIcon(subscription.status)"></i> {{ subscription.status }}
                            </span>
                            <span v-show="parseInt(subscription.initial_amount)"> {{ $t('& Signup Fee:') }} <em
                                v-html="formatMoney(subscription.initial_amount)"></em></span>
                        </div>

                        <p class="ff_subscription_data_item_total">
                            <span>{{ $t('Total Bills:')}}</span>
                            <span class="table_payment_amount" v-html="subscription.bill_count"/>
                        </p>
                        <p v-html="subscriptionHumanText(subscription.original_plan)"></p>
                    </div><!-- .ff_subscription_data_item -->
                    <div class="ff_subscription_data_item">
                        <btn-group>
                            <btn-group-item>
                                <a
                                    rel="noopener"
                                    target="_blank"
                                    :href="getSubscriptionUrl(subscription)"
                                    v-show="getSubscriptionUrl(subscription)"
                                    class="el-button el-button--primary el-button--soft el-button--mini"
                                >
                                    {{ $t('View on') }} {{ payment_method }}
                                </a>
                            </btn-group-item>
                            <btn-group-item>
                                <el-button
                                    class="el-button--soft"
                                    @click="cancelSubscription(subscription)"
                                    v-if="subscription.status == 'active' || subscription.status == 'trialling' || subscription.status == 'failing'" size="mini" type="danger">
                                    {{$t('Cancel')}}
                                </el-button>
                            </btn-group-item>
                        </btn-group>
                    </div><!-- .ff_subscription_data_item -->
                </div><!-- .ff_subscription_data -->
                
                <div v-if="subscription && subscription.related_payments" class="payment_head_bottom wpf_entry_order_items">
                    <h3>{{ $t('Related Payments') }}</h3>

                    <table
                        v-if="subscription.related_payments.length"
                        class="wp-list-table widefat table table-bordered striped"
                    >
                        <thead>
                        <tr>
                            <th>{{ $t('Amount') }}</th>
                            <th>{{ $t('Date (GMT)') }}</th>
                            <th></th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr
                            :key="i"
                            v-for="(payment,i) in subscription.related_payments"
                        >
                            <td>
                                    <span
                                        class="table_payment_amount"
                                        v-html="mayBeHandleDiscount(payment.payment_total)"
                                    />

                                <span class="payment_currency">
                                    {{ payment.currency }}
                                </span>

                                <span class="ff_pay_status_badge ff_pay_status_active">
                                    {{ payment.status }}
                                </span>
                            </td>

                            <td>
                                {{ payment.created_at | dateFormat('MMM DD, YYYY h:mm:ss a') }}
                            </td>

                            <td>
                                <a
                                    rel="noopener"
                                    target="_blank"
                                    v-if="payment.action_url"
                                    :href="payment.action_url"
                                    class="el-button el-button--mini"
                                >
                                    <i class="el-icon-view"></i>
                                </a>
                            </td>
                        </tr>

                        <template v-if="discounts.percent">
                            <tr v-for="(payment,i) in subscription.related_payments" :key="i">
                                <td>
                                    {{ $t('Discounts') }}
                                </td>

                                <td>
                                    <span v-html="getDiscountsTotal(payment.payment_total)"/>
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                    <div v-else>
                        <p>
                            {{ $t('All received payments will be shown here. No payments received yet!') }}
                        </p>
                    </div>
                </div>
            </div>
        </card-body>

        <el-dialog
            title="Conform subscription cancelation"
            :visible.sync="sub_cancel_modal"
            v-if="canceling_subscription"
            v-loading="cancelling"
            width="50%">
            <h3>{{ $t('You are about to cancel this subscription') }}</h3>
            <p v-if="payment_method == 'stripe'">{{ $t('This will also ') }} <b>{{ $t('cancel the subscription at stripe.') }}</b>
                {{ $t('So no further payment will be processed') }}</p>
            <div v-else>
                <p>{{payment_method|ucFirst}} {{ $t('payment gateway does not support remote cancellation at this moment.') }}</p>
                <p style="font-weight: bold;">{{ $t('Please cancel the subscription from ') }}{{payment_method}}
                    {{ $t('dashboard too.') }}</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sub_cancel_modal = false">{{ $t('close') }}</el-button>
                <el-button type="primary" @click="confirmCancel()">{{ $t('Yes, Cancel this subscription') }}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
import each from "lodash/each";
import Card from '@/admin/components/Card/Card.vue';
import CardHead from '@/admin/components/Card/CardHead.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';

export default {
    name: "Subscriptions",
    components: {
        Card,
        CardHead, 
        CardBody,
        BtnGroup,
        BtnGroupItem
    },
    props: ['subscriptions', 'discounts', 'payment_method'],
    data() {
        return {
            canceling_subscription: false,
            sub_cancel_modal: false,
            cancelling: false
        }
    },
    methods: {
        mayBeHandleDiscount(amount) {
            if (this.discounts.percent) {
                amount -= amount * (this.discounts.percent / 100)
            }

            return this.formatMoney(amount);
        },

        getSubscriptionUrl(subscription) {
            if (this.payment_method === 'stripe') {
                if (subscription.payment_mode === 'test') {
                    return 'https://dashboard.stripe.com/test/subscriptions/' + subscription.vendor_subscription_id;
                }

                return 'https://dashboard.stripe.com/subscriptions/' + subscription.vendor_subscription_id;
            }
        },

        subscriptionTotal(payments) {
            let total = 0;

            each(payments, (payment) => {
                if (payment.status === 'paid') {
                    total += payment.payment_total;
                }
            });

            return this.mayBeHandleDiscount(total);
        },

        subscriptionHumanText(plan) {
            if (parseInt(plan.bill_times)) {
                return this.$t('Customer will be billed ' + plan.bill_times + ' times in total');
            } else {
                return this.$t('Customer will be billed until cancelled');
            }
        },

        getDiscountsTotal(amount) {
            let discounted = '-';

            if (this.discounts.percent) {
                discounted = amount * (this.discounts.percent / 100);
            }

            return this.formatMoney(discounted);
        },

        cancelSubscription(subscription) {
            this.canceling_subscription = subscription;
            this.sub_cancel_modal = true;
        },
        confirmCancel() {
            this.cancelling = true;
            FluentFormsGlobal.$post({
                action: 'fluentform_handle_payment_ajax_endpoint',
                route: 'cancel_subscription',
                subscription_id: this.canceling_subscription.id,
                form_id: this.canceling_subscription.form_id
            })
                .then((res) => {
                    this.$notify.success(res.data.message);
                    this.$emit('reload_payments');
                    this.canceling_subscription = false;
                    this.sub_cancel_modal = false;
                })
                .catch(errors => {
                    this.$notify.error(errors.responseJSON.data.message);
                })
                .always(() => {
                    this.cancelling = false;
                });
        }
    }
}
</script>
