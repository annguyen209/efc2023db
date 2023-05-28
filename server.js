const express = require('express');
var db = require("./database.js");
var cors = require('cors')
const app = express();


//app.use('/', express.static('dist/efc2023app'));

app.use(cors());

app.get("/api/sponsors", (req, res, next) => {
  var sql = `SELECT * FROM Sponsor`;
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

app.get("/api/teamsWithoutPlayer", (req, res, next) => {
  var sql = `SELECT * FROM Team`;
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

app.get("/api/teams", (req, res, next) => {
  var sql = `SELECT Player.Id, Player.Name AS PlayerName, TeamId, Team.Name AS TeamName
                FROM Player
                JOIN Team
                ON Player.TeamId = Team.Id
                ORDER BY TeamId, Player.Name`;
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

app.get("/api/fixtures", (req, res, next) => {
  var sql = `SELECT Fixture.Id, TimeLocation, HomeTeamId, HomeTeam.Name AS HomeTeamName, 
              AwayTeamId, AwayTeam.Name AS AwayTeamName, Result1, Result2
              FROM "Fixture" 
              JOIN Team AS HomeTeam 
              ON HomeTeam.Id = Fixture.HomeTeamId
              JOIN Team AS AwayTeam 
              ON AwayTeam.Id = Fixture.AwayTeamId
              ORDER BY Fixture.Id`;
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    var checkFinal = rows.indexOf(s => s.TimeLocation == "[Final] 7B, 18:30 Thu Jun 22 2023");
    if (checkFinal == -1) {
      rows.push({
        "Id": 99,
        "TimeLocation": "[Final] 7B, 18:30 Thu Jun 22 2023",
        "HomeTeamId": null,
        "HomeTeamName": "1st Group",
        "AwayTeamId": null,
        "AwayTeamName": "2nd Group",
        "Result1": null,
        "Result2": null
      });
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

app.get("/api/standings", (req, res, next) => {
  var sql = `SELECT Id, TeamId, Team.Name AS TeamName, Played, Won, 
              Drawn, Lost, Points, GF, GA, GD
              FROM "TeamStanding"
              JOIN Team ON Team.Id = TeamStanding.TeamId
              ORDER BY Points DESC, Team.Name`;
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

app.get("/api/scorers", (req, res, next) => {
  var sql = `SELECT PlayerId, Player.Name, SUM(Goals) AS TotalGoals FROM Scorer
                JOIN Player ON Player.Id = Scorer.PlayerId
                GROUP BY PlayerId
                ORDER BY TotalGoals DESC`;
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({
      "message": "success",
      "data": rows
    })
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
