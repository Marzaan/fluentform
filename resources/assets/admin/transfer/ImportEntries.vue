<template>
	<div class="ff_import_entries">
		<card>
			<card-head>
				<h5 class="title">{{ $t('Import Entries') }}</h5>
			</card-head>
			<card-body>
				<el-form v-if="app.hasPro && app.has_entries_import" label-position="top">
					<el-row :gutter="24">
						<el-col :lg="12" :md="24">
							<!--Select Forms-->
							<el-form-item class="ff-form-item">
								<template slot="label">
									{{ $t('Select Forms') }}

									<el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
										<div slot="content">
											<p>
												{{ $t('Select the form you would like to map entries.') }}
											</p>
										</div>

										<i class="ff-icon ff-icon-info-filled text-primary"></i>
									</el-tooltip>
								</template>

								<el-select class="w-100" v-model="selected_form_id" filterable>
									<el-option v-for="(form, index) in app.forms" :key="index"
									           :label="'#'+ form.id +' - ' +form.title" :value="form.id"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :lg="12" :md="24">
							<!--File Type-->
							<el-form-item>
								<template slot="label">
									{{ $t('File Type') }}
									<el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
										<div slot="content">
											<p>
												{{ $t('Choose File type you would like to import') }}
											</p>
										</div>

										<i class="ff-icon ff-icon-info-filled text-primary"></i>
									</el-tooltip>
								</template>
								<el-radio-group v-model="file_type">
									<el-radio label="json">JSON (.json)</el-radio>
									<el-radio label="csv">CSV (.csv)</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<!--Csv Delimiter-->
							<el-form-item v-if="is_csv_file_type" class="ff-form-item">
								<template slot="label">
									{{ $t('Csv Delimiter') }}
									<el-tooltip class="item" placement="bottom-start" popper-class="ff_tooltip_wrap">
										<div slot="content">
											<p>
												{{ $t('Select your csv file delimiter') }}
											</p>
										</div>
										<i class="ff-icon ff-icon-info-filled text-primary"></i>
									</el-tooltip>
								</template>
								<el-select class="w-100" v-model="csv_delimiter">
									<el-option
										v-for="(delimiter, key) in {comma:'Comma Separated (,)', semicolon: 'Semicolon Separated (;)', auto_guess: 'Auto Guess'}"
										:key="key"
										:label="delimiter" :value="key"
									></el-option>
								</el-select>
							</el-form-item>

							<!--Select File-->
							<el-form-item class="ff-form-item">
								<template slot="label">
									{{ $t('Select File') }}
								</template>
								<p>{{ file_upload_info }}</p>
								<input type="file" ref="fileButton" id="fileButton" class="file-input w-100"
								       @click="clear">
							</el-form-item>
							<el-button :type="is_imported ? 'success' : 'primary'" :icon="is_imported ? 'el-icon-success' : 'el-icon-right'" :disabled="is_imported" @click="goForMapFields"
							           :loading="loading_map_columns">
								{{ is_imported ? $t('Imported') : $t('Next [Map Columns]')}}
							</el-button>
						</el-col>
					</el-row>

					<!-- Entries page url -->
					<div class="mt-4" v-if="is_imported">
						<h5 class="mb-2"><a :href="entries_page_url"> {{ $t('View Entries') }}</a></h5>
					</div>

					<!-- Modal for mapping fields -->
					<div v-if="form_fields && submission_info_fields && mapping_fields"
					     :class="{'ff_backdrop': show_mapping_dialog}">
						<el-dialog
							top="50px"
							width="70%"
							element-loading-spinner="el-icon-loading"
							:loading="loading_map_columns"
							:visible="show_mapping_dialog"
							:before-close="closeInputSelection"
						>
							<template slot="title">
								<div class="el-dialog__header_group">
									<h3 class="mr-3">{{ $t('Map responsible fields to import') }}</h3>
								</div>
							</template>

							<div class="ff_card_wrap mt-5 mb-4">
								<el-row :gutter="24" class="mb-4">
									<el-col :lg="12" :sm="24">
										<h6 class="mr-3">{{ $t('Form Fields') }}</h6>
									</el-col>
									<el-col :lg="12" :sm="24">
										<h6 class="mr-3">{{ $t('Mapping Fields') }}</h6>
									</el-col>
								</el-row>
								<hr/>
								<template v-for="(form_field, key) in form_fields">
									<el-row :gutter="24" :key="key">
										<el-col :lg="12" :sm="24">
											<span>{{ form_field.label }}</span>
										</el-col>
										<el-col :lg="12" :sm="24">
											<el-select v-model="form_field['binding_field']" class="w-100"
											           placeholder="Select" filterable clearable>
												<el-option
													v-for="item in (is_csv_file_type ? mapping_fields : mapping_fields.form_fields)"
													:key="item.value"
													:label="item.label"
													:value="item.value">
												</el-option>
											</el-select>
										</el-col>
									</el-row>
									<hr/>
								</template>
							</div>
							<el-checkbox v-model="map_submission_info_fields">
								{{ $t('Show Submission Info Mapping') }}
							</el-checkbox>
							<div v-if="map_submission_info_fields" class="ff_card_wrap mt-5 mb-4">
								<el-row :gutter="24" class="mb-4">
									<el-col :lg="12" :sm="24">
										<h6 class="mr-3">{{ $t('Submission Info Fields') }}</h6>
									</el-col>
									<el-col :lg="12" :sm="24">
										<h6 class="mr-3">{{ $t('Mapping Fields') }}</h6>
									</el-col>
								</el-row>
								<hr/>
								<template v-for="(submission_info_field, key) in submission_info_fields">
									<el-row :gutter="24" :key="key">
										<el-col :lg="12" :sm="24">
											<span>{{ submission_info_field.label }}</span>
										</el-col>
										<el-col :lg="12" :sm="24">
											<el-select v-model="submission_info_field['binding_field']" class="w-100"
											           placeholder="Select" filterable clearable>
												<el-option
													v-for="item in (is_csv_file_type ? mapping_fields : mapping_fields.submission_info_fields)"
													:key="item.value"
													:label="item.label"
													:value="item.value">
												</el-option>
											</el-select>
										</el-col>
									</el-row>
									<hr/>
								</template>
							</div>

							<div slot="footer">
								<el-row :gutter="24">
									<el-col :lg="12" :sm="24" style="align-self: center;text-align: left;">
										<el-checkbox v-model="delete_existing_submissions">
											{{ $t('Delete Existing Submissions') }}
										</el-checkbox>
									</el-col>
									<el-col :lg="12" :sm="24">
										<el-button @click="closeInputSelection" type="info" class="el-button--soft">
											{{ $t('Cancel') }}
										</el-button>
										<el-button type="primary" :loading="loading_import_entries" icon="el-icon-success"
										           @click="importEntries">
											{{ $t('Import') }}
										</el-button>
									</el-col>
									<el-col :span="24" v-if="loading_import_entries && has_lots_of_entries">
										<p>
											{{ $t("It's take some times. Please wail...") }}
										</p>
									</el-col>
								</el-row>
		                    </div>
						</el-dialog>
					</div>
				</el-form>
				<notice v-else-if="app.hasPro" type="info-soft" class="ff_alert_between">
					<div>
						<h6 class="title">{{ $t('Update Needed.') }}</h6>
						<p class="text">{{ $t('Update fluentformpro to get access to import entries.') }}</p>
					</div>
				</notice>
				<notice v-else type="danger-soft" class="ff_alert_between">
					<div>
						<h6 class="title">{{ $t('You are using the free version of Fluent Forms.') }}</h6>
						<p class="text">{{ $t('Upgrade to get access to import entries.') }}</p>
					</div>
					<a target="_blank"
					   href="https://fluentforms.com/pricing/?utm_source=plugin&amp;utm_medium=wp_install&amp;utm_campaign=ff_upgrade&amp;theme_style=twentytwentythree"
					   class="el-button el-button--danger el-button--small">
						{{ $t('Upgrade to Pro') }}
					</a>
				</notice>
			</card-body>
		</card>
	</div>
</template>

<script>
import Card from '@/admin/components/Card/Card.vue';
import CardBody from '@/admin/components/Card/CardBody.vue';
import CardHead from '@/admin/components/Card/CardHead.vue';
import Notice from '@/admin/components/Notice/Notice.vue';

export default {
	name: 'ImportEntries',
	props: ['app'],
	components: {
		Card,
		CardHead,
		CardBody,
		Notice
	},
	data() {
		return {
			selected_form_id: this.app.forms?.length > 0 ? this.app.forms[0].id : '',
			csv_delimiter: 'auto_guess',
			file_type: 'json',
			entries_page_url: '',
			has_lots_of_entries: false,
			submission_imported : false,
			loading_map_columns: false,
			loading_import_entries: false,
			map_submission_info_fields: false,
			delete_existing_submissions: false,
			form_fields: null,
			submission_info_fields: null,
			mapping_fields: null,
			show_mapping_dialog: false
		}
	},
	watch: {
		file_type() {
			this.clear();
			this.entries_page_url = '';
		},
		selected_form_id() {
			this.clear();
			this.entries_page_url = '';
		}
	},
	methods: {
		clear() {
			this.loading_map_columns = false;
			this.loading_import_entries = false;
			this.has_lots_of_entries = false;
			this.submission_info_fields = null;
			this.form_fields = null;
			this.mapping_fields = null;
			this.map_submission_info_fields = false;
			this.delete_existing_submissions = false;
			this.show_mapping_dialog = false;
			this.$refs.fileButton.value = '';
		},
		goForMapFields() {
			this.loading_map_columns = true;
			if (this.form_fields && this.submission_info_fields) {
				this.loading_map_columns = false;
				this.show_mapping_dialog = true;
				return;
			}
			const file = this.$refs.fileButton.files[0];
			if (!file) {
				this.loading_map_columns = false;
				this.$warning(this.$t('Empty file'));
				return;
			}
			let data = new FormData();
			data.append('form_id', this.selected_form_id);
			data.append('file_type', this.file_type);
			data.append('csv_delimiter', this.csv_delimiter);
			data.append('file', file);
			data.append('action', 'fluentform-import-entries-map-fields');
			data.append('fluent_forms_admin_nonce', window.fluent_forms_global_var.fluent_forms_admin_nonce);
			jQuery
				.ajax({
					url: window.ajaxurl,
					type: 'POST',
					data: data,
					contentType: false,
					processData: false,
					success: (response) => {
						this.loading_map_columns = false;
						this.form_fields = response.data.form_fields;
						this.has_lots_of_entries = response.data.has_lots_of_entries;
						this.submission_info_fields = response.data.submission_info_fields;
						this.mapping_fields = response.data.mapping_fields;
						this.show_mapping_dialog = true;
					},
					error: (error) => {
						this.clear();
						const errorMessage = error?.message || error?.responseJSON?.message;
						errorMessage && this.$fail(errorMessage);
					}
				});
		},
		importEntries() {
			this.loading_import_entries = true;
			const file = this.$refs.fileButton.files[0];
			if (!file) {
				this.loading_import_entries = false;
				this.$warning(this.$t('Empty file'));
				return;
			}
			let data = new FormData();
			data.append('form_id', this.selected_form_id);
			data.append('file_type', this.file_type);
			data.append('csv_delimiter', this.csv_delimiter);
			data.append('file', file);
			data.append('delete_existing_submissions', this.delete_existing_submissions);
			data.append('form_fields', JSON.stringify(this.form_fields));
			data.append('submission_info_fields', JSON.stringify(this.submission_info_fields));
			data.append('action', 'fluentform-import-entries');
			data.append('fluent_forms_admin_nonce', window.fluent_forms_global_var.fluent_forms_admin_nonce);
			jQuery
				.ajax({
					url: window.ajaxurl,
					type: 'POST',
					data: data,
					contentType: false,
					processData: false,
					success: (response) => {
						this.$success(response.data.message)
						this.entries_page_url = response.data.entries_page_url;
						this.clear();
					},
					error: (error) => {
						let errorMessage = error?.message || error?.responseJSON?.message;
						if (!errorMessage) {
							if (this.has_lots_of_entries) {
								errorMessage = this.$t("Maximum execution time error, due to lot's of entries. Maybe fail importing some of entries. Please increase server maximum executing time and try again.");
							} else {
								errorMessage = this.$t("Unknown Error");
							}
						}
						this.$fail(errorMessage);
						this.clear();
					}
				});
		},
		closeInputSelection() {
			this.show_mapping_dialog = false;
			this.map_submission_info_fields = false;
		},
	},
	computed: {
		is_csv_file_type() {
			return this.file_type === 'csv';
		},
		file_upload_info() {
			return this.is_csv_file_type ? this.$t('Please make sure your csv file delimiter is correct and has unique headers. Otherwise, it may fail to import') : this.$t('Select the FluentForms exported entries (.json) file. Otherwise, it may fail to import');
		},
		is_imported() {
			return !!this.entries_page_url;
		}
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>