chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    // console.log("something happening from the extension");
    if (request === "getName") {
    	let fbName = document.getElementsByClassName("_1vp5")[0].innerHTML;
    	sendResponse({name: fbName , success: true});
    }
    // else if (request === "alertExpired") {
    // 	alert("session expired, please log in again");
    // 	sendResponse({success: true});
    // 	console.log("session expired, please log in again");
    // }
    // else if (request === "alertLogIn") {
    // 	alert("please log in first");
    // 	sendResponse({success: true});
    // 	console.log("please log in first");
    // }
});
