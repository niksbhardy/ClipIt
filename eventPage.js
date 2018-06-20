var contextMenuItem = {
  'id': 'clipit',
  'title': 'ClipIt',
  'contexts': ['selection']
};
chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create(contextMenuItem);
});

chrome.contextMenus.onClicked.addListener(function(contextEvent) {
  if(contextEvent.menuItemId == 'clipit') {
    let clippedText = contextEvent.selectionText;
    
    chrome.storage.sync.get('noteList', function(getEvent) {
      
      if(getEvent.noteList) {
        
        let arrayNote = [];
        
        arrayNote = [...getEvent.noteList, clippedText];
        //console.log(arrayNote);
        chrome.storage.sync.set({'noteList': [...getEvent.noteList, clippedText]});
      }
      else {
        chrome.storage.sync.set({'noteList': [clippedText]});
      }
    });

    let sendMessage = "";
    const textLength = clippedText.length;

    if(textLength < 50) {
      sendMessage = clippedText;
    }
    else if(textLength >= 50) {
      for(i=0;i<50;i++) {
        sendMessage += clippedText[i];
      }
      sendMessage += '...';
    }
    
    //console.log(sendMessage);
    
    var notifOptions = {
      type: 'basic',
      iconUrl: 'icons/clipit128.png',
      title: 'Note clipped',
      'message': sendMessage 
    };

    chrome.notifications.create('exportNotif', notifOptions);


  }
});