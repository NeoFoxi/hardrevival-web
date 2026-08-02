from fastapi import FastAPI
import functions

app = FastAPI()

@app.get("/v1/fights/ends")
def fight_ends(looser_username: str, attacker_username: str):
    functions.fight_ends(looser_username, attacker_username)

@app.get("/v1/players/revives")
def revive(reviver_username: str, player_username: str):
    functions.revive(reviver_username, player_username)

@app.get("/v1/players/datas")
def get_player_data(username: str):
    return functions.get_player_data(username)

@app.get("/v1/players/lists")
def get_player_list():
    return functions.get_player_list()