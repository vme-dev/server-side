'use strict';

var card =( post) => {
	return `<div class="card z-depth-4">
			        <div class="card-content">
			          <span class="card-title">${post.title}</span>
			          <p>${post.text}</p>
			          <small>${post.data}</small>
			        </div>
			        <div class="card-action">
			          <button class="btn btn-small red js-remove" data-id="${post._id}"><i class="material-icons">delete</i></button>
			          <button class="btn btn-small blue js-edit modal-trigger" data-id="${post._id}" data-target="modal1" href="#modal1"><i class="material-icons">edit</i></button>
			        </div>
			      </div>`
};

var posts = [];
var modal;
var elems;
var instances;
var BASE_URL = '/api/post';

class PostApi {
	static fetch() {
		return fetch(BASE_URL,{ method:'GET'}).then( (res) => { return res.json() })
	}

	static create (post) {
		return fetch(BASE_URL, {
			method:'post',
			body: JSON.stringify(post),
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		}).then( (res) => { return res.json() })   //return res.json()
	}

	static edit (post) {
		return fetch(BASE_URL+"/edit", {
			method:'post',
			body: JSON.stringify(post),
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			}
		}).then( (res) => { 
				return res.json() ;
			});
	}

	static remove (id) {
		return fetch(`${BASE_URL}/${id}`,
		{
			method:'delete'
		}).then( (res) => { res.json() });
	}
};

document.addEventListener('DOMContentLoaded', () => {

	PostApi.fetch().then( ( backendPosts ) => {
		
		posts = backendPosts.concat();

		renderPosts(posts);
	})

	// elems = document.querySelectorAll('.modal');
 //    instances = M.Modal.init(elems);
	modal = M.Modal.init(document.querySelector('#createForm'));
	instances = M.Modal.init(document.querySelector('#modal1'), {
		onOpenStart: function () {
			var $title = document.querySelector('#edit_title');
			var $text = document.querySelector('#edit_text');

			var id = event.target.getAttribute("data-id");
			var postIndex = posts.findIndex(post => post._id == id);
			var post = posts[+postIndex];

			document.querySelector('#editPost').setAttribute('data-id', id);
			$title.autofocus = true;
			document.querySelector('label[for="edit_text"]').classList.add("active");
			$title.value =post.title; 
			$text.value=post.text;



		},
	});
	document.querySelector('#createPost').addEventListener('click', onCreatePost);
	document.querySelector('#posts').addEventListener('click', onDeletePost);
	document.querySelector('#editPost').addEventListener('click', onEditPost);
})

function renderPosts(_posts = []) {
	var $posts = document.querySelector('#posts');

	if ( posts.length > 0 ) {
		$posts.innerHTML = posts.map( (post) => card(post)).join(' ');

		
	} else {
		$posts.innerHTML = '<div class="center"> Not posts </div> '
	}
}

function onCreatePost () {
	var $title = document.querySelector('#title');
	var $text = document.querySelector('#text');

	if ($title.value && $text.value) {
		var newPost = {
			title:$title.value,
			text:$text.value
		};
		PostApi.create(newPost).then( (post) => {
			posts.push(post);
			renderPosts(posts);
		})
		modal.close();
		$title.value =""; $text.value="";
		M.updateTextFields();
	}
}

function onEditPost () {

	var $title = document.querySelector('#edit_title');
	var $text = document.querySelector('#edit_text');
	var id = event.target.getAttribute("data-id");

	if ($title.value && $text.value) {
		var newPost = {
			_id:id,
			title:$title.value,
			text:$text.value
		};
		PostApi.edit(newPost).then( (post) => {
			
			var postIndex = posts.findIndex(post => post._id == id);
			posts[postIndex] = post;
			renderPosts(posts);
		})
		instances.close();
		
		M.updateTextFields();
	}

}

function onDeletePost (event) {
	if (event.target.classList.contains('js-remove')) {
		var dec = confirm("Do you want?");

		if (dec) {
			var id = event.target.getAttribute("data-id");

			PostApi.remove(id).then(() => {
				var postIndex = posts.findIndex(post => post._id == id);

				posts.splice(postIndex,1);

				renderPosts(posts);
			})
		}
	}
}