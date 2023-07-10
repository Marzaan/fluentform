<template>
    <el-form label-position="top" label-width="120px">
        <div :class="optionFieldsSection == 'generalEditOptions' ? 'option-fields-section_active' : ''" class="option-fields-section">
            <h5 @click="toggleFieldsSection('generalEditOptions')"
                :class="optionFieldsSection == 'generalEditOptions' ? 'active' : ''"
                class="option-fields-section--title">
                {{ editItem.editor_options.title }}
            </h5>
    
            <transition name="slide-fade">
                <div v-if="optionFieldsSection == 'generalEditOptions'" class="option-fields-section--content">
                    <template v-for="(listItem, key, i) in generalEditOptions">
                        <component
                            v-if="willShow(key, listItem)"
                            :is="guessElTemplate(listItem)"
                            v-model="vModelFinder(key)[key]"
                            :editItem="editItem"
                            :prop="key"
                            :form_items="form_items"
                            :listItem="listItem"
                            :key="i">
                        </component>
                    </template>
                </div>
            </transition>
        </div>
    
        <div :class="optionFieldsSection == 'advancedEditOptions' ? 'option-fields-section_active' : ''" class="option-fields-section">
            <template v-if="haveSettings(advancedEditOptions)">
                <h5 @click="toggleFieldsSection('advancedEditOptions')"
                    :class="optionFieldsSection == 'advancedEditOptions' ? 'active' : ''"
                    class="option-fields-section--title">
                    {{ $t('Advanced Options') }}
                </h5>
    
                <transition name="slide-fade">
                    <div v-if="optionFieldsSection == 'advancedEditOptions'" class="option-fields-section--content">
                        <template v-for="(listItem, key, i) in advancedEditOptions">
                            <component
                                v-if="willShow(key, listItem)"
                                :is="guessElTemplate(listItem)"
                                v-model="vModelFinder(key)[key]"
                                :form_items="form_items"
                                :editItem="editItem"
                                :listItem="listItem"
                                :key="i">
                            </component>
                        </template>
                        <div v-if="!hasPro && is_conversion_form" class="fcc_pro_message">
                            {{
                                $t('Conditional Logic on conversational form available only in Pro version. To use conditional logic please upgrade to pro')
                            }}
                            <a target="_blank" rel="noopener" href="https://fluentforms.com/conversational-form" class="el-button el-button--success el-button--small">{{
                                    $t('Get Fluent Forms Pro')
                                }}</a>
                        </div>
                    </div>
                </transition>
            </template>
        </div>
    
        <div :class="optionFieldsSection == 'layoutOptions' ? 'option-fields-section_active' : ''" class="option-fields-section">
            <template v-if="editItem.style_pref">
                <h5 @click="toggleFieldsSection('layoutOptions')"
                    :class="optionFieldsSection == 'layoutOptions' ? 'active' : ''"
                    class="option-fields-section--title">
                    {{ $t('Layout Settings') }}
                </h5>
    
                <transition name="slide-fade">
                    <div v-if="optionFieldsSection == 'layoutOptions'" class="option-fields-section--content">
                        <conversion-style-pref :pref="editItem.style_pref" />
                    </div>
                </transition>
            </template>
        </div>
    
    </el-form>
    </template>
    
    <script type="text/babel">
    
    import select from './templates/select.vue';
    import nameAttr from './templates/nameAttr.vue';
    import infoBlock from './templates/infoBlock.vue';
    import inputText from './templates/inputText.vue';
    import inputCalculationSettings from './templates/inputCalculationSettings.vue';
    import inputNumber from './templates/inputNumber.vue';
    import customMask from './templates/customMask.vue';
    import nameFields from './templates/nameFields.vue';
    import dateFields from './templates/dateFields.vue';
    import inputValue from './templates/inputValue.vue';
    import inputColor from './templates/inputColor.vue';
    import inputRadio from './templates/inputRadio.vue';
    import gridRowCols from './templates/gridRowCols.vue';
    import radioButton from './templates/radioButton.vue';
    import addressFields from './templates/addressFields.vue';
    import inputTextarea from './templates/inputTextarea.vue';
    import inputHTML from './templates/inputHTML.vue';
    import inputCheckbox from './templates/inputCheckbox.vue';
    import selectOptions from './templates/select-options.vue';
    import advancedOptions from './templates/advanced-options.vue';
    import pricingOptions from './templates/pricing-options.vue';
    import subscriptionOptions from './templates/subscription-options.vue';
    import prevNextButton from './templates/prevNextButton.vue';
    import selectBtnStyle from './templates/selectBtnStyle.vue';
    import customHookName from './templates/customHookName.vue';
    import validationRules from './templates/validationRules.vue';
    import customStepTitles from './templates/customStepTitles.vue';
    import conditionalLogics from './templates/conditionalLogics.vue';
    import customCountryList from './templates/customCountryList.vue';
    import productFieldTypes from './templates/productFieldTypes.vue';
    import customRepeatFields from './templates/customRepeatFields.vue';
    import validationRulesForm from './templates/validationRulesForm.vue';
    import inputRequiredFieldText from './templates/inputRequiredFieldText.vue';
    import chainSelectDataSource from './templates/chainSelectDataSource.vue';
    import paymentMethodsConfig from './templates/paymentMethodsConfig.vue';
    import targetProduct from './templates/targetProduct.vue';
    import inputYesNoCheckBox from "./templates/inputYesNoCheckbox";
    import fieldsRepeatSettings from "./templates/fieldsRepeatSettings";
    import ConversionStylePref from "../../conversion_templates/ConversionStylePref";
    import ContainerWidth from "./templates/containerWidth";
    import inventoryStock from "./templates/inventoryStock";
    
    export default {
        name: 'FieldOptionsSettings',
        props: [
            'editItem',
            'form_items',
            'generalEditOptions',
            'advancedEditOptions'
        ],
        components: {
            ff_select: select,
            ff_radio: inputRadio,
            ff_nameAttr: nameAttr,
            ff_inputText: inputText,
            ff_inputNumber: inputNumber,
            ff_infoBlock: infoBlock,
            ff_customMask: customMask,
            ff_inputValue: inputValue,
            ff_nameFields: nameFields,
            ff_dateFields: dateFields,
            ff_inputColor: inputColor,
            ff_radioButton: radioButton,
            ff_gridRowCols: gridRowCols,
            ff_inputTextarea: inputTextarea,
            ff_inputHTML: inputHTML,
            ff_inputCheckbox: inputCheckbox,
            ff_selectOptions: selectOptions,
            ff_advancedOptions: advancedOptions,
            ff_pricingOptions: pricingOptions,
            ff_subscriptionOptions: subscriptionOptions,
            ff_addressFields: addressFields,
            ff_customHookName: customHookName,
            ff_selectBtnStyle: selectBtnStyle,
            ff_prevNextButton: prevNextButton,
            ff_validationRules: validationRules,
            ff_customStepTitles: customStepTitles,
            ff_customCountryList: customCountryList,
            ff_productFieldTypes: productFieldTypes,
            ff_conditionalLogics: conditionalLogics,
            ff_customRepeatFields: customRepeatFields,
            ff_validationRulesForm: validationRulesForm,
            ff_inputCalculationSettings: inputCalculationSettings,
            ff_inputRequiredFieldText: inputRequiredFieldText,
            ff_chainSelectDataSource: chainSelectDataSource,
            ff_paymentMethodsConfig: paymentMethodsConfig,
            ff_targetProduct: targetProduct,
            ff_inputYesNoCheckBox: inputYesNoCheckBox,
            ff_fieldsRepeatSettings: fieldsRepeatSettings,
            ConversionStylePref,
            ff_containerWidth: ContainerWidth,
            ff_inventoryStock: inventoryStock,
        },
        data() {
            return {
                optionFieldsSection: 'generalEditOptions',
                hasPro: !!window.FluentFormApp.hasPro,
                is_conversion_form: !!window.FluentFormApp.is_conversion_form
            }
        },
        computed: {
            /**
             * All configurable options of an element
             * What is shown in the sidebar edit option is determined here
             * @return {Array}
             */
            elementOptions() {
                let elementOptions = [];
    
                _ff.each(this.editItem.attributes, (value, name) => {
                    elementOptions.push(name);
                });
    
                _ff.each(this.editItem.settings, (value, name) => {
                    elementOptions.push(name);
                });
    
                if (_ff.has(this.editItem, 'options')) {
                    elementOptions.push('options');
                }
    
                if (_ff.has(this.editItem, 'fields')) {
                    const fieldsTempl = _ff.snakeCase(this.editItem.editor_options.template);
                    elementOptions.push(fieldsTempl);
                }
    
                return elementOptions;
            }
        },
        methods: {
            /**
             * Determine the input v-model parent object
             * @param attr
             */
            vModelFinder(attr) {
                if (_ff.has(this.editItem.attributes, attr)) {
                    return this.editItem.attributes
                } else {
                    return this.editItem.settings
                }
            },
    
            /**
             * This determins to show/hide "general" and "advanced" settings
             * @param targetObj
             * @return {number}
             */
            haveSettings(targetObj) {
                let total = 0;
                _ff.each(this.elementOptions, (el_key) => {
                    if(_ff.has(targetObj, el_key)) {
                        total++;
                    }
                });
                return total;
            },
    
            /**
            * Helper function for show/hide dependent elements
            & @return {Boolean}
             */
            compare(operand1, operator, operand2) {
                switch(operator) {
                    case '==':
                        return operand1 == operand2
                        break;
                    case '!=':
                        return operand1 != operand2
                        break;
                }
            },
    
            /**
             * Checks if a prop is dependent on another
             * @param listItem
             * @return {boolean}
             */
            dependancyPass(listItem) {
                if (listItem.dependency) {
                    let optionPaths = listItem.dependency.depends_on.split('/');
    
                    let dependencyVal = optionPaths.reduce((obj, prop) => {
                        return obj[prop]
                    }, this.editItem);
    
                    if ( this.compare(listItem.dependency.value, listItem.dependency.operator, dependencyVal) ) {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            willShow(key, listItem) {
                return this.elementOptions.includes(key) && this.dependancyPass(listItem) && this.conversionPass(listItem, key);
            },
            conversionPass(listItem, key) {
                if(!this.is_conversion_form) {
                    return true;
                }
                let unsupportedSettings = [
                    // 'conditional_logics',
                    'label_placement',
                    // 'calculation_settings',
                    'prefix_label',
                    'suffix_label',
                    'numeric_formatter',
                    'layout_class',
                    'class',
                    'rows',
                    'cols'
                ];
    
                if(!this.hasPro) {
                    unsupportedSettings.push('conditional_logics');
                }
    
                return unsupportedSettings.indexOf(key) === -1;
            }
        },
    };
    </script>
    