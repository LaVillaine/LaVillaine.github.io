$(function(){
	var postURLs;
	var isFetchingPosts = false;
	var shouldFetchPosts = true;
	var postsToLoad = $(".post-list").children().length/3;
	var loadNewPostsThreshold = 3000;
	
	// Load the JSON file containing all URLs
	var getJsonRes = function(data){
					postURLs = data["posts"];
					// If there aren't any more posts available to load 
					//than already visible, disable fetching
					if (postURLs.length <= postsToLoad)
					  disableFetching();
				};
	$.getJSON('/all-posts.json', getJsonRes);
	
	// If there's no spinner, it's not a page where posts should be fetched
	if ($(".infinite-spinner").length < 1)
		shouldFetchPosts = false;
	
	// Are we close to the end of the page? If we are, load more posts
	var scrollAndLoad = function(e){
					if (!shouldFetchPosts || isFetchingPosts) return;
					var windowHeight = $(window).height();
        			var windowScrollPosition = $(window).scrollTop();
        			var bottomScrollPosition = windowHeight + windowScrollPosition;
        			var documentHeight = $(document).height();
					// If we've scrolled past the loadNewPostsThreshold, 
					//fetch posts
					if ((documentHeight - loadNewPostsThreshold) < bottomScrollPosition) 
						fetchPosts();
				};
	//$(window).scroll(scrollAndLoad);
	
	//get more button
	$(function(){
		$('#morebtn').click(function() {fetchPosts();});
	});
	
	// Fetch a chunk of posts
	function fetchPosts() {
		 // Exit if postURLs haven't been loaded
		if (!postURLs) return;
		isFetchingPosts = true;
		
		// Load as many posts as there were present on the page when it loaded
		// After successfully loading a post, load the next one
		var loadedPosts = 0;
		var postCount = $(".post-list").children().length/3;
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
		var getUrlData = function(data) {
					var postHeading = $(data).find(".post-heading");
					console.log(postHeading);
					postHeading.appendTo(".post-list");
					callback();
				};
		$.get(postURL, getUrlData);
	}
	
	function disableFetching() {
		shouldFetchPosts = false;
		isFetchingPosts = false;
		$(".infinite-spinner").fadeOut();
	}
});