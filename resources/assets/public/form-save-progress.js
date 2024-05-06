import formSlider from "./Pro/slider";

(function ($) {
    $(document.body).on('fluentform_init', function (e, $theForm, form) {

        const formSelector = '.' + form.form_instance;
        let hash = -1;
        let activeStep = 'no';
        let hasSaveProgress = $(formSelector).hasClass('ff-form-has-save-progress');
        if (!hasSaveProgress) {
            return;
        }

        let hasFormStep = $(formSelector).hasClass('ff-form-has-steps');

        if (hasFormStep) {
            $theForm.on('ff_to_next_page', function (e, currentStep) {
                activeStep = currentStep;
            });
            $theForm.on('ff_to_prev_page', function (e, currentStep) {
                activeStep = currentStep;
            });
        }

        $(formSelector).find('.ff-btn-save-progress').each(function (key, el) {
            const $saveBttn = $(el);

            $saveBttn.on('click', function (e) {
                e.preventDefault();
                $saveBttn.addClass('ff-working');

                const $inputs = $theForm.find(':input').filter(function (i, el) {
                    return !$(el).closest('.has-conditions').hasClass('ff_excluded');
                });

                $inputs.filter((i, el) => {
                    let $el = $(el);
                    return $el.parents().hasClass('ff_repeater_table') &&
                        $el.attr('type') == 'select' &&
                        !$el.val();
                }).prepend('<option selected disabled />');

                let inputData = $inputs.serialize();

                var hasFiles = false;
                $.each($theForm.find('[type=file]'), function (index, fileInput) {
                    var params = {}, fileInputName = fileInput.name + '[]';
                    params[fileInputName] = [];

                    $(fileInput)
                        .closest('div')
                        .find('.ff-uploaded-list')
                        .find('.ff-upload-preview[data-src]')
                        .each(function (i, div) {
                            params[fileInputName][i] = $(this).data('src');
                        });

                    $.each(params, function (k, v) {
                        if (v.length) {
                            var obj = {};
                            obj[k] = v;
                            inputData += '&' + $.param(obj);
                            hasFiles = true;
                        }
                    });
                });

                var formData = {
                    source_url: window.form_state_save_vars.source_url,
                    action: 'fluentform_save_form_progress_with_link',
                    data: inputData,
                    form_id: $theForm.data('form_id'),
                    hash: hash,
                    active_step: activeStep,
                    nonce: window.form_state_save_vars.nonce
                };
                const saveProgressMessage = formData.form_id + '_save_progress_msg';
                const savingResponseMsg = '#' + saveProgressMessage;
                jQuery.post(fluentFormVars.ajaxUrl, formData).then(data => {
                    if (data) {
                        hash = data.data.hash;
                        const $linkDom = $theForm.find('.ff-saved-state-link');
                        if (data.data?.message != '') {
                            if ($(savingResponseMsg).length) {
                                $(savingResponseMsg).slideUp('fast');
                            }
                            $('<div/>', {
                                'id': saveProgressMessage,
                                'class': 'ff-message-success ff-el-group'
                            })
                                .html(data.data.message)
                                .insertBefore($saveBttn.closest('.ff-el-group'));
                        }

                        //Show Link in Input
                        const copyIcon = window.form_state_save_vars.copy_button || 'Copy';
                        let inputDiv =
                            `<div class="ff-el-input--content">
                                <div class="ff_input-group">
                                    <input readonly value="${ data.data.saved_url }" class="ff-el-form-control" >
                                    <div class="ff_input-group-append">
                                        <button class="ff-btn ff-btn-md ff_btn_style ff_btn_copy_link ff_input-group-text">${copyIcon}</button>
                                    </div>
                                </div>
                            </div>`;
                        let inputGroup = $('<div/>', { class: 'ff-el-group ff-saved-state-input ff-saved-state-link ff-hide-group', html: inputDiv });

                        $(this).closest('.ff-el-group').after(
                            inputGroup
                        )
                        inputGroup.fadeIn();

                        //Show Email Input
                        const emailPlaceholderStr = window.form_state_save_vars.email_placeholder_str || 'Your Email Here';
                        const emailIcon = window.form_state_save_vars.email_button || 'Email';
                        if ($(this).hasClass('ff_resume_email_enabled')) {
                            let emailDiv =
                                `<div class="ff-el-input--content">
                                    <div class="ff_input-group">
                                        <input type="email" class="ff-el-form-control" placeholder="${emailPlaceholderStr}" class="ff-el-form-control">
                                        <div class="ff_input-group-append">
                                            <button class="ff-btn ff-btn-md ff_btn_style ff_btn_is_email ff_input-group-text">${emailIcon}</button>
                                        </div>
                                    </div>
                                </div>`;
                            let emailGroup = $('<div/>', { class: 'ff-el-group ff-saved-state-input  ff-email-address ff-hide-group', html: emailDiv });

                            $(inputGroup).after(
                                emailGroup
                            )
                            emailGroup.fadeIn();
                        }
                    }
                }).fail(error => {
                    if ($(savingResponseMsg).length) {
                        $(savingResponseMsg).slideUp('fast');
                    }
                    $('<div/>', {
                        'id': saveProgressMessage,
                        'class': 'ff-message-success ff-el-group text-danger'
                    })
                        .html(error.responseJSON.data.message)
                        .insertBefore($saveBttn.closest('.ff-el-group'));

                })
                    .always(function () {
                        $saveBttn.parent().hide();
                    });
            });
        });

        $(formSelector).on('click', '.ff_btn_copy_link', function (e) {
            e.preventDefault();
            let copiedText = $(this).closest('.ff-el-input--content').find('.ff-el-form-control').val();
            navigator.clipboard.writeText(copiedText);
            const copySuccess = window.form_state_save_vars.copy_success_button || 'Copied';
            $(this).html(`${copySuccess}`);
        });

        $(formSelector).on('click', '.ff_btn_is_email', function (e) {
            e.preventDefault();
            const emailBtn = $(this).closest('.ff-el-group');
            const to_email = $(this).closest('.ff-email-address').find('input').val();
            $('.ff-email-address').find('input').val('');
            const link = $('.ff-saved-state-link').find('input').val();
            const formData = {
                source_url: window.form_state_save_vars.source_url,
                action: 'fluentform_email_progress_link',
                form_id: $theForm.data('form_id'),
                to_email: to_email,
                link: link,
                hash: hash,
                nonce: window.form_state_save_vars.nonce
            };
            const emailResponse = formData.form_id + '_save_progress_email_response';
            const responseMessageSelector = '#' + emailResponse;

            jQuery.post(fluentFormVars.ajaxUrl, formData).then(data => {

                if (data) {
                    emailBtn.removeClass('ff-el-is-error')

                    if ($(responseMessageSelector).length) {
                        $(responseMessageSelector).slideUp('fast');
                    }
                    $('<div/>', {
                        'id': emailResponse,
                        'class': 'ff-message-success ff-el-group'
                    })
                        .html(data.data.response)
                        .insertAfter(emailBtn);

                }
            }).fail(error => {
                if (error) {

                    emailBtn.addClass('ff-el-is-error')

                    if ($(responseMessageSelector).length) {
                        $(responseMessageSelector).slideUp('fast');
                    }
                    $('<div/>', {
                        'id': emailResponse,
                        'class': 'ff-message-success ff-el-group text-danger'
                    })
                        .html(error.responseJSON.data.Error)
                        .insertAfter(emailBtn);
                }
            });
        });

        //load data
        let hashKey = false;
        if (typeof window.form_state_save_vars !== 'undefined') {
            hashKey = window.form_state_save_vars.key;
        }
        if (!hashKey) {
            return;
        }
        $theForm.append(`<input type="hidden" value="${ hashKey }" class="__fluent_state_hash" name="__fluent_state_hash"/>`)

        jQuery.getJSON(fluentFormVars.ajaxUrl, {
            form_id: $theForm.data('form_id'),
            action: 'fluentform_get_form_state',
            hash: hashKey,
            nonce: window.form_state_save_vars.nonce
        }).then(data => {
            if (data) {
                const sliderInstance = formSlider($, $theForm, window.fluentFormVars, formSelector);
                sliderInstance.populateFormDataAndSetActiveStep(data);
            }
        });
    })

})(jQuery);

