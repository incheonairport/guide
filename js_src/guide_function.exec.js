/*******************
 * Guide Execution *
 *******************/

$(function(){

  /**
   * redirection
   */

  var category = '';
  var pathName = '';

  (function(){

    var locationData = location;

    category = locationData.search.replace('?', '');

    if( locationData.pathname.indexOf('release') > 0 ){

      pathName = '/release';

    }

    if( category == '' ){

      location.href = locationData.href + 'ap.html?ap';

    }

  })();

  /**
   * define
   */

  var item = [];
  var itemFlag = [];
  var fileData = [];

  var $record = $('.file-list tbody tr');

  var count = {

    allWork : 0,
    allPrimary : 0,
    allCategory : 0,
    allCancel : 0,
    allHtml : 0,
    allDev : 0,
    allBoard : 0,
    allLink : 0,
    allExtra : 0,
    allIframe : 0,
    allForeign : 0,
    allLayer : 0,

    doneWork : 0,
    doneHtml : 0,
    doneDev : 0,
    doneBoard : 0,
    doneIframe : 0,
    doneForeign : 0,

    exceptForeign : 0

  };

  var pageCount = 1;

  // each data split filename and ext
  function splitData(data){

    $.each(data, function(key, val){

      item[key] = val.split('.')[0];

    });

  }

  // add class name each case ex. cancel/category/link/page(O/X)
  function addClassname($record){

    var $children = $record.children('td');
    var childrenText = $children.eq(6).text().toLowerCase();

    if($children.has('s').length){

      $record.addClass('cancel');
      $children.eq(7).text('');

    } else {

      if( $children.eq(7).text().indexOf('*') >= 0){

        childrenText = 'extra-page';

      } else if( $children.length == 1 && $children.eq(0).text() != '' ){

        //childrenText = childrenText ? 'primary-category ' + $children.eq(6).text().toLowerCase() + '-page' : 'primary-category '
        childrenText = 'primary-category ';

      } else {

        childrenText = childrenText ? childrenText + '-page' : childrenText + 'category';

      }

      if($children.eq(7).text().indexOf('#') >= 0){

        childrenText += ' except-foreign';

      }

      $record.addClass(childrenText);

    }

  }

  // find same filename and put link html code or X
  function compareFile($record){

    if(!$record.hasClass('cancel') && !$record.hasClass('category') && !$record.hasClass('link-page')){

      if( $record.attr('class').indexOf('page') >= 0 ){

        for(var j=0; j<item.length; j++){

          if( $record.children('td:nth-child(8)').text().replace('#', '') == item[j] ) {

            $record.prepend('<td>'+ pageCount +'</td>');
            $record.addClass('done').append('<td class="center"><a href="' + pathName + '/' + category + '/html/' + item[j] + '.html" class="list-link" target="_blank"> Link </a></td>');
            itemFlag[j] = true;
            pageCount++;
            break;

          } else if( $record.children('td:nth-child(8)').text().indexOf('*') >= 0 ){

            $record.prepend('<td></td>');
            $record.append('<td></td>');
            break;

          } else {

            if( j == item.length-1 ){
              $record.prepend('<td>'+ pageCount +'</td>');
              $record.append('<td class="center">X</td>');
              pageCount++;
            }
          }
        }

      } else {
        $record.prepend('<td></td>');
        $record.append('<td></td>');
      }

    } else {
      $record.prepend('<td></td>');
      $record.append('<td></td>');

    }
  }

  // find unmatch filename and log
  function unmatchFile(){
    for(var k=0; k<itemFlag.length; k++){
      if( itemFlag[k] != true ){
        fileData.push(item[k]);
      }
    }
    console.log(fileData);
  }

  function countProgress(){

    $record.each(function () {

      var className = $(this).attr('class');
      var cmsURL = $(this).children('td:nth-child(11)').text();

      if (className == 'primary-category') {

        // number of primary category
        count.allPrimary++;

      } else if (className == 'category') {

        // number of category
        count.allCategory++;

      } else if ( className == 'cancel' ) {

        count.allCancel++;

      }

      if( className.toLowerCase().indexOf('page') >= 0 ) {

        // number of working page
        count.allWork++;

        if (className.toLowerCase().indexOf('html') >= 0) {
          // number of html page
          count.allHtml++;

        } else if (className.toLowerCase().indexOf('develop') >= 0) {
          // number of develop page
          count.allDev++;

        } else if (className.toLowerCase().indexOf('board') >= 0) {
          // number of board page
          count.allBoard++;

        } else if (className.toLowerCase().indexOf('link') >= 0) {
          // number of link
          count.allLink++;

        } else if( className.toLowerCase().indexOf('extra') >= 0 ){
          // number of extra page
          count.allExtra++;

        } else if( className.toLowerCase().indexOf('iframe') >= 0 ){
          // number of iframe page
          count.allIframe++;

        }

      }

      if (className.toLowerCase().indexOf('done') >= 0) {
        // number of done page
        count.doneWork++;

        if (className.toLowerCase().indexOf('html') >= 0) {

          // number of done html page
          count.doneHtml++;

        } else if (className.toLowerCase().indexOf('develop') >= 0) {

          // number of done develop page
          count.doneDev++;

        } else if (className.toLowerCase().indexOf('board') >= 0) {

          // number of done board page
          count.doneBoard++;

        } else if (className.toLowerCase().indexOf('iframe') >= 0) {

          // number of done iframe page
          count.doneIframe++;

        }
      }

      if( className.toLowerCase().indexOf('except-foreign') >= 0 ){

        count.exceptForeign++;

        $(this).children('td:nth-child(11)').text('');

      } else {

        if( cmsURL.indexOf('/en/') >= 0 ){
          count.doneForeign++;
        }

        if( cmsURL.indexOf('/ja/') >= 0 ){
          count.doneForeign++;
        }

        if( cmsURL.indexOf('/ch/') >= 0 ){
          count.doneForeign++;
        }

      }

      if( cmsURL.indexOf('Layer Popup') >= 0 ){
        count.allLayer++;
      }

    });

    count.allWork = count.allWork - count.allLink - count.allExtra;
    count.allForeign = ( count.allHtml - count.exceptForeign ) * 3;

  }

  // write each count number
  function outputProgress() {

    countProgress();

    console.log(count);

    $('.progress-all .progress-bar').css({width:Math.floor( count.doneWork / count.allWork * 100 ) + '%'}).html('<div class="progress-percent">' + Math.floor( count.doneWork / count.allWork * 100 ) + '%</div>');

    $('.all-work').text( count.allWork + 'p');
    $('.done-work .progress-bar').css({width: Math.floor( count.doneWork / count.allWork * 100 ) + '%'}).html('<div class="progress-percent">' + count.doneWork + 'p</div>');

    $('.all-work-html').text(count.allHtml + 'p');
    $('.done-work-html .progress-bar').css({width: Math.floor( count.doneHtml / count.allHtml * 100 ) + '%'}).html('<div class="progress-percent">' + count.doneHtml + 'p</div>');

    $('.all-work-board').text(count.allBoard + 'p');
    $('.done-work-board .progress-bar').css({width: Math.floor( count.doneBoard / count.allBoard * 100) + '%'}).html('<div class="progress-percent">' + count.doneBoard + 'p</div>');

    $('.all-work-develop').text(count.allDev + 'p');
    $('.done-work-develop .progress-bar').css({width: Math.floor( count.doneDev / count.allDev * 100) + '%'}).html('<div class="progress-percent">' + count.doneDev + 'p</div>');

    $('.all-work-foreign').text(count.allForeign + 'p');
    $('.done-work-foreign .progress-bar').css({width: Math.floor( count.doneForeign / count.allForeign * 100) + '%'}).html('<div class="progress-percent">' + count.doneForeign + 'p</div>');

    $('.all-work-iframe').text(count.allIframe + 'p');
    $('.done-work-iframe .progress-bar').css({width: Math.floor( count.doneIframe / count.allIframe * 100) + '%'}).html('<div class="progress-percent">' + count.doneIframe + 'p</div>');

    $('.all-work-link').text(count.allLink + 'p');
    $('.done-work-link .progress-bar').css({width: Math.floor( count.allLink / count.allLink * 100) + '%'}).html('<div class="progress-percent">' + count.allLink + 'p</div>');
  }

  // add URL
  function addURL($record){

    if(!$record.hasClass('cancel') && !$record.hasClass('category') && !$record.hasClass('link-page')){

      if( $record.attr('class').indexOf('page') >= 0 ){

        if( $record.children('td:nth-child(11)').text() == 'Layer Popup' ){

          $record
              .addClass('done')
              .append('<td class="center bg-gray">Layer Popup</td>');

        } else if( $record.children('td:nth-child(11)').text() != '' ){

          var urlFile = $record.children('td:nth-child(11)').html().split('<br>');

          $record
              .addClass('done')
              .append('<td class="center">' +
              '<a href="http://ndev-www.airport.kr/' + urlFile[0] + '" class="list-link" target="_blank"> Link </a><br />' +
              '<a href="http://ndev-www.airport.kr/' + urlFile[1] + '" class="list-link" target="_blank"> Link </a><br />' +
              '<a href="http://ndev-www.airport.kr/' + urlFile[2] + '" class="list-link" target="_blank"> Link </a><br />' +
              '<a href="http://ndev-www.airport.kr/' + urlFile[3] + '" class="list-link" target="_blank"> Link </a><br />' +
              '</td>');

        } else {

          $record.append('<td></td>');

        }

      } else {
        $record.append('<td></td>');
      }

    } else {
      $record.append('<td></td>');

    }

  }

  /**
   * run
   */

  // ajax

  $.getJSON('/static/guide/data/' + category + '_file_data.json', function(data){

    splitData(data);

  }).done(function(){

    $record.each(function(){

      addClassname($(this));

      compareFile($(this));

      addURL($(this))

    });

    unmatchFile();

    outputProgress();

  });

  // show each list

  $('body').on('click', '.js-show-all', function(){

    $('.btn-type-small').removeClass('on');

    var showCategory = $(this).attr('class').split(' ')[4];

    $(this).addClass('on');

    $('.file-list tbody tr').addClass('hide');

    if( showCategory == undefined ){
      $('.file-list tbody tr').removeClass('hide');
    } else {
      $('.file-list tbody tr.category, .file-list tbody tr.primary-category').removeClass('hide');
      $('.file-list tbody tr.' + showCategory + '-page').removeClass('hide');
    }

  });

  $('body').on('click', '.js-show-done', function(){

    $('.btn-type-small').removeClass('on');

    var showCategory = $(this).attr('class').split(' ')[4];

    $(this).addClass('on');

    $('.file-list tbody tr').addClass('hide');

    if( showCategory == undefined ){
      $('.file-list tbody tr.done').removeClass('hide');
    } else {
      $('.file-list tbody tr.' + showCategory + '-page.done').removeClass('hide');
    }

  });

  $('body').on('click', '.js-url-show-all', function(){

    $('.btn-type-small').removeClass('on');

    var showCategory = $(this).attr('class').split(' ')[4];

    $(this).addClass('on');

    $('.url-list tbody tr').addClass('hide');

    if( showCategory == undefined ){
      $('.url-list tbody tr').removeClass('hide');
    } else {
      $('.url-list tbody tr.category, .url-list tbody tr.primary-category').removeClass('hide');
      $('.url-list tbody tr.' + showCategory + '-page').removeClass('hide');
    }

  });

  $('body').on('click', '.js-url-show-done', function(){

    $('.btn-type-small').removeClass('on');

    var showCategory = $(this).attr('class').split(' ')[4];

    $(this).addClass('on');

    $('.url-list tbody tr').addClass('hide');

    if( showCategory == undefined ){
      $('.url-list tbody tr.done').removeClass('hide');
    } else {
      $('.url-list tbody tr.' + showCategory + '-page.done').removeClass('hide');
    }

  });

  //// link or alert message
  //$('body').on('click', '.file-list tr', function(e){
  //
  //  if( $(this).find('.list-link').length ){
  //
  //    window.open($(this).find('.list-link').attr('href'));
  //
  //  } else {
  //
  //    alert('제작 페이지가 아닙니다.');
  //
  //  }
  //
  //});

  //// link or alert message
  //$('body').on('click', '.url-list tr', function(e){
  //
  //  if( $(this).find('.list-link').length ){
  //
  //    //window.open($(this).find('.list-link').attr('href'));
  //
  //  } else {
  //
  //    alert('배포 파일이 아닙니다.');
  //
  //  }
  //
  //});

  // tab

  $('.tab-sub-list-item-link').on('click', function(e){
    e.preventDefault();

    var $tab = $('.tab-sub-list-item-link');
    var $tabContents = $('.tab-contents');

    var index = $tab.index( $(this) );

    $tab.removeClass('on');
    $(this).addClass('on');

    $tabContents.removeClass('on');
    $tabContents.eq(index).addClass('on');

  });

});


