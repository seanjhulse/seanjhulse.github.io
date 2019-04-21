window.onload = function() {
  
  
}

/**
 * makes a request to a URL. Callback required
 * @returns true or false if the URL exists
 */
const urlExists = function(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        callback(true);
      } else {
        callback(false);
      }
  }
  xmlHttp.open("GET", url, true); // true for asynchronous 
  xmlHttp.send(null);
}