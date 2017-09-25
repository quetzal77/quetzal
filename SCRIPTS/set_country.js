//12. Settings Page - Country

//12.01 Creation of main Country add, edit, removal section
function createSettingsCountryTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"country");
    local[1] = "country";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("countries").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ){
        listOfCountries += '<li><a id="' + country.short_name + '" onclick="javascript:addEditRemoveCountry(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
                '<h1 class="page-header">Countries</h1>' +
                '<span id="success"></span>' +
                    '<div class="well">' +
                        '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"country\" entity.</p>' +
                        '<p>Select \"Add new\" option to add new \"country\" or choose some particular entity that gonna be either edited or removed.</p>' +
                        '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                        '<p><b>Pencil</b> is shown for all the non mandatory fields.</p>' +
                        '<div id="countryDropdown" class="btn-toolbar">' +
                            '<div class="btn-group">' +
                                '<button type="button" class="btn btn-info btn-default">List of existing Countries</button>' +
                                '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                                '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                    '<li><a id="addnew" onclick="javascript:addEditRemoveCountry(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                                    '<li role="separator" class="divider"></li>' +
                                    listOfCountries +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//12.02 Creation of section to be able to add new, edit or removal of country
function addEditRemoveCountry(itemId) {
    var removeButton = ""; var contIdValue = ""; var contSNValue = ""; var readonly = ""; var editIdField = ""; var editIdField_2 = "";
    var header = "Add new"; var submitStatus = "add"; var continents = '';
    var country = (itemId != "addnew") ? $.grep (data.country, function( n, i ) {return ( n.short_name == itemId )}) : "newcountry";
    local[0] = {
        country_id: (itemId != "addnew") ? country[0].country_id : "",
        continent_id: (itemId != "addnew") ? country[0].continent_id : "",
        name: (itemId != "addnew") ? country[0].name : "",
        name_ru: (itemId != "addnew") ? country[0].name_ru : "",
        name_nt: (itemId != "addnew") ? (country[0].name_nt != undefined) ? country[0].name_nt: "" : "",
        small_flag_img: (itemId != "addnew") ? (country[0].small_flag_img != undefined) ? country[0].small_flag_img: "" : "",
        short_name: itemId
    };

    $.each (data.continent.sort(dynamicSort("name_ru")), function( i, continent ) {
        var selected = (continent.continent_id == country[0].continent_id) ? " selected" : "";
        continents += "<option value='" + continent.continent_id + "' " + selected + ">" + continent.name_ru + "</option>";
    });

    if (itemId != "addnew"){
        contIdValue = 'value="' + local[0].country_id + '" ';
        contSNValue = 'value="' + local[0].short_name + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveCountry();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
        editIdField = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newId" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
        editIdField_2 = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newShortName" onclick="javascript:unblockReadonlyField(this.id)">Edit</button></span>';
    }
        editIdField_3 = '<span class="input-group-btn"><button class="btn btn-secondary" type="button" id="newSmallFlagCheck" onclick="javascript:checkSmallFlag()">Check flag</button></span>';

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' country</h2>' +
        '<form>' +
            removeButton +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique country Id" ' + contIdValue + readonly + '>' +
                editIdField +
            '</div>' +
            '<span id="alert_id"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newShortName" type="text" class="form-control" placeholder="Enter unique country Short Name" ' + contSNValue + readonly + '>' +
                editIdField_2 +
            '</div>' +
            '<span id="alert_short_name"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + local[0].name_ru + '" placeholder="Enter russian name of country">' +
            '</div>' +
            '<span id="alert_name_ru"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + local[0].name + '" placeholder="Enter english name of country">' +
            '</div>' +
            '<span id="alert_name"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                '<input id="newNtName" type="text" class="form-control" value="' + local[0].name_nt + '" placeholder="Enter native name of country (use language of main nation)">' +
            '</div>' +
            '<span id="alert_name_nt"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<select id="newContinent" class="form-control">' +
                    '<option value="0">Select continent that country belongs to.</option>' +
                    continents +
                '</select>' +
            '</div>' +
            '<span id="alert_continent"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newSmallImg" type="text" class="form-control" value="' + local[0].small_flag_img + '" placeholder="Enter coordanates of small flag of your country">' +
                editIdField_3 +
            '</div>' +
            '<span id="alert_small_img"></span>' +
            '<br>' +
        '<span id="checkFlags"></span>' +
        '<hr>' +
        '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
        '</form>';
}

//12.03 Submit changes for Add new of edit event
function SubmitChanges(status) {
    var newCountryObj = {
                     country_id: document.getElementById("newId").value.trim(),
                     continent_id: document.getElementById("newContinent").value.trim(),
                     name: document.getElementById("newRusName").value.trim(),
                     name_ru: document.getElementById("newEngName").value.trim(),
                     short_name: document.getElementById("newShortName").value.trim(),
                     small_flag_img: document.getElementById("newSmallImg").value.trim()
                   };

    if (document.getElementById("newNtName").value.trim() != "") { newCountryObj["name_nt"] = document.getElementById("newNtName").value.trim(); }

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ru");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_short_name");
    removeAllChildNodes("alert_continent");
    removeAllChildNodes("alert_small_img");
    removeAllChildNodes("success");

    if (status == "add") {
        if (checkRules4AddUpdate(newCountryObj)) {
            $.getScript("SCRIPTS/set_content.js", function(){
                addElementOfGlobalDataArray(newCountryObj);
                createSettingsCountryTab_HTML();
                alertOfSuccess();
            });
        }
    }
    else {
        if (checkRules4AddUpdate(newCountryObj)) {
            $.getScript("SCRIPTS/set_content.js", function(){
                updateElementOfGlobalDataArray(newCountryObj);
                createSettingsCountryTab_HTML();
                alertOfSuccess();
            });
        }
    }
    return false;
}

//12.04 Remove item entity handler
function RemoveCountry() {
    var newID = document.getElementById('newId').value;
    var distinctIds = {};
    var regionsToRemoveArray = $.grep (data.area, function( n, i ) {return (n.country_id == newID)});

    removeAllChildNodes("alert_id");
    removeAllChildNodes("alert_name_ru");
    removeAllChildNodes("alert_name");
    removeAllChildNodes("alert_short_name");
    removeAllChildNodes("alert_continent");
    removeAllChildNodes("success");
    removeAllChildNodes("alert_small_img");

    if (regionsToRemoveArray.length > 0) {
        var regionsLinkedToCountry = "";
        $.each (regionsToRemoveArray, function( i, region ){
            regionsLinkedToCountry += '<b>' + region.name_ru + '</b>, ';
        });
        document.getElementById("remove").innerHTML =
            '<div class="alert alert-danger fade in">' +
            '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
            '<strong>Error!</strong> This item can\'t be removed, because it\'s still dependent on some region. Change country id (or remove region) for following regions: ' +
            regionsLinkedToCountry.slice(0, -2) + '.' +
            '</div>';
    }
    else {
        $.getScript("SCRIPTS/set_content.js", function(){
            removeElementOfGlobalData4DefinedArray ("country_id", newID);
            createSettingsCountryTab_HTML();
            alertOfSuccess();
        });
    }
}

//12.05 Verification for Add/Update fields
function checkRules4AddUpdate(countryObj) {
    var result = true;
    var initialCountryObj = local[0];
    for (var i = 0; i < data.country.length; i++) {
        if (initialCountryObj.short_name != "addnew") {
            if (initialCountryObj.country_id.toLowerCase() != countryObj.country_id.toLowerCase() && data.country[i].country_id.toLowerCase() == countryObj.country_id.toLowerCase()){
                alertOfDuplicateIDFailure(data.country[i].country_id, data.country[i].name_ru);
                result = false;
            }
            if (initialCountryObj.short_name.toLowerCase() != countryObj.short_name.toLowerCase() && data.country[i].short_name.toLowerCase() == countryObj.short_name.toLowerCase()){
                alertOfDuplicateSNFailure(data.country[i].short_name, data.country[i].name_ru);
                result = false;
            }
        }
        else {
            if (data.country[i].country_id.toLowerCase() == countryObj.country_id.toLowerCase()){
                alertOfDuplicateIDFailure(data.country[i].country_id, data.country[i].name_ru);
                result = false;
            }
            if (data.country[i].short_name.toLowerCase() == countryObj.short_name.toLowerCase()){
                alertOfDuplicateSNFailure(data.country[i].short_name, data.country[i].name_ru);
                result = false;
            }
        }
        if (countryObj.country_id == ''){ alertOfEmptyMandatoryField("alert_id"); result = false; }
        if (countryObj.short_name == ''){ alertOfEmptyMandatoryField("alert_short_name"); result = false; }
        if (countryObj.name_ru == ''){ alertOfEmptyMandatoryField("alert_name_ru"); result = false; }
        if (countryObj.name == ''){ alertOfEmptyMandatoryField("alert_name"); result = false; }
        if (countryObj.continent_id == '0'){ alertOfEmptyMandatoryField("alert_continent"); result = false; }
        if (countryObj.small_flag_img == ''){ alertOfEmptyMandatoryField("alert_small_img"); result = false; }
    }
    return result;
}


//12.06 Success flag for any event successfully applied
function alertOfSuccess() {
    removeAllChildNodes("alert");
    document.getElementById("success").innerHTML =
        '<div class="alert alert-success fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Success!</strong> Your changes are successfully applied. Check list of Cities to see changes added.' +
        '</div>';
}

//12.07 Failure flag for not unique ID applied
function alertOfDuplicateIDFailure(id, name_ru) {
    removeAllChildNodes("success");
    document.getElementById("alert_id").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id  + ' (' + name_ru + ')</b>. Try to use another id!' +
        '</div>';
}

//12.08 Failure flag for not unique ShortName applied
function alertOfDuplicateSNFailure(id, name_ru) {
    removeAllChildNodes("success");
    document.getElementById("alert_short_name").innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Id is not unique, it\'s one already accociated with <b>' + id  + ' (' + name_ru + ')</b>. Try to use another id!' +
        '</div>';
}

//12.09 Failure flag for empty mandatory field
function alertOfEmptyMandatoryField(alertId) {
    removeAllChildNodes("success");
    document.getElementById(alertId).innerHTML =
        '<div class="alert alert-danger fade in">' +
        '<a href="#" class="close" data-dismiss="alert">&times;</a>' +
        '<strong>Error!</strong> Mandatory field is empty. Popullate it before submit.' +
        '</div>';
}

//12.10 Add image to verify if it looks good
function checkSmallFlag() {
    var flagCoordinates = document.getElementById("newSmallImg").value.trim()

    if (flagCoordinates != "") {
        document.getElementById("checkFlags").innerHTML =
                '<hr>' +
                '<img src="IMG/icon/x.gif" class="countflag" style="background-position:' + flagCoordinates + '" />';
    }
    else {
        alertOfEmptyMandatoryField("alert_small_img");
    }

}