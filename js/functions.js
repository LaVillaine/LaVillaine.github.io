---
---
var app = "{{ site.receiver.app }}";
var func = "{{ site.receiver.func }}";

// Toggle between hiding and showing blog replies/comments

function viewHideReactions(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
		var y = document.getElementById("hideBtn");
		y.style.display = '';
		var z = document.getElementById("reactionsBtn");
		z.style.display = 'none';
    } else { 
        x.className = x.className.replace(" w3-show", "");
		var y = document.getElementById("hideBtn");
		y.style.display = 'none';
		var z = document.getElementById("reactionsBtn");
		z.style.display = '';
    }
}

function viewHideSubscribe(){
	if($("#subscriber").hasClass("w3-show")){
		$("#subscriber").removeClass("w3-show");
		$("#toggleSubs").removeClass("black-on-grey");
		$("#toggleSubs").addClass("white-on-pink");
	}
	else{
		$("#subscriber").addClass("w3-show");
		$("#toggleSubs").addClass("black-on-grey");
		$("#toggleSubs").removeClass("white-on-pink");
	}
}

function loadMoreEntries(btn, id, iter)
{
	var disable = false;
	var count = 0;
	var entries = document.getElementById(id).children;
	
	var entriesLength = 0;
	if(entries[entries.length - 1].nodeName.toLowerCase() == 'footer')
		entriesLength = entries.length - 1;
	else
		entriesLength = entries.length;
	
	for(var i=0; i<entriesLength; i++) 
	{
		if (entries[i].style.display == 'none')
		{
		   entries[i].style.display = '';
		   count = count + 1;
		}
		if(i == entriesLength-1)
			disable = true;
		if(count >= iter)
			break;
	}
	if(disable)
		btn.className += " w3-disabled";
	else
	{
		btn.setAttribute('style','color: #fff !important;background-color: #000 !important');
	}
}

function subscribe(formId){
	var formIndex = formId.slice(-1);
	var grecaptchaId = parseInt(formIndex) - 1;
	var email = "email" + formIndex;

	var displayEmailError = "displayEmailError" + formIndex;
	var displayRecaptchaError = "displayRecaptchaError" + formIndex;	
	document.getElementById(displayEmailError).style.display = 'none';
	document.getElementById(displayRecaptchaError).style.display = 'none';
	
	var f = $(formId);
	if(!f[0].email.validity.valid)
	{
		document.getElementById(displayEmailError).style.display = '';
		return;
	}
		
	var f_email = document.getElementById(email);
	
	var dataObj = {};
	dataObj["Email"] = f_email.value;
	// Spam verification
	if (grecaptcha) {
		dataObj["Captcha"] = grecaptcha.getResponse(grecaptchaId);
		if (dataObj["Captcha"].length === 0) {
			document.getElementById(displayRecaptchaError).style.display = '';
			return;
		}
		grecaptcha.reset(grecaptchaId);
	}

	f_email.value = '';
		
	$.ajax({
		contentType: "application/x-www-form-urlencoded",
		url: app + func,
		method: "POST",
		data: dataObj
	}).done(function(data, status, xhr){
		f[0].reset();
	}).fail(function (xhr, status, error) {
		f[0].reset();
	});
	$("#thank-you").css('display', 'block');
	$("#subscribe").css('display', 'none');
	viewHideSubscribe();
	return false;
}

function reply(formId, postTitle){	
	var error = false;
	
	document.getElementById("displayReplyNameError").style.display = 'none';
	document.getElementById("displayReplyCommentError").style.display = 'none';
	document.getElementById("displayReplyEmailError").style.display = 'none';
	document.getElementById("displayRecaptchaError").style.display = 'none';
	
	var f = $(formId);
	if(!f[0].alias.validity.valid)
	{
		document.getElementById("displayReplyNameError").style.display = '';
		error = true;
	}
	if(!f[0].comment.validity.valid)
	{
		document.getElementById("displayReplyCommentError").style.display = '';
		error = true;
	}
	if(!f[0].email.validity.valid)
	{
		document.getElementById("displayReplyEmailError").style.display = '';
		error = true;
	}
	
	if(error == true){
		return;
	}
		
	var f_name = document.getElementById("replyName");
	var f_comment = document.getElementById("replyComment");
	var f_email = document.getElementById("replyEmail");
	
	var dataObj = {};
	dataObj["Name"] = f_name.value;
	dataObj["Email"] = f_email.value;
	dataObj["Post"] = postTitle;
	dataObj["Comment"] = f_comment.value;
	// Spam verification
	if (grecaptcha) {
		dataObj["Captcha"] = grecaptcha.getResponse(2);
		if (dataObj["Captcha"].length === 0) {
			document.getElementById("displayRecaptchaError").style.display = '';
			return;
		}
		grecaptcha.reset(2);
	}
	
	f_name.value = '';
	f_comment.value = '';
	f_email.value = '';
	
	$.ajax({
		contentType: "application/x-www-form-urlencoded",
		url: app + func,
		method: "POST",
		data: dataObj
	}).done(function(data, status, xhr){
		f[0].reset();
	}).fail(function (xhr, status, error) {
		f[0].reset();
	});	
	$("#thanks").css('display', 'block');
	$("#reply").css('display', 'none');
	return false;
}

jQuery( document ).ready( function($){
	/**YEAR**/
	$("#theYear").text(new Date().getFullYear());
	
	// reset forms on page refresh
	var contactForm1 = $("#contactForm1");
	if (contactForm1.length > 0) {
		contactForm1[0].reset();
	}
	var contactForm2 = $("#contactForm2");
	if (contactForm2.length > 0) {
		contactForm2[0].reset();
	}
	var replyForm = $("#replyForm");
	if (replyForm.length > 0) {
		replyForm[0].reset();
	}
});
