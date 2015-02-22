/**
 * Created by Mike on 12/26/14.
 */
jQuery.noConflict();
jQuery(function(){
    //Add Style Sheets
    var styleSheets = ["style/main", "style/WebRegCalendar", "style/WebRegCourseSelection", "vendor/tooltipster/tooltipster"];
    addCustomStylesheetResources(styleSheets);
    //Import Roboto font
    addStylesheet('https://fonts.googleapis.com/css?family=Roboto:400,300,100', 'RobotoImport');
    addStylesheet('https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css', 'FontAwesome');

    //Watch for Calendar Changes
    watchDOMMutation(jQuery('#calendar')[0], function(){
        Calendar();

    },{childList: true});

    //Make Course Selection Changes
    CourseSelection();


});

//Array of chrome resource paths
function addCustomStylesheetResources(arr){
    for(var i=0; i<arr.length; i++){
        addStylesheet(chrome.extension.getURL(arr[i]+".css"), arr[i].replace(/\W/g, ''));
    }
}

//Add stylesheet with URL and ID. ID for later removal
function addStylesheet(url, id){
    jQuery('head').append('<link rel="stylesheet" type="text/css" href="'+url+'" id="'+id+'">');
}

//Attach element to mutation observer
function watchDOMMutation(elem, callback, con){
    var notifWatcher = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation){callback(mutation);});
    });
    var config = { attributes: true, childList: true, characterData: true, subtree:true};
    if(con)
        config = con;
    notifWatcher.observe(elem, config);
}