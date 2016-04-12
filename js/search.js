$(function() {
	var isFetchingPosts = false;
	var postsToLoad = 10;
	var all_results = new Array();
  // Initialize lunr with the fields to be searched, plus the boost.
  window.idx = lunr(function () {
    this.field('id');
    this.field('postHeading');
    this.field('subHeading');
    this.field('content', { boost: 10 });
    this.field('date');
    this.field('tags');
    this.field('image');
  });
  
  // Get the generated search_data.json file so lunr.js can search it locally.
  window.data = $.getJSON('/search-data.json');

  // Wait for the data to load and add it to lunr
  window.data.then(function(loaded_data){
    $.each(loaded_data, function(index, value){
      window.idx.add(
        $.extend({ "id": index }, value)
      );
    });
  });
  
  // Event when the form is submitted
  $("#site_search").submit(function(event){
      event.preventDefault();
      var query = $("#search_box").val(); // Get the value for the text field
      var results = window.idx.search(query); // Get lunr to perform a search
      display_search_results(results); // Hand the results off to be displayed
	  show_more_results_btn(); // Display more search results button
  });
  
  function display_search_results(results) {
    var $search_results = $("#search_results");
	//var all_results = new Array();

    // Wait for data to load
    window.data.then(function(loaded_data) {

      // Are there any results?
      if (results.length) {
        $search_results.empty(); // Clear any old results

        // Iterate over the results
        results.forEach(function(result) {
          var item = loaded_data[result.ref];

          // Build a snippet of HTML for this result var appendString = '<li><a href="' + item.url + '">' + item.postHeading + '</a></li>';
		  var postPreview = build_html(item.url, item.postHeading, item.subHeading, item.date, item.tags.split(', '));

          // Add the snippet to the collection of results.
          $search_results.append(postPreview);
		  $search_results.append(document.createElement("HR"));
		  
		  // Populate all_results
		  all_results.push({url:item.url, postHeading:item.postHeading, date:item.date, tags:item.tags, subHeading:item.subHeading});
        });
      } else {
        // If there are no results, let the user know.
        $search_results.html('<li>No results found.<br/>Please check spelling, spacing, and so on...</li>');
      }
    });
	return all_results;
  }
  
  function build_html(url, heading, subHeading, date, tags){
    // Create div
    var postPreview = document.createElement("div");
	postPreview.setAttribute('class', 'post-preview');
	// Create anchor
	var anchor = document.createElement("a");
	anchor.setAttribute('href', url);
	var title = document.createElement("h2");
	title.setAttribute('class', 'post-title');
	title.innerHTML = heading;
	var subTitle = document.createElement("h3");
	subTitle.setAttribute('class', 'post-subtitle');
	subTitle.innerHTML = subHeading;
	// Close anchor
	anchor.appendChild(title);
	anchor.appendChild(subTitle);
	// Create paragraph
	var paragraph = document.createElement('P');
	paragraph.setAttribute('class', 'paragraph post-meta');
	var calendar = document.createElement('i');
	calendar.setAttribute('class', 'icon-calendar');
	var node1 = document.createTextNode("Posted on: " + date + " |");
	var tag = document.createElement('i');
	tag.setAttribute('class', 'icon-tags');
	var node2 = document.createTextNode(" Tags: ");
	var subAnchor = document.createElement("a");
	if(tags[0] == 'food') subAnchor.setAttribute('href', '/recipes.html');
	else  subAnchor.setAttribute('href', '/creative-writing.html');
	subAnchor.setAttribute('title', 'View posts tagged with "' + tags[0] + '"');
	var span = document.createElement("span");
	span.setAttribute('class', 'label label-info');
	span.innerHTML = tags[0];
	subAnchor.appendChild(span);
	// Close paragraph
	paragraph.appendChild(calendar);
	paragraph.appendChild(node1);
	paragraph.appendChild(tag);
	paragraph.appendChild(node2);
	paragraph.appendChild(subAnchor);
	// Close div
	postPreview.appendChild(anchor);
	postPreview.appendChild(paragraph);
	return postPreview;
  }
  
  function show_more_results_btn(){
	  if(all_results.length > postsToLoad){
		  var element = document.createElement("a");
		  element.setAttribute('href', '#');
		  element.setAttribute('class', 'next');
		  element.onclick = function(e){getMoreResults();};
		  var anchorText = document.createTextNode("Show More Results");
		  element.appendChild(anchorText);
		  $(element).appendTo(".pagination");
	  }
  }
  
	//get more button
	function getMoreResults(){
		if (isFetchingPosts) return;
		fetchPosts();
		return false;
	}
  	
	// Fetch a chunk of posts
	function fetchPosts() {
		isFetchingPosts = true;
		
		// After successfully loading a post, load the next one
		var loadedPosts = 0;
		var postIndex = 0;
		do{
			postIndex = postsToLoad + loadedPosts;
			/*if (postIndex > all_results.length-1) {
				disableFetching();
				return;
			}*/
			if (loadedPosts < postsToLoad) {
				fetchPostWithIndex(postIndex);
			} else {
				isFetchingPosts = false;
			}
			loadedPosts++;
		}while(postIndex < all_results.length);
		disableFetching();
		//fetchPostWithIndex(postsToLoad + loadedPosts, callback);
	}
	
	function fetchPostWithIndex(index) {
		var item = all_results[index];
		console.log(item);
	}
	
	function disableFetching() {
		isFetchingPosts = false;
		$(".pager").remove();
	}
});