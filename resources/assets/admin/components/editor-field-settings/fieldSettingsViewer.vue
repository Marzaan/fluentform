<template>
    <div>
        <FieldOptionSettings
            :editItem="editItem"
            :form_items="form_items"
            :advancedEditOptions="advancedEditOptions"
            :generalEditOptions="generalEditOptions"
        />
    </div>
</template>

<script type="text/babel">
    import FieldOptionSettings from './FieldOptionsSettings.vue';

    const fieldOptionsDictionary = FluentFormApp.element_customization_settings;

    const composeFieldOptions = (args = []) => (obj = {}) => {
        let listOpt = {};
        args.map(prop => {
            if (fieldOptionsDictionary.hasOwnProperty(prop)) {
                listOpt[prop] = fieldOptionsDictionary[prop];
            }
        });

		// For maintain field options order
		// Remove field option, if options exist on extras options
	    for (const prop in obj) {
		    if (prop in listOpt) {
			    delete listOpt[prop];
		    }
	    }
        return {...listOpt, ...obj};
    };

    export default {
        name: 'fieldSettingsViewer',
        props: ['form_items', 'editItem', 'haveFormSteps'],
        components: {
            FieldOptionSettings
        },
        data() {
            return {
                editItemElement: window.FluentFormApp.element_settings_placement
            }
        },
        computed: {
            generalEditOptions() {
                const attachExtras = composeFieldOptions(
                    this.editItemElement[this.editItem.element].general
                );
                let result = attachExtras(this.editItemElement[this.editItem.element].generalExtras);
                if (this.haveFormSteps && ['custom_submit_button','button'].includes(this.editItem.element)) {
                  delete result['align'];
                }
                return result;
            },
            advancedEditOptions() {
                const attachExtras = composeFieldOptions(
                    this.editItemElement[this.editItem.element].advanced
                );
                return attachExtras(this.editItemElement[this.editItem.element].advancedExtras);
            }
        }
    };
</script>
