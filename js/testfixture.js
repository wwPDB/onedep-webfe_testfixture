/*
 * File:  testFixture.js
 * Date:  20-Nov-2017  J. Westbrook
 *
 * Updates:
 */
//
// Globals -
//

var fullTaskDict  = {'#list-stored-form'          : '/service/testfixture/listsaved',
		     '#restore-stored-form'          : '/service/testfixture/restore',
		     '#store-form'          : '/service/testfixture/store',
                    };


//var newSessionServiceUrl = '/service/ann_tasks_v2/newsession';
//var endSessionServiceUrl = '/service/ann_tasks_v2/finish';


/*window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};*/

(function(){var b,d,c=this,a=c.console;c.log=b=function(){d.push(arguments);a&&a.log[a.firebug?"apply":"call"](a,Array.prototype.slice.call(arguments))};c.logargs=function(e){b(e,arguments.callee.caller.arguments)};b.history=d=[]})();
String.prototype.startsWith = function (str){
	return this.indexOf(str) == 0;
};


/*
function newSession(context) {
    var retObj;
    clearServiceContext();
    var serviceData = getServiceContext();
    logContext("Calling newsession ");
    //$.ajax({url: newSessionServiceUrl, async: false, data: {context: context}, type: 'post', success: assignSession } );
    $.ajax({
        url: newSessionServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    //
    assignContext(retObj);
    logContext("After newsession ");
    appendContextToMenuUrls();
}
*/

/*
function endSession() {
    logContext("Starting endSession ");
    var serviceData = getServiceContext();
    $.ajax({
        url: endSessionServiceUrl,
        async: true,
        data: serviceData,
        type: 'post',
        beforeSend: function() {
            progressStart();
	        $("#confirm-dialog").html("Ready to leave this module?");
        },
        success: function (jsonObj) {
	        progressEnd();
	        if (jsonObj.errorflag) {
		        $("#op-status").html(jsonObj.statustext);
	        } else {
		        $("#op-status").html(jsonObj.htmlcontent);
		        $(window).unbind('beforeunload')
		        closeWindow();
	        }
        }
    });
}
*/


/*
function getSessionInfo() {
    var retObj;
    var serviceData = getServiceContext();
    logContext("Calling getSessionInfo() for entry " + entryId);
    $.ajax({
        url: getSessionInfoServiceUrl,
        async: false,
        data: serviceData,
        type: 'post',
        success: function (jsonObj) {
            retObj = jsonObj;
        }
    });
    return retObj;
}
*/


/*
function getEntityInfoDetails() {
    var serviceData = getServiceContext();
    return $.ajax({
	    url: '/service/ann_tasks_v2/entityloadinfo',
	    data: serviceData,
	    dataType: 'json',
        async: true,
        beforeSend: function() {
            progressStart();
            logContext("Starting get entity details for entry " + entryId);
        },
	    success: function (jsonObj) {
	        $('#entity-info-content').html(jsonObj.htmlcontent);
	        $('#entity-info-container').show();
            logContext("Completed get entity details for entry " + entryId);
	    }
    });
}
*/

/*
function appendContextToMenuUrls() {
    // append the current session id to menu urls
    $("fieldset legend a, #top-menu-options li a, .navbar-header a" ).attr('href', function (index, href) {
        ret = href.split("?")[0];
        if (sessionId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'sessionid=' + sessionId;
        }
        if (entryId.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryid=' + entryId;
        }
        if (entryFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryfilename=' + entryFileName;
        }

        if (entryExpFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entryexpfilename=' + entryExpFileName;
        }

        if (entryCsFileName.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'entrycsfilename=' + entryCsFileName;
        }

        if (standaloneMode.length > 0) {
            ret += (/\?/.test(ret) ? '&' : '?') + 'standalonemode=' + standaloneMode;
        }

        //console.log("index = " + index + " href " + href + " ret = " + ret);

        return ret;
    });
    //JDW ###
    if (entryId.length > 0 && entryFileName.length > 0 ) {
	   getEntryInfo(null);

    }


}
*/


function logContext(message) {
    log("%lc: " + message + " ");
}

function setOptionButtonVisible(id) {
    if (entryFileName.length > 0) {
        $(id).show();
    } else {
        $(id).hide();
    }
}

function progressStart() {
    logContext("Called progressStart() -----------");
    $("#loading").fadeIn('slow').spin("large", "black");
    return false;
}

function progressEnd() {
    logContext("Called progressEnd() -----------");
    $("#loading").fadeOut('fast').spin(false);
    return false;
}


// Document ready entry point
//
$(document).ready(function () {
	//    <!-- Task operations -->
	if ($("#task-dialog").length > 0) {
	    $("#task-alt-dialog").html();
	    $("#task-alt-dialog").show();
	    $("#task-dialog").show();
	    for ( var myTask in fullTaskDict) {
		<!-- lite up the task form -->
		    $(myTask).ajaxForm({
			    url: fullTaskDict[myTask],
				dataType: 'json',
				success: function (jsonObj,statusText, xhr, $form) {
				taskFormCompletionOp(jsonObj,"#" + $form.attr('id'));
			    },
				beforeSubmit: function (arr, $form, options) {
				taskFormPrepOp(arr,"#" + $form.attr('id'));
			    }
			});
	    }
	} else {
	    $("#task-dialog").hide();
	    $("#task-alt-dialog").html("No file uploaded");
	    $("#task-alt-dialog").show();
	}

    }); // end-ready

function taskFormPrepOp(arr, formId) {
    logContext("Before task calculation >> " + formId);
    progressStart();
    $(formId + ' fieldset div.my-task-form-status').hide();
    $(formId + ' fieldset input.my-task-form-submit ').hide();
    updateTaskFormContent(arr,formId);
}

function updateTaskFormContent(arr,formId) {
    /*
    arr.push({ "name": "sessionid",           "value": sessionId    });
    arr.push({ "name": "entryid",             "value": entryId    });
    arr.push({ "name": "entryfilename",       "value": entryFileName    });
    arr.push({ "name": "entryexpfilename",    "value": entryExpFileName    });
    arr.push({ "name": "entrycsfilename",    "value": entryCsFileName    });
    arr.push({ "name": "taskformid",          "value": formId   });
    */
}

function taskFormCompletionOp(jsonObj, formId) {
    logContext("Completion processing for  >> " + formId);
    updateFormStatus(jsonObj, formId);
    $(formId + ' fieldset input.my-task-form-submit ').show();
    progressEnd();
}

function updateFormStatus(jsonObj, formId) {

    var statusText ='';
    /* if ('taskformid' in jsonObj) {
	formId = jsonObj.taskformid;
	} */
    if ('statusmessage' in jsonObj) {
	statusText = jsonObj.statusmessage;
    }
    logContext("updateformstatus   >> " + formId + " statustext " + statusText);
    if (formId == '#list-stored-form') {
	if (statusText == 'ok') {
	    statusText = '';
	    output = '';
	    var arr = jsonObj.entries;
	    arr.sort();
	    output = '';
	    for (var key in arr) {
		output = output + '<p>' + arr[key] + '</p>';
	    }
	    $(formId + ' fieldset div.my-task-form-list').html(output);
	    $(formId + ' fieldset div.my-task-form-list').show();
	}
    }

    if (formId == '#store-form') {
	if (statusText == 'ok') {
	    statusText = jsonObj.storedsession;
	}
    }

    if (formId.length > 0 && statusText.length > 0) {
	var errFlag = jsonObj.errorflag;
	if (errFlag) {
            $(formId + ' fieldset div.my-task-form-status').html(statusText);
            $(formId + ' fieldset div.my-task-form-status').addClass('error-status');
	} else {
            $(formId + ' fieldset div.my-task-form-status').html(statusText);
            $(formId + ' fieldset div.my-task-form-status').removeClass('error-status');
	}
	$(formId + ' fieldset div.my-task-form-status').show();
    }
}
