import { App } from "../app/models/app.model";
import { User } from "../app/services/user.service";

export var user: User = {
    isLoggedIn: true,
    username: 'nate',
    password: '',
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

export var appList: App[] = [
    new App('Admin', true, false, 1),
    new App('Archive', false, false, 1),
    new App('Shape Store', false, false, 1),
    new App('Mine Nate Coin', false, false, 1),
    new App('Stuff I Like', true, false, 1),
    new App('Puzzle', false, false, 1),
    new App('Media Player', false, false, 1),
    new App('Stats', false, false, 1),
    new App('Internet', false, false, 1),
    new App('Catalog', false, false, 1),
    new App('Settings', false, false, 1),
    new App('Weather', false, false, 1),
    new App('Minesweeper', false, false, 1),
    new App('Command Line', false, false, 1),
    new App('Login', false, false, 1),
    new App('Recycle', false, false, 1)
  ];
