$(function () {
  let currentUserId = 1;

  loadUser(currentUserId);

  $("header button:first").on("click", function () {
    currentUserId = currentUserId === 1 ? 30 : currentUserId - 1;
    loadUser(currentUserId);
  });

  $("header button:last").on("click", function () {
    currentUserId = currentUserId === 30 ? 1 : currentUserId + 1;
    loadUser(currentUserId);
  });

  $(document).on("click", ".posts h3, .todos h3", function () {
    $(this).next("ul").slideToggle();
  });

  $(document).on("click", ".posts h4", function () {
    const postId = $(this).data("post-id");
    loadPostDetails(postId);
  });

  $(document).on("click", ".modal button", function () {
    $(".overlay").remove();
  });

  function loadUser(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}`,
      method: "GET",
      success: function (user) {
        displayUserInfo(user);
        loadUserPosts(userId);
        loadUserTodos(userId);
      },
      error: function (error) {
        console.error("Error loading user:", error);
      },
    });
  }

  function displayUserInfo(user) {
    $(".info__image img").attr("src", user.image);

    const userInfoHtml = `
      <h2>${user.firstName} ${user.lastName}</h2>
      <p><strong>Age:</strong> ${user.age}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
    `;

    $(".info__content").html(userInfoHtml);
  }

  function loadUserPosts(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}/posts`,
      method: "GET",
      success: function (data) {
        displayPosts(data.posts);
      },
      error: function (error) {
        console.error("Error loading posts:", error);
      },
    });
  }

  function displayPosts(posts) {
    const firstName = $(".info__content h2").text().split(" ")[0];
    $(".posts h3").text(`${firstName}'s Posts`);

    if (posts.length === 0) {
      $(".posts ul").html("<li>User has no posts</li>");
    } else {
      let postsHtml = "";
      posts.forEach((post) => {
        postsHtml += `
          <li>
            <h4 data-post-id="${post.id}">${post.title}</h4>
            <p>${post.body}</p>
          </li>
        `;
      });
      $(".posts ul").html(postsHtml);
    }
  }

  function loadUserTodos(userId) {
    $.ajax({
      url: `https://dummyjson.com/users/${userId}/todos`,
      method: "GET",
      success: function (data) {
        displayTodos(data.todos);
      },
      error: function (error) {
        console.error("Error loading todos:", error);
      },
    });
  }

  function displayTodos(todos) {
    const firstName = $(".info__content h2").text().split(" ")[0];
    $(".todos h3").text(`${firstName}'s To Dos`);

    if (todos.length === 0) {
      $(".todos ul").html("<li>User has no todos</li>");
    } else {
      let todosHtml = "";
      todos.forEach((todo) => {
        todosHtml += `<li>${todo.todo}</li>`;
      });
      $(".todos ul").html(todosHtml);
    }
  }

  function loadPostDetails(postId) {
    $.ajax({
      url: `https://dummyjson.com/posts/${postId}`,
      method: "GET",
      success: function (post) {
        displayModal(post);
      },
      error: function (error) {
        console.error("Error loading post details:", error);
      },
    });
  }

  function displayModal(post) {
    const modalHtml = `
      <div class="overlay">
        <div class="modal">
          <h3>${post.title}</h3>
          <p>${post.body}</p>
          <p><strong>Views:</strong> ${post.views}</p>
          <button>Close Modal</button>
        </div>
      </div>
    `;

    $("body").append(modalHtml);
  }
});
