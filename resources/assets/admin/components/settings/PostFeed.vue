<template>
    <div class="ff_post_feed_wrap">
        <card>
            <card-head>
                <card-head-group class="justify-between">
                    <div>
                        <h5 class="title" v-if="!feed.id">{{ $t('Create New Feed') }}</h5>
                        <h5 class="title" v-else v-html="feedTitleForEdit"></h5>
                    </div>
                    <btn-group>
                        <btn-group-item>
                            <el-button
                                size="medium"
                                type="info"
                                icon="el-icon-arrow-left"
                                @click="$emit('show-post-feeds')"
                            >
                                {{ $t('Back') }}
                            </el-button>
                        </btn-group-item>
                    </btn-group>
                </card-head-group>
            </card-head>
            <card-body>
                <div class="post_feed">
                    <el-form label-position="top">
                        <el-form-item class="ff-form-item" :label="$t('Feed Name')">
                            <el-input class="ff_input_full_width" v-model="feed.value.feed_name"/>
                        </el-form-item>

                        <el-form-item class="ff-form-item" :label="$t('Post Type')">
                            <el-input class="ff_input_full_width" disabled v-model="post_settings.post_info.value.post_type"/>
                        </el-form-item>
                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Submission Type') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t('For post update only one feed is available, if you have more than one feed the first one will work.') }}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>
                            <el-radio-group v-model="feed.value.post_form_type">
                                <el-radio label="new">{{ $t('New Post') }}</el-radio>
                                <el-radio label="update">{{ $t('Update Post') }}</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item class="ff-form-item">
                            <template slot="label">
                                {{ $t('Allow Guest') }}
                                <el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
                                    <div slot="content">
                                        <p>
                                            {{ $t(`Permission guest user to ${isUpdate? 'update' : 'create'} post. If allowed post can be ${isUpdate? 'updatable' : 'creatable'} from logout session.`)}}
                                        </p>
                                    </div>
                                    <i class="ff-icon ff-icon-info-filled text-primary"></i>
                                </el-tooltip>
                            </template>
                            <el-checkbox v-model="feed.value.allowed_guest_user">{{ feed.value.allowed_guest_user ? 'Allowed' : 'Not Allowed' }}</el-checkbox>
                        </el-form-item>

                        <el-row :gutter="24">
                            <el-col :lg="6" style="flex: 1">
                                <el-form-item class="ff-form-item" :label="$t('Post Status')">
                                    <el-select v-model="feed.value.post_status" class="ff_input_full_width">
                                        <el-option
                                            v-for="status in postStatuses"
                                            :key="status"
                                            :value="status"
                                            :label="status | ucFirst"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="6" style="flex: 1">
                                <el-form-item class="ff-form-item" :label="$t('Comment Status')">
                                    <el-select v-model="feed.value.comment_status" class="ff_input_full_width">
                                        <el-option
                                            v-for="status in commentStatuses"
                                            :key="status"
                                            :value="status"
                                            :label="status | ucFirst"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="6" style="flex: 1" v-if="postFormats.length">
                                <el-form-item class="ff-form-item" :label="$t('Post Format')">
                                    <el-select v-model="feed.value.post_format" class="ff_input_full_width">
                                        <el-option
                                            v-for="format in postFormats"
                                            :key="format"
                                            :value="format"
                                            :label="format | ucFirst"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :lg="6" style="flex: 1">
                                <el-form-item class="ff-form-item" v-if="post_settings.post_info.value.post_type == 'post'" :label="('Default Category')">
                                    <el-select clearable v-model="feed.value.default_category" class="ff_input_full_width">
                                        <el-option
                                            v-for="item in categories"
                                            :key="item.category_id"
                                            :value="item.category_id"
                                            :label="item.category_name"
                                        />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <!-- Post Fields Mapping -->
                        <div class="post_fields_mapping">
                            <div class="post_fields_mapping_head">
                                <h6>{{ $t('Post Fields Mapping') }}</h6>
                            </div>
                            <div class="ff-table-container">
                                <el-table :data="feed.value.post_fields_mapping" size="medium">
                                    <el-table-column label="#" type="index"/>
                                    <el-table-column :label="$t('Post Fields')">
                                        <template slot-scope="scope">
                                            {{ scope.row.post_field.replace(/_/, ' ').ucWords() }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column :label="$t('Form Fields')">
                                        <template slot-scope="scope">
                                            <inputPopover
                                                fieldType="text"
                                                :data="editorShortcodes"
                                                v-model="scope.row.form_field"
                                            />
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="ff_card_block mt-4">
                                <p>
                                    {{ ('Note: All your taxonomies and featured image will be mapped automatically from your form fields') }}
                                </p>
                            </div>
                        </div>

                        <!-- Meta Fields Mapping -->
                        <div class="meta_fields_mapping">
                            <div class="meta_fields_mapping_head">
                                <h6>{{ $t('Meta Fields Mapping') }}</h6>
                                <el-button
                                    size="small"
                                    icon="el-icon-plus"
                                    @click="addMetaFieldMapping"
                                >
                                    {{ $t('Add Meta Field') }}
                                </el-button>
                            </div>

                            <template v-if="feed.value.meta_fields_mapping">
                                <el-row
                                    class="mb-3"
                                    :gutter="20"
                                    :key="'meta' + key"
                                    v-for="(mapping, key) in feed.value.meta_fields_mapping"
                                >
                                    <!-- Meta Key -->
                                    <el-col :span="11">
                                        <el-form-item class="ff-form-item" :label="$t('Meta Key')">
                                            <el-input
                                                v-model="mapping.meta_key"
                                                :placeholder="$t('Enter Meta Key...')"
                                                @input="validateMetaKey(mapping)"
                                            />
                                        </el-form-item>
                                    </el-col>

                                    <!-- Meta Value -->
                                    <el-col :span="11">
                                        <el-form-item class="ff-form-item" :label="$t('Meta Value')">
                                            <inputPopover
                                                fieldType="text"
                                                :data="editorShortcodes"
                                                v-model="mapping.meta_value"
                                            />
                                        </el-form-item>
                                    </el-col>

                                    <!-- Delete Meta Mapping -->
                                    <el-col :span="2">
                                        <el-button
                                            style="margin-top: 34px;"
                                            class="el-button--soft el-button--icon"
                                            type="danger"
                                            size="small"
                                            icon="el-icon-close"
                                            @click="deleteMapping(feed.value.meta_fields_mapping, key)"
                                        />
                                    </el-col>
                                </el-row>
                            </template>

                            <div v-if="!feed.value.meta_fields_mapping.length" class="no-mapping-alert">
                                {{ $t('There is no mapping of meta fields. please click on the above add meta field button to add.') }}
                            </div>
                        </div>
                        <!-- end Meta Fields Mapping -->

                        <template v-if="post_settings.has_acf">
                            <post-meta-plugin-mapping
                                :general_settings="feed.value.acf_mappings"
                                :advanced_settings="feed.value.advanced_acf_mappings"
                                :labels="{
                                section_title: $t('ACF Plugin Mapping'),
                                remote_label: $t('ACF Field'),
                                local_label: $t('Form Field (Value)')
                            }"
                                :general_fields="post_settings.acf_fields"
                                :advanced_fields="post_settings.acf_fields_advanced"
                                :form_fields="form_fields"
                                :editorShortcodes="editorShortcodes" />
                                <hr class="mt-4 mb-4">
                        </template>

	                    <template v-if="post_settings.has_jetengine">
                            <post-meta-plugin-mapping
                                :general_settings="feed.value.jetengine_mappings"
                                :advanced_settings="feed.value.advanced_jetengine_mappings"
                                :labels="{
                                section_title: $t('Jetengine Meta Mapping'),
                                remote_label: $t('Jetengine Field'),
                                local_label: $t('Form Field (Value)')
                            }"
                                :general_fields="post_settings.jetengine_fields"
                                :advanced_fields="post_settings.jetengine_fields_advanced"
                                :form_fields="form_fields"
                                :editorShortcodes="editorShortcodes" />
                                <hr class="mt-4 mb-4">
                        </template>

                        <template v-if="post_settings.has_metabox">
                            <post-meta-plugin-mapping
                                :general_settings="feed.value.metabox_mappings"
                                :advanced_settings="feed.value.advanced_metabox_mappings"
                                :labels="{
                                section_title: $t('MetaBox (MB) Plugin Mapping'),
                                remote_label: $t('MetaBox (MB) Field'),
                                local_label: $t('Form Field (Value)')
                            }"
                                :general_fields="post_settings.metabox_fields"
                                :advanced_fields="post_settings.metabox_fields_advanced"
                                :form_fields="form_fields"
                                :editorShortcodes="editorShortcodes" />
                            <hr class="mt-4 mb-4">
                        </template>

                        <filter-fields :fields="form_fields"
                            :conditionals="feed.value.conditionals"
                            :hasPro="hasPro"
                        />

                        <div class="mt-4">
                            <el-button
                                type="primary"
                                @click="saveFeed"
                                icon="el-icon-success"
                            >
                                {{ saving ? $t('Saving') : 'Save' }} {{'Feed'}}
                            </el-button>
                        </div>
                    </el-form>
                </div>
            </card-body>
        </card>
    </div>
</template>

<script type="text/babel">
    import inputPopover from '../input-popover.vue';
    import FilterFields from './Includes/FilterFields.vue';
    import PostMetaPluginMapping from './_PostMetaPluginsMapping';
    import each from 'lodash/each';
    import BtnGroup from '@/admin/components/BtnGroup/BtnGroup.vue';
    import BtnGroupItem from '@/admin/components/BtnGroup/BtnGroupItem.vue';
    import Card from '@/admin/components/Card/Card.vue';
    import CardBody from '@/admin/components/Card/CardBody.vue';
    import CardHead from '@/admin/components/Card/CardHead.vue';
    import CardHeadGroup from '@/admin/components/Card/CardHeadGroup.vue';

    export default {
        name: 'PostFeed',
        components: {
            inputPopover,
            FilterFields,
            PostMetaPluginMapping,
            Card,
            CardHead,
            CardBody,
            CardHeadGroup,
            BtnGroup,
            BtnGroupItem
        },
        props: [
            'feed',
            'form_id',
            'form_fields',
            'post_settings',
            'editorShortcodes',
        ],
        data() {
            return {
                saving: false,
                hasPro: !!window.FluentFormApp.hasPro
            };
        },
        methods: {
            saveFeed() {
                this.saving = true;

                if (!this.feed.value.feed_name) {
                    return this.$fail(this.$t('Feed name is required.'));
                }

                let feed = {
                    meta_key: 'postFeeds',
                    meta_id: this.feed.id,
                    value: JSON.stringify(this.feed.value),
                };

                const url = FluentFormsGlobal.$rest.route('storeFormSettings', this.form_id);

                FluentFormsGlobal.$rest.post(url, feed)
                    .then(response => {
                        this.feed.id = response.id;
                        this.feed.form_id = feed.form_id;
                        this.feed.meta_key = feed.meta_key;
                        this.feed.value = response.settings;

                        this.$emit('show-post-feeds', this.feed);

                        this.$success(response.message);
                    })
                    .finally(() => {
                        this.saving = false;
                    });
            },
            addPostFieldMapping() {
                this.feed.value.post_fields_mapping.push({
                    post_field: null,
                    form_field: null
                });
            },
            addMetaFieldMapping() {
                this.feed.value.meta_fields_mapping.push({
                    meta_key: '',
                    meta_value: ''
                });
            },
            deleteMapping(mappingSource, index) {
                mappingSource.splice(index, 1);
            },
            addAcfMetaFieldMapping() {
                this.feed.value.acf_mappings.push({
                    field_key: '',
                    field_value: ''
                });
            },
            deleteAcfMapping(index) {
                this.feed.value.acf_mappings.splice(index, 1);
            },
            addAcfAdvancedMetaFieldMapping() {
                if(!this.feed.value.advanced_acf_mappings) {
                    this.$set(this.feed.value, 'advanced_acf_mappings', []);
                }
                this.feed.value.advanced_acf_mappings.push({
                    field_key: '',
                    field_value: ''
                });
            },
            deleteAdvancedAcfMapping(index) {
                this.feed.value.advanced_acf_mappings.splice(index, 1);
            },
            validateMetaKey(mapping) {
                mapping.meta_key = mapping.meta_key.replace(/\s/, '_');
            },
            getFilteredFields(fieldKey) {
                let settingFields = this.post_settings.acf_fields_advanced[fieldKey];
                if (!settingFields) {
                    return {};
                }
                const fields = {};
                each(this.form_fields, (item, itemName) => {
                    if (settingFields.acceptable_fields.indexOf(item.element) !== -1) {
                        fields[itemName] = item;
                    }
                });
                return fields;
            }
        },
        computed: {
            feedTitleForEdit() {
                return `Edit <small class='feed_name'>(${this.feed.value.feed_name})</small>`;
            },
            postFields() {
                return this.post_settings.post_fields.filter(f => f !== 'featured_image');
            },
            postStatuses() {
                return this.post_settings.post_statuses;
            },
            commentStatuses() {
                return this.post_settings.comment_statuses;
            },
            postFormats() {
                return this.post_settings.post_formats;
            },
            categories() {
                return this.post_settings.categories;
            },
            isUpdate() {
                return this.feed.value.post_form_type === 'update';
            }
        },
        mounted() {
            jQuery('head title').text('Edit Post Feed - Fluent Forms');
        }
    };
</script>

