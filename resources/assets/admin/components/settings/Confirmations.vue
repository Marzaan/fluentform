<template>
    <div class="ff_other_confirmation">
        <!-- Confirmation Item Editor -->
        <el-form label-position="top">
            <card>
                <card-head>
                    <card-head-group class="justify-between">
                        <h5 class="title">{{ $t('Conditional Confirmations') }}</h5>
                        <btn-group>
                            <btn-group-item>
                                <video-doc btn_size="medium" :btn_text="$t('Learn More')" route_id="otherConfirmationSettings"/>
                            </btn-group-item>
                            <btn-group-item>
                                <el-button class="el-button--soft" v-if="selected" type="info" size="medium" @click="discard" icon="ff-icon ff-icon-arrow-left">
                                    {{ $t('Back') }}
                                </el-button>
                                <template v-else>
                                    <el-button v-if='has_pro' @click="add" type="info" size="medium" icon="ff-icon ff-icon-plus">
                                        {{ $t('Add Confirmation') }}
                                    </el-button>
                                </template>
                            </btn-group-item>
                        </btn-group>
                    </card-head-group>
                </card-head>
                <card-body>
                    <template v-if="has_pro">
                        <!-- Confirmation Items Table -->
                        <div class="ff-table-container" v-if="!selected">
                            <el-skeleton :loading="confLoading" animated :rows="6">
                                <el-table :data="confirmations">
                                    <el-table-column width="180" :label="$t('Status')">
                                        <template slot-scope="scope">
                                            <span class="mr-3" v-if="scope.row.active">{{$t('Enabled')}}</span>
                                            <span class="mr-3 text-danger" v-else>{{ $t('Disabled') }}</span>
                                            <el-switch
                                                :width="40"
                                                @change="handleActive(scope.$index)"
                                                v-model="scope.row.active"
                                            ></el-switch>
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="name" :label="$t('Name')" width="180" class-name="content-ellipsis"></el-table-column>

                                    <el-table-column :label="$t('Content')" class-name="content-ellipsis">
                                        <template slot-scope="scope">
                                            <template v-if="scope.row.redirectTo === 'samePage'">
                                                <span v-html="$t(scope.row.messageToShow)"></span>
                                            </template>

                                            <template v-else-if="scope.row.redirectTo === 'customUrl'">
                                                <span v-html="scope.row.customUrl"></span>
                                            </template>

                                            <template v-else>
                                                <span class="page" v-html="getPageUrl(scope.row.customPage)"></span>
                                            </template>
                                        </template>
                                    </el-table-column>

                                    <el-table-column width="120" :label="$t('Actions')" class-name="action-buttons">
                                        <template slot-scope="scope">
                                            <ul class="ff_btn_group sm">
                                                <li>
                                                    <el-tooltip class="item" :content="$t('Duplicate notification settings')" placement="top">
                                                        <el-button
                                                            class="el-button--icon"
                                                            @click="clone(scope.$index)"
                                                            type="primary"
                                                            icon="el-icon-plus"
                                                            size="mini"
                                                        ></el-button>
                                                    </el-tooltip>
                                                </li>
                                                <li>
                                                    <el-button
                                                        class="el-button--icon"
                                                        @click="edit(scope.$index)"
                                                        type="success"
                                                        icon="el-icon-setting"
                                                        size="mini"
                                                    ></el-button>
                                                </li>
                                                <li>
                                                    <remove @on-confirm="remove(scope.$index, scope.row.id)">
                                                        <el-button
                                                            class="el-button--icon"
                                                            size="mini"
                                                            type="danger"
                                                            icon="el-icon-delete"
                                                        />
                                                    </remove>
                                                </li>
                                            </ul>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-skeleton>
                        </div><!-- .ff-table-container -->

                        <template v-if="selected">
                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Confirmation Name') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>{{ $t('The name to identify each confirmation.') }}</p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <el-input v-model="selected.name"></el-input>
                            </el-form-item>

                            <add-confirmation
                                class="mb-4"
                                :errors="errors"
                                :pages="pages"
                                :editorShortcodes="editorShortcodes"
                                :confirmation="selected">
                            </add-confirmation>

                            <el-form-item class="ff-form-item">
                                <template slot="label">
                                    {{ $t('Conditional Logic') }}

                                    <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                        <div slot="content">
                                            <p>
                                                {{ $t('Enable this feed conditionally') }}
                                            </p>
                                        </div>

                                        <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                    </el-tooltip>
                                </template>

                                <FilterFields :fields="inputs" :conditionals="selected.conditionals" :hasPro="has_pro"></FilterFields>
                            </el-form-item>
                        </template>
                    </template>

                    <notice v-else type="danger-soft" class="ff_alert_between">
                        <div>
                            <h6 class="title">{{ $t('You are using the free version of Fluent Forms.') }}</h6>
                            <p class="text">{{ $t('Upgrade to get access to all the advanced features.') }}</p>
                        </div>
                        <a target="_blank" href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree" class="el-button el-button--danger el-button--small">
                            {{ $t('Upgrade to Pro') }}
                        </a>
                    </notice>
                </card-body>
            </card>

            <div v-if="selected">
                <el-button @click="store" type="primary" icon="el-icon-success">{{$t('Save Notification')}}</el-button>
            </div>
        </el-form>
    </div>
</template>

<script type="text/babel">
    import Remove from '../confirmRemove.vue'
    import InputPopover from '../input-popover.vue'
    import FilterFields from './Includes/FilterFields'
    import ErrorView from '@/common/errorView'
    import AddConfirmation from './Includes/AddConfirmation.vue'
    import VideoDoc from '@/common/VideoInstruction.vue';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue'
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue'
    import Notice from '@/admin/components/Notice/Notice.vue'

    export default {
        name: 'Confirmations',
        props: {
            'form': Object,
            'form_id': [Number, String],
            'inputs': {
                type: Object,
                default: {}
            },
            'has_pro': Boolean,
            'editor-shortcodes': {
                type: Array,
                default: []
            }
        },
        components: {
            Remove,
            InputPopover,
            FilterFields,
            ErrorView,
            AddConfirmation,
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
                confLoading: true,
                selected: null,
                selectedIndex: null,
                confirmations: [],
                mock: {
                    name: '',
                    active: true,
                    redirectTo: 'samePage',
                    messageToShow: 'Thank you for your message. We will get in touch with you shortly',
                    customPage: null,
                    samePageFormBehavior: 'hide_form',
                    customUrl: null,
                    conditionals: {
                        status: true,
                        type: 'all',
                        conditions: [
                            {
                                field: null,
                                operator: '=',
                                value: null
                            }
                        ]
                    },
                },
                pages: [],
                errors: new Errors
            }
        },
        methods: {
            add() {
                this.selectedIndex = this.confirmations.length;

                this.selected = _ff.cloneDeep(this.mock);
            },
            clone(index) {
                let freshCopy = _ff.cloneDeep(this.confirmations[index]);

                freshCopy.name = `Copy of ${freshCopy.name}`;
                freshCopy.id = null;

                this.selected = freshCopy;
                this.selectedIndex = this.confirmations.length;
            },
            edit(index) {
                this.selectedIndex = index;

                let confirmation = this.confirmations[index];

                this.selected = _ff.cloneDeep(confirmation);

                this.selected.id = confirmation.id;
            },
            discard() {
                this.selected = null;
                this.selectedIndex = null;
                this.errors.clear();
            },

            handleActive(index) {
                let confirmation = this.confirmations[index];

                let id = confirmation.id;

                delete (confirmation.id);

                let data = {
                    meta_key: 'confirmations',
                    value: JSON.stringify(confirmation),
                    meta_id: id,
                };

                const url = FluentFormsGlobal.$rest.route('storeFormSettings', this.form.id);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        confirmation.id = response.id;

                        let handle = confirmation.active ? 'enabled' : 'disabled';

                        this.$success(this.$t('Successfully ' + handle + ' the confirmation.'));
                    })
                    .catch(e => {});
            },
            remove(index, id) {
                const url = FluentFormsGlobal.$rest.route('deleteFormSettings', this.form.id);

                FluentFormsGlobal.$rest.delete(url, {meta_id: id})
                    .then(response => {
                        this.confirmations.splice(index, 1);

                        this.$success(this.$t('Successfully removed the confirmation.'));
                    })
                    .catch(e => {});
            },

            getPages() {
                const url = FluentFormsGlobal.$rest.route('getFormPages', this.form_id);

                FluentFormsGlobal.$rest.get(url)
                    .then(response => {
                        this.pages = response;
                    })
                    .catch(e => {
                        this.loading = false;
                    })
            },
            getPageUrl(id) {
                let page = this.pages[id];

                return page ? page.url : null;
            },

            fetch() {
                const url = FluentFormsGlobal.$rest.route('getFormSettings', this.form.id);

                FluentFormsGlobal.$rest.get(url, {meta_key: 'confirmations'})
                    .then(response => {
                        this.confirmations = response.map((item) => {
                            const {value, ...rest} = item;
                            return {...rest, ...value};
                        });
                    })
                    .catch(e => {})
                    .finally(_ => this.confLoading = false)
            },
            store() {
                this.errors.clear();

                let id = this.selected.id;

                delete (this.selected.id);

                let data = {
                    meta_key: 'confirmations',
                    value: JSON.stringify(this.selected),
                    meta_id: id,
                };

                const url = FluentFormsGlobal.$rest.route('storeFormSettings', this.form.id);

                FluentFormsGlobal.$rest.post(url, data)
                    .then(response => {
                        this.selected.id = response.id;

                        this.confirmations.splice(this.selectedIndex, 1, this.selected);

                        this.$success(this.$t('Successfully saved the confirmation.'));

                        this.selected = null;

                        this.selectedIndex = null;
                    })
                    .catch(errors => {
                        this.errors.record(errors);

                        this.selected.id = id;
                    });
            }
        },
        beforeMount() {
            this.fetch();
            this.getPages();

            // Back to all notifications by clicking on menu item
            jQuery('[data-hash="conditional_confirmations"]').on('click', this.discard);

            jQuery('head title').text('Other Confirmations - Fluent Forms');

        }
    }
</script>

