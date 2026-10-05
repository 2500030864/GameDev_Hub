/* =========================================
   GAMEDEV HUB
   GAMING TOURNAMENT PORTAL
   ========================================= */


/* ---------- NAVIGATION ---------- */

function goToLogin() {
    window.location.href = "login.html";
}

function goToSignup() {
    window.location.href = "signup.html";
}

function goToTournaments() {
    window.location.href = "tournaments.html";
}

function scrollToTeam() {
    document.getElementById("teamSection")
        ?.scrollIntoView({ behavior: "smooth" });
}


/* ---------- LOCAL STORAGE ---------- */

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


/* ---------- SIGNUP ---------- */

function signup(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const username =
        document.getElementById("username")
        .value.trim()
        .toLowerCase();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "red");
        return;
    }


    if (username === "admin") {
        showMessage("This username is reserved.", "red");
        return;
    }


    const users = getData("users");


    if (users.some(user =>
        user.username === username
    )) {

        showMessage(
            "Username already exists.",
            "red"
        );

        return;
    }


    users.push({
        id: Date.now(),
        name: name,
        username: username,
        password: password
    });


    saveData("users", users);


    showMessage(
        "Account created successfully!",
        "green"
    );


    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}


/* ---------- LOGIN ---------- */

function login(event) {

    event.preventDefault();


    const username =
        document.getElementById("username")
        .value.trim()
        .toLowerCase();

    const password =
        document.getElementById("password").value;

    const role =
        document.getElementById("role").value;


    /* ADMIN */

    if (role === "admin") {

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            localStorage.setItem(
                "role",
                "admin"
            );

            localStorage.setItem(
                "username",
                "admin"
            );

            window.location.href =
                "admin.html";

        } else {

            showMessage(
                "Invalid admin credentials.",
                "red"
            );
        }

        return;
    }


    /* USER */

    const users = getData("users");


    const user = users.find(
        account =>
            account.username === username &&
            account.password === password
    );


    if (user) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        localStorage.setItem(
            "role",
            "user"
        );

        localStorage.setItem(
            "username",
            username
        );


        window.location.href =
            "user.html";

    } else {

        showMessage(
            "Invalid username or password.",
            "red"
        );
    }
}


/* ---------- MESSAGE ---------- */

function showMessage(text, color) {

    const message =
        document.getElementById("message");

    if (message) {
        message.textContent = text;
        message.style.color = color;
    }
}


/* ---------- AUTH ---------- */

function checkUser() {

    if (
        localStorage.getItem("loggedIn") !== "true" ||
        localStorage.getItem("role") !== "user"
    ) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


function checkAdmin() {

    if (
        localStorage.getItem("loggedIn") !== "true" ||
        localStorage.getItem("role") !== "admin"
    ) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


/* ---------- LOGOUT ---------- */

function logout() {

    localStorage.removeItem("loggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    window.location.href = "index.html";
}


/* ---------- USER ---------- */

function showUserName() {

    const username =
        localStorage.getItem("username");

    const users = getData("users");

    const user =
        users.find(
            account =>
                account.username === username
        );

    const element =
        document.getElementById("userName");

    if (element && user) {
        element.textContent = user.name;
    }
}


/* ---------- CREATE TEAM ---------- */

function createTeam(event) {

    event.preventDefault();

    if (!checkUser()) return;


    const teamName =
        document.getElementById("teamName")
        .value.trim();

    const username =
        localStorage.getItem("username");


    const teams = getData("teams");


    teams.push({

        id: Date.now(),

        teamName: teamName,

        captain: username,

        members: [username]

    });


    saveData("teams", teams);


    alert("Team created successfully!");

    event.target.reset();

    displayTeams();
}


/* ---------- DISPLAY TEAMS ---------- */

function displayTeams() {

    const container =
        document.getElementById("teamList");

    if (!container) return;


    const teams = getData("teams");

    container.innerHTML = "";


    if (teams.length === 0) {

        container.innerHTML =
            "<p>No teams created yet.</p>";

        return;
    }


    teams.forEach(team => {

        container.innerHTML += `

            <div class="team-card">

                <h3>🏆 ${team.teamName}</h3>

                <p>
                    Captain: ${team.captain}
                </p>

                <p>
                    Members:
                    ${team.members.join(", ")}
                </p>

            </div>

        `;

    });
}


/* ---------- CREATE TOURNAMENT ---------- */

function createTournament(event) {

    event.preventDefault();

    if (!checkAdmin()) return;


    const tournament = {

        id: Date.now(),

        name:
            document.getElementById(
                "tournamentName"
            ).value,

        game:
            document.getElementById(
                "game"
            ).value,

        mode:
            document.getElementById(
                "mode"
            ).value,

        date:
            document.getElementById(
                "date"
            ).value,

        location:
            document.getElementById(
                "location"
            ).value,

        prize:
            document.getElementById(
                "prize"
            ).value,

        maxPlayers:
            document.getElementById(
                "maxPlayers"
            ).value,

        status:
            "Registration Open"

    };


    const tournaments =
        getData("tournaments");


    tournaments.push(tournament);

    saveData(
        "tournaments",
        tournaments
    );


    alert(
        "Tournament created successfully!"
    );


    event.target.reset();

    displayAdminTournaments();
}


/* ---------- TOURNAMENTS ---------- */

function displayTournaments() {

    const container =
        document.getElementById(
            "tournamentGrid"
        );

    if (!container) return;


    const tournaments =
        getData("tournaments");


    container.innerHTML = "";


    if (tournaments.length === 0) {

        container.innerHTML = `

            <div class="no-games">

                <h2>
                    No tournaments available
                </h2>

                <p>
                    Ask the organizer to create a tournament.
                </p>

            </div>

        `;

        return;
    }


    tournaments.forEach(tournament => {

        container.innerHTML += `

            <div class="tournament-card">

                <div class="tournament-icon">
                    🎮
                </div>

                <h2>
                    ${tournament.name}
                </h2>

                <p>
                    <strong>Game:</strong>
                    ${tournament.game}
                </p>

                <p>
                    <strong>Mode:</strong>
                    ${tournament.mode}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${tournament.date}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${tournament.location}
                </p>

                <p>
                    <strong>Prize:</strong>
                    ₹${tournament.prize}
                </p>

                <span class="status">
                    ${tournament.status}
                </span>

                <button
                    onclick="openTournament(${tournament.id})">

                    View Tournament

                </button>

            </div>

        `;

    });
}


/* ---------- OPEN TOURNAMENT ---------- */

function openTournament(id) {

    localStorage.setItem(
        "selectedTournament",
        id
    );

    window.location.href =
        "tournament.html";
}


/* ---------- TOURNAMENT DETAILS ---------- */

function loadTournamentDetails() {

    const id =
        Number(
            localStorage.getItem(
                "selectedTournament"
            )
        );


    const tournaments =
        getData("tournaments");


    const tournament =
        tournaments.find(
            item => item.id === id
        );


    if (!tournament) return;


    const name =
        document.getElementById(
            "selectedTournamentName"
        );


    const info =
        document.getElementById(
            "selectedTournamentInfo"
        );


    const schedule =
        document.getElementById(
            "scheduleInfo"
        );


    if (name) {
        name.textContent =
            tournament.name;
    }


    if (info) {

        info.innerHTML = `
            <strong>${tournament.game}</strong>
            • ${tournament.mode}
            • Prize ₹${tournament.prize}
        `;
    }


    if (schedule) {

        schedule.innerHTML = `

            <p>
                📅 Date:
                ${tournament.date}
            </p>

            <p>
                📍 Location:
                ${tournament.location}
            </p>

            <p>
                👥 Maximum Players:
                ${tournament.maxPlayers}
            </p>

        `;
    }
}


/* ---------- REGISTER ---------- */

function registerTournament() {

    if (!checkUser()) return;


    const tournamentId =
        Number(
            localStorage.getItem(
                "selectedTournament"
            )
        );


    const username =
        localStorage.getItem(
            "username"
        );


    const registrations =
        getData("registrations");


    const already =
        registrations.some(
            item =>
                item.tournamentId ===
                tournamentId &&
                item.username ===
                username
        );


    if (already) {

        alert(
            "You are already registered."
        );

        return;
    }


    registrations.push({

        tournamentId:
            tournamentId,

        username:
            username,

        date:
            new Date().toLocaleDateString()

    });


    saveData(
        "registrations",
        registrations
    );


    alert(
        "Successfully registered!"
    );


    displayRegistrationCount();
}


/* ---------- REGISTRATION COUNT ---------- */

function displayRegistrationCount() {

    const element =
        document.getElementById(
            "registrationCount"
        );

    if (!element) return;


    const id =
        Number(
            localStorage.getItem(
                "selectedTournament"
            )
        );


    const registrations =
        getData("registrations");


    const count =
        registrations.filter(
            item =>
                item.tournamentId === id
        ).length;


    element.textContent = count;
}


/* ---------- ADMIN TOURNAMENTS ---------- */

function displayAdminTournaments() {

    const container =
        document.getElementById(
            "adminTournamentList"
        );

    if (!container) return;


    const tournaments =
        getData("tournaments");


    container.innerHTML = "";


    tournaments.forEach(tournament => {

        container.innerHTML += `

            <div class="admin-item">

                <h3>
                    ${tournament.name}
                </h3>

                <p>
                    Game:
                    ${tournament.game}
                </p>

                <p>
                    Date:
                    ${tournament.date}
                </p>

                <p>
                    Mode:
                    ${tournament.mode}
                </p>

                <p>
                    Tournament ID:
                    <strong>${tournament.id}</strong>
                </p>

            </div>

        `;

    });
}


/* ---------- REGISTRATIONS ---------- */

function displayRegistrations() {

    const container =
        document.getElementById(
            "registrationList"
        );

    if (!container) return;


    const registrations =
        getData("registrations");


    const tournaments =
        getData("tournaments");


    container.innerHTML = "";


    if (registrations.length === 0) {

        container.innerHTML =
            "<p>No registrations yet.</p>";

        return;
    }


    registrations.forEach(item => {

        const tournament =
            tournaments.find(
                t =>
                    t.id ===
                    item.tournamentId
            );


        container.innerHTML += `

            <div class="admin-item">

                <p>
                    <strong>Player:</strong>
                    ${item.username}
                </p>

                <p>
                    <strong>Tournament:</strong>
                    ${tournament
                        ? tournament.name
                        : "Unknown"}
                </p>

                <p>
                    Registered:
                    ${item.date}
                </p>

            </div>

        `;

    });
}


/* ---------- MATCH RESULTS ---------- */

function addResult(event) {

    event.preventDefault();

    if (!checkAdmin()) return;


    const tournamentId =
        Number(
            document.getElementById(
                "resultTournament"
            ).value
        );


    const player =
        document.getElementById(
            "resultPlayer"
        ).value.trim();


    const score =
        Number(
            document.getElementById(
                "resultScore"
            ).value
        );


    const results =
        getData("results");


    results.push({

        tournamentId:
            tournamentId,

        player:
            player,

        score:
            score

    });


    saveData(
        "results",
        results
    );


    alert(
        "Match result updated!"
    );


    event.target.reset();


    displayResults();

    displayLeaderboard();
}


/* ---------- RESULTS ---------- */

function displayResults() {

    const container =
        document.getElementById(
            "resultList"
        );

    if (!container) return;


    const results =
        getData("results");


    container.innerHTML = "";


    results.forEach(result => {

        container.innerHTML += `

            <div class="result-card">

                <h3>
                    ${result.player}
                </h3>

                <p>
                    Score:
                    ${result.score}
                </p>

            </div>

        `;

    });
}


/* ---------- LEADERBOARD ---------- */

function displayLeaderboard() {

    const container =
        document.getElementById(
            "leaderboard"
        );

    if (!container) return;


    const results =
        getData("results");


    const scores = {};


    results.forEach(result => {

        if (!scores[result.player]) {
            scores[result.player] = 0;
        }

        scores[result.player] +=
            Number(result.score);

    });


    const sorted =
        Object.entries(scores)
        .sort(
            (a, b) =>
                b[1] - a[1]
        );


    container.innerHTML = "";


    if (sorted.length === 0) {

        container.innerHTML =
            "<p>No scores available.</p>";

        return;
    }


    sorted.forEach(
        (player, index) => {

            container.innerHTML += `

                <div class="leaderboard-row">

                    <span>
                        #${index + 1}
                    </span>

                    <strong>
                        ${player[0]}
                    </strong>

                    <span>
                        ${player[1]} Points
                    </span>

                </div>

            `;

        }
    );
}


/* ---------- LIVE UPDATES ---------- */

function addUpdate(event) {

    event.preventDefault();

    if (!checkAdmin()) return;


    const text =
        document.getElementById(
            "updateText"
        ).value.trim();


    const updates =
        getData("updates");


    updates.unshift({

        text: text,

        time:
            new Date().toLocaleString()

    });


    saveData(
        "updates",
        updates
    );


    alert(
        "Live update published!"
    );


    event.target.reset();


    displayUpdates();
}


function displayUpdates() {

    const container =
        document.getElementById(
            "liveUpdates"
        );

    if (!container) return;


    const updates =
        getData("updates");


    container.innerHTML = "";


    if (updates.length === 0) {

        container.innerHTML =
            "<p>No live updates.</p>";

        return;
    }


    updates.forEach(update => {

        container.innerHTML += `

            <div class="update-card">

                <p>
                    🔴 ${update.text}
                </p>

                <small>
                    ${update.time}
                </small>

            </div>

        `;

    });
}


/* ---------- PRIZES ---------- */

function addPrize(event) {

    event.preventDefault();

    if (!checkAdmin()) return;


    const prizes =
        getData("prizes");


    prizes.push({

        tournament:
            document.getElementById(
                "prizeTournament"
            ).value,

        first:
            document.getElementById(
                "firstPrize"
            ).value,

        second:
            document.getElementById(
                "secondPrize"
            ).value,

        third:
            document.getElementById(
                "thirdPrize"
            ).value

    });


    saveData(
        "prizes",
        prizes
    );


    alert(
        "Prize distribution saved!"
    );


    event.target.reset();


    displayPrizes();
}


function displayPrizes() {

    const container =
        document.getElementById(
            "prizeList"
        );

    if (!container) return;


    const prizes =
        getData("prizes");


    container.innerHTML = "";


    if (prizes.length === 0) {

        container.innerHTML =
            "<p>No prize information.</p>";

        return;
    }


    prizes.forEach(prize => {

        container.innerHTML += `

            <div class="prize-card">

                <h3>
                    🏆 ${prize.tournament}
                </h3>

                <p>
                    🥇 First:
                    ₹${prize.first}
                </p>

                <p>
                    🥈 Second:
                    ₹${prize.second}
                </p>

                <p>
                    🥉 Third:
                    ₹${prize.third}
                </p>

            </div>

        `;

    });
}


/* ---------- INITIALIZATION ---------- */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const page =
            window.location.pathname
            .split("/")
            .pop();


        if (page === "admin.html") {

            if (checkAdmin()) {

                displayAdminTournaments();
                displayRegistrations();
                displayResults();
                displayLeaderboard();
                displayUpdates();
                displayPrizes();

            }
        }


        if (page === "user.html") {

            if (checkUser()) {

                showUserName();
                displayTeams();

            }
        }


        if (page === "tournaments.html") {

            if (checkUser()) {

                displayTournaments();

            }
        }


        if (page === "tournament.html") {

            if (checkUser()) {

                loadTournamentDetails();
                displayRegistrationCount();
                displayLeaderboard();
                displayUpdates();
                displayPrizes();

            }
        }

    }
);