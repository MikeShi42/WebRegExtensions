//Class Colors
var calendarColors = [
    //Light Blue
    {
        primary: "#00B0FF",
        bold: "#0091EA"
    },
    //Green
    {
        primary: "#00E676",
        bold: "#00C853"
    },
    //Amber
    {
        primary: "#FFC400",
        bold: "#FFAB00"
    },
    //Deep Orange
    {
        primary: "#FF3D00",
        bold: "#DD2C00"
    }
];

function setUpPlanners(){
    jQuery.ajax({
        url: "/classPlanner/planner"
    }).done(function(data) {
        jQuery('body').append('<div class="result" style="display:none;"></div>');
        var planners = jQuery( ".result" ).append(jQuery(data).find('.formtable')).find('a[href^="/classPlanner/"]');
        planners.each(function(){
            jQuery('#calendarWrapper.card').prepend('<a class="plannerLink" href="'+jQuery(this).attr('href')+'">'+jQuery(this).text()+'</a>')
        });

    });
}

//Set Up Calendar
function Calendar(){
    jQuery('#calendarWrapper').addClass('card');//.parent().children().eq(0).hide();

    setUpPlanners();

    //The element with the actual calendar event container
    var classCalendarObject = jQuery('.calendarclassinfo:contains("more...")');

    //Hashmap of classes and their event elements
    var classSet = [];

    //Put elements into hashmap
    classCalendarObject.each(function(){
        var courseName = jQuery(this).find('li').eq(0).text();
        if(!classSet[courseName]){
            classSet[courseName] = [jQuery(this)];
        }
        else{
            classSet[courseName].push(jQuery(this));
        }
    });

    //Give classes their color
    var classNum = 0;
    for(var c in classSet){
        for(var i=0; i<classSet[c].length; i++){
            //Get Section Type: DI, LA, LE
            var sectionType = classSet[c][i].find('li').eq(1).find('span').text();
            classSet[c][i].css({
                'background-color': calendarColors[classNum%calendarColors.length].primary,
                'border-left-color': calendarColors[classNum%calendarColors.length].bold
            });

            //Add stripes or not depending on section type
            switch(sectionType){
                case 'LE':
                    break;
                case 'DI':
                    classSet[c][i].addClass('stripes');
                    break;
                case 'LA':
                    classSet[c][i].addClass('stripes-reverse');
                    break;
                default:
                    classSet[c][i].addClass('stripes-reverse');
                    break;
            }
        }
        classNum++;
    }

    //Remove Unneccessary Event Info
    classCalendarObject.each(function(){
        //Remove Section and more info
        jQuery(this).find('li').eq(1).hide();
        jQuery(this).find('li').eq(2).hide();

        //Link the Div if it's not linked yet
        if(!jQuery(this).parent().is('a')){
            var classLink = jQuery(this).find('a[href^="/classPlanner/"]');
            var classClickAttribute = classLink.attr('onclick');
            jQuery(this).wrap("<a class='calendarClassInfoLink' onclick=\""+classClickAttribute+"\"></a>");
        }

        //LE, DI, or LA
        var sectionType = jQuery(this).find('li').eq(1).find('span').text();
        //If the section doesn't have the section type already
        if(classLink.text().indexOf(sectionType) == -1 || classLink.text().indexOf(sectionType) != classLink.text().length-2)
            classLink.text(classLink.text() + " " + sectionType);

    });

    /*
     //Add Tooltip Info
     classCalendarObject.each(function(){
     //Remove Section and more info
     var detailsHTML = jQuery(this).parent().parent().find('.calendarclassinfo:contains("close")').find('td').html();
     jQuery(this).tooltipster({
     delay: 50,
     position: 'right',
     //autoClose: false,
     content: jQuery(detailsHTML)
     });
     console.log(detailsHTML);

     });

     */
}