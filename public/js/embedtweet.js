const tweetAPIUrl = "https://publish.twitter.com/oembed?url=";
const tweetEl = document.querySelector("#embedded-tweet");
const tweetUrl = document.currentScript.getAttribute('tweetUrl');
if(tweetUrl && tweetUrl.indexOf("twitter.com") > -1){
  fetch(location.origin + "/tweet/", { headers: { tweeturl: tweetUrl } })
    .then(response => {
      return response.json();
    })
    .then(response => {
      console.log(response);
      if(response && response.html){
          tweetEl.innerHTML = response.html
      }
    })
    .catch(error => console.log("Oops", error));
}
