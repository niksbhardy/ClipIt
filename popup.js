$(function() {
  $('body').height(280); 
$('html').height(280); 
    chrome.storage.sync.get('noteList', function(getEvent) {
      
      if(getEvent.noteList && getEvent.noteList.length) {
        let counter = 0;
      getEvent.noteList.forEach(function(note) {
          $('#notes').append("<div style='padding: 10px; font-size: 14px'>" +
            "<p style='margin-top: 0px;margin-bottom: 5px;'>" + note + "</p>" + 
            "<button class='remove-note' style='background: Transparent; border: none; outline: none; color: #757575;font-size: 10px;margin-top: 0px;margin-bottom: 0px; text-align: right;margin-left: 85%;' id=" + counter++ + ">" + 
              
            "<strong>" + "Remove" + "</strong>" + "</button>" +
            "</div>"
          );
        });


        $('#num-notes').text(getEvent.noteList.length + " notes");
        $('#notes > div').mouseover(function() {
          $(this).css('background-color', '#74e19b');
          $(this).css('color', '#ffffff');
        })
        .mouseout(function() {
          $(this).css({'background-color': 'white', 'color': '#000'});
        });

        $('.remove-note').click(function(e) {
          var noteId = $(this).attr('id');
          chrome.storage.sync.get('noteList', function(getEvent) {
      
            getEvent.noteList.splice(noteId, 1);
            //alert(JSON.stringify(getEvent.noteList).replace(/\"/g, ""));
            chrome.storage.sync.set({'noteList': [...getEvent.noteList]});
            //$(this).parent().remove();
            $('#'+ noteId).parent().fadeOut('fast', function() {
              window.location.href="popup.html";
            }); 
            
          });       
        });


      } else {
        $('#notes').text('No notes yet').css({'text-align': 'center', 'margin-top': '60px'});
        $('#num-notes').hide();
      }
  });

  // EXPORT FILE FUNCTION
  $('#export').click(function() {
    
    var exportNote = "";
    
    chrome.storage.sync.get('noteList', function(getEvent) {
      
      if(getEvent.noteList) {
        getEvent.noteList.forEach(function(note) {
          exportNote =  exportNote + note + "\n\n";
        });
        //alert(exportNote)
 	  var d = new Date();
          var dayx = ((''+d.getDate()).length<2 ? '0' : '') + d.getDate();
          var month = ((''+d.getMonth()).length<2 ? '0' : '') + d.getMonth();
          var year = d.getFullYear();
          
          var fileName = 'Notes' + '-' + dayx + '-' + month + '-' + year + '.txt';
        saveText(fileName, exportNote);

        var notifOptions = {
          type: 'basic',
          iconUrl: 'icons/clipit128.png',
          title: 'Notes Exported',
          'message': 'Notes have been exported to ' + fileName + ' file'
        };
    
        chrome.notifications.create('exportNotif', notifOptions);

      } else {

        var notifOptions = {
          type: 'basic',
          iconUrl: 'icons/clipit128.png',
          title: 'Notes not found',
          'message': 'Nothing to export' 
        };
    
        chrome.notifications.create('exportNotif', notifOptions);
      }
    });   

  });

  $('#clear').click(function() {

	if(confirm("Are you sure want to remove all the notes?")){
    chrome.storage.sync.set({'noteList': []});

    var notifOptions = {
      type: 'basic',
      iconUrl: 'icons/clipit128.png',
      title: 'Notes removed',
      'message': 'All notes have been deleted' 
    };

    $('#notes').text('No notes yet');
    $('#notes').css('text-align', 'center');
    chrome.notifications.create('exportNotif', notifOptions);
    }
  });

  function saveText(filename, text) {
    var tempElem = document.createElement('a');
    tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    tempElem.setAttribute('download', filename);
    tempElem.click();
 }


});
