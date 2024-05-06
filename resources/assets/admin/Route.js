class Route {
    get(name, ...args) {
        const route = this[name];

        if (!route) {
            throw `${name}:Route Not Found`;
        }

        let continuation = 0;

        return route.replace(/{param}/g, function () {
            const replaceMent = args[continuation];

            continuation++;

            return replaceMent;
        });
    }

    getForms = "forms";
    storeForms = this.getForms;
    getTemplates = this.getForms + "/templates";


    findForm = this.getForms + "/{param}";
    updateForm = this.findForm;
    deleteForm = this.findForm;
    duplicateForm = this.findForm + "/duplicate";
    convertForm = this.findForm + "/convert";
    getFormResources = this.findForm + "/resources";
    getFormPages = this.findForm + "/pages";
    getFormFields = this.findForm + "/fields";
    getFormShortcodes = this.findForm + "/shortcodes";
    findFormShortCodePage = this.findForm + "/findShortCodePage";

    getFormSettings = "settings/{param}";
    storeFormSettings = this.getFormSettings;
    deleteFormSettings = this.getFormSettings;

    getPresetSettings = this.getFormSettings + "/preset";
    savePresetSettings = this.getFormSettings + "/save-preset";

    getGeneralFormSettings = this.getFormSettings + "/general";
    storeGeneralFormSettings = this.getGeneralFormSettings;

    getFormSettingsCustomizer = this.getFormSettings + "/customizer";
    storeFormSettingsCustomizer = this.getFormSettingsCustomizer;
    storeEntryColumns = this.getFormSettings + '/entry-columns';

    getFormSettingsConversationalDesign = this.getFormSettings + '/conversational-design';
    storeFormSettingsConversationalDesign = this.getFormSettings + '/store-conversational-design';

    getSubmissions = "submissions";
    getSubmissionsResources = this.getSubmissions + '/resources';
    handleSubmissionsBulkActions = this.getSubmissions + '/bulk-actions';
    getAllSubmissions = this.getSubmissions + '/all';

    findSubmission = this.getSubmissions + '/{param}'; // not implemented
    deleteSubmission = this.findSubmission;
    updateSubmissionStatus = this.findSubmission + '/status';
    toggleSubmissionIsFavorite = this.findSubmission + '/is-favorite';

    getSubmissionLogs = this.findSubmission + '/logs';
    deleteSubmissionLogs = this.findSubmission + '/logs';

    getSubmissionNotes = this.findSubmission + '/notes';
    storeSubmissionNote = this.findSubmission + '/notes';

    getSubmissionUsers = this.findSubmission + '/submission-users'
    updateSubmissionUser = this.findSubmission + '/update-submission-user'

    getLogs = 'logs';
    getLogFilters = this.getLogs + '/filters';
    deleteLogs = this.getLogs;

    integrations = 'integrations';
    getGlobalIntegration = this.integrations;
    updateGlobalIntegration = this.integrations;
    updateGlobalIntegrationStatus = this.integrations + '/update-status'
    findIntegration = this.integrations + "/{param}";
    getFormIntegrationSettings = this.findIntegration;
    updateFormIntegrationSettings = this.findIntegration;
    deleteFormIntegration = this.findIntegration;
    getIntegrations = this.findIntegration + "/form-integrations";
    getFormIntegrationList = this.findIntegration + '/integration-list-id';

    getGlobalSettings = 'global-settings';
    storeGlobalSettings = this.getGlobalSettings;

    getRoles = 'roles';
    storeRoles = this.getRoles;

    getManagers = 'managers';
    storeManager = this.getManagers;
    deleteManager = this.storeManager;

    analytics = 'analytics';
    getFormAnalytics = this.analytics + '/{param}'
    resetFormAnalytics = this.analytics + '/{param}/reset/'

    report = 'report';
    formsReport = this.report + '/forms'
    formReport = this.formsReport + '/{param}'
    submissionsReport = this.report + '/submissions';

    //pro routes
    inventory ='inventory';
    getInventoryList = this.inventory ;
    storeInventory = this.inventory ;

    noticeAction = 'notice';

    globalSearch = 'global-search';

}

export default new Route();
