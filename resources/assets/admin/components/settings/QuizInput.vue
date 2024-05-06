<template>
    <div class="quiz-field-container">
        <div class="quiz-field">
            <div class="quiz-field-setting">
                <el-switch v-model="input.enabled"/>
            </div>
            <div class="quiz-field-setting">
                {{ original_input.label }}
            </div>
            <div class="quiz-field-setting"  v-if="input.enabled == true && hasOptions(input) && !is_personality_quiz" >
                <el-checkbox true-label="yes" false-label="no" v-model="input.has_advance_scoring">
                    {{ $t('Advance Scoring') }}
                </el-checkbox>
            </div>
        </div>
        <transition name="slide-down">
            <div v-if="input.enabled == true && input.has_advance_scoring == 'no' && !is_personality_quiz" class="quiz-field">
                <div class="quiz-field-setting">
                    <div class="lead-title mb-2">{{ $t('Score') }}</div>
                    <el-input-number size="small" v-model="input.points" controls-position="right" :min="1" :max="100"></el-input-number>
                </div>
                <div class="quiz-field-setting" v-if="ifNeedsCondition(input.element) && hasOptions(input)">
                   <div class="lead-title mb-2"> {{ $t('Condition') }}</div>
                    <el-select @change="resetValue(input)"  size="small" style="width: 100%" v-model="input.condition"
                               :placeholder="$t('Select Condition')">
                        <el-option
                            v-for="(label, key) in macthingCondition"
                            :key="key"
                            :label="$t(label)"
                            :value="key">
                        </el-option>
                    </el-select>
                </div>
                <div class="quiz-field-setting"  v-if="ifNeedsCondition(input.element)">
                   <div class="lead-title mb-2"> {{ $t('Correct Answer') }}</div>
                    <el-select
	                    v-if="hasOptions(input)"
                        ref="resetInput"
                        size="small"
                        style="width: 100%"
                        v-model="input.correct_answer"
                        :multiple="isMultiple(input)"
                        filterable
                        allow-create
                        default-first-option
                        :automatic-dropdown=false
                        :placeholder="$t('Type your Answers')">

                        <el-option
                            v-for="(item, key) in original_input.options"
                            :key="key"
                            :label="item"
                            :value="key"> {{ item }}
                        </el-option>

                    </el-select>
	                <el-input v-else v-model="input.correct_answer" size="small" :placeholder="$t('Correct Answer')"></el-input>
                </div>
                <div class="quiz-field-setting" v-else-if="isRadioInput(input.element)">
                   <div class="lead-title mb-2"> {{ $t('Correct Answer') }}</div>
                    <el-select
                        multiple
                        size="small" style="width: 100%" v-model="input.correct_answer" :placeholder="$t('Correct Answer')">
                        <el-option
                            v-for="(item, key) in input.options"
                            :key="key"
                            :label="item"
                            :value="key"> {{ item }}
                        </el-option>
                    </el-select>
                </div>
            </div>
        </transition>
        <transition v-if="input.has_advance_scoring == 'yes'">
            <div>
                <span v-for="(item, key) in original_input.options" class="quiz-field" :key="key">
                    <div  class="quiz-field-setting">
                       <el-input-number
                            size="small"
                            v-model="input.advance_points[key]"
                            controls-position="right"
                            :min="0" :max="100">
                       </el-input-number>
                    </div>
                    <div class="quiz-field-setting" >
                        {{ item }}
                    </div>
                </span>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: "QuizInput",
    props: {
        input: {
            type: Object,
        },
        original_input :{
            type: Object,
        },
        is_personality_quiz :{
            type: Boolean,
        }
    },
    data() {
        return {
            macthingCondition: {
                equal: 'Equal',
                includes_any: 'Includes Any',
                includes_all: 'Includes All',
                not_includes: 'Not Includes',
            },
        }
    },
    methods: {
        isRadioInput(key) {
            let selectAbleFields = ['input_radio'];
            return selectAbleFields.includes(key) ? true : false;
        },
        ifNeedsCondition(key) {
            let textInput = ['input_text', 'input_date', 'rangeslider', 'input_number', 'select', 'input_checkbox'];
            return textInput.includes(key) ? true : false;
        },
        resetValue(input) {
            this.$refs.resetInput.selectedLabel = '';
            input.correct_answer = null;
        },
        isMultiple(item) {
            return item.condition == 'equal' ? false : true;
        },
        setDefaultPoints(){
            let isEmpty = Object.keys(this.input.advance_points).length === 0;
            if (isEmpty){
                this.input.advance_points = this.original_input.advance_points
            }
        },
        hasOptions(item){
           return Object.keys(this.input.advance_points).length !== 0;
        }

    },
    mounted() {
        if (!this.input.has_advance_scoring){
            this.$set(this.input, 'has_advance_scoring', 'no');
        }
        this.setDefaultPoints();
    }
}
</script>
