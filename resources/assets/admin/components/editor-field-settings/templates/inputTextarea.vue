<template>
    <el-form-item>
        <div slot="label">
            {{ listItem.label }}
            <el-tooltip v-if="listItem.help_text" popper-class="ff_tooltip_wrap" :content="listItem.help_text" placement="top">
                <i class="tooltip-icon el-icon-info"></i>
            </el-tooltip>
        </div>
        <el-input :disabled="listItem.disabled" :class="listItem.css_class" v-model="model" :rows="listItem.rows" :cols="listItem.cols" type="textarea"></el-input>
        <p v-if="listItem.inline_help_text" v-html="listItem.inline_help_text"></p>
    </el-form-item>
</template>

<script type="text/babel">
import DOMPurify from 'dompurify';
    export default {
        name: 'inputTextarea',
        props: ['listItem', 'value'],
        watch: {
            model() {
                this.$emit('input', DOMPurify.sanitize(this.model));
            }
        },
        data() {
            return {
                model: this.value
            }
        }
    };
</script>
