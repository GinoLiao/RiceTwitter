
angular.module('dummy')
	.filter('filterNamePostText', FilterByNamePostText);

function FilterByNamePostText(){
	return function(posts, searchtext){
		if(!searchtext){
			return posts
		}
		return posts.filter(function(post){
			return post.author.toLowerCase().includes(searchtext.toLowerCase()) || post.body.toLowerCase().includes(searchtext.toLowerCase())
		})
	}
};

