let username = "johnpapa";
const apiUrl = `https://api.github.com/users/`;
let perPage = 10;
let currentPage = 1;
let totalRepos = 0;
let windowStart = 1;

const searchButton = document.getElementById("search-button");

const input = document.getElementById("username");

const loader = document.getElementById("loader");

input.addEventListener("input", ()=> {
  document.querySelector("#form-error").textContent = "";
  document.querySelector("#error").textContent = "";
})

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  currentPage = 1;
  try {
    const inputUser = document.querySelector("#username").value;
    if (inputUser.trim().length !== 0) {
      username = inputUser;
      await fetchProfileData();
      await fetchRepoData();
    } else {
      throw new Error("Input field must not be empty");
    }
  } catch (error) {
    console.log("error", error);
    document.querySelector("#form-error").textContent = error.message;
  } finally {
    document.querySelector("#username").value = "";
  }
});

const createPagination = () => {
  let page = Math.ceil(totalRepos / perPage);
  const pagination = document.getElementById("pagination-id");
  pagination.innerHTML = null;

  const previousButton = document.createElement("li");
  previousButton.className = `page-item ${currentPage == 1 && "disabled"}`;
  const linkButtonPrev = document.createElement("span");
  linkButtonPrev.className = `page-link`;
  linkButtonPrev.textContent = "Previous";
  previousButton.addEventListener("click", function () {
    if (currentPage > 1) {
      if (windowStart > 10 && currentPage%10 === 1) {
        windowStart -= 10;
      }
      currentPage--;
      fetchRepoData();
      createPagination();
    }
  });
  previousButton.appendChild(linkButtonPrev);
  pagination.appendChild(previousButton);

  for (let i = windowStart; i <= page && i < windowStart + 10; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i == currentPage && "active"}`;
    const span = document.createElement("a");
    span.href = "#";
    span.className = `page-link`;
    span.textContent = i;

    li.addEventListener("click", async (event) => {
      event.preventDefault();
      currentPage = i;
      await fetchRepoData();
      await createPagination();
    });

    li.appendChild(span);
    pagination.appendChild(li);
  }

  const nextButton = document.createElement("li");
  nextButton.className = `page-item ${currentPage == page && "disabled"}`;
  const linkButtonNext = document.createElement("a");
  linkButtonNext.href = "#";
  linkButtonNext.className = `page-link`;
  linkButtonNext.textContent = "Next";
  nextButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < page) {
      if(currentPage%10 === 0 && windowStart + 10 < page) {
        windowStart += 10;
      }
      currentPage++;
      fetchRepoData();
      createPagination();
    }
  });
  nextButton.appendChild(linkButtonNext);
  pagination.appendChild(nextButton);
};

const fetchProfileData = async () => {

  loader.style.display = "block";
  await fetch(`${apiUrl}${username}`)
    .then((response) => response.json())
    .then((data) => {

      if(data?.message === "Not Found") {
        throw new Error("User Not Found");
      }
      totalRepos = data.public_repos;
      const profileDiv = document.getElementById("profile");

      profileDiv.innerHTML = `<img class="profile-image" src="${data?.avatar_url}" alt="profile_picture">
                                    <div class="about">
                                        <h1>${data?.name}</h1>
                                        <p class='bio'>${data?.bio}</p>
                                        <p><strong>Location: </strong> ${data?.location}</p>
                                        <a href="https://github.com/${username}">Profile Link</a>
                                        <a href="${data?.blog}">Website Link</a>
                                    </div>`;
      loader.style.display = "none";
      createPagination();
    })
    .catch((error) => {
      document.querySelector("#error").textContent = error.message;
      loader.style.display = "none";
    });
};

const fetchRepoData = () => {
  fetch(`${apiUrl}${username}/repos?per_page=${perPage}&page=${currentPage}`)
    .then((response) => response.json())
    .then((repositories) => {

      if(repositories?.message === "Not Found") {
        throw new Error("Not Found");
      }
      const repositoriesList = document.getElementById("repositories-list");
      repositoriesList.innerHTML = null;

      repositories.forEach((repo) => {
        const topicsList = document.createElement("div");
        topicsList.className = `topic-list`;
        if (repo.topics.length !== 0) {
          repo.topics.forEach((topic) => {
            const topicDiv = document.createElement("div");
            topicDiv.className = `topic-element`;
            topicDiv.textContent = `${topic}`;
            topicsList.appendChild(topicDiv);
          });
        }

        const listItem = document.createElement("div");
        listItem.className = "repo-element";
        listItem.innerHTML = `<strong><a href="${
          repo.html_url
        }" target="_blank">${repo.name}</a></strong><p>${
          repo.description || "No description available."
        }</p><br>${
          repo.topics.length !== 0
            ? topicsList.outerHTML
            : "<p>No topics available</p>"
        }`;
        repositoriesList.appendChild(listItem);
        document.querySelector("#error").textContent = "";
      });
    })
    .catch((error) => {
      if(document.querySelector("#error").textContent === "")
        document.querySelector("#error").textContent = error.message;
      console.log(error);
    });
};

const selectPerPage = document.getElementById("per-page-cap");

selectPerPage.addEventListener("change", async (e) => {
  perPage = e.target.value;
  currentPage = 1;
  await fetchRepoData();
  await createPagination();
});
