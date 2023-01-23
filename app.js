const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
app.use(express.json());

dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhot:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getAllQuery = `
    SELECT * FROM cricket_team ORDER BY player_id`;
  const allPlayersArray = await db.all(getAllQuery);
  response.send(
    allPlayersArray.map((eachPlayer) => {
      return {
        playerId: eachPlayer.player_id,
        playerName: eachPlayer.player_name,
        jerseyNumber: eachPlayer.jersey_number,
        role: eachPlayer.role,
      };
    })
  );
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const createPlayerQuery = ` insert into cricket_team(player_name,
    jersey_number,role) 
    values('${playerName}',${jerseyNumber},'${role}');`;
  const createPlayerQueryResponse = await db.run(createPlayerQuery);
  response.send(`Player Added to Team`);
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;
  const gotPlayer = await db.get(getPlayerQuery);
  response.send({
    playerId: gotPlayer.player_id,
    playerName: gotPlayer.player_name,
    jerseyNumber: gotPlayer.jersey_number,
    role: gotPlayer.role,
  });
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayerQuery = `UPDATE cricket_team SET 
  player_name="${playerName}",
  jersey_number=${jerseyNumber},
  role="${role}"
  WHERE player_id=${playerId}`;
  const playerUpdate = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`;
  const deleteResponse = await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
