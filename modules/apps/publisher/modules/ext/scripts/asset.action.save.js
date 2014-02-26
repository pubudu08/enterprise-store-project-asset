var meta = {
    use: 'action',
    purpose: 'save',
    type: 'form',
    source: 'default',
    applyTo: '*',
    required: ['model', 'template'],
    name: 'asset.action.save'
};

/*
Description:Saves the contents of the model to an artifact instance and then retrieves the
            id
Filename: asset.action.save.js
Created Date: 8/8/2013
 */


var module = function () {

    var configs = require('/config/publisher.json');
    var log = new Log();

    /*
    adding asset details to Social Cache DB.
     */
    function addToSocialCache(id, type) {
        if (id) {
            var logged = require('store').server.current(session);
            var domain = (logged && logged.tenantDomain) ? logged.tenantDomain : "carbon.super";

            var CREATE_QUERY = "CREATE TABLE IF NOT EXISTS SOCIAL_CACHE (id VARCHAR(255) NOT NULL,tenant VARCHAR(255),type VARCHAR(255), " +
                "body VARCHAR(5000), rating DOUBLE,  PRIMARY KEY ( id ))";
            var server = require('store').server;
            server.privileged(function () {
                var db = new Database("SOCIAL_CACHE");
                db.query(CREATE_QUERY);
                var combinedId = type + ':' + id;
                db.query("MERGE INTO SOCIAL_CACHE (id,tenant,type,body,rating) VALUES('" + combinedId + "','" + domain + "','" + type + "','',0)");
                db.close();
            });
        }
    }

    function createVCSRepo(context) {

        var model = context.model;
        var rxtManager = context.rxtManager;
        var artifactManager = rxtManager.getArtifactManager("vcs");
        var resourceId = model.getField('Other.VCSResourceID').value;
        var repoLocation = model.getField('Other.VersionControl').value;


        repoLocation = repoLocation.substring((repoLocation.lastIndexOf("/") + 1), (repoLocation.length + 1));
        var artifactManager = rxtManager.getArtifactManager('vcs');

        if (resourceId !== null) {
            var artifact = artifactManager.get(resourceId);
            var osgiService;
            var repositoryAdminService = carbon.server.osgiServices('org.wso2.carbon.utility.versioncontrol.IRepository');
            for (var i = 0; i < repositoryAdminService.size(); i++) {
                var id = repositoryAdminService.get(i).getRepositoryType();
                if (id.toLocaleLowerCase() == artifact.attributes.overview_serverType.toLocaleLowerCase()) {
                    osgiService = repositoryAdminService.get(i);
                }
            }
            var status = osgiService.createRepository(artifact.attributes.interface_username, artifact.attributes.interface_password, repoLocation);

            var result = {
                success: Boolean(status),
                status: status
            };


        }

    }

    function createPMSProject(context) {
        var model = context.model;
        var rxtManager = context.rxtManager;
        var pMSResourceId = model.getField('Other.PMSResourceID').value;
        var pMSEndPoint = model.getField('Other.ProjectManagementTool').value;
        pMSEndPoint = pMSEndPoint.substring((pMSEndPoint.lastIndexOf("/") + 1), (pMSEndPoint.length + 1));
        var artifactManager = rxtManager.getArtifactManager('pms');
        if (pMSResourceId !== null) {
            var artifact = artifactManager.get(pMSResourceId);
            var osgiService;
            var pMAdminService = carbon.server.osgiServices('org.wso2.carbon.utility.projectmanagement.IProjectManagement');
            for (var i = 0; i < pMAdminService.size(); i++) {
                var id = pMAdminService.get(i).getPMSType();
                if (id.toLocaleLowerCase() == artifact.attributes.overview_serverType.toLocaleLowerCase()) {
                    osgiService = pMAdminService.get(i);
                }
            }
            var status = osgiService.createPMSProject(artifact.attributes.interface_username, artifact.attributes.interface_password, pMSEndPoint);

            var result = {
                success: Boolean(status),
                status: status
            };
        }


    }

    function createIssueTrackerProject(context) {
        var model = context.model;
        var rxtManager = context.rxtManager;
        var issueTrackerResourceId = model.getField('Other.ISSResourceID').value;
        var issueTrackerEndPoint = model.getField('Other.IssueTracker').value;
        issueTrackerEndPoint = issueTrackerEndPoint.substring((issueTrackerEndPoint.lastIndexOf("/") + 1), (issueTrackerEndPoint.length + 1));
        var artifactManager = rxtManager.getArtifactManager('iss');
        if (issueTrackerResourceId !== null) {
            var artifact = artifactManager.get(issueTrackerResourceId);
            var osgiService;
            var issueTrackerAdminService = carbon.server.osgiServices('org.wso2.carbon.utility.issuetracker.IIssueTracker');
            for (var i = 0; i < issueTrackerAdminService.size(); i++) {
                var id = issueTrackerAdminService.get(i).getIssueTrackerType();
                log.info(id.toLocaleLowerCase() + "  " + artifact.attributes.overview_serverType.toLocaleLowerCase())
                if (id.toLocaleLowerCase() == artifact.attributes.overview_serverType.toLocaleLowerCase()) {
                    osgiService = issueTrackerAdminService.get(i);
                    log.info(osgiService);
                }
            }
            //String projectKey,String name,String description,String url,String lead
            log.info(artifact.attributes.interface_username + " " + artifact.attributes.interface_password + " " + issueTrackerEndPoint + " " + issueTrackerResourceId);
            var status = osgiService.createIssueTrackerProject(artifact.attributes.interface_username, artifact.attributes.interface_password, issueTrackerEndPoint, issueTrackerEndPoint, issueTrackerEndPoint, "", artifact.attributes.interface_username);

            var result = {
                success: Boolean(status),
                status: status
            };
        }
    }

    function createCIProject(context) {
        var model = context.model;
        var rxtManager = context.rxtManager;
        var cIResourceId = model.getField('Other.CISResourceID').value;
        var cIJobName = model.getField('Other.ContinuousIntegration').value;
        cIJobName = cIJobName.substring((cIJobName.lastIndexOf("/") + 1), (cIJobName.length + 1));
        var artifactManager = rxtManager.getArtifactManager('cis');
        if (cIResourceId !== null) {
            var artifact = artifactManager.get(cIResourceId);
            var osgiService;
            var cIAdminService = carbon.server.osgiServices('org.wso2.carbon.utility.continuousintegration.IContinuousIntegration');
            for (var i = 0; i < cIAdminService.size(); i++) {
                var id = cIAdminService.get(i).getCISType();
                log.info(id.toLocaleLowerCase() + "  " + artifact.attributes.overview_serverType.toLocaleLowerCase())
                if (id.toLocaleLowerCase() == artifact.attributes.overview_serverType.toLocaleLowerCase()) {
                    osgiService = cIAdminService.get(i);
                    log.info(osgiService);
                }
            }

            var status = osgiService.createCISProject(artifact.attributes.interface_username, artifact.attributes.interface_password, artifact.attributes.interface_serverURL, cIJobName);
            var result = {
                success: Boolean(status),
                status: status
            };


        }
    }


    return {
        execute: function (context) {

            var utility = require('/modules/utility.js').rxt_utility();

            log.debug('Entered : ' + meta.name);

            log.debug(stringify(context.actionMap));

            var model = context.model;
            var template = context.template;

            var now = new String(new Date().valueOf());
            var length = now.length;
            var prefix = configs.constants.assetCreatedDateLength;
            var onsetVal = '';
            if (length != prefix) {
                var onset = prefix - length;
                for (var i = 0; i < onset; i++) {
                    onsetVal += '0';
                }
            }
            model.setField('overview.createdtime', onsetVal + now);
            var name = model.getField('overview.name').value;
            var version = model.getField('overview.version').value;
            var shortName = template.shortName;

            log.debug('Artifact name: ' + name);

            log.debug('Converting model to an artifact for use with an artifact manager');

            //Export the model to an asset
            var asset = context.parent.export('asset.exporter');

            log.debug('Finished exporting model to an artifact');

            //Save the artifact
            log.debug('Saving artifact with name :' + name);


            //Get the artifact using the name
            var rxtManager = context.rxtManager;


            var artifactManager = rxtManager.getArtifactManager(shortName);

            artifactManager.add(asset);

            //name='test-gadget-7';

            log.debug('Finished saving asset : ' + name);

            //The predicate object used to compare the assets
            var predicate = {
                attributes: {
                    overview_name: name,
                    overview_version: version
                }
            };
            var artifact = artifactManager.find(function (adapter) {
                //Check if the name and version are the same
                //return ((adapter.attributes.overview_name==name)&&(adapter.attributes.overview_version==version))?true:false;
                return utility.assertEqual(adapter, predicate);
            }, null);

            log.debug('Locating saved asset: ' + stringify(artifact) + ' to get the asset id.');

            var id = artifact[0].id || ' ';

            log.debug('Setting id of model to ' + id);

            //adding asset to social
            addToSocialCache(id, template.shortName);

            //Save the id data to the model
            model.setField('*.id', id);

            if (shortName === "project") {


                if (model.getField('Other.VCSResourceID').value != null && model.getField('Other.VCSResourceID').value.trim().length >0) {
                    createVCSRepo(context);

                }

                if (model.getField('Other.CISResourceID').value != null && model.getField('Other.CISResourceID').value.trim().length >0 ) {
                    createCIProject(context);

                }

                if (model.getField('Other.PMSResourceID').value != null && model.getField('Other.PMSResourceID').value.trim().length >0) {
                    createPMSProject(context);

                }

                if (model.getField('Other.ISSResourceID').value != null && model.getField('Other.ISSResourceID').value.trim().length >0) {
                    createIssueTrackerProject(context);

                }


            }

            log.debug('Finished saving asset with id: ' + id);
        }
    }
};