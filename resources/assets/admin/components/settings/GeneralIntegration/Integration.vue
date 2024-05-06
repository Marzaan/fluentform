<template>
    <div class="ff_form_integrations">
        <card>
            <card-head>
                <card-head-group class="justify-between">
                    <h5 class="title">{{ $t('All Form Integrations') }}</h5>
                    <div v-if="!isEmpty(available_integrations)" class="action-buttons">
                        <el-dropdown @command="add" :hide-on-click="false" trigger="click">
                            <el-button type="info" size="medium">
                                {{ $t('Add New Integration') }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu class="ff-dropdown-menu" slot="dropdown" style="max-height: 400px; overflow: auto">
                                <el-dropdown-item>
                                    <el-input @click.prevent autofocus v-model="search" :placeholder="$t('Search Integration')"></el-input>
                                </el-dropdown-item>
                                <el-dropdown-item v-for="(integration,integration_name) in filteredList" :key="integration_name" :command="integration_name">{{integration.title}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </card-head-group>
            </card-head>
            <card-body>
                <div v-if="has_pro && isEmpty(available_integrations) && !loading" class="text-center">
                    <p style="font-size: 16px; margin-bottom: 20px; max-width: 760px; margin-left: auto; margin-right: auto;">
                        {{ $t(this.integrationsResource.instruction) }}
                    </p>
                     <a class="el-button el-button--primary el-dropdown-selfdefine" :href="all_module_config_url">
                        {{ $t('Configure Modules') }}
                    </a>
                </div>

                <!-- GetResponse Feeds Table: 1 -->
                <div class="ff-table-container">
                    <el-skeleton :loading="loading" animated :rows="6">
                        <el-table v-if="!isEmpty(available_integrations)" :data="integrations">
                            <template slot="empty">
                                <div class="getting_started_message" style="padding-top: 16px; padding-bottom: 10px;">
                                    <p>{{ $t('You haven\'t added any integration feed yet. Add new integration to connect your favourite tools with your forms') }}</p>
                                </div>
                            </template>
                            <el-table-column width="180" :label="$t('Status')">
                                <template slot-scope="scope">
                                    <span class="mr-3" v-if="scope.row.enabled">{{$t('Enabled')}}</span>
                                    <span class="mr-3" v-else style="color:#fa3b3c;">{{ $t('Disabled') }}</span>
                                    <el-switch
                                        active-color="#00b27f"
                                        @change="handleActive(scope.row)"
                                        v-model="scope.row.enabled">
                                    </el-switch>
                                </template>
                            </el-table-column>

                            <el-table-column width="180" :label="$t('Integration')">
                                <template slot-scope="scope">
                                    <img v-if="scope.row.provider_logo" class="general_integration_logo" :src="scope.row.provider_logo" :alt="scope.row.provider" />
                                    <span class="general_integration_name" v-else>{{scope.row.provider}}</span>
                                </template>
                            </el-table-column>


                            <el-table-column :label="$t('Title')">
                                <template slot-scope="scope">
                                    {{scope.row.name}}
                                </template>
                            </el-table-column>

                            <el-table-column width="130" :label="$t('Actions')" class-name="action-buttons">
                                <template slot-scope="scope">
                                    <btn-group size="sm">
                                        <btn-group-item>
                                            <el-button
                                                class="el-button--soft el-button--icon"
                                                @click="edit(scope.row)"
                                                type="success"
                                                icon="ff-icon-setting"
                                                size="small">
                                            </el-button>
                                        </btn-group-item>
                                        <btn-group-item>
                                            <remove @on-confirm="remove(scope.row.id, scope)">
                                                <el-button
                                                    class="el-button--soft el-button--icon"
                                                    size="small"
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
                </div><!-- .ff-table-container -->

                <p v-if="has_pro && !integrations.length" class="text-center">
                    <a :href="all_module_config_url">{{$t('Check Global Integration Settings')}}</a>
                    <a style="margin-left: 20px" target="_blank" rel="noopener" href="https://wpmanageninja.com/docs/fluent-form/integrations-available-in-wp-fluent-form/">
                        {{ $t('View Documentations') }}
                    </a>
                </p>

                <div v-if="!has_pro" class="upgrade_to_pro text-center mt-4" style="max-width: 750px; margin: auto;">
                    <p style="font-size: 16px;" class="mb-4">
                        {{ $t(this.integrationsResource.instruction) }}
                    </p>

                    <btn-group>
                        <btn-group-item>
                            <a class="el-button el-button--primary el-dropdown-selfdefine" :href="upgrade_url">
                                {{ $t('Upgrade to PRO') }}
                            </a>
                        </btn-group-item>
                        <btn-group-item>
                            <a class="el-button el-button--default" :href="integrationsResource.list_url">
                                {{ $t('See All Integrations') }}
                            </a>
                        </btn-group-item>
                    </btn-group>

                    <img class="mt-6" :src="integrationsResource.asset_url" alt="integrations asset" />
                </div>
            </card-body>
        </card>
    </div>
</template>

<script>
    import remove from '../../confirmRemove.vue';
    import isEmpty from 'lodash/isEmpty';
    import Card from '@/admin/components/Card/Card.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';

    export default {
        name: 'generalSettings',
        props: ['form_id', 'inputs', 'has_pro', 'editorShortcodes'],
        components: {
            remove,
            Card,
            CardHead,
            CardBody,
            BtnGroup,
            BtnGroupItem,
            CardHeadGroup
        },
        data() {
            return {
                search: '',
                loading: true,
                integrations: [],
                errors: new Errors,
                available_integrations: {},
                all_module_config_url: '',
                instruction: "Fluent Forms Pro has tons of integrations to take your forms to the next level. From payment gateways to quiz building, SMS notifications to email marketing - you'll get integrations for various purposes. Even if you don't find your favorite tools, you can integrate them easily with Zapier.",
                integrationsAsset: window.FluentFormApp.integrations_asset_url,
                upgrade_url: window.FluentFormApp.upgrade_url,
                integrations_url: window.FluentFormApp.integrations_url,
                integrationsResource: window.FluentFormApp.integrationsResource,
            }
        },
        methods: {
            add(integration_name) {
                if (!integration_name) {
                    return;
                }
                let integration = this.available_integrations[integration_name];

                if(!integration.is_active) {
                    // Handle Inactive state
                    this.$confirm(integration.configure_message, integration.configure_title, {
                        confirmButtonText: integration.configure_button_text,
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        window.location.href = integration.global_configure_url;
                        return;
                    }).catch(() => {

                    });
                    return;
                }

                this.$router.push({
                    name: 'edit_integration',
                    params: {
                        integration_id: 0,
                        integration_name: integration_name
                    }
                });
                return;
            },
            edit(integration) {
                this.$router.push({
                    name: 'edit_integration',
                    params: {
                        integration_id: integration.id,
                        integration_name: integration.provider
                    }
                });
            },
            handleActive(row) {
                let data = {
                    form_id: this.form_id,
                    status: row.enabled,
                    integration_id: row.id,
                };

                this.errors.clear();

                this.saving = true;

                const url = FluentFormsGlobal.$rest.route('updateFormIntegrationSettings',this.form_id);

                FluentFormsGlobal.$rest.post(url,data)
                    .then(response => {
                        if(response.created) {
                            this.$router.push({
                                name: 'allIntegrations'
                            });
                        }
                        this.$success(response.message);
                    })
                    .catch((error) => {
                        const message = error?.message || error?.data?.message
                        this.$fail(message);
                    })
                    .finally(() => this.saving = false);
            },
            remove(feed_id, scope) {
                const url = FluentFormsGlobal.$rest.route('deleteFormIntegration', this.form_id);
                let $index  = scope.$index;
                let data = {
                    integration_id: feed_id,
                    form_id: this.form_id
                };
                this.deleting = true;
                FluentFormsGlobal.$rest.delete(url,data)
                    .then(response => {
                        this.$success(response.message);
                        this.integrations.splice($index, 1);
                    })
                    .catch((error) => {
                        const message = error?.message || error?.data?.message
                        this.$fail(message);
                    })
                    .finally(()=>{});

            },
            getFeeds() {
                this.loading = true;

                const url = FluentFormsGlobal.$rest.route('getIntegrations', this.form_id);
                FluentFormsGlobal.$rest.get(url)
                    .then(response => {
                        this.integrations = response.feeds;
                        this.available_integrations = response.available_integrations;
                        this.all_module_config_url = response.all_module_config_url;
                        // this.$success(response.message);
                    })
                    .catch(error => {
                        console.log(error)
                        this.errors.record(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });

            },
            isEmpty
        },
        computed: {
            filteredList() {
                let filteredList = {};
                Object.keys(this.available_integrations).map(key => {
                    if (key.toLowerCase().includes(this.search.toLowerCase())) {
                        filteredList[key] = this.available_integrations[key];
                    }
                });
                return filteredList;
            }

        },
        beforeMount() {
            this.getFeeds();
        },
        beforeCreate() {
            jQuery('head title').text('Form Integrations - Fluent Forms');
        }
    }
</script>


