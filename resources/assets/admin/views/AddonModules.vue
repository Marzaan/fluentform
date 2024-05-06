<template>
    <div class="add_on_modules">
        <div class="modules_header mb-5">
            <h4 class="title mb-2">
                {{ $t('Fluent Forms Modules') }}
            </h4>
            <p class="text">{{ $t('Here is the list of all Fluent Forms modules. You can enable or disable the modules based on your need.') }}</p>
        </div>
        <div class="modules_body">
            <el-row class="mb-3" :gutter="24">
                <el-col :span="18">
                    <div class="ff_module_selectors">
                        <el-radio-group class="ff_radio_group" v-model="module_type">
                            <el-radio-button label="all">{{ $t('All') }}</el-radio-button>
                            <el-radio-button label="crm">{{ $t('CRM & SASS Integrations') }}</el-radio-button>
                            <el-radio-button label="wp_core">{{ $t('WP Core Modules') }}</el-radio-button>
                        </el-radio-group>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="ff_mdoules_search">
                        <el-input :placeholder="$t('Search Modules')" v-model="search" class="el-input-gray-light" prefix-icon="el-icon-search"></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="24">
                <el-col :md="12" :lg="8" v-for="(addon, addonKey) in filteredAddons" :key="addonKey">
                    <div class="ff_card ff_card_s2 h-100" :class="'ff_addon_enabled_' + addon.enabled">
                        <div class="ff_card_body mb-4">
                            <div class="ff_media_group mb-3">
                                <div class="ff_media_head">
                                    <div class="ff_icon_btn dark-soft md square">
                                        <img v-if="addon.logo" :src="addon.logo" />
                                    </div>
                                </div>
                                <div class="ff_media_body">
                                    <h4>{{addon.title}}</h4>
                                </div>
                            </div><!-- .ff_media_group -->
                            <p class="text">{{addon.description}}</p>
                        </div><!-- .ff_card_body -->
                        <div class="ff_card_footer">
                            <div class="ff_card_footer_group">
                                <template v-if="addon.purchase_url">
                                    <a class="el-button el-button--primary el-button--soft el-button--small" rel="noopener" :href="addon.purchase_url" target="_blank">{{ $t('Upgrade To Pro') }}</a>
                                </template>
                                <div v-else class="d-flex items-center">
                                     <el-switch
                                        @change="saveStatus(addonKey)"
                                        active-value="yes"
                                        inactive-value="no"
                                        v-model="addon.enabled"
                                    />
                                    <span class="ml-2 fs-15">
                                        {{addon.enabled == 'yes' ? $t('Enabled') : $t('Disabled')}}
                                    </span>
                                </div>
                                <a style="font-size: 22px;" class="text-secondary" v-if="addon.config_url && addon.enabled == 'yes'" :href="addon.config_url">
                                    <i class="el-icon-setting"></i>
                                </a>
                            </div>
                        </div><!-- .ff_card_footer -->
                    </div>
                </el-col>
            </el-row>
            <div style="text-align: center" v-if="is_no_modules">
                <h3>{{ $t('Sorry! No modules found based on your filter') }}</h3>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    import each from 'lodash/each';
    import isEmpty from 'lodash/isEmpty';

    export default {
        name: 'fluent_addon_modules',
        data() {
            return {
                search: '',
                addOns: window.fluent_addon_modules.addons,
                has_pro: window.fluent_addon_modules.has_pro,
                module_type: 'all'
            }
        },
        computed: {
            filteredAddons() {
                let addons = window.fluent_addon_modules.addons;
                if(this.search) {
                    let filteredAddons = {};
                    each(addons, (addOn, addOnKey) => {
                        let obString = JSON.stringify(addOn);
                        if(obString.toLowerCase().indexOf(this.search.toLowerCase()) !== -1) {
                            filteredAddons[addOnKey] = addOn;
                        }
                    });
                    addons = filteredAddons;
                }

                if(this.module_type != 'all') {
                    let filteredAddons = {};
                    each(addons, (addOn, addOnKey) => {
                       if(addOn.category == this.module_type) {
                           filteredAddons[addOnKey] = addOn;
                       }
                    });
                    addons = filteredAddons;
                }
                return addons;
            },
            is_no_modules() {
                return isEmpty(this.filteredAddons);
            }
        },
        methods: {
            saveStatus(addonKey) {

                // let addonModules = {};
                // jQuery.each(this.addOns, (key, addon) => {
                //     addonModules[key] = addon.enabled;
                // });
                // delete this later
                const url = FluentFormsGlobal.$rest.route('updateGlobalIntegrationStatus');
                FluentFormsGlobal.$rest.post(url, {
                        module_key: addonKey,
                        module_status: this.addOns[addonKey].enabled
                    })
                    .then((response) => {
                        this.$success(response.message)
                    })
                    .catch(error => {
                        this.$fail(error.message);
                    })
            }
        }
    }
</script>
