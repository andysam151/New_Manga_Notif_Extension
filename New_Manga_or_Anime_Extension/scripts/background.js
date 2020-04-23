//5 minute alarm
chrome.alarms.create("5min", {
  delayInMinutes: 5,
  periodInMinutes: 5
});

//listens for alarm to check sites
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "5min") {
    checkSites();
  }
});

function checkSites(){

    //ensures a kissmanga.com tab is open and recent to bypass cloud protection

    chrome.tabs.query({

      },
      function(tabs){
        var list = "";
        for(var i = 0; i < tabs.length; i++){
          list += tabs[i].url + " ";
        }
        //alert(list);
      }
    );

    chrome.tabs.query(
      {
      //"url": chrome.runtime.getURL("https://kissmanga.com/") // -outdated with chrome update
      "url": "https://kissmanga.com/*",
      "pinned": true
      },
      function(tabs) {

        if (tabs.length == 0){
          chrome.tabs.create({
                //"url": chrome.extension.getURL("https://kissmanga.com"), // -outdated with chrome update
                "url": "https://kissmanga.com",
                "pinned": true,
                "active": false
            },
            function(tab) {
                 tab.highlighted = false;
                 tab.active = false;
            });
        }else if(tabs.length > 1){
          var extra = tabs.splice(0,1);
          for(var i = 0; i < extra.length; i++){
            chrome.tabs.remove(extra[i].id);
          }
        }
        else{
          chrome.tabs.reload(tabs[0].id);
        }
    });

    //ensures a kissanime.ru tab is open and recent to bypass cloud protection
  chrome.tabs.query(
    {
    //"url": chrome.extension.getURL("https://kissanime.ru/")   -outdated with chrome update
    "url": "https://kissanime.ru/*",
    "pinned": true
    },
    function(tabs) {
    if (tabs.length == 0){
     chrome.tabs.create({
           //"url": chrome.runtime.getURL("https://kissanime.ru/"), // -outdated with chrome update
           "url": "https://kissanime.ru",
           "pinned": true,
           "active": false
       },
       function(tab) {
            tab.highlighted = false;
            tab.active = false;
        });
    }else if(tabs.length > 1){
      var extra = tabs.splice(0,1);
      for(var i = 0; i < extra.length; i++){
        chrome.tabs.remove(extra[i].id);
      }
    }else{
      chrome.tabs.reload(tabs[0].id);
    }
    });

  chrome.storage.local.get({'sites':[]},function(data){

    function setLength(index, len){
      if(len != data.sites[index][1]){
        data.sites[index][1] = len;
        var str = "new manga at " + data.sites[index][0];

        chrome.notifications.create('new chapter', {
          type: 'basic',
          iconUrl: '../images/icon.png',
          title: 'There\'s a new chapter!',
          message: str,
          buttons: [{title: "Read Now!"}]
        }, function(notificationId) {});

        chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
              if (btnIdx === 0) {
                  chrome.tabs.create({ url: data.sites[index][0] });
              }
        });

        if(data.sites.length > 0 && arrToStr(data.sites) != null){
          try{
            document.getElementById("insert").innerHTML = arrToStr(data.sites);
          }catch(error){}
        }

        chrome.storage.local.set({'sites':data.sites},function(){
            if(typeof callback === 'function'){
                //If there was no callback provided, don't try to call it.
                callback();
            }
        });
      }
    }
    for(var i = 0; i < data.sites.length; i++){
      xhttp = new XMLHttpRequest();
      xhttp.open("GET", data.sites[i][0], false);
      xhttp.send();
      var el = document.createElement( 'html' );
      el.innerHTML = xhttp.response;
      if(el.getElementsByClassName("listing").item(0) != null){
        setLength(i ,el.getElementsByClassName("listing").item(0).rows.length);
      }
    }
  });

}

function arrToStr(arr){
  var strng = "";
  if(arr == null){
    return;
  }
  for(var k = 0; k < arr.length; k++){
    var q = k+1
    strng += "<div id=\"options\"><input type=\"radio\" name=\"radio\" class=\"radio\" value=\"" + k +"\" id=\"radio" + q + "\"/><label for=\"radio" + q + "\">" + q + ". " + arr[k][2] + "</label></div>";

  }
  return strng;
}
