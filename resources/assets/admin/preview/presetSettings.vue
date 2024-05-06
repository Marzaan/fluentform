<template>
	<div v-loading="loading" class="preview-form-style-template-wrap">
		<div class="preview-form-style-template-head">
			<h5>{{ $t('Form Style Template') }}</h5>
			<el-button @click="saveSettings()" type="primary" size="mini" class="ffs_save_settings">
				{{ $t('Save Settings') }}
			</el-button>
		</div>
		<div class="preview-form-style-template-selector">
			<el-select :placeholder="$t('Select Preset Styles')" v-model="selected_preset">
				<el-option v-for="(preset, presetKey) in presets" :key="presetKey" :value="presetKey"
				           :label="preset.label">{{ preset.label }}
				</el-option>
			</el-select>
		</div>
	</div>
</template>

<script>

export default {
	name: 'preset-settings',
	props: ['form_id'],
	data() {
		return {
			loading: false,
			selected_preset: '',
			presets: {}
		}
	},
	watch: {
		selected_preset() {
			if (this.selected_preset.trim() === 'ffs_default') {
				jQuery('.ff_form_preview .fluentform').addClass('ff-default');
			} else if (this.selected_preset.trim() === 'ffs_inherit_theme') {
				jQuery('.ff_form_preview .fluentform.ff-default').removeClass('ff-default');
			}
		}
	},
	methods: {
		getSettings() {
			this.loading = true;
			const url = FluentFormsGlobal.$rest.route('getPresetSettings', this.form_id);
			FluentFormsGlobal.$rest.get(url, { input_only: true })
				.then(response => {
					this.selected_preset = response.selected_preset;
					this.presets = response.presets;
				})
				.catch(e => {
					this.$notify.error({
						title: this.$t('Error'),
						message: e.message,
						position: 'bottom-right'
					});
				})
				.finally(() => {
					this.loading = false;
				})
		},

		saveSettings() {
			this.loading = true;
			const url = FluentFormsGlobal.$rest.route('savePresetSettings', this.form_id);
			FluentFormsGlobal.$rest.post(url, {
					selected_preset: this.selected_preset
				})
				.then(response => {
					this.$notify.success({
						title: this.$t('Success'),
						message: response.message,
						position: 'bottom-right'
					});
				})
				.catch(e => {
					this.$notify.error({
						title: this.$t('Error'),
						message: e.message,
						position: 'bottom-right'
					});
				})
				.finally(() => {
					this.loading = false;
				})
		}
	},
	mounted() {
		this.getSettings();
	}
}
</script>


