/**
 * Created by michaelshi on 2/6/15.
 */

function CourseSelection(){
    //Adds Google MD Card to listing wrapper
    jQuery('#listingWrapper').addClass('card');

    var lastState = -1;

    //Watch for "Current Level" Changes
    watchDOMMutation(jQuery('#listing')[0], function(mutation){
        var currentState = getState();
        var currentInformation = getCurrentInformation();


        //Title card at state 2

        //Only execute if there is a state change
        if(currentState != lastState){

            console.log(currentState);
            console.log(currentInformation);

            lastState = currentState;

            formatCourseTitle(currentState, currentInformation);

            switch(currentState){
                case 2:
                    formatSectionListings();
                    break;
                case 3:
                    formatSubSectionListings();
                    break;
                default:
                    break;
            }
        }else{
            //Card title got overwritten but no state was changed
            if(jQuery('#cardTitle').length == 0){
                formatCourseTitle(currentState, currentInformation);
            }
        }
    },{characterData: true, childList: true});
}

/* Creates the sub-section (discussion groups, labs, etc.) elements from the parsed data */
function formatSubSectionListings(){
    var listing = jQuery('#listing');
    var currentSubSection = listing.find('.subsection');
    var subSectionInfos = [];

    //Wat r recursion?
    while(currentSubSection != null && currentSubSection.length > 0){
        var sectionInfo = getSectionListing(currentSubSection.find('h5').eq(0), currentSubSection.find('.courseinfo'));
        subSectionInfos.push(sectionInfo);

        //Honestly, I'm not sure any sane web dev would ever do this
        currentSubSection = currentSubSection.find('.subsection');
    }

    //Create all the section listing elements from the data

    jQuery('.sectionListing').remove();
    var sectionListingsHTML = '';

    for(var i=0; i<subSectionInfos.length; i++){

        var section = subSectionInfos[i];

        sectionListingsHTML +=
            '<div class="sectionListing" onclick="' + section.onClick + '">' +
                '<div class="sectionLocation">' + section.sectionLocation + '</div>' +
                '<div class="sectionLetter">' + section.sectionType + ': ' + section.sectionLetter + section.sectionNumber +'</div>' +
                '<div style="clear:both;"></div>' +

                '<div class="sectionDays">' + section.days + '</div>' +

                '<div class="sectionTime">' + section.times.start.split(' ')[0] + '&nbsp; <i class="fa fa-long-arrow-right"></i> &nbsp;'
                + section.times.end + '</div>' +

                '<div style="clear:both;"></div>' +
            ' </div>' +
            //The message center classes have essentially become a full width line for us
            '<p class="message center"></p>';
    }

    jQuery(sectionListingsHTML).insertAfter('#cardTitle');
}

/* Create the section listing elements from the parsed data */
function formatSectionListings(){

    console.log('11');
    var listingChildren = jQuery("#listing").children();
    var firstSectionOption = 9999;

    var sectionListings = [];

    for(var i=0; i<listingChildren.length; i++){
        var currentChild = listingChildren.eq(i);
        //If this is the first time we've seen an h5, mark it as the first index
        if(currentChild.is('h5') && firstSectionOption == 9999){
            firstSectionOption=i;
        }
        //If we're already in the list of courses
        if(i>=firstSectionOption && currentChild.is('h5')){
            //Add it to the list of sections
            sectionListings.push(getSectionListing(currentChild, listingChildren.eq(i+2)));
        }
    }

    //Create all the section listing elements from the data

    jQuery('.sectionListing').remove();
    var sectionListingsHTML = '';
    for(i=0; i<sectionListings.length; i++){
        var section = sectionListings[i];
        //console.log(section);

        sectionListingsHTML += '<div class="sectionListing" onclick="' + section.onClick + '">' +
                '<div class="sectionLocation">' + section.sectionLocation + '</div>' +
                '<div class="sectionLetter">' + section.sectionType + ' ' + section.sectionLetter +'</div>' +
                '<div style="clear:both;"></div>' +

                '<div class="sectionTeacher">' + (section.professorName.first? section.professorName.first[0] + '. ':'')
                    + section.professorName.last +'</div>' +

                '<div class="sectionDays">' + section.days + '</div>' +

                '<div class="sectionTime">' + section.times.start.split(' ')[0] + '&nbsp; <i class="fa fa-long-arrow-right"></i> &nbsp;'
                    + section.times.end + '</div>' +

                '<div style="clear:both;"></div>' +
            ' </div>' +
            //The message center classes have essentially become a full width line for us
            '<p class="message center"></p>';
    }

    jQuery(sectionListingsHTML).insertAfter('#cardTitle');
}

//Format the course title
function formatCourseTitle(currentState, currentInfo){
    //Only display custom course title card if there is enough information

    console.log(',', currentState);
    if(currentState >= 2){
        var courseTitleCardHTML =
            '<div id="cardTitle">' +
                '<div class="courseAbbreviation">' + currentInfo.courseAbbreviation + '</div>';
        if(currentState == 2)
            courseTitleCardHTML +=
                '<div class="courseName">' + currentInfo.courseName + '</div>' +
                '<p class="message center"></p>';
        if(currentState > 2){
            courseTitleCardHTML +=
                '<div class="courseProfessor">' +
                    (currentInfo.professorName.first? currentInfo.professorName.first[0] + '. ':'') +
                    currentInfo.professorName.last +
                '</div>' +
                //Division Line
                //'<p class="message center"></p>' +
                //Current Section Information
                '<div class="courseSection">' +
                    '<div class="sectionLetter">' + currentInfo.sectionType + ' ' + currentInfo.sectionLetter + '</div>' +
                    '<div class="changeSectionButton" title="Change ' + currentInfo.sectionType + '"><i class="fa fa-pencil-square-o"></i></div>' +

                    '<div style="clear:both;"></div>' +

                    '<div class="sectionDays">' + currentInfo.sectionDays + '</div>' +

                    '<div class="sectionTime">' +
                        currentInfo.sectionTimes.start.split(' ')[0] + '&nbsp; <i class="fa fa-long-arrow-right"></i> &nbsp;' +
                        currentInfo.sectionTimes.end +
                    '</div>' +


                    '<div style="clear:both;"></div>' +

                    '<div class="sectionLocation">' + currentInfo.sectionLocation + '</div>' +

                '</div>';

                if(currentState == 3 && !currentInfo.finalSectionDate)
                    courseTitleCardHTML += '<p class="message center"></p>';
        }
        if(currentState > 3){
            courseTitleCardHTML +=
                '<div class="courseSection">' +
                    '<div class="sectionLetter">' + currentInfo.subSectionType + ' ' + currentInfo.sectionLetter + currentInfo.sectionNumber + '</div>' +
                    '<div class="changeSectionButton" title="Change ' + currentInfo.subSectionType + '"><i class="fa fa-pencil-square-o"></i></div>' +

                    '<div style="clear:both;"></div>' +

                    '<div class="sectionDays">' + currentInfo.subSectionDays + '</div>' +

                    '<div class="sectionTime">' +
                        currentInfo.subSectionTimes.start.split(' ')[0] + '&nbsp; <i class="fa fa-long-arrow-right"></i> &nbsp;' +
                        currentInfo.subSectionTimes.end +
                    '</div>' +


                    '<div style="clear:both;"></div>' +

                    '<div class="sectionLocation">' + currentInfo.subSectionLocation + '</div>' +

                '</div>';
        }

        //If final information is already available
        if(currentInfo.finalSectionDate){
            courseTitleCardHTML +=
                '<div class="courseSection">' +
                    '<div class="sectionLetter">' + currentInfo.finalSectionType + '</div>' +

                    '<div class="sectionDate">' + currentInfo.finalSectionDate + '</div>' +

                    '<div style="clear:both;"></div>' +

                    '<div class="sectionDays">' + currentInfo.finalSectionDay.substr(0,3) + '</div>' +

                    '<div class="sectionTime">' +
                        currentInfo.finalSectionTimes.start.split(' ')[0] + '&nbsp; <i class="fa fa-long-arrow-right"></i> &nbsp;' +
                        currentInfo.finalSectionTimes.end +
                    '</div>' +

                    '<div style="clear:both;"></div>' +

                    '<div class="sectionLocation">' + 'TBA' + '</div>' +

                '</div>';
        }

        courseTitleCardHTML += '</div>';

        jQuery('#currentlevel').after(courseTitleCardHTML);
    }
}

/**
  * Pass in H5 and .courseinfo jQuery Objects
  * Note: Also hides the section listing information
 *
 */
function getSectionListing(h5, courseInfo){
    var sectionLetter = 'Z';
    var sectionNumber = '-1';
    var sectionType = 'None';
    var professorName = {
        last: 'Staff',
        first: ''
    };
    var sectionLocation = "TBA";
    var days = "ABC";
    var times = {
        start: 'TBA',
        end: 'TBA'
    };
    var selectSectionAction = '';

    //Hides the H5 Information as well
    sectionLetter = h5.hide().find('a').text()[0];
    sectionNumber = h5.find('a').text().substr(1);
    selectSectionAction = h5.find('a').attr('onclick');
    sectionType = h5.find('span').attr('title');

    courseInfo.hide();

    //If we have prof info
    if(courseInfo.children().length > 1){
        var profFullName = courseInfo.children().eq(0).text().split(', ');
        //Doesn't matter if they have middle name since we're abbrv first names.
        professorName.first = profFullName[1];
        professorName.last = profFullName[0];
    }

    var fullMeetingTime = courseInfo.find('.meetingtime').text().split(' ');
    days = fullMeetingTime[0];

    //Make sure the day exists
    if(days.length != 0){
        //Delete first element and join the rest of the time, because the PM and AM was split off due to split
        fullMeetingTime.shift();
        var fullTime = fullMeetingTime.join();
        var timeRegex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9],[PA]M/g;
        times.start = timeRegex.exec(fullTime)[0].replace(',',' ');
        times.end = timeRegex.exec(fullTime)[0].replace(',',' ');
    }

    sectionLocation = courseInfo.find('span[title]').attr('title');
    if(sectionLocation){
        sectionLocation += " - " + courseInfo.find('span[title]').text().split(' ')[1];
    }else{
        sectionLocation = "TBA";
    }

    return {
        'sectionLetter': sectionLetter,
        'sectionType': sectionType,
        'professorName': professorName,
        'sectionLocation': sectionLocation,
        'days': days,
        'times': times,
        'onClick': selectSectionAction,
        'sectionNumber': sectionNumber
    };
}

/* Uses #currentLevel to get information the user has already chose */
function getCurrentInformation(){
    var currentLevel = jQuery('#currentlevel');
    var courseFullText = currentLevel.find('h4').text();
    //Ex. CSE11
    var courseAbbreviation='',
    //Ex. Basic Data Struct. & OO Design
        courseName='';

    var professorName = {
        last: 'Staff',
        first: ''
    };

    var sectionLetter ='',
        sectionNumber = null,
        sectionType = null;

    var sectionLocation = null,
        sectionDays = null,
        sectionTimes = {
            start: 'TBA',
            end: 'TBA'
        };

    var sectionPopulation = {
        'totalSeats': -1,
        'availableSeats': -1,
        'waitlist': -1
    };

    var subSectionType = null;

    var subSectionLocation = null,
        subSectionDays = null,
        subSectionTimes = {
            start: 'TBA',
            end: 'TBA'
        };

    //Not sure about this...
    var finalSectionType = null;

        //ex. June 06, 2015
    var finalSectionDate = null,
        //ex. Fri, Sat, etc.
        finalSectionDay = null,
        finalSectionTimes = {
            start: 'TBA',
            end: 'TBA'
        };

    /* Grab Course Title Information */
    if(courseFullText.indexOf(':') != -1){
        var courseFullNameArray = courseFullText.split(': ');
        courseAbbreviation = courseFullNameArray[0];
        courseName = courseFullNameArray[1];
    }

    var h5s = currentLevel.find('h5');
    //Get more information as more information gets appended
    switch(h5s.length){
        case 3:
            finalSectionType = h5s.eq(2).find('span.instructiontype').attr('title');
        case 2:
            if(h5s.eq(1).text().indexOf('Final') != -1){
                finalSectionType = "Final";
            }else{
                sectionNumber = h5s.eq(1).text().substr(1,2);
                subSectionType = h5s.eq(1).find('span.instructiontype').attr('title');
            }
        case 1:
            sectionLetter = h5s.eq(0).text()[0];
            sectionType = h5s.eq(0).find('span.instructiontype').attr('title');
            break;
        default:
            break;
    }

    var courseInfos = currentLevel.find('ul.courseinfo');
    switch(courseInfos.length){
        case 2:
            var infoItems = courseInfos.eq(1).find('li');
            /* Get the sub-section details */
            //Use infoItems.last() because sometimes there is a "TA" name for the first LI
            var subSectionDetails = getSectionDetails(infoItems.last());

            //Set our variables
            subSectionLocation = subSectionDetails.sectionLocation;
            subSectionDays = subSectionDetails.sectionDays;
            subSectionTimes = subSectionDetails.sectionTimes;
        case 1:
            var infoItems = courseInfos.eq(0).find('li');

            /* Get the professor name for section */
            var profFullName = infoItems.eq(0).text();
            var profFullNameArray = profFullName.split(', ');
            professorName.first = profFullNameArray[1];
            professorName.last = profFullNameArray[0];

            /* Get the section details */
            var sectionDetails = getSectionDetails(infoItems.eq(1));

            //Set our variables
            sectionLocation = sectionDetails.sectionLocation;
            sectionDays = sectionDetails.sectionDays;
            sectionTimes = sectionDetails.sectionTimes;
            break;
        default:
            break;
    }

    var paragraphs = currentLevel.find('p');
    var seats = paragraphs.eq('-1');
    if(seats && seats.text().indexOf('Seats') != -1){
        var seatLine = seats.html().split('<br>');
        if(seatLine.length == 3){
            sectionPopulation.totalSeats = seatLine[0].split(': ')[1];
            sectionPopulation.availableSeats = seatLine[1].split(': ')[1];
            sectionPopulation.waitlist = seatLine[2].split(': ')[1];
        }
    }
    var finalTimeString = paragraphs.eq('-2');
    //If finalTimeString is valid and has either PM or AM in it.
    if(finalTimeString && (finalTimeString.text().indexOf('PM') != -1 || finalTimeString.text().indexOf('AM') != -1)){
        var finalTimeLines = finalTimeString.html().split('<br>');
        var dateString = finalTimeLines[0];
        var dateStringArray = dateString.split(',');
        finalSectionDay = dateStringArray[0];
        //Get rid of day
        dateStringArray.shift();
        //Reunite, convenient comma placed with the join
        finalSectionDate = dateStringArray.join();

        var finalTime = finalTimeLines[1];
        finalTime = finalTime.replace(/ /g, ',');
        var parsedFinalTime = parseTimeString(finalTime);
        finalSectionTimes.start = parsedFinalTime.start;
        finalSectionTimes.end = parsedFinalTime.end;
    }

    return{
        //CSE12
        courseAbbreviation: courseAbbreviation,
        //Data Stucts & OO Design
        courseName: courseName,

        //{first: 'John', last: 'Doe'}
        professorName: professorName,

        //A
        sectionLetter: sectionLetter,
        //01
        sectionNumber: sectionNumber,

        //Lecture
        sectionType: sectionType,
        //Pepper Canyon Hall - 112
        sectionLocation: sectionLocation,
        //MWF
        sectionDays: sectionDays,
        //{start: '11:00 AM', end: '11:50 AM'}
        sectionTimes: sectionTimes,

        //{'totalSeats': 0, 'availableSeats': 0, 'waitlist': 0}
        sectionPopulation: sectionPopulation,

        subSectionType: subSectionType,
        subSectionLocation: subSectionLocation,
        subSectionDays: subSectionDays,
        subSectionTimes: subSectionTimes,

        finalSectionType: finalSectionType,
        finalSectionDate: finalSectionDate,
        finalSectionDay: finalSectionDay,
        finalSectionTimes: finalSectionTimes
    };
}

/* Get the section days and times */
function getSectionDetails(listItem){
    var sectionLocation = null,
        sectionDays = null,
        sectionTimes = {
            start: 'TBA',
            end: 'TBA'
        };

    //Find the meeting time information
    var fullSectionTime = listItem.find('span.meetingtime').text();

    //Explode by spaces
    var fullSectionTimeArray = fullSectionTime.split(' ');

    //Get the first "word" which will be like MWF
    sectionDays = fullSectionTimeArray[0];

    //Remove Days
    fullSectionTimeArray.shift();
    //Create our new time string
    var fullTime = fullSectionTimeArray.join();
    var parsedTimes = parseTimeString(fullTime);
    sectionTimes.start = parsedTimes.start;
    sectionTimes.end = parsedTimes.end;

    //Find the title in the span
    sectionLocation = listItem.find('span[title]').attr('title');
    if(sectionLocation){
        sectionLocation += " - " + listItem.find('span[title]').text().split(' ')[1];
    }else{
        sectionLocation = "TBA";
    }

    return {
        sectionLocation: sectionLocation,
        sectionDays: sectionDays,
        sectionTimes: sectionTimes
    };
}

/* Parses time strings in the format of 1:00,PM–1:50,PM */
function parseTimeString(timeString){
    var times = {
        start: 'TBA',
        end: 'TBA'
    };
    var timeRegex = /([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9],[PA]M/g;
    times.start = timeRegex.exec(timeString)[0].replace(',',' ');
    times.end = timeRegex.exec(timeString)[0].replace(',',' ');
    return times;
}

//Returns the current state of the course listing panel by examining the breadcrumbs hierarchy
function getState(){
    return jQuery('#breadcrumbs').find('a').length;
}

//Go back 1 state link using the breadcrumbs
function stateBackLink(){
    return jQuery('#breadcrumbs').find('a').last().attr('onclick');
}