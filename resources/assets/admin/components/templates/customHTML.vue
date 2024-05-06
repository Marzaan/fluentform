<template>
    <div class="ff_editor_html" v-html="html"></div>
</template>

<script>
import  DOMPurify from 'dompurify';
export default {
    name: 'customHTML',
    props: ['item'],
	computed: {
		html() {
			return DOMPurify.sanitize(this.item.settings.html_codes);
		}
	}
}
</script>