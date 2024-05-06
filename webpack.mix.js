let mix = require('laravel-mix');
const exec = require('child_process').exec;
const path = require('path');

mix.setPublicPath('assets');
mix.setResourceRoot('../');

if (!mix.inProduction()) {
    mix.webpackConfig({
        devtool: 'source-map'
    }).sourceMaps(false);
} else {
    // During production build we'll remove the existing public
    // directory so that the source-maps are deleted as well.
    let fs = require('fs-extra');
    fs.remove('assets');
}

mix.webpackConfig({
    resolve: {
        alias: {
            '@': path.resolve('resources/assets')
        }
    }
});

// mix.js('resources/assets/admin/editor_app.js', `public/js/fluent-forms-editor.js`);
// return;


mix
    .js('resources/assets/admin/fluent_forms_global.js', `assets/js/fluent_forms_global.js`)
    .js('resources/assets/admin/settings/global_settings.js', `assets/js/fluentform-global-settings.js`)
    .js('resources/assets/admin/transfer/transfer.js', `assets/js/fluentform-transfer.js`)
    .js('resources/assets/admin/form_settings_app.js', `assets/js/form_settings_app.js`)
    .js('resources/assets/admin/editor_app.js', `assets/js/fluent-forms-editor.js`)
    .js('resources/assets/admin/form_entries_app.js', `assets/js/form_entries.js`)
    .js('resources/assets/admin/all_forms_app.js', `assets/js/fluent-all-forms-admin.js`)

    .js('resources/assets/public/fluentform-advanced.js', `assets/js/fluentform-advanced.js`)
    .js('resources/assets/public/form-submission.js', `assets/js/form-submission.js`)
    .js('resources/assets/public/form-save-progress.js', `assets/js/form-save-progress.js`)
    .js('resources/assets/admin/fluentform_editor_script.js', `assets/js/fluentform_editor_script.js`)
    .js('resources/assets/admin/copier.js', `assets/js/copier.js`)
    .js('resources/assets/admin/admin_notices.js', `assets/js/admin_notices.js`)
    .js('resources/assets/admin/modules.js', `assets/js/modules.js`)
    .js('resources/assets/admin/documentation.js', `assets/js/docs.js`)
    .js('resources/assets/admin/form_preview_app.js', `assets/js/form_preview_app.js`)
    .js('resources/assets/admin/AllEntries/all-entries.js', `assets/js/all_entries.js`)
    .js('resources/assets/admin/conversion_templates/conversational_design.js', `assets/js/conversational_design.js`)
    .vue({
        version: 2,
        extractStyles: true
    })
    .js('resources/assets/admin/fluent_forms_editor_helper.js', `assets/js/fluent_forms_editor_helper.js`)

    .sass('resources/assets/admin/css/element-ui-css.scss', `assets/css/element-ui-css.css`)
    .sass('resources/assets/admin/css/fluent-forms-admin.scss', `assets/css/fluent-forms-admin-sass.css`)
    .sass('resources/assets/admin/css/settings_global.scss', `assets/css/settings_global.css`)
    .sass('resources/assets/admin/css/fluent-all-forms.scss', `assets/css/fluent-all-forms.css`)
    .sass('resources/assets/admin/css/admin_notices.scss', `assets/css/admin_notices.css`)
    .sass('resources/assets/admin/css/admin_docs.scss', `assets/css/admin_docs.css`)
    .sass('resources/assets/admin/css/add-ons.scss', 'assets/css/add-ons.css')
    .sass('resources/assets/admin/css/fluent_gutenblock.scss', 'assets/css/fluent_gutenblock.css')
    .sass('resources/assets/public/scss/fluent-forms-public.scss', `assets/css/fluent-forms-public.css`)
    .sass('resources/assets/public/scss/fluentform-public-default.scss', `assets/css/fluentform-public-default.css`)
    .sass('resources/assets/preview/preview.scss', `assets/css/preview.css`)
    .sass('resources/assets/public/scss/choices.scss', `assets/css/choices.css`)
    .sass('resources/assets/elementor/fluent-forms-elementor-widget.scss', `assets/css/fluent-forms-elementor-widget.css`)
    .sass('resources/assets/admin/conversion_templates/design_css.scss', `assets/css/conversational_design.css`)

    .less('resources/assets/admin/styles/index.less', `assets/css/fluent-forms-admin.css`, {
        lessOptions: {
            javascriptEnabled: true
        }
    });

mix.then(() => {
    exec('rtlcss ./assets/css/fluent-forms-public.css ./assets/css/fluent-forms-public-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/fluentform-public-default.css ./assets/css/fluentform-public-default-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/settings_global.css ./assets/css/settings_global_rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/element-ui-css.css ./assets/css/element-ui-css-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/fluent-all-forms.css ./assets/css/fluent-all-forms-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/fluent-forms-admin-sass.css ./assets/css/fluent-forms-admin-sass-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/fluent-forms-admin.css ./assets/css/fluent-forms-admin-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss assets/css/add-ons.css ./assets/css/add-ons-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss assets/css/admin_docs.css ./assets/css/admin_docs_rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
});

mix.js('resources/assets/admin/fluent_gutenblock.js','assets/js/fluent_gutenblock.js').react()

mix
    .copyDirectory('resources/assets/libs', 'assets/libs')
    .copyDirectory('resources/img', 'assets/img')
    // .copyDirectory('guten_block/public', 'assets/js')
    .copy('index.php', 'assets/index.php');

