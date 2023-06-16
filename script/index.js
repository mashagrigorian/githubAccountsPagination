const API1 = "https://api.github.com/users";
    const API2 = "https://randomuser.me/api/";

    class FetchService {
      constructor(domain) {
        this.domain = domain;
      }

      async get() {
        const response = await fetch(this.domain);
        const data = await response.json();
        return data;
      }
    }

    const gitAPI = new FetchService(API1);
    const randomUserAPI = new FetchService(API2);

    const tableBody = document.getElementById("gitHubUserTableBody");
    const paginationContainer = document.getElementById("paginationContainer");
    const loadingIndicator = document.getElementById("loadingIndicator");

    const itemsPerPage = 10;
    let currentPage = 1;

    const showPopup = (id, login, followersUrl) => {
        alert(`ID: ${id}\nLogin: ${login}\nFollowers URL: ${followersUrl}`);
      };

    const handleRenderTable = (data) => {
        tableBody.innerHTML = "";
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
      
        const pageData = data.slice(startIndex, endIndex);
      
        pageData.forEach((element) => {
          const row = document.createElement("tr");
          row.addEventListener("click", () => {
            showPopup(element.id, element.login, element.followers_url);
          });
      
          const idCell = document.createElement("td");
          idCell.textContent = element.id;
          row.appendChild(idCell);
      
          const loginCell = document.createElement("td");
          loginCell.textContent = element.login;
          row.appendChild(loginCell);
      
          const typeCell = document.createElement("td");
          typeCell.textContent = element.type;
          row.appendChild(typeCell);
      
          const followersUrlCell = document.createElement("td");
          const followersUrlLink = document.createElement("a");
          followersUrlLink.href = element.followers_url;
          followersUrlLink.textContent = "Followers URL";
          followersUrlLink.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering the row click event
          });
          followersUrlCell.appendChild(followersUrlLink);
          row.appendChild(followersUrlCell);
      
          tableBody.appendChild(row);
        });
      };
      
    const handleRenderPagination = (data) => {
      paginationContainer.innerHTML = "";

      const totalPages = Math.ceil(data.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
        const link = document.createElement("a");
        link.href = "#";
        link.classList.add("link");
        link.textContent = i;
        link.value = i;

        if (i === currentPage) {
          link.classList.add("active");
        }

        link.addEventListener("click", () => {
          currentPage = i;
          handleRenderTable(data);
          handleRenderPagination(data);
        });

        paginationContainer.appendChild(link);
      }

    };

    gitAPI.get().then((data) => {
      handleRenderTable(data);
      handleRenderPagination(data);

  // Remove loading indicator after 1 second
  setTimeout(() => {
    loadingIndicator.style.display = "none";
    document.querySelector("table").style.display = "table";
    paginationContainer.style.display = "block"; // Show the pagination
    }, 1000);
});
