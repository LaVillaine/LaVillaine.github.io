$(function(){
	var postURLs;
	var isFetchingPosts = false;
	var postsToLoad = $(".post-list").children().length/2;
	
	// Load the JSON file containing all URLs
	var getJsonRes = function(data){
					if(document.title == "Recipes"){
						postURLs = data["food"]["url"];
						postHeadings = data["food"]["heading"];
						postDates = data["food"]["date"];
					}
					
					if(document.title == "Articles"){
						postURLs = data["prose"]["url"];
						postHeadings = data["prose"]["heading"];
						postDates = data["prose"]["date"];
					}
					// If there aren't any more posts available to load 
					//than already visible, disable fetching
					if (postURLs.length <= postsToLoad)
					  disableFetching();
				};
	$.getJSON('/all-posts.json', getJsonRes);
	
	//get more button
	$(function(){
		$('#morePostsBtn').click(function() {
			if (isFetchingPosts) return;
			fetchPosts();
			return false;
		});
	});
	
	//get more button
	$(function(){
		$('#moreProseBtn').click(function() {
			if (isFetchingPosts) return;
			fetchPosts();
			return false;
		});
	});
	
	// Fetch a chunk of posts
	function fetchPosts() {
		 // Exit if postURLs haven't been loaded
		if (!postURLs) return;
		isFetchingPosts = true;
		
		// Load as many posts as there were present on the page when it loaded
		// After successfully loading a post, load the next one
		var loadedPosts = 0;
		var postCount = $(".post-list").children().length/2;
		var callback = function() {
					loadedPosts++;
					var postIndex = postCount + loadedPosts;
					if (postIndex > postURLs.length-1) {
						disableFetching();
						return;
					}
					if (loadedPosts < postsToLoad) {
					    fetchPostWithIndex(postIndex, callback);
					} else {
						isFetchingPosts = false;
					}
				};
		fetchPostWithIndex(postCount + loadedPosts, callback);
	}
	
	function fetchPostWithIndex(index, callback) {
		var postURL = postURLs[index];
		var firstChild = '<div class="container" style="width:100%"><h1><a href="' + postURL + '" title="View entire post">' + postHeadings[index] + '</a></h1>'
		var secondChild = '<p class="author"><span class="date">Posted on: ' + postDates[index] + '</span></p><div class="content">'
		var getUrlData = function(data) {
					var excerpt = $(data).find("#post-excerpt");
					var im = $(excerpt).find(".inline-image");
					im.remove();
					if(excerpt[0].className)excerpt.attr('class', 'col-md-12 text-left');
					var toAppend = firstChild + secondChild + excerpt[0].outerHTML + '</div></div><hr>';
					$(toAppend).appendTo(".post-list");
					callback();
				};
		$.get(postURL, getUrlData);
	}
	
	function disableFetching() {
		isFetchingPosts = false;
		$(".pager").remove();
	}
});