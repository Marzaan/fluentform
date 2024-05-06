<template>
    <div class="form-editor" id="form-editor">
        <div class="form-editor-main">
            <div id="js-form-editor--body" class="form-editor--body"
             :style="{width: editorConfig.bodyWidth ? editorConfig.bodyWidth + 'px' : ''}">
                <div class="form-editor__body-content">
                    <div>
                        <!-- =========================
                            PAGING START
                        ============================== -->
                        <div v-if="haveFormSteps" class="form-step__wrapper form-step__start panel__body--item">
                            <div @click="editSelected(stepStart)" class="item-actions-wrapper hover-action-middle">
                                <div class="item-actions">
                                    <i @click="editSelected(stepStart)" class="el-icon el-icon-edit"></i>
                                </div>
                            </div>
                            <div class="step-start text-center">
                                <div class="step-start__indicator">
                                    <strong>{{ $t('PAGING START') }}</strong>
                                    <hr>
                                </div>
                                <div class="start-of-page">
                                    {{ $t('Click to configure your step settings') }}
                                </div>
                            </div>
                        </div>

                        <!-- =========================
                            FORM DROPZONE
                        ============================== -->
                        <el-form :class="'label_position_org_'+original_label_placement" class="form-editor-elements"
                                :label-position="labelPlacement" label-width="120px">
                            <vddl-list class="panel__body--list"
                                    :class="{'empty-dropzone': !form.dropzone.length}"
                                    :list="form.dropzone"
                                    :drop="handleDrop"
                                    :horizontal="false">

                                <!-- Placeholder shown when element dragged -->
                                <vddl-placeholder :style="{ minHeight: dragSourceHeight }">
                                </vddl-placeholder>

                                <!-- Empty dropzone placeholder -->
                                <div v-if="!form.dropzone.length" class="empty-dropzone-placeholder">
                                    <i @click.stop="editorInserterPopup(0, form.dropzone)"
                                    class="popup-search-element ff-icon ff-icon-plus"></i>
                                </div>

                                <template v-if="is_conversion_form">
                                    <list-conversion v-for="(item, index) in form.dropzone"
                                    :handleDragstart="handleDragstart"
                                    :handleDragend="handleDragend"
                                    :allElements="form.dropzone"
                                    :handleEdit="editSelected"
                                    :handleDrop="handleDrop"
                                    :wrapper="form.dropzone"
                                    :key="item.uniqElKey"
                                    :editItem="editItem"
                                    :index="index"
                                    :item="item">
                                    </list-conversion>
                                </template>
                                <template v-else>
                                    <list v-for="(item, index) in form.dropzone"
                                        :handleDragstart="handleDragstart"
                                        :handleDragend="handleDragend"
                                        :allElements="form.dropzone"
                                        :handleEdit="editSelected"
                                        :handleDrop="handleDrop"
                                        :wrapper="form.dropzone"
                                        :key="item.uniqElKey"
                                        :editItem="editItem"
                                        :index="index"
                                        :item="item">
                                    </list>
                                </template>

                            </vddl-list>
                        </el-form>

                        <!-- =========================
                            SUBMIT BUTTON
                        ============================== -->
                        <div class="ff_default_submit_button_wrapper mt-3">
                            <submitButton
                                v-if="Object.keys(submitButton).length"
                                :editItem="editItem"
                                :submitButton="submitButton"
                                :editSelected="editSelected"/>
                        </div>

                        <div v-if="!form.dropzone.length" class="ff-user-guide">
                            <div @click="introVisible = true" class="editor_play_video">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" class="el-icon"><path d="m9.5 16.5 7-4.5-7-4.5ZM12 22q-2.075 0-3.9-.788-1.825-.787-3.175-2.137-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175 1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138 1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175-1.35 1.35-3.175 2.137Q14.075 22 12 22Z"></path>
                                </svg>
                                {{ $t('Video Instruction') }}
                            </div>
                            <img :src="instructionImage" alt="">
                            <el-dialog
                                :visible.sync="introVisible"
                                :append-to-body="true"
                                width="60%"
                            >
                                <div slot="title">
                                    <h5 class="mb-2">{{$t('How to create a form')}}</h5>
                                    <p>Watch our fluentform's video to better understand.</p>
                                </div>
                                <div v-if="introVisible" class="videoWrapper mt-4">
                                    <iframe class="w-100" height="530" style="border-radius: 10px;" src="https://www.youtube.com/embed/ebZUein_foM?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                                    </iframe>
                                </div>
                            </el-dialog>
                        </div>

                        <!-- =========================
                            PAGING END
                        ============================== -->
                        <div v-if="haveFormSteps" class="form-step__wrapper form-step__end panel__body--item">
                            <div @click="editSelected(stepEnd)" class="item-actions-wrapper hover-action-middle">
                                <div class="item-actions">
                                    <i @click="editSelected(stepEnd)" class="el-icon el-icon-edit"></i>
                                </div>
                            </div>
                            <div class="step-start text-center">
                                <div class="start-of-page">
                                    {{ $t('End of last page') }}
                                </div>
                                <div class="step-start__indicator">
                                    <strong>{{ $t('PAGING END') }}</strong>
                                    <hr>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- =========================
                SIDEBAR
            ============================== -->
            <div class="form-editor--sidebar"
                :style="{width: editorConfig.sidebarWidth ? editorConfig.sidebarWidth + 'px' : ''}">

                <div class="form-editor--sidebar-content nav-tabs new-elements">
                    <ul class="nav-tab-list toggle-fields-options">
                        <li :class="fieldMode == 'add' ? 'active' : ''">
                            <a href="#" @click.prevent="changeFieldMode('add')">{{ $t('Input Fields') }}</a>
                        </li>
                        <li :class="fieldMode == 'edit' ? 'active' : ''">
                            <a href="#" @click.prevent="changeSidebarMode('edit')">{{ $t('Input Customization') }}</a>
                        </li>
                    </ul>

                    <div style="min-height: 420px;" class="panel-full-height nav-tab-items">
                        <el-skeleton :loading="!isMockLoaded" animated :rows="10">
                            <template v-if="isMockLoaded">
                                <!-- =========================
                                    ADD FIELDS
                                ============================== -->
                                <template v-if="fieldMode == 'add'">
                                    <div class="search-element-wrap">
                                        <searchElement
                                        :placeholder="$t('Search name, address, mask input etc.')"
                                        :isSidebarSearch.sync="isSidebarSearch"
                                        :moved="moved"
                                        :isDisabled="isDisabled"
                                        :insertItemOnClick="insertItemOnClick"
                                        :list="[
                                            ...postMockList,
                                            ...taxonomyMockList,
                                            ...generalMockList,
                                            ...advancedMockList,
                                            ...containerMockList,
                                            ...paymentsMockList
                                        ]"/>
                                    </div>

                                    <div class="sidebar_elements_wrapper" v-show="!isSidebarSearch">
                                        <!-- Post Fields -->
                                        <div
                                            v-if="isPostForm"
                                            class="option-fields-section"
                                            :class="(optionFieldsSection == 'post') ? 'option-fields-section_active' : ''"
                                        >
                                            <h5 @click="toggleFieldsSection('post')"
                                                :class="optionFieldsSection == 'post' ? 'active' : ''"
                                                class="option-fields-section--title">
                                                {{ $t('Post Fields') }}
                                            </h5>

                                            <transition name="slide-fade">
                                                <div v-show="optionFieldsSection == 'post'"
                                                    class="option-fields-section--content">
                                                    <div v-for="(itemMockList, i) in postMockListChunked" :key="i"
                                                        class="v-row mb15">
                                                        <div class="v-col--50" v-for="(itemMock, i) in itemMockList" :key="i">
                                                            <vddl-draggable
                                                                class="btn-element"
                                                                :class="{ 'disabled': isDisabled(itemMock) }"
                                                                :draggable="itemMock"
                                                                :selected="insertItemOnClick"
                                                                :index="i"
                                                                :wrapper="itemMockList"
                                                                :disable-if="isDisabled(itemMock)"
                                                                :moved="moved"
                                                                effectAllowed="copy">
                                                                <i :class="itemMock.editor_options.icon_class"></i>
                                                                <span>{{ itemMock.editor_options.title }}</span>
                                                            </vddl-draggable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- Taxonomy Fields -->
                                        <div
                                            v-if="isPostForm"
                                            class="option-fields-section"
                                            :class="(optionFieldsSection == 'taxonomy') ? 'option-fields-section_active' : ''"
                                        >
                                            <h5 @click="toggleFieldsSection('taxonomy')"
                                                :class="optionFieldsSection == 'taxonomy' ? 'active' : ''"
                                                class="option-fields-section--title">
                                                {{ $t('Taxonomy Fields') }}
                                            </h5>

                                            <transition name="slide-fade">
                                                <div
                                                    class="option-fields-section--content"
                                                    v-show="optionFieldsSection == 'taxonomy'"
                                                >
                                                    <div
                                                        :key="i"
                                                        class="v-row mb15"
                                                        v-for="(itemMockList, i) in taxonomyMockListChunked"
                                                    >
                                                        <div
                                                            :key="i"
                                                            class="v-col--50"
                                                            v-for="(itemMock, i) in itemMockList"
                                                        >
                                                            <vddl-draggable
                                                                class="btn-element"
                                                                :class="{ 'disabled': isDisabled(itemMock) }"
                                                                :draggable="itemMock"
                                                                :selected="insertItemOnClick"
                                                                :index="i"
                                                                :wrapper="itemMockList"
                                                                :disable-if="isDisabled(itemMock)"
                                                                :moved="moved"
                                                                effectAllowed="copy">
                                                                <i :class="itemMock.editor_options.icon_class"></i>
                                                                <span>{{ itemMock.editor_options.title }}</span>
                                                            </vddl-draggable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- General Fields -->
                                        <div
                                            class="option-fields-section"
                                            :class="(optionFieldsSection == 'general') ? 'option-fields-section_active' : ''"
                                        >
                                            <h5 @click="toggleFieldsSection('general')"
                                                :class="optionFieldsSection == 'general' ? 'active' : ''"
                                                class="option-fields-section--title">
                                                {{ $t('General Fields') }}
                                            </h5>

                                            <transition name="slide-fade">
                                                <div v-show="optionFieldsSection == 'general'"
                                                    class="option-fields-section--content">
                                                    <div v-for="(itemMockList, i) in itemMockListChunked" :key="i"
                                                        class="v-row mb15" :class="'ff_items_'+itemMockList.length">
                                                        <div class="v-col--50" v-for="(itemMock, i) in itemMockList" :key="i">
                                                            <vddl-draggable
                                                                class="btn-element"
                                                                :class="{ 'disabled': isDisabled(itemMock) }"
                                                                :draggable="itemMock"
                                                                :selected="insertItemOnClick"
                                                                :index="i"
                                                                :wrapper="itemMockList"
                                                                :disable-if="isDisabled(itemMock)"
                                                                :moved="moved"
                                                                effectAllowed="copy">
                                                                <i :class="itemMock.editor_options.icon_class"></i>
                                                                <span>{{ itemMock.editor_options.title }}</span>
                                                            </vddl-draggable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- Advanced Fields -->
                                        <div
                                            class="option-fields-section"
                                            :class="(optionFieldsSection == 'others') ? 'option-fields-section_active' : ''"
                                        >
                                            <h5 @click="toggleFieldsSection('others')"
                                                :class="optionFieldsSection == 'others' ? 'active' : ''"
                                                class="option-fields-section--title">
                                                {{ $t('Advanced Fields') }}
                                            </h5>
                                            <transition name="slide-fade">
                                                <div v-show="optionFieldsSection == 'others'"
                                                        class="option-fields-section--content">
                                                    <div v-for="(itemMockList, i) in otherItemsMockListChunked" :key="i"
                                                            class="v-row mb15" :class="'ff_items_'+itemMockList.length">
                                                        <div class="v-col--50" v-for="(itemMock, i) in itemMockList" :key="i">
                                                            <vddl-draggable
                                                                class="btn-element"
                                                                :draggable="itemMock"
                                                                :index="i"
                                                                :wrapper="itemMockList"
                                                                :selected="insertItemOnClick"
                                                                :disable-if="isDisabled(itemMock)"
                                                                :moved="moved"
                                                                effect-allowed="copy"
                                                            ><i :class="itemMock.editor_options.icon_class"></i>
                                                            <span>{{itemMock.editor_options.title}}</span>
                                                            </vddl-draggable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- Container Fields -->
                                        <div
                                        v-if="!is_conversion_form"
                                            class="option-fields-section"
                                            :class="(optionFieldsSection == 'container') ? 'option-fields-section_active' : ''"
                                        >
                                            <h5 @click="toggleFieldsSection('container')"
                                                :class="optionFieldsSection == 'container' ? 'active' : ''"
                                                class="option-fields-section--title">
                                                {{ $t('Container') }}
                                            </h5>
                                            <transition name="slide-fade">
                                                <div v-show="optionFieldsSection == 'container'"
                                                        class="option-fields-section--content">
                                                    <div class="v-row mb15">
                                                        <div class="v-col--50" v-for="(mockItem, i) in containerMockList" :key="i">
                                                            <vddl-draggable
                                                                class="btn-element mb15"
                                                                :draggable="mockItem"
                                                                :wrapper="containerMockList"
                                                                :index="i"
                                                                :selected="insertItemOnClick"
                                                                :moved="moved"
                                                                effect-allowed="copy"
                                                            ><i :class="mockItem.editor_options.icon_class"></i>
                                                            <span>{{mockItem.editor_options.title}}</span>
                                                            </vddl-draggable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                        <!-- Payment Fields -->
                                        <div
                                            v-if="has_payment_features"
                                            class="option-fields-section"
                                            :class="(optionFieldsSection == 'payment') ? 'option-fields-section_active' : ''"
                                        >
                                            <h5 @click="toggleFieldsSection('payment')"
                                                :class="optionFieldsSection == 'payment' ? 'active' : ''"
                                                class="option-fields-section--title">
                                                {{ $t('Payment Fields') }}
                                            </h5>
                                            <transition name="slide-fade">
                                                <div v-show="optionFieldsSection == 'payment'"
                                                        class="option-fields-section--content">
                                                    <div v-for="(itemMockList, i) in paymentsMockListChunked" :key="i"
                                                            class="v-row mb15" :class="'ff_items_'+itemMockList.length">
                                                        <div class="v-col--50" v-for="(itemMock, i) in itemMockList" :key="i">
                                                            <vddl-draggable
                                                                class="btn-element"
                                                                :class="{ 'disabled': isDisabled(itemMock) }"
                                                                :draggable="itemMock"
                                                                :selected="insertItemOnClick"
                                                                :index="i"
                                                                :wrapper="itemMockList"
                                                                :disable-if="isDisabled(itemMock)"
                                                                :moved="moved"
                                                                effectAllowed="copy">
                                                                <i :class="itemMock.editor_options.icon_class"></i>
                                                                <span>{{ itemMock.editor_options.title }}</span>
                                                            </vddl-draggable>
                                                        </div>
                                                    </div>
                                                </div>
                                            </transition>
                                        </div>

                                    </div>
                                </template>

                                <!-- =========================
                                    EDIT FIELDS
                                ============================== -->
                                <template v-if="fieldMode == 'edit' && Object.keys(editItem).length">
                                    <div class="ff-input-customization-wrap" style="min-height: 100px;">
                                        <el-skeleton :loading="sidebarLoading" animated :rows="10">
                                            <EditorSidebar
                                                v-if="!sidebarLoading"
                                                :editItem="editItem"
                                                :form_items="form.dropzone"
                                                :haveFormSteps="haveFormSteps"
                                            />
                                        </el-skeleton>
                                    </div>
                                </template>
                            </template>
                        </el-skeleton>
                    </div>
                </div>
            </div>
        </div><!-- .form-editor-main -->

        <!-- OTHER MODAL/POPUP COMPONENTS -->
        <ItemDisabled
            :visibility.sync="whyDisabledModal"
            :modal="itemDisableConditions[whyDisabledModal] || {}">
        </ItemDisabled>

        <editorInserter
            :dropzone="dropzone"
            :postMockList="postMockList"
            :taxonomyMockList="taxonomyMockList"
            :generalMockList="generalMockList"
            :paymentsMockList="paymentsMockList"
            :advancedMockList="advancedMockList"
            :visible.sync="editorInserterVisible"
            :containerMockList="containerMockList"
            :insertItemOnClick="insertItemOnClick"/>

        <RenameForm
            v-if="form.title"
            :formTitle="form.title"
            @rename-success="formRenameSuccess"
            :visible.sync="renameFormVisibility"/>
    </div>
</template>

<script type="text/babel">
import {mapActions, mapGetters, mapMutations} from 'vuex';
import List from '../components/nested-list.vue';
import ListConversion from '../components/nested-list-conversion.vue';
import recaptcha from '../components/modals/Recaptcha.vue';
import hcaptcha from '../components/modals/Hcaptcha.vue';
import searchElement from '../components/searchElement.vue';
import EditorSidebar from '../components/EditorSidebar.vue';
import RenameForm from '../components/modals/RenameForm.vue';
import ItemDisabled from '../components/modals/ItemDisabled.vue';
import submitButton from '../components/templates/submitButton.vue';
import editorInserter from '../components/includes/editor-inserter.vue';

export default {
    name: 'FormEditor',
    props: [
        'form',
        'save_form',
        'form_saving'
    ],
    components: {
        List,
        ListConversion,
        recaptcha,
        hcaptcha,
        RenameForm,
        ItemDisabled,
        submitButton,
        EditorSidebar,
        searchElement,
        editorInserter
    },
    data() {
        return {
            form_id: window.FluentFormApp.form_id,
            labelPlacement: 'top',
            original_label_placement: 'top',
            editorConfig: {
                bodyWidth: 0,
                sidebarWidth: 0
            },
            editItem: {},
            disable: false,
            dragSourceHeight: null,
            whyDisabledModal: '',
            optionFieldsSection: window.FluentFormApp.form.type === 'post' ? 'post' : 'general',
            nameEditable: false,
            searchElementStr: '',
            searchResult: [],
            isSidebarSearch: false,
            editorInserterVisible: false,
            insertNext: {
                index: null,
                wrapper: null
            },
            renameFormVisibility: false,
            editorInserterInContainer: false,
            instructionImage: FluentFormApp.plugin_public_url + 'img/help.svg',
            has_payment_features: FluentFormApp.has_payment_features,
            introVisible: false
        }
    },
    computed: {
        ...mapGetters({
            fieldMode: 'fieldMode',
            sidebarLoading: 'sidebarLoading',
            itemDisableConditions: 'editorDisabledComponents',
            postMockList: 'postMockList',
            taxonomyMockList: 'taxonomyMockList',
            generalMockList: 'generalMockList',
            advancedMockList: 'advancedMockList',
            paymentsMockList: 'paymentsMockList',
            containerMockList: 'containerMockList',
            isMockLoaded: 'isMockLoaded',
        }),

        /**
         * Make chunks of item draggable
         * in post section
         * @return {Array}
         */
        postMockListChunked() {
            return _ff.chunk(this.postMockList, 2);
        },

        /**
         * Make chunks of item draggable
         * in post section
         * @return {Array}
         */
        paymentsMockListChunked() {
            return _ff.chunk(this.paymentsMockList, 2);
        },

        /**
         * Make chunks of item draggable
         * in taxonomy section
         * @return {Array}
         */
        taxonomyMockListChunked() {
            return _ff.chunk(this.taxonomyMockList, 2);
        },

        /**
         * Make chunks of item draggable
         * in general section
         * @return {Array}
         */
        itemMockListChunked() {
            return _ff.chunk(this.generalMockList, 2);
        },

        /**
         * Make chunks of item draggable
         * in advanced section
         * @return {Array}
         */
        otherItemsMockListChunked() {
            return _ff.chunk(this.advancedMockList, 2);
        },

        /**
         * Default form elements
         * @return {Array}
         */
        dropzone() {
            return this.form.dropzone;
        },

        /**
         * Submit button object
         * @return {Object}
         */
        submitButton() {
            return this.form.submitButton;
        },

        /**
         * Checks if the form have steps in it
         * @return {boolean}
         */
        haveFormSteps() {
            let result = false;

			if (this.is_conversion_form) {
				return result; // Conversation form doesn't support steps field
            }
            _ff.map(this.form.dropzone, (field) => {
                if (field && field.editor_options && field.editor_options.template == "formStep") {
                    return result = true;
                }
            });
            return result;
        },

        /**
         * Checks how many form steps have in it
         * @return {number}
         */
        formStepsCount() {
            let count = 1;
            _ff.map(this.form.dropzone, (field) => {
                if (field && field.editor_options && field.editor_options.template == "formStep") {
                    count++;
                }
            });
            return count;
        },

        /**
         * Form step beginning options
         * @return {Object}
         */
        stepStart() {
            return this.form.stepsWrapper.stepStart;
        },

        /**
         * Form step ending options
         * @return {Object}
         */
        stepEnd() {
            return this.form.stepsWrapper.stepEnd;
        },
        isPostForm() {
            return window.FluentFormApp.form.type === 'post';
        },
        isAutoloadCaptchaEnabled() {
            return !!window.FluentFormApp.is_autoload_captcha;
        }
    },
    watch: {
        form_saving() {
            const saveBtn = jQuery('#saveFormData');
            if (this.form_saving) {
                this.clearEditableObject(); // Empty {editItem} after form saved
                saveBtn.html('<i class="el-icon-loading mr-1"></i> Save Form');
            } else {
                saveBtn.html('<i class="el-icon-success mr-1"></i> Save Form');
            }
        },

        formStepsCount() {
            if (this.stepStart && this.stepStart.settings.step_titles.length > this.formStepsCount) {
                this.stepStart.settings.step_titles.splice(this.formStepsCount);
            }
        },

        /**
         * Remove step staring & ending options if no steps found
         * Adds step staring & ending options if any steps found
         */
        haveFormSteps() {
            if (this.haveFormSteps) {
                this.form.stepsWrapper = {
                    stepStart: this.form.stepStart,
                    stepEnd: this.form.stepEnd
                }
            } else {
                this.$delete(this.form.stepsWrapper, 'stepStart');
                this.$delete(this.form.stepsWrapper, 'stepEnd');
            }
        }
    },
    methods: {
        ...mapMutations({
            changeFieldMode: 'changeFieldMode',
            updateSidebar: 'updateSidebar'
        }),

        moved(o) {
            // vddl has issue with this method.
            // we can remove this method once fixed.
        },

        // probably not in use (need to re-check)
        enableNameEditable() {
            this.nameEditable = true;
            jQuery('.nameEditableInput').find('input').focus();
        },

        /**
         * Empty {editItem} and restore sidebar to add item mode
         */
        clearEditableObject() {
            this.changeFieldMode('add');
            this.editItem = {};
        },

        /**
         * Toggle between 'Add Fields' & 'Field Options'
         * from the Editor sidebar
         * @param mode
         */
        changeSidebarMode(mode) {
            this.isSidebarSearch = false;
            this.updateSidebar();
            this.changeFieldMode(mode);
            if (_ff.isEmpty(this.editItem)) {
                // if (this.form.dropzone[0].element != 'container') {
                this.editItem = this.form.dropzone[0];
                // }
            }
        },

        /**
         * Actions after Drag & Drop an element
         * @param {Object|vddl prams}
         * @return {void}
         */
        handleDrop({index, list, item, type}) {
            if (type != 'existingElement') {
                this.makeUniqueNameAttr(this.form.dropzone, item);
            }
            if (item.element == 'container' && this.form.dropzone != list) {
                this.$message({
                    message: this.$t('You can not insert a container into another.'),
                    type: 'warning',
                });
                return false;
            }

            const captchas = ['recaptcha', 'hcaptcha', 'turnstile'];
            if (this.isAutoloadCaptchaEnabled && captchas.includes(item.element)) {
                this.$message({
                    message: this.$t('Captcha has been enabled globally.'),
                    type: 'warning',
                });
                return false;
            }

            let isCaptchaExists = type != 'existingElement' && this.isCaptchaExists(captchas, item.element);

            if (isCaptchaExists) {
                return;
            }

            item.uniqElKey = 'el_' + new Date().getTime();

            list.splice(index, 0, item);
        },

        /**
         * Insert element into form on click sidebar buttons
         * @param item
         * @return {void}
         */
        insertItemOnClick(item, target) {
            if (this.itemDisableConditions.hasOwnProperty(item.element) && this.itemDisableConditions[item.element].disabled) {
                this.whyDisabledModal = item.element;
                return;
            }
            let freshCopy = _ff.cloneDeep(item);
            const $target = jQuery(target);

            if (target && !target.draggable
                && $target.hasClass('disabled')
                || $target.parents().hasClass('disabled')) {
                return this.showWhyDisabled(item);
            }

            if (this.editorInserterInContainer && freshCopy.element == 'container') {
                this.$message({
                    message: this.$t('You can not insert a container into another.'),
                    type: 'warning',
                });

                return;
            }

            const captchas = ['recaptcha', 'hcaptcha', 'turnstile'];
            if (this.isAutoloadCaptchaEnabled && captchas.includes(freshCopy.element)) {
                this.$message({
                    message: this.$t('Captcha has been enabled globally.'),
                    type: 'warning',
                });

                return;
            }

            let isCaptchaExists = this.isCaptchaExists(captchas, item.element);

            if (isCaptchaExists) {
                return;
            }

            this.makeUniqueNameAttr(this.form.dropzone, freshCopy);

            if (this.insertNext.index != null) {
                this.insertNext.wrapper.splice(this.insertNext.index + 1, 0, freshCopy);
                this.editorInserterDismiss();
                this.editItem = freshCopy;
                this.changeSidebarMode('edit');
            } else {
                this.form.dropzone.push(freshCopy);
            }
        },

        /**
         * Show a modal for disabled components
         */
        showWhyDisabled(item) {
            this.whyDisabledModal = item.editor_options.why_disabled_modal;
        },

        /**
         * Action for clicking on edit icon
         * from an element
         * @param item
         * @param mode
         */
        editSelected(item, mode = 'edit') {
            this.updateSidebar();
            this.changeFieldMode(mode);

            this.editItem = item;

            jQuery('html, body').animate({
                scrollTop: 0
            }, 300);
        },

        /**
         * Checks if an item is disabled
         * @param item
         * @return {boolean}
         */
        isDisabled(item) {
            if (this.itemDisableConditions.hasOwnProperty(item.element)) {
                return this.itemDisableConditions[item.element].disabled;
            }
            return false;
        },

        /**
         * Rearrange elements in the editor
         * Action when drag starts
         * @param el
         */
        handleDragstart(el) {
            var height = jQuery(el).height() + 20;
            this.dragSourceHeight = height + 'px';
        },

        /**
         * Rearrange elements in the editor
         * Action when drag ends
         * @param el
         */
        handleDragend(el) {
            this.dragSourceHeight = null;
        },

        /**
         * Rename the form in the editor
         */
        renameForm() {
            this.save_form();
            this.nameEditable = false;
        },

        /**
         * Fetch form settings from the server.
         * And do necessary adjustments to the editor
         */
        fetchSettings() {
            const url = FluentFormsGlobal.$rest.route('getFormSettings', this.form_id);

            FluentFormsGlobal.$rest.get(url, {meta_key: 'formSettings'})
                .then(response => {
                    let result = response[0];
                    if (result && result.value) {
                        let settings = result.value;
                        this.original_label_placement = settings.layout.labelPlacement;
                        if (settings.layout.labelPlacement == 'hide_label') {
                            settings.layout.labelPlacement = 'top';
                        } else {
                            this.labelPlacement = settings.layout.labelPlacement;
                        }
                    }
                })
                .catch(error => {
                    // ...
                });
        },

        /**
         * Clean any data binding associating with it
         * once the element is removed
         */
        garbageCleaner() {
            FluentFormEditorEvents.$on('onElRemoveSuccess', field => {
                // Reset Editable Object
                if (!_ff.isEmpty(this.editItem) && this.editItem.attributes.name == field)
                    this.clearEditableObject();

                // remove garbage conditional logics
                // recursively from nested elements
                this.mapElements(this.dropzone, (el) => {
                    const conditions = el.settings.conditional_logics && el.settings.conditional_logics.conditions;
                    _ff.map(conditions, (condition, index) => {
                        if (condition) {
                            if (condition.field == field || condition.field.startsWith(field)) {
                                conditions.splice(index, 1);
                            }
                        }
                        if (!conditions.length) {
                            el.settings.conditional_logics.status = false;
                        }
                    });
                });
            });
        },

        /**
         * Inject save form button to navigation
         * Initiate click and save event
         **/
        initSaveBtn() {
            const self = this;
            var saveButton = jQuery('<button />', {
                id: 'saveFormData',
                class: 'el-button el-button--primary',
                html: '<i class="el-icon-success mr-1"></i> Save Form'
            });
            saveButton.on('click', function () {
                const $this = jQuery(this);
                if (!$this.data('text')) $this.data('text', $this.text());
                $this.html('<i class="el-icon-loading mr-1"></i> Save Form');
                self.save_form();
            });

            jQuery('.ff-navigation-right').append(saveButton);

            var screenButton = jQuery('<span />', {
                id: 'switchScreen',
                class: 'ff_icon_switch_full ff-icon ff-icon-fullscreen',
                text: ''
            });

            screenButton.on('click', function () {
                const $body = jQuery('body');
                let wasFullScreen = $body.hasClass('ff_full_screen');
                if (window.localStorage) {
                    if (wasFullScreen) {
                        window.localStorage.setItem('ff_is_full_screen', 'no');

                    } else {
                        window.localStorage.setItem('ff_is_full_screen', 'yes');
                    }
                }
                $body.toggleClass('ff_full_screen');
            });

            if (window.localStorage) {
                if (window.localStorage.getItem('ff_is_full_screen') == 'yes') {
                    jQuery('body').addClass('ff_full_screen').addClass('folded');
                }
            } else {
                jQuery('body').addClass('ff_full_screen').addClass('folded');
            }

            jQuery('.ff-navigation-right').append(screenButton);
        },

        /**
         * Hide editor inserter popup
         * Clean associated data
         */
        editorInserterDismiss() {
            this.insertNext.index = null;
            this.insertNext.wrapper = null;
            this.editorInserterVisible = false;
            this.editorInserterInContainer = false;
            jQuery('.js-editor-item').removeClass('is-editor-inserter');
        },

        /**
         * Show editor inserter popup event
         */
        editorInserterPopup(index, wrapper) {
            FluentFormEditorEvents.$emit('editor-inserter-popup', index, wrapper, this.$el);
        },

        /**
         * Initiate form rename popup
         */
        initRenameForm() {
            jQuery('#js-ff-nav-title')
                .on('click', _ => this.renameFormVisibility = true)
                .prepend('<i class="el-icon-edit"></i> ')
                .css('cursor', 'pointer');
        },

        /**
         * Event for the form rename success
         * passed by the component
         */
        formRenameSuccess(title) {
            this.form.title = title;
            jQuery('#js-ff-nav-title').find('div').text(title);
        },

        /*
        * checking if captcha is already exists in the Editor
        */
        isCaptchaExists(captchas, itemEl) {
            let isCaptchaExists = false;
            this.dropzone.forEach(el => {
                if (captchas.includes(el.element) && captchas.includes(itemEl)) {
                     this.$message({
                        message: this.$t('A captcha has been already added.'),
                        type: 'warning',
                    });

                    isCaptchaExists = true;
                }
            });

            return isCaptchaExists;
        }
    },

    created() {
        /**
         * Event: To clear editor inserter dependency
         * and hide from view
         * @augments {event}
         */
        FluentFormEditorEvents.$on('editor-inserter-dismiss', this.editorInserterDismiss);

        /**
         * Event: On editor inserter popup visible
         * @augments {index, wrapper, elDOM}
         */
        FluentFormEditorEvents.$on('editor-inserter-popup', (index, wrapper, elDOM) => {
            this.editorInserterDismiss();
            jQuery(elDOM).find('.js-editor-item').first().addClass('is-editor-inserter');

            this.insertNext = {index, wrapper};
            this.$nextTick(_ => this.editorInserterVisible = true);
        });

        /**
         * Event listener
         * If the editor inserter popup is triggered from a container element
         */
        FluentFormEditorEvents.$on('editor-inserter-in-container', _ => {
            this.editorInserterInContainer = true;
        });
    },

    mounted() {
        this.fetchSettings();

        this.garbageCleaner();
        this.initSaveBtn();
        this.initRenameForm();

        /**
         * Dismiss editor inserter popup when clicked outside
         */
        jQuery(document).on('click', this.editorInserterDismiss);

        /**
         * Copy to clip board
         * @type {Clipboard}
         */
        (new ClipboardJS('.copy')).on('success', (e) => {
            this.$copy();
        });

        if (this.isAutoloadCaptchaEnabled) {
            const captchas = ['recaptcha', 'hcaptcha', 'turnstile'];
            setTimeout(() => {
                this.form.dropzone = this.form.dropzone.filter(el => !captchas.includes(el.element));
            }, 100);
        }
    }
};
</script>

