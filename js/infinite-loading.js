$(function(){
	var postURLs;
	var isFetchingPosts = false;
	var postsToLoad = $(".post-list").children().length/4;
	
	// Load the JSON file containing all URLs
	var getJsonRes = function(data){
					console.log(data);
					postURLs = data["posts"]["url"];
					postHeadings = data["posts"]["heading"];
					postDates = data["posts"]["date"];
					// If there aren't any more posts available to load 
					//than already visible, disable fetching
					if (postURLs.length <= postsToLoad)
					  disableFetching();
				};
	$.getJSON('/all-posts.json', getJsonRes);
	
	//get more button
	$(function(){
		$('#morebtn').click(function() {
			if (isFetchingPosts) return;
			fetchPosts();
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
		var postCount = $(".post-list").children().length/4;
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
		var firstChild = '<h1><a href="' + postURL + '">' + postHeadings[index] + '</a></h1>'
		var secondChild = '<p class="author"><span class="date">Posted on: ' + postDates[index] + '</span></p>'
		var getUrlData = function(data) {
					$(firstChild).appendTo(".post-list");
					$(secondChild).appendTo(".post-list");
					$(data).find("#post-body").appendTo(".post-list");
					$("<hr>").appendTo(".post-list");
					callback();
				};
		$.get(postURL, getUrlData);
	}
	
	function disableFetching() {
		isFetchingPosts = false;
		$(".pager").remove();
	}
});