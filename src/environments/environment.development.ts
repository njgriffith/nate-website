import { User } from "../app/services/user.service";

export var user: User = {
    isLoggedIn: true,
    username: 'nate',
    password: 'uiop',
    puzzleLevel: 0,
    easy: undefined,
    medium: undefined,
    hard: undefined,
    expert: undefined,
    master: undefined,
    balance: 0,
    shapesOwned: [],
    miningTools: { "employees": [5, 5, 5, 5, 5], "ore_detector": 5 }
};

