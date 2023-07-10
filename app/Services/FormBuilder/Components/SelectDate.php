<?php

namespace FluentForm\App\Services\FormBuilder\Components;

use FluentForm\App\Helpers\Helper;
use FluentForm\Framework\Helpers\ArrayHelper;
use FluentForm\App\Services\FormBuilder\Components\Select;

class SelectDate extends Select
{
    /**
     * Compile and echo the html element
     *
     * @param array     $data [element data]
     * @param \stdClass $form [Form Object]
     *
     * @return void
     */
    public function buildHtml($data, $form)
    {
        $hasConditions = $this->hasConditions($data) ? ' has-conditions ' : '';

        $data['attributes']['class'] .= $hasConditions;

        $data['attributes']['class'] .= trim(
            'ff-field_container ff-date-field-wrapper ' . esc_attr($data['settings']['container_class'])
        );
        $atts = $this->buildAttributes(
            ArrayHelper::except($data['attributes'], 'name')
        );

        $data['attributes']['id'] = $this->makeElementId($data, $form);

        $html = "<div {$atts}>"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $atts is escaped before being passed in.

        $labelPlacement = ArrayHelper::get($data, 'multi_field.settings.label_placement');
        if ($labelPlacement) {
            $labelPlacementClass = ' ff-el-form-' . esc_attr($labelPlacement);
        }

        // Merge parent settings with multi field settings
        $data['multi_field']['attributes']['id'] = $data['attributes']['id'];
        $data['multi_field']['settings']['help_message'] = $data['settings']['help_message'];
        $html .= $this->buildElementLabel($data['multi_field'], $form);
        
        $html .= "<div class='ff-t-container'>";
        
        $startYear    = ArrayHelper::get($data, 'multi_field.fields.year.settings.validation_rules.min.value');
        $endYear      = ArrayHelper::get($data, 'multi_field.fields.year.settings.validation_rules.max.value');
        $fields       = ArrayHelper::get($data, 'multi_field.fields');
        $fieldOrder   = ArrayHelper::get($data, 'multi_field.settings.field_order');
        $dateFormat   = ArrayHelper::get($data, 'multi_field.settings.date_format');
        $customFormat = ArrayHelper::get($data, 'multi_field.settings.custom_format');
        $dateFormat   = $dateFormat === 'custom' ? $customFormat : $dateFormat;
        $rootName     = $data['attributes']['name'];

        $fields = array_intersect_key($fields, array_flip($fieldOrder));
        $fields = array_merge(array_flip($fieldOrder), $fields);

        foreach ($fields as $field) {
            $fieldName = $field['attributes']['name'];
            $field['attributes']['name'] = $rootName . '[' . $fieldName . ']';
            $field['attributes']['class'] = trim('ff-el-form-control ' . $field['attributes']['class']);

            $field['settings']['container_class'] .= $labelPlacementClass;
            
            if ($tabIndex = Helper::getNextTabIndex()) {
                $field['attributes']['tabindex'] = $tabIndex;
            }

            $field['settings']['advanced_options'] = $this->getOptions($fieldName, $dateFormat, $startYear, $endYear);

            $field['attributes']['id'] = $this->makeElementId($field, $form);
            $atts = $this->buildAttributes($field['attributes']);

            
            $defaultValues = (array) $this->extractValueFromAttributes($field);
            
            $options = $this->buildOptions($field, $defaultValues);
            
            $elMarkup = '<select ' . $atts . ' aria-invalid="false">' . $options . '</select>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $atts, $options are escaped before being passed in.
            
            $selectMarkup = $this->buildElementMarkup($elMarkup, $field, $form);
            $html .= "<div class='ff-t-cell'>{$selectMarkup}</div>";  // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $inputTextMarkup is escaped before being passed in.
        }
        
        $html .= '</div>';
        $html .= '</div>';

        $hasLeadingZeroInDay = $this->checkDateFormat('d', $dateFormat);
        $this->loadToFooter($data['attributes']['id'], $hasLeadingZeroInDay);

        return $html;
    }

    public function checkDateFormat($char, $dateFormat)
    {
        return preg_match("/\b{$char}\b/", $dateFormat);
    }

    protected function getTimePeriodOptions()
    {
        $options = [
            ['label' => 'AM', 'value' => 'AM'],
            ['label' => 'PM', 'value' => 'PM'],
        ];
        return $options;
    }

    protected function getMinuteOptions()
    {
        $options = [];
        for ($i = 0; $i <= 59; $i++) {
            $minuteValue = sprintf('%02d', $i);
            $options[] = [
                'label' => $minuteValue,
                'value' => $minuteValue,
            ];
        }
        return $options;
    }

    protected function getHourOptions($dateFormat)
    {
        $is12HourFormat = $this->checkDateFormat('h', $dateFormat);

        // Set the hour range accordingly
        $startHour = $is12HourFormat ? 1 : 0;
        $endHour = $is12HourFormat ? 12 : 23;
        
        $options = [];
        for ($i = $startHour; $i <= $endHour; $i++) {
            $hourValue = sprintf('%02d', $i);
            $options[] = [
                'label' => $hourValue,
                'value' => $hourValue,
            ];
        }
        return $options;
    }

    protected function getDateOptions($dateFormat)
    {
        $isLeadingZero = $this->checkDateFormat('d', $dateFormat);
        $dayInMonth = date('t');
        
        $options = [];
        for ($i = 1; $i <= $dayInMonth; $i++) {
            $dayValue = $isLeadingZero ? sprintf('%02d', $i) : $i;
            $options[] = [
                'label' => $dayValue,
                'value' => $dayValue,
            ];
        }
        return $options;
    }

    protected function getMonthOptions($dateFormat)
    {
        $isLeadingZero = $this->checkDateFormat('m', $dateFormat);
        $isMonthName = $this->checkDateFormat('M', $dateFormat);
        $isMonthFullName = $this->checkDateFormat('F', $dateFormat);

        $options = [];
        for ($i = 1; $i <= 12; $i++) {
            $month = $isLeadingZero ? sprintf('%02d', $i) : $i;
            if ($isMonthName) {
                $month = date('M', mktime(0, 0, 0, $i, 10));
            } elseif ($isMonthFullName) {
                $month = date('F', mktime(0, 0, 0, $i, 10));
            }
            $options[] = [
                'label' => $month,
                'value' => $month,
            ];
        }
        return $options;
    }

    protected function getYearOptions($dateFormat, $startYear, $endYear)
    {
        // Get the max and min year
        $minYear = min($startYear, $endYear);
        $maxYear = max($startYear, $endYear);

        $options = [];
        for ($i = $minYear; $i <= $maxYear; $i++) {
            $options[] = [
                'label' => $i,
                'value' => $i,
            ];
        }
        return $options;
    }

    protected function getOptions($fieldName, $dateFormat, $startYear, $endYear)
    {
        $optionMethods = [
            'ampm' => 'getTimePeriodOptions',
            'minute' => 'getMinuteOptions',
            'hour' => 'getHourOptions',
            'day' => 'getDateOptions',
            'month' => 'getMonthOptions',
            'year' => 'getYearOptions',
        ];

        $options = [];
        // Check the map and call the corresponding method
        if (isset($optionMethods[$fieldName])) {
            $method = $optionMethods[$fieldName];
            if ('year' === $fieldName) {
                $options = $this->$method($dateFormat, $startYear, $endYear);
                return $options;
            }
            $options = $this->$method($dateFormat);
        }
        return $options;
    }

    public function getCustomDateFormatsWithFieldOrder() 
    {
        $customFormatsWithFieldOrder = apply_filters('fluentform/custom_date_formats_with_field_order', [
            'd' => ['day'],
            'j' => ['day'],
            'm' => ['month'],
            'n' => ['month'],
            'M' => ['month'],
            'F' => ['month'],
            'y' => ['year'],
            'Y' => ['year'],
            'H' => ['hour'],
            'h' => ['hour'],
            'i' => ['minute'],
            'K' => ['ampm'],
            'H:i' => ['hour', 'minute'],
            'h:i K' => ['hour', 'minute', 'ampm'],
            'm/d/Y' => ['month', 'day', 'year'],
            'd/m/Y' => ['day', 'month', 'year'],
            'd.m.Y' => ['day', 'month', 'year'],
            'n/j/y' => ['month', 'day', 'year'],
            'm/d/y' => ['month', 'day', 'year'],
            'M/d/Y' => ['month', 'day', 'year'],
            'y/m/d' => ['year', 'month', 'day'],
            'Y-m-d' => ['year', 'month', 'day'],
            'd-M-y' => ['day', 'month', 'year'],
            'm/d/Y H:i' => ['month', 'day', 'year', 'hour', 'minute'],
            'd/m/Y H:i' => ['day', 'month', 'year', 'hour', 'minute'],
            'd.m.Y H:i' => ['day', 'month', 'year', 'hour', 'minute'],
            'm/d/Y h:i K' => ['month', 'day', 'year', 'hour', 'minute', 'ampm'],
            'd/m/Y h:i K' => ['day', 'month', 'year', 'hour', 'minute', 'ampm'],
            'd.m.Y h:i K' => ['day', 'month', 'year', 'hour', 'minute', 'ampm'],
        ]);
        return $customFormatsWithFieldOrder;
    }

    private function loadToFooter($id, $hasLeadingZeroInDay)
    {
        add_action('wp_footer', function () use ($id, $hasLeadingZeroInDay) {
            ?>
                <script type="text/javascript">
                    jQuery(document).ready(function($){
                        function updateDateOptions(){
                            const date  = dateID.val();
                            const year = yearID.val();
                            const month = monthID.val();

                            // Get the month value from month name
                            const dateFromMonth = new Date(`${month} 1, 2000`);
                            const monthValue = dateFromMonth.getMonth() + 1;

                            // If the month is not selected, do nothing
                            if (!monthValue) {
                                return;
                            }
                            
                            // Get the number of days in the selected month
                            dayInMonth = new Date(year, monthValue, 0).getDate();
                            
                            // Clear existing options
                            dateID.empty();

                            // Initialize the default option
                            const defaultOption = $('<option>', {
                                value: '',
                                text: 'Day'
                            });
                            dateID.append(defaultOption);

                            // Add the new options
                            for (let i = 1; i <= dayInMonth; i++) {
                                const dayValue = hasLeadingZero ? ('0' + i).slice(-2) : i;
                                const optionElement = $('<option>', {
                                    value: dayValue,
                                    text: dayValue
                                });
                                dateID.append(optionElement);
                            }

                            // Update the selected date to the last day of the month if the previous date is greater than the number of days in the month
                            dateID.val((date > dayInMonth) ? dayInMonth : date);
                        }
                        const monthID = $('#<?php echo esc_attr($id); ?>_month_');
                        const yearID = $('#<?php echo esc_attr($id); ?>_year_');
                        const dateID = $('#<?php echo esc_attr($id); ?>_day_');
                        const hasLeadingZero = <?php echo $hasLeadingZeroInDay; ?>;

                        // Apply the event handler to both monthID and yearID
                        monthID.on('change', updateDateOptions);
                        yearID.on('change', updateDateOptions);
                    });

                </script>
            <?php
        }, 99999);
    }
}
