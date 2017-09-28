//14. Settings Page - Region

//14.01 Creation of main Region add, edit, removal section
function createSettingsRegionTab_HTML() {
    // Set url
    window.history.pushState("object or string", "Title", "index.html?settings="+"region");
    local[1] = "region";

    // Set menu marker
    removeAllAttributesByName("class", "active");
    document.getElementById("regions").setAttribute("class", "active")

    var listOfCountries = '';
    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ){
        listOfCountries += '<li><a id="' + country.country_id + '" onclick="javascript:showAllTheRegionsOfSelectedCountry(this.id)" onmouseover="" style="cursor: pointer;">' + country.name_ru + '</a></li>';
    });

    document.getElementById("rightSettingsSection").innerHTML =
            '<h1 class="page-header">Regions</h1>' +
            '<span id="success"></span>' +
                '<div class="well">' +
                    '<p>This section gives you possible to <b>ADD</b>, <b>EDIT</b> or <b>REMOVE</b> \"region\" entity.</p>' +
                    '<p>Select \"Add new\" option to add new \"region\" or choose some particular entity that gonna be either edited or removed.</p>' +
                    '<p><b>Asterisk</b> is shown for all the mandatory fields which must be populated</p>' +
                    '<p><b>Pencil</b> is shown for all the non mandatory fields.</p>' +
                    '<p><b>Region ID</b> should be changed only manually because it depend on map ID and region ID prefix which also must be changed.</p>' +
                    '<hr>' +
                    '<p><b>Select country</b> that region you gonna to add/edit/remove belongs to. It has to reduce list of regions shown and makes it more userfriendly.</p>' +
                    '<div id="countryDropdown" class="btn-toolbar">' +
                        '<div class="btn-group">' +
                            '<button type="button" class="btn btn-info btn-default">List of existing Countries</button>' +
                            '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                                listOfCountries +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '<div id="RegionListSection"></div>' +
            '<div id="AddEditRemoveSection"></div>';

    //Remove copy marker and bottom line
    document.getElementById("copy_cert").innerHTML = "";
    document.getElementById("hr_bottom").innerHTML = "";
}

//14.02 Second region drop down
function showAllTheRegionsOfSelectedCountry(id) {
    var listOfRegions = '';
    var country = new CountryObj(id)
    local[2] = country.map_img;
    $.each (data.area.sort(dynamicSort("name_ru")), function( i, region ){
        var regionObj = new RegionObj(region.region_id);
        if (regionObj.country_id == id){
            listOfRegions += '<li><a id="' + region.region_id + '" onclick="javascript:addEditRemoveRegion(this.id)" onmouseover="" style="cursor: pointer;">' + region.name_ru + '</a></li>';
        }
    });

    document.getElementById("RegionListSection").innerHTML =
            '<div id="regionDropdown" class="btn-toolbar" style = "margin-left: 15px;">' +
                '<p><b>Select region</b> that you want to add/edit/remove.</p>' +
                '<div class="btn-group">' +
                    '<button type="button" class="btn btn-info btn-default btn-second-list">List of existing Regions</button>' +
                    '<button type="button" data-toggle="dropdown" class="btn btn-info dropdown-toggle"><span class="caret"></span></button>' +
                    '<ul class="dropdown-menu" aria-labelledby="dropdownMenu1">' +
                        '<li><a id="addnew" onclick="javascript:addEditRemoveRegion(this.id)" onmouseover="" style="cursor: pointer;">Add new</a></li>' +
                        '<li role="separator" class="divider"></li>' +
                        listOfRegions +
                    '</ul>' +
                '</div>' +
            '</div>';
    document.getElementById("AddEditRemoveSection").innerHTML = "";
}

//14.03 Creation of section to be able to add new, edit or removal of region
function addEditRemoveRegion(itemId) {
    var removeButton = ""; var regIdValue = ""; var readonly = ""; var editIdField = ""; var countries = '';
    var header = "Add new"; var submitStatus = "add";var listOfNotYetAddedRegions = "";
    var country_map_url = local[2];
    var region = (itemId != "addnew") ? $.grep (data.area, function( n, i ) {return ( n.region_id == itemId )}) : "newregion";
    local[0] = {
        country_id: (itemId != "addnew") ? region[0].country_id : "",
        region_id: itemId,
        name: (itemId != "addnew") ? region[0].name : "",
        name_ru: (itemId != "addnew") ? region[0].name_ru : "",
        active: (itemId != "addnew") ? (region[0].active != undefined) ? region[0].active: "" : ""
    };

    $.each (data.country.sort(dynamicSort("name_ru")), function( i, country ) {
        var selected = (country.country_id == region[0].country_id) ? " selected" : "";
        countries += "<option value='" + country.country_id + "' " + selected + ">" + country.name_ru + "</option>";
    });

    if (itemId != "addnew"){
        regIdValue = 'value="' + local[0].region_id + '" ';
        readonly = "readonly";
        header = "Edit";
        submitStatus = "edit";
        removeButton = '<input type="submit" class="btn btn-primary" onclick="RemoveRegion();return false" value="Remove selected item"/>' +
                '<span id="remove"></span>' +
                '<hr>';
    }
    else {
        var regionOptions = "";
        var distinctIds = {};
        $.each (data.area, function( i, region ) {
            if (region.country_id == local[0].country_id) {
                distinctIds[region.region_id] = true;
            }
        });

        $.getScript("SCRIPTS/MAPS/" + country_map_url, function() { AmCharts.maps.country_map_url.slice(0, -3) });
        $.each (AmCharts.maps.country_map_url.slice(0, -3).svg.g.path, function( i, newregion ) {
            if (!distinctIds[newregion.id]) {
                regionOptions += '<option value="' + newregion.id + '">' + newregion.title + '</option>'
            }
        });

        listOfNotYetAddedRegions =
                        '<div class="input-group">' +
                            '<span class="input-group-addon"><span class="glyphicon glyphicon-pencil"></span></span>' +
                            '<select id="newNotAddedRegion" class="form-control" onchange="populateForm(this.value)">' +
                                '<option value="0">Select region that not yet added to base among existing on country map or skip this step and add your own variant.</option>' +
                                regionOptions +
                            '</select>' +
                        '</div>' +
                        '<hr>';
    }

    document.getElementById("AddEditRemoveSection").innerHTML =
        '<h2 class="sub-header">' + header + ' country</h2>' +
        '<form>' +
            removeButton +
            listOfNotYetAddedRegions +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newId" type="text" class="form-control" placeholder="Enter unique region Id" ' + regIdValue + readonly + '>' +
//                editIdField +
            '</div>' +
            '<span id="alert_id"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newRusName" type="text" class="form-control" value="' + local[0].name_ru + '" placeholder="Enter russian name of region">' +
            '</div>' +
            '<span id="alert_name_ru"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<input id="newEngName" type="text" class="form-control" value="' + local[0].name + '" placeholder="Enter english name of region">' +
            '</div>' +
            '<span id="alert_name"></span>' +
            '<br>' +
            '<div class="input-group">' +
                '<span class="input-group-addon"><span class="glyphicon glyphicon-asterisk"></span></span>' +
                '<select id="newContinent" class="form-control">' +
                    '<option value="0">Select country that region belongs to.</option>' +
                    countries +
                '</select>' +
            '</div>' +
            '<span id="alert_continent"></span>' +
            '<br>' +
        '<hr>' +
        '<input type="submit" class="btn btn-primary" value="Submit changes" id="' + submitStatus + '" onclick="SubmitChanges(this.id);return false;" />' +
        '</form>';
}

//14.xx Populate add new region fields
function populateForm(id) {
    document.getElementById("newId").value = id;

    var e = document.getElementById("newNotAddedRegion");
    document.getElementById("newEngName").value = e.options[e.selectedIndex].text;
}