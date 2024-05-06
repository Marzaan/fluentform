<template>
    <el-form @submit.native.prevent="checkEnter" ref="form-bottom" label-position="top">
        <!--Limit Number of Entries-->
        <div class="el-form-item-wrap">
            <el-form-item class="ff-form-item ff-form-item-flex">
                <div slot="label" style="width: 390px;">
                    {{ $t('Maximum Number of Entries') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Enter a number in the input box below to limit the number of entries allowed for this form. The form will become inactive when that number is reached.')}}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                    </el-tooltip>
                </div>

                <el-switch class="el-switch-lg" v-model="form.limitNumberOfEntries.enabled"></el-switch>
            </el-form-item>

            <!--Additional fields when limit number of entries enabled-->
            <transition name="slide-down">
                <div v-if="form.limitNumberOfEntries.enabled" class="conditional-items">
                    <el-form-item class="ff-form-item" :label="$t('Maximum Entries')">
                        <el-row :gutter="24">
                            <el-col :md="8">
                                <el-input-number
                                    class="w-100"
                                    :min="0"
                                    v-model="form.limitNumberOfEntries.numberOfEntries"
                                ></el-input-number>
                            </el-col>
                            <el-col :md="8">
                                <el-select class="w-100" v-model="form.limitNumberOfEntries.period">
                                    <el-option v-for="(label, period) in entryPeriodOptions" :key="period"
                                            :label="$t(label)" :value="period"
                                    ></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-form-item class="ff-form-item" :label="$t('Message Shown on Reaching Max Entries')" key="limit-reached-msg">
                        <el-input v-model="form.limitNumberOfEntries.limitReachedMsg" type="textarea"></el-input>
                    </el-form-item>
                </div>
            </transition>
        </div><!-- .el-form-item-wrap -->

         <!--Schedule Form-->
        <div class="el-form-item-wrap">
            <el-form-item class="ff-form-item ff-form-item-flex">
                <div slot="label" style="width: 390px;">
                    {{ $t('Form Scheduling') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Schedule a time period the form is active.') }}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                    </el-tooltip>
                </div>

                <el-switch class="el-switch-lg" v-model="form.scheduleForm.enabled"></el-switch>
            </el-form-item>

            <!--Additional fields when form sheduling enabled-->
            <transition name="slide-down">
                <div v-if="form.scheduleForm.enabled" class="conditional-items">
                    <el-form-item class="ff-form-item" :label="$t('Select Weekdays')" v-if="form.scheduleForm.enabled">
                        <div class="mb-3">
                            <el-checkbox
                                :indeterminate="isIndeterminate"
                                v-model="checkAllWeekday"
                                @change="handleCheckAllChange"
                            >
                                {{ $t('Check all') }}
                            </el-checkbox>
                        </div>

                        <el-checkbox-group v-model="selectedDays">
                            <el-checkbox
                                v-for="weekday in weekdays"
                                :key="weekday"
                                @change="handleCheckedDayChange"
                                :label="$t(weekday)"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <div class="el-form-item-wrap">
                        <el-row :gutter="24">
                            <el-col :md="12">
                                <el-form-item
                                    class="ff-form-item"
                                    :label="$t('Submission Starts')"
                                    v-if="form.scheduleForm.enabled"
                                >
                                    <el-date-picker
                                        class="w-100"
                                        v-model="form.scheduleForm.start"
                                        type="datetime"
                                        :placeholder="$t('Select date and time')"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :md="12">
                                <el-form>
                                    <el-form-item class="ff-form-item" :label="$t('Submission Ends')">
                                        <el-date-picker
                                            class="w-100"
                                            v-model="form.scheduleForm.end"
                                            type="datetime"
                                            :placeholder="$t('Select date and time')"
                                            :picker-options="datePickerOptions"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-col>
                        </el-row>
                    </div>

                    <el-form-item class="ff-form-item" :label="$t('Form Waiting Message')">
                        <el-input v-model="form.scheduleForm.pendingMsg" type="textarea"></el-input>
                    </el-form-item>

                    <el-form-item class="ff-form-item" :label="$t('Form Expired Message')">
                        <el-input v-model="form.scheduleForm.expiredMsg" type="textarea"></el-input>
                    </el-form-item>
                </div>
            </transition>
        </div><!-- .el-form-item-wrap -->

        <hr class="mb-4 mt-4">

        <!--Require user to be logged in-->
        <div class="el-form-item-wrap">
            <h5 class="mb-3">{{ $t('Login Requirement Settings') }}</h5>
            <el-form-item class="ff-form-item ff-form-item-flex">
                <div slot="label" style="width: 390px;">
                    {{ $t('Require user to be logged in') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Check this option to require a user to be logged in to view this form.')}}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                    </el-tooltip>
                </div>

                <el-switch class="el-switch-lg" v-model="form.requireLogin.enabled"></el-switch>
            </el-form-item>

            <!--Additional fields when user logged in is enabled-->
            <transition name="slide-down">
                <div v-if="form.requireLogin.enabled" class="conditional-items">
                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Require Login Message') }}

                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enter a message to be displayed to users who are not logged in (shortcodes and HTML are supported).') }}
                                    </p>
                                </div>

                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>
                        <el-input type="textarea" v-model="form.requireLogin.requireLoginMsg"></el-input>
                    </el-form-item>
                </div>
            </transition>
        </div><!-- .el-form-item-wrap -->

        <hr class="mb-4 mt-4">

        <!--Allow empty form submission-->
        <div class="el-form-item-wrap">
            <h5 class="mb-3">{{ $t('Empty Submission Blocking') }}</h5>
            <el-form-item class="ff-form-item ff-form-item-flex">
                <div slot="label" style="width: 390px;">
                    {{ $t('Deny empty submission') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Enabling this won\'t allow users to submit empty forms when there are no required form fields.') }}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                    </el-tooltip>
                </div>

                <el-switch class="el-switch-lg" v-model="form.denyEmptySubmission.enabled"></el-switch>
            </el-form-item>

            <!--Additional fields when empty form submission is not allowed-->
            <transition name="slide-down">
                <div v-if="form.denyEmptySubmission.enabled" class="conditional-items">
                    <el-form-item class="ff-form-item">
                        <template slot="label">
                            {{ $t('Message Shown Against on Empty Submission') }}

                            <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                <div slot="content">
                                    <p>
                                        {{ $t('Enter a message to be displayed to users when they try to submit an empty form.')}}
                                    </p>
                                </div>

                                <i class="ff-icon ff-icon-info-filled text-primary"></i>
                            </el-tooltip>
                        </template>

                        <el-input type="textarea" v-model="form.denyEmptySubmission.message"></el-input>
                    </el-form-item>
                </div>
            </transition>
        </div><!-- .el-form-item -->

        <hr class="mb-4 mt-4">
        <!--Restrict form based on ip, country and keywords-->
        <div class="el-form-item-wrap">
            <h5 class="mb-3">{{ $t('Restrict Form') }}</h5>
            <el-form-item class="ff-form-item ff-form-item-flex">
                <div slot="label" style="width: 390px;">
                    {{ $t('Restrict Form Submission') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Enable this restriction or allow users to submit forms depending on the selected condition.') }}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                    </el-tooltip>
                </div>

                <el-switch class="el-switch-lg" v-model="form.restrictForm.enabled"></el-switch>
            </el-form-item>

            <transition name="slide-down">
                <el-form-item v-if="form.restrictForm.enabled" class="conditional-items">
                    <div v-if="hasFluentformPro">
                        <el-checkbox v-model="form.restrictForm.fields.ip.status">
                            {{ $t('IP Based Restriction') }}
                        </el-checkbox>
                        <div v-if="form.restrictForm.fields.ip.status && form.restrictForm.enabled" class="conditional-items mb-6">
                            <div v-if="isIpInfoActive">
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Add IP Address') }}

                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Add multiple IP address separated by comma to restrict submission.') }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <el-input v-model="form.restrictForm.fields.ip.values"></el-input>
                                </el-form-item>

                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('IP Address Restriction Error Message') }}

                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Set error message when IP address is invalid.') }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <el-input type="textarea" v-model="form.restrictForm.fields.ip.message"></el-input>
                                </el-form-item>

                                <el-form-item class="ff-form-item">
                                    <el-radio-group class="mb-3" v-model="form.restrictForm.fields.ip.validation_type">
                                        <el-radio label="fail_on_condition_met">{{ $t('Fail the submission if match')}}</el-radio>
                                        <el-radio label="success_on_condition_met">{{ $t('Allow the submission if match') }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <p class="ff_tips_warning">{{ $t('Please setup your geolocation IP token from global settings.') }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-if="hasFluentformPro">
                        <el-checkbox v-model="form.restrictForm.fields.country.status">
                            {{ $t('Country Based Restriction') }}
                        </el-checkbox>
                        <div v-if="form.restrictForm.fields.country.status && form.restrictForm.enabled" class="conditional-items mb-6">
                            <div v-if="isIpInfoActive">
                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Select Country') }}

                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Select country to set restriction.') }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>
                                    <el-select filterable v-model="form.restrictForm.fields.country.values" multiple class="w-100">
                                        <el-option
                                            v-for="(value, key) in getCountries"
                                            :key="key"
                                            :label="value"
                                            :value="key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item class="ff-form-item">
                                    <template slot="label">
                                        {{ $t('Country Restriction Error Message') }}

                                        <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                            <div slot="content">
                                                <p>
                                                    {{ $t('Set error message when selected country is restricted.') }}
                                                </p>
                                            </div>

                                            <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                        </el-tooltip>
                                    </template>

                                    <el-input type="textarea" v-model="form.restrictForm.fields.country.message"></el-input>
                                </el-form-item>

                                <el-form-item class="ff-form-item">
                                    <el-radio-group class="mb-3" v-model="form.restrictForm.fields.country.validation_type">
                                        <el-radio label="fail_on_condition_met">{{ $t('Fail the submission if match')}}</el-radio>
                                        <el-radio label="success_on_condition_met">{{ $t('Allow the submission if match') }}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <p class="ff_tips_warning">{{ $t('Please setup your geolocation IP token from global settings.') }}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <el-checkbox v-model="form.restrictForm.fields.keywords.status">
                            {{ $t('Keyword Based Restriction') }}
                        </el-checkbox>
                        <div v-if="form.restrictForm.fields.keywords.status && form.restrictForm.enabled" class="conditional-items">
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Add Keywords') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Add multiple keywords separated by comma to restrict submission.') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input v-model="form.restrictForm.fields.keywords.values"></el-input>
                            </el-form-item>

                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Keywords Restriction Error Message') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Set error message when keywords are invalid.') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input type="textarea" v-model="form.restrictForm.fields.keywords.message"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </el-form-item>
            </transition>
        </div>
    </el-form>
</template>

<script>
    import Notice from "@/admin/components/Notice/Notice.vue";

    export default {
        name: 'FormRestrictions',
        components: {Notice},
        props: {
            data: {
                required: true
            },
            hasPro: {
                required: true,
                type: Boolean
            }
        },
        data() {
            return {
                isIndeterminate: false,
                checkAllWeekday:'',
                selectedDays:[],
                weekdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                entryPeriodOptions: {
                    total: 'Total Entries',
                    day: 'Per Day',
                    week: 'Per Week',
                    month: 'Per Month',
                    year: 'Per Year',
                    per_user_ip: 'Per User (IP Address Based)',
                    per_user_id: 'Per User (Logged in ID based)'
                },
                datePickerOptions: {
                    shortcuts: [
                        {
                            text: 'Today',
                            onClick(picker) {
                                picker.$emit('pick', new Date());
                            }
                        },
                        {
                            text: this.$t('Yesterday'),
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24);
                                picker.$emit('pick', date);
                            }
                        },
                        {
                            text: this.$t('A week ago'),
                            onClick(picker) {
                                const date = new Date();
                                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', date);
                            }
                        }
                    ]
                }
            }
        },
        methods: {
            handleCheckAllChange(val) {
                this.selectedDays = val ? this.weekdays : [];
                this.form.scheduleForm.selectedDays = this.selectedDays;
                this.isIndeterminate = false;
            },
            handleCheckedDayChange(value) {

                let checkedCount = this.selectedDays.length;
                this.checkAllWeekday = checkedCount === this.weekdays.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekdays.length;
                this.form.scheduleForm.selectedDays = this.selectedDays;

            },
            checkEnter() {
            }
        },
        mounted() {
            //if weekdays is not set initially select all weekday
            if(!this.form.scheduleForm.selectedDays){
                this.form.scheduleForm.selectedDays = this.weekdays;
            }
            this.selectedDays    = this.form.scheduleForm.selectedDays ;
            this.checkAllWeekday = this.selectedDays.length === this.weekdays.length;

        },
        computed: {
            form() {
                return this.data;
            },
            getCountries() {
                return window.FluentFormApp.countries;
            },
            isIpInfoActive() {
                return !!window.FluentFormApp.getIpInfo?.length;
            },
            hasFluentformPro() {
                return !!window.FluentFormApp.hasPro;
            }

        }
    }
</script>
