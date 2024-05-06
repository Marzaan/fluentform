<template>
    <div  :class="{'ff_backdrop': visibility}">
        <el-dialog
            top="40px"
            width="90%"
             :element-loading-text="$t('Creating Form, Please wait...')"
             element-loading-spinner="el-icon-loading"
            :loading="creatingForm"
            :visible="visibility"
            :before-close="close"
            class="predefinedModal"
        >

            <PostTypeSelectionModal
                @on-post-type-selction-end="onPostTypeSelctionEnd"
                :postTypeSelectionDialogVisibility="postTypeSelectionDialogVisibility"
            />

            <div slot="title">
                <b>
                    {{ $t('Choose a pre - made form template or') }}
                    <a href="#" type="info" @click.prevent="createForm('blank_form')">
                        {{ $t('create a blank form') }}
                    </a>
                </b>
            </div>

            <div class="form_action_navigations">
                <div class="form_item_group">
                    <label>{{ $t('Category') }}</label>
                    <el-select size="mini" v-model="category" clearable :placeholder="$t('All Category')">
                        <el-option
                            v-for="item in categories"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>

                <div class="form_item_group form_item_group_search">
                    <el-input
                        size="mini"
                        v-model="search"
                        :placeholder="$t('Search Form')"
                        class="input-with-select"
                    >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </div>
            </div>

            <div
                :element-loading-text="$t('Working...')"
                element-loading-spinner="el-icon-loading"
                v-loading="fetching || creatingForm"
                style="min-height: 200px"
                class="ff-el-banner-group"
            >
                <div v-for="(forms, category) in filteredForms" class="ff_form_group">
                    <h3>{{category}}</h3>
                    <div v-for="(form, name) in forms" :class="form.class" class="ff-el-banner">
                        <div class="ff-el-banner-inner-item">
                            <p class="ff-el-banner-header">{{ form.title }}</p>
                            <img :src="form.screenshot" alt="">
                            <div
                                :loading="creatingForm"
                                @click="createForm(name, form)"
                                class="ff-el-banner-text-inside ff-el-banner-text-inside-hoverable"
                            >
                                <p style="text-align:center;" v-html="form.brief"></p>

                                <div class="text-center mtb10">
                                    <el-button size="small">
                                        <template v-if="creatingForm">
                                            <span>{{ $t('Creating Form...') }}</span>
                                        </template>
                                        <template v-else>
                                            <span v-if="form.is_pro && !has_pro">Unlock in Pro</span>
                                            <span v-else>{{ $t('Create Form') }}</span>
                                        </template>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button
                    v-if="has_post_feature"
                    size="mini"
                    type="info"
                    class="ff_create_post_form"
                    :loading="creatingForm"
                    @click="postTypeSelectionDialogVisibility = true"
                >
                    <span v-if="creatingForm">{{ $t('Creating Form...') }}</span>
                    <span v-else>{{ $t('Create a Post Form') }}</span>
                </el-button>

                <el-button size="mini" @click="close">Cancel</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    :loading="creatingForm"
                    @click="createForm('blank_form')"
                >
                    <span v-if="creatingForm">{{ $t('Creating Form...') }}</span>
                    <span v-else>{{ $t('Create a Blank Form') }}</span>
                </el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
    import each from 'lodash/each';
    import PostTypeSelectionModal from './PostTypeSelectionModal';

    export default {
        name: 'predefinedFormsModal',
        components: {PostTypeSelectionModal},
        props: {
            categories: Array,
            visibility: Boolean,
            predefinedForms: Object
        },
        data() {
            return {
                has_post_feature: !!window.FluentFormApp.has_post_feature,
                postFormData: {
                    type: 'post',
                    predefined: 'blank_form',
                    action: 'fluentform-predefined-create'
                },
                creatingForm: false,
                // predefinedForms: {},
                isNewForm: false,
                selectedPredefinedForm: '',
                form_title: '',
                category: '',
                // categories: [],
                fetching: false,
                search: '',
                postTypeSelectionDialogVisibility: false,
                has_pro: !!window.FluentFormApp.hasPro
            }
        },
        computed: {
            filteredForms() {
                let items = {};

                if (this.search) {
                    let search = this.search.toLocaleLowerCase();
                    let allForms = {
                        'Search Result': {}
                    };

                    each(this.predefinedForms, (forms, formCategory) => {
                        each(forms, (form, formName) => {
                            let formStrung = JSON.stringify([
                                form.title,
                                form.category,
                                form.tags
                            ]).toLowerCase();

                            if (formStrung.indexOf(search) != -1) {
                                allForms['Search Result'][formName] = form;
                            }
                        });
                    });

                    this.category = '';

                    return allForms;
                } else {
                    if (this.category) {
                        items[this.category] = this.predefinedForms[this.category];
                    } else {
                        return this.predefinedForms;
                    }
                }

                return items;
            }
        },
        methods: {
            close() {
                this.$emit('update:visibility', false);
                this.isNewForm = false;
            },
            createForm(formType, form) {
                let selectedFormType = 'form';
                if (form) {
                    if (form.is_pro && !window.FluentFormApp.hasPro) {
                        return this.$fail(this.$t('This form required pro add-on of fluentform. Please install pro add-on'));
                    }
                    selectedFormType = form.type;
                }

                this.creatingForm = true;

                let data = {
                    type: selectedFormType,
                    predefined: formType,
                    action: 'fluentform-predefined-create'
                };

                if (selectedFormType === 'post') {
                    return this.createPostForm(data);
                }

                return this.doCreateForm(data)
            },
            createPostForm(data) {
                this.postFormData = data;
                this.postTypeSelectionDialogVisibility = true;
            },
            doCreateForm(data) {
                const url = FluentFormsGlobal.$rest.route('getForms');
                
                FluentFormsGlobal.$rest.post(url, data)
                    .then((response) => {
                        this.$success(response.message);

                        if (response.redirect_url) {
                            window.location.href = response.redirect_url;
                        }
                    })
                    .catch(error => {
                        this.$fail(error.message);
                    })
                    .finally(() => {
                        this.creatingForm = false;
                    });
            },
            onPostTypeSelctionEnd(post_type) {
                this.creatingForm = false;
                this.postTypeSelectionDialogVisibility = false;
                if (post_type) {
                    this.doCreateForm({post_type, ...this.postFormData});
                }
            },
            gotoPage(url) {
                location.href = url;
            }
        },

        mounted() {
            // this.createForm();
            // this.fetchPredefinedForms();
            // this.forms = this.predefinedForms;
            // this.categories = this.categories;
        }
    };
</script>
