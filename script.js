let jpdbURL = "http://api.login2explore.com:5577";
let jpdpIRL = "/api/irl";
let jpdpIML = "/api/iml";
let ProjectManagementDB = "COLLEGE-DB";
let pmRelationName = "PROJECT-TABLE";
let connToken = "90931287|-31949327997802517|90961058";


function saveRecNo2LS(jsonObj) {
    let lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}


function resetData() {
    $("#projectId").val("");
    $("#projectName").val("");
    $("#assignTo").val("");
    $("#assignDate").val("");
    $("#deadline").val("");
    $("#projectID").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#projectId").focus();
}

function getProjectIdAsJsonObj() {
    let projectId = $("#projectId").val();
    console.log(projectId)
    let jsonStr = {
        projectId: projectId,
    }
    return JSON.stringify(jsonStr);
}

function validateAndGetFormData() {
    let projectIdVar = $("#projectId").val();
    if (projectIdVar === "") {
        alert("Project ID Required !!");
        $("#projectId").focus();
        return "";
    }

    let projectNameVar = $("#projectName").val();
    if (projectNameVar === "") {
        alert("Project Name Required !!");
        $("#projectName").focus();
        return "";
    }

    let assignToVar = $("#assignTo").val();
    if (assignToVar === "") {
        alert("assign To Required !!");
        $("#assignTo").focus();
        return "";
    }

    let assignDateVar = $("#assignDate").val();
    if (assignDateVar === "") {
        alert("assignDate Required !!");
        $("#assignDate").focus();
        return "";
    }

    let deadlineVar = $("#deadline").val();
    if (deadlineVar === "") {
        alert("deadline Required !!");
        $("#deadline").focus();
        return "";
    }

    let jsonStrObj = {
        projectId: projectIdVar,
        projectName: projectNameVar,
        assignTo: assignToVar,
        assignDate: assignDateVar,
        deadline: deadlineVar,
    };

    console.log(JSON.stringify(jsonStrObj));
    return JSON.stringify(jsonStrObj);
}


function createPUTRequest(connToken, jsonObj, dbName, relName) {
    let putRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";

    console.log(putRequest)
    return putRequest;
}


function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);

    let record = JSON.parse(jsonObj.data).record;
    $("#projectName").val(record.projectName);
    $("#assignTo").val(record.assignTo);
    $("#assignDate").val(record.assignDate);
    $("#deadline").val(record.deadline);

}


function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    let url = dbBaseUrl + apiEndPointUrl;
    let jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}



function saveData() {
    let jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }

    let putRequestStr = createPUTRequest(
        connToken,
        jsonStr,
        ProjectManagementDB,
        pmRelationName
    );

    alert(putRequestStr);
    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommand(
        putRequestStr,
        "http://api.login2explore.com:5577",
        "/api/iml"
    );
    jQuery.ajaxSetup({ async: true });

    alert(JSON.stringify(resultObj));
    resetData();
    $("projectId").focus()
}



function updateData() {
    $('#update').prop('disabled', true);
    jsonChg = validateAndGetFormData();
    let updateRequest = createUPDATERecordRequest(connToken, jsonChg, ProjectManagementDB, pmRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbURL, jpdpIML);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetData();
    $('#projectId').focus();

}


function getProject() {
    let projectIdJsonObj = getProjectIdAsJsonObj();
    let getRequest = createGET_BY_KEYRequest(connToken, ProjectManagementDB, pmRelationName, projectIdJsonObj);
    jQuery.ajaxSetup({ async: false });
    let resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbURL, jpdpIRL);
    console.log(resJsonObj)
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#projectName').focus();

    } else if (resJsonObj.status === 200) {
        console.log(resJsonObj)
        $('projectId').prop('disabled', true);

        fillData(resJsonObj);

        $('#update').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#projectName').focus();

    }



}