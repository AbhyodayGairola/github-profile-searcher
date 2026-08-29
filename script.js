async function searchUser() {

    const username = document.getElementById("username").value.trim();
    const profile = document.getElementById("profile");
    const message = document.getElementById("message");

    if (username === "") {
        message.textContent = "Please enter a GitHub username.";
        profile.innerHTML = "";
        return;
    }

    message.textContent = "Loading...";
    profile.innerHTML = "";

    try {

        const response = await fetch(
            `/api/github/${encodeURIComponent(username)}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User not found");
            }

            throw new Error("Server error");
        }

        const user = await response.json();

        message.textContent = "";

        profile.innerHTML = `
            <div class="profile-card">

                <img src="${user.avatar_url}" alt="Profile Picture">

                <h2>${user.username}</h2>

                <p>
                    ${user.bio || "No bio available."}
                </p>

                <p>
                    <strong>Followers:</strong> ${user.followers}
                </p>

                <div class="repositories">

                    <h3>Recent Repositories</h3>

                    ${user.repositories.length === 0
                        ? "<p>No public repositories found.</p>"
                        : user.repositories.map(repo => `
                            <div class="repository">
                                <a href="${repo.url}" target="_blank">
                                    ${repo.name}
                                </a>
                            </div>
                        `).join("")
                    }

                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        message.textContent = error.message === "User not found"
            ? "User not found."
            : "Something went wrong. Please try again.";

        profile.innerHTML = "";
    }
}