isDefined = (arg) => typeof arg !== 'undefined';

var sites = [];
chrome.storage.local.get('sites',function(data){
  if(!isDefined(data.sites)){
    //alert("null");
    saveUrlList();
  }else {
    sites = data.sites;
    document.getElementById("insert").innerHTML = arrToStr(sites);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  getUrlListAndRestoreInDom();
  var addPageButton = document.getElementById('addPage');
  var submitButton = document.getElementById('aform');

  addPageButton.addEventListener('click', function() {
    chrome.tabs.getSelected(null, function(tab) {
        document.cookie = "url=" + tab.url;

        // $.ajax({
        //   type: "POST",
        //   url: "scraper.py",
        //   data: { param: tab.url}
        // }).done(function(mydata) {
        //    // do something
        //    alert("working");
        //    alert(mydata);
        //    var el = document.createElement( 'html' );
        //    el.innerHTML = mydata;
        //    sites.push([tab.url, el.getElementsByClassName("listing").item(0).rows.length, el.getElementsByTagName("title")[0].innerHTML]);
        //    document.getElementById("insert").innerHTML = arrToStr(sites);
        //    saveUrlList();
        //   });

        doc = loadHTMLSource(tab.url);
        var el = document.createElement( 'html' );
        el.innerHTML = doc;
        sites.push([tab.url, el.getElementsByClassName("listing").item(0).rows.length, el.getElementsByTagName("title")[0].innerHTML]);
        document.getElementById("insert").innerHTML = arrToStr(sites);
        saveUrlList();
    });
  }, false);

  submitButton.addEventListener('submit', function(){
    if(document.querySelector('input[name="radio"]:checked') != null){
      var index = document.querySelector('input[name="radio"]:checked').value;
      sites.splice(index, 1);
      document.getElementById("insert").innerHTML = arrToStr(sites);
      saveUrlList();
    }
  },false);
}, false);


function loadHTMLSource(urlSource){
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", urlSource, false);
  xhttp.send();
  return xhttp.response;
}

function arrToStr(arr){
  var strng = "";
  for(var k = 0; k < arr.length; k++){
    var q = k+1
    strng += "<div id=\"options\"><input type=\"radio\" name=\"radio\" class=\"radio\" value=\"" + k +"\" id=\"radio" + q + "\"/><label for=\"radio" + q + "\">" + q + ". " + arr[k][2] + "</label></div>";

  }
  return strng;
}

function getUrlListAndRestoreInDom(){
    chrome.storage.local.get('sites',function(data){
        sites = data.sites;
        document.getElementById("insert").innerHTML = arrToStr(sites);
    });
}

function saveUrlList(callback){
    if(sites != null)
      document.getElementById("insert").innerHTML = arrToStr(sites);
    chrome.storage.local.set({'sites':sites},function(){
        if(typeof callback === 'function'){
            //If there was no callback provided, don't try to call it.
            callback();
        }
    });


}
