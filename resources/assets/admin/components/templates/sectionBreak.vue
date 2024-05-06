<template>
    <div class="section-break" :class="'text-' + item.settings.align">
        <h4 class="section-break__title">{{ item.settings.label }}</h4>
        <div v-html="html"></div>
        <hr>
    </div>
</template>

<script>
import  DOMPurify from 'dompurify';
export default {
    name: 'section_break',
    props: ['item'],
	computed: {
		html() {
			return DOMPurify.sanitize(this.item.settings.description);
		}
	}
}
</script>

