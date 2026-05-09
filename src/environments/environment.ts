import { User } from "../app/services/user.service";

export var user: User = {
    isLoggedIn: false,
    username: '',
    password: '',
    puzzleLevel: 0,
    easy: undefined,
    medium: undefined,
    hard: undefined,
    expert: undefined,
    master: undefined,
    balance: 0,
    shapesOwned: [],
    miningTools: { "employees": [0, 0, 0, 0, 0], "ore_detector": 0 }
};
