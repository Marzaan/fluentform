<template>
    <!--confirmation settings form-->
    <div class="ff-add-confirmation-wrap">
        <!--Confirmation Type-->
        <el-form-item class="ff-form-item">
            <template slot="label">
                {{ $t('Confirmation Type') }}

                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                    <div slot="content">
                        <p>
                            {{ $t('Choose the type of redirection after form submission.') }}
                        </p>
                    </div>

                    <i class="ff-icon ff-icon-info-filled text-primary" />
                </el-tooltip>
            </template>

            <el-radio 
                v-for="(redirectOption, optionName) in redirectToOptions"
                v-model="confirmation.redirectTo" 
                :label="$t(optionName)"
                border 
                :key="optionName"
            >
                {{ redirectOption }}
            </el-radio>

            <error-view field="redirectTo" :errors="errors" />
        </el-form-item>

        <!--Additional fields based on the redirect to selection-->
        <!--Same page-->
        <template v-if="confirmation.redirectTo === 'samePage'">
            <!--Message to show-->
            <el-form-item class="ff-form-item">
                <template slot="label">
                    {{ $t('Message to show') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Enter the text you would like the user to see on the confirmation page of this form.') }}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary" />
                    </el-tooltip>
                </template>

                <wp-editor :height="150" :editor-shortcodes="emailBodyeditorShortcodes" v-model="confirmation.messageToShow" />
            </el-form-item>

            <!--After form submission behavior-->
            <el-form-item class="ff-form-item">
                <template slot="label">
                    {{ $t('After Form Submission') }}

                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Select the behavior after form submission, whether you want to hide or reset the form.')}}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                    </el-tooltip>
                </template>

                <el-radio v-model="confirmation.samePageFormBehavior"
                            label="hide_form" border>{{ $t('Hide Form') }}
                </el-radio>

                <el-radio v-model="confirmation.samePageFormBehavior"
                            label="reset_form" border>{{ $t('Reset Form') }}
                </el-radio>
            </el-form-item>
        </template>

        <!--Custom page-->
        <el-form-item 
            v-else-if="confirmation.redirectTo === 'customPage'"
            class="conditional-items ff-form-item" 
            :class="errors.has('customPage') ? 'is-error' : ''"
        >
            <template slot="label">
                {{ $t('Select Page') }}

                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                    <div slot="content">
                        <p>
                            {{ $t('Select the page you would like the user to be redirected to after they have submitted the form.') }}
                        </p>
                    </div>

                    <i class="ff-icon ff-icon-info-filled text-primary" />
                </el-tooltip>
            </template>

            <el-select class="w-100" v-model="confirmation.customPage" filterable placeholder="Select">
                <el-option
                    v-for="page in pages"
                    :key="page.ID"
                    :label="page.post_title"
                    :value="page.ID"
                />
            </el-select>

            <error-view field="customPage" :errors="errors" />
        </el-form-item>

        <!--Custom URL-->
        <el-form-item 
            class="conditional-items ff-form-item" 
            :class="errors.has('customUrl') ? 'is-error' : ''" 
            v-else-if="confirmation.redirectTo === 'customUrl'"
        >
            <template slot="label">
                {{ $t('Custom URL') }}

                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                    <div slot="content">
                        <p>
                            {{ $t('Enter the URL of the webpage you would like the user to be redirected to after they have submitted the form.')}}
                        </p>
                    </div>

                    <i class="ff-icon ff-icon-info-filled text-primary" />
                </el-tooltip>
            </template>

            <input-popover 
                fieldType="text"
                :placeholder="$t('Redirect URL')"
                v-model="confirmation.customUrl"
                :data="inputsFirstShortcodes"
            ></input-popover>

            <error-view field="customUrl" :errors="errors" />
        </el-form-item>


        <!-- Redirection Message to show-->

        <template v-if="confirmation.redirectTo === 'customPage' || confirmation.redirectTo === 'customUrl'">
            <el-form-item :label="$t('Redirect Query String')" class="conditional-items ff-form-item">
                <el-checkbox v-model="confirmation.enable_query_string" true-label="yes" false-label="no">
                    {{ $t('Pass Field Data Via Query String') }}
                </el-checkbox>
                <div class="mt-3" v-if="confirmation.enable_query_string == 'yes'">
                    <input-popover
                        fieldType="text"
                        :placeholder="$t('Redirect Query String')"
                        v-model="confirmation.query_strings"
                        :data="inputsFirstShortcodes"
                    ></input-popover>
                    <p class="mt-1 fs-14"><em>{{ $t('Sample:') }} phone={inputs.phone}&email={inputs.email}</em></p>
                </div>
            </el-form-item>

            <el-form-item class="ff-form-item">
                <template slot="label">
                    {{ $t('Redirection Message') }}
                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                        <div slot="content">
                            <p>
                                {{ $t('Enter the text you would like the user to see on the confirmation page when redirecting.')}}
                            </p>
                        </div>

                        <i class="ff-icon ff-icon-info-filled text-primary" />
                    </el-tooltip>
                </template>

                <wp-editor :height="100" :editor-shortcodes="emailBodyeditorShortcodes" v-model="confirmation.redirectMessage" />
            </el-form-item>

        </template>

    </div>
</template>

<script type="text/babel">
    import wpEditor from '../../../../common/_wp_editor.vue';
    import errorView from '../../../../common/errorView.vue';
    import inputPopover from '../../input-popover.vue';

    export default {
        name: 'AddConfirmation',
        components: {
            wpEditor,
            errorView,
            inputPopover
        },
        props: ['pages', 'editorShortcodes', 'confirmation', 'errors'],
        computed: {
            inputsFirstShortcodes() {
                return _ff.cloneDeep( this.editorShortcodes );
            },
            emailBodyeditorShortcodes() {
                const freshCopy = _ff.cloneDeep(this.editorShortcodes);
                if (freshCopy && freshCopy.length) {
                    freshCopy[0].shortcodes = {
                        ...freshCopy[0].shortcodes,
                        '{all_data}': 'All Data',
                        '{all_data_without_hidden_fields}': 'All Data Without Hidden Fields'
                    };
                }
                return freshCopy;
            }
        },
        data() {
            return {
                redirectToOptions: {
                    samePage: 'Same Page',
                    customPage: 'To a Page',
                    customUrl: 'To a Custom URL'
                },
            }
        }
    }
</script>
