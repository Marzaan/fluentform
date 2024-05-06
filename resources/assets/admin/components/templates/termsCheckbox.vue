<template>
    <div class="ff_tc">
        <el-checkbox v-if="item.settings.has_checkbox">
            <span v-html="html"></span>
        </el-checkbox>
        <div v-else class="el-checkbox">
            <div class="el-checkbox__label" v-html="html"></div>
        </div>
    </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
    name: 'TNC_Checkbox',
    props: ['item'],
	computed: {
		html() {
			return DOMPurify.sanitize(this.item.settings.tnc_html);
		}
	}
}
</script>
