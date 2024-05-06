<template>
	<preset-settings :form_id="form_id"/>
</template>

<script>
import presetSettings from './presetSettings.vue';
export default {
	name: 'PreviewApp',
	props: ['form_id'],
	components: {
		presetSettings,
	}
}
</script>