import os, json

def get_player_data(username: str):
    if os.path.exists(f"data/player_data/{username}.json"):
        with open(f"data/player_data/{username}.json", "r", encoding="utf-8") as file:
            data = json.load(file)
        return data
    else:
        return "404"

def get_player_list():
    list = os.listdir("data/player_data")
    for i in range(len(list)):
        list[i] = list[i].replace(".json", "")
    return list

def player_exists(username: str):
    return os.path.exists(f"data/player_data/{username}.json")

def if_player_not_exists_create(username: str):
    if not player_exists(username):
        create_player(username)

def create_player(username: str):

        default_data = {
            "killed_players": [],
            "revived_players": [],
            "killed_by_players": [],
            "revived_by_players": []
        }

        with open(f"data/player_data/{username}.json", "w", encoding="utf-8") as file:
            json.dump(default_data, file, indent=4, ensure_ascii=False)

def fight_ends(looser_username: str, attacker_username: str):
    if_player_not_exists_create(looser_username)
    if_player_not_exists_create(attacker_username)

    with open(f"data/player_data/{looser_username}.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    data["killed_by_players"].append(attacker_username)

    with open(f"data/player_data/{looser_username}.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    
    #killes by player

    with open(f"data/player_data/{attacker_username}.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    data["killed_players"].append(looser_username)

    with open(f"data/player_data/{attacker_username}.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

def revive(reviver_un: str, player_un: str):
    if_player_not_exists_create(reviver_un)
    if_player_not_exists_create(player_un)

    with open(f"data/player_data/{player_un}.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    data["revived_players"].append  (reviver_un)

    with open(f"data/player_data/{player_un}.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    
    #killes by player

    with open(f"data/player_data/{reviver_un}.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    data["revived_by_players"].append(player_un)

    with open(f"data/player_data/{reviver_un}.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)