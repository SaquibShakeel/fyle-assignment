const username = "johnpapa";
const apiUrl = `https://api.github.com/users/`;
let perPage = 10;
let currentPage = 1;
let totalRepos = 0;

const createPagination = () => {
  const page = Math.ceil(totalRepos/perPage);
  const pagination = document.getElementById("pagination-id");
  pagination.innerHTML = null;

  for(let i = perPage*(currentPage-1); i < totalRepos && i < perPage*currentPage; i++) {
    
  }
};

const fetchProfileData = () => {
  fetch(`${apiUrl}${username}`)
    .then((response) => response.json())
    .then((data) => {
      totalRepos = data.public_repos;
      const profileDiv = document.getElementById("profile");

      profileDiv.innerHTML = `<img class="profile-image" src="${data?.avatar_url}" alt="profile_picture">
                                    <div class="about">
                                        <h1>${data?.name}</h1>
                                        <p>${data?.bio}</p>
                                        <div>${data?.location}</div>
                                        <a href="${data?.blog}">Website Link</a>
                                    </div>`;
    })
    .catch((error) => console.log("Error fetching profile data", error));
};

const fetchRepoData = () => {
  fetch(`${apiUrl}${username}/repos?per_page=${perPage}&page=${currentPage}`)
    .then((response) => response.json())
    .then((repositories) => {
      const repositoriesList = document.getElementById("repositories-list");
      repositoriesList.innerHTML = null;

      repositories.forEach((repo) => {
        const topicsList = document.createElement("div");
        if (repo.topics.length !== 0) {
          repo.topics.forEach((topic) => {
            const topicDiv = document.createElement("div");
            topicDiv.innerHTML = `${topic}`;
            topicsList.appendChild(topicDiv);
          });
        }

        const listItem = document.createElement("div");
        listItem.className = "repo-element";
        listItem.innerHTML = `<strong><a href="${
          repo.html_url
        }" target="_blank">${repo.name}</a></strong><br><p>${
          repo.description || "No description available."
        }</p><br>${topicsList.innerHTML || "No topics available"}`;
        repositoriesList.appendChild(listItem);
      });
    })
    .catch((error) =>
      console.error("Error fetching GitHub repositories:", error)
    );
};

document.addEventListener("DOMContentLoaded", () => {
  try {
    fetchProfileData();
    fetchRepoData();
  } catch (error) {
    console.log(error);
  }
});

const selectPerPage = document.getElementById("per-page-cap");

selectPerPage.addEventListener("change", (e) => {
  perPage = e.target.value;
  fetchRepoData();
});
