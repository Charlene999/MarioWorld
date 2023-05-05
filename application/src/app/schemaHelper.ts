export class character {
  Name: string;
  Level: number;
  Class: string;
  Description: string;
  ID: number;
  items: Map<number, Item>;

  constructor(name: string, level: number, myClass: string, desc: string, id: number, allitems: Item[]) {
    this.Name = name;
    this.Level = level;
    this.Class = myClass;
    this.Description = desc;
    this.ID = id;
    this.items = new Map<number, Item>;

    if (allitems !== null) {
      for (var i = 0; i < allitems.length; i++) {
        this.items.set(allitems[i].ID, allitems[i]);
      }
    }
  }
}

export class Item {
  Name: string;
  Description: string;
  Level: number;
  Class: string;
  ID: number;
  Owned: boolean;

  constructor(name: string, desc: string, level: number, myclass: string, id: number, owned: boolean) {
    this.Owned = owned;
    this.Name = name;
    this.Description = desc;
    this.Level = level;
    this.Class = myclass;
    this.ID = id;
  }
}

// User Info available for admin
export class myUser {
  Name: string;
  Username: string;
  Email: string;
  ID: number;
  IsAdmin: boolean;
  adm: string;
  Password: string;
  constructor(name: string, username: string, email: string, id: number, isadmin: boolean, password: string) {
    this.Name = name;
    this.Username = username;
    this.Email = email;
    this.ID = id;
    this.IsAdmin = isadmin;
    this.Password = password;
    if (isadmin === true) {
      this.adm = "TRUE";
    }
    else {
      this.adm = "FALSE";
    }
  }
}

export class AllClasses {

  allClasses: Array<string>;
  allCharacters: Array<string>;
  justClasses: Array<string>;
  constructor() {
    this.allClasses = ["All Items", "Visionary", "Slippery Spy", "Ice Master", "Detonator", "Accelerator", "Sharp Shooter", "Shell Shooter", "Animalist", "Paladin", "Avenger"];
    this.allCharacters = ["All Characters", "Visionary", "Slippery Spy", "Ice Master", "Detonator", "Accelerator", "Sharp Shooter", "Shell Shooter", "Animalist", "Paladin", "Avenger"];
    this.justClasses = ["VISIONARY", "SLIPPERY SPY", "ICE MASTER", "DETONATOR", "ACCELERATOR", "SHARP SHOOTER","SHELL SHOOTER", "ANIMALIST", "PALADIN", "AVENGER"];
  }

  getNames(classIndex: number): string {

    var className: string;
    switch (classIndex) {
      case 1:
        className = this.allClasses.at(1)!;
        break;
      case 2:
        className = this.allClasses.at(2)!;
        break;
      case 3:
        className = this.allClasses.at(3)!;
        break;
      case 4:
        className = this.allClasses.at(4)!;
        break;
      case 5:
        className = this.allClasses.at(5)!;
        break;
      case 6:
        className = this.allClasses.at(6)!;
        break;
      case 7:
        className = this.allClasses.at(7)!;
        break;
      case 8:
        className = this.allClasses.at(8)!;
        break;
      case 9:
        className = this.allClasses.at(9)!;
        break;
      case 10:
        className = this.allClasses.at(10)!;
        break;
      default:
        className = "";
        break;
    }

    return className;
  }

  getIndices(className: string): number {

    var currentClass: number;

    switch (className) {
      case this.allClasses.at(1)!:
        currentClass = 1;
        break;
      case this.allClasses.at(2)!:
        currentClass = 2;
        break;
      case this.allClasses.at(3)!:
        currentClass = 3;
        break;
      case this.allClasses.at(4)!:
        currentClass = 4;
        break;
      case this.allClasses.at(5)!:
        currentClass = 5;
        break;
      case this.allClasses.at(6)!:
        currentClass = 6;
        break;
      case this.allClasses.at(7)!:
        currentClass = 7;
        break;
      case this.allClasses.at(8)!:
        currentClass = 8;
        break;
      case this.allClasses.at(9)!:
        currentClass = 9;
        break;
      case this.allClasses.at(10)!:
        currentClass = 10;
        break;
      default:
        currentClass = -1;
        break;
    }

    return currentClass;
  }
}

export enum allImages {
  RedShell = 3,
  Rocket = 4,
  Lightning = 5,
  Star = 6,
  Banana = 7,
  BlueShell = 8,
  CrownSpeed = 9,
  Bomb = 10,
  ImpendingDoom = 11,
  GreenShell = 12,
  MushroomSpeed = 13,
  PseudoItemBox = 14,
  Blooper = 15,
  KingBoo = 16,
  TripleGreenShell = 17,
  Giant = 18,
  FireFlower = 19,
  IceBall = 20,
  PenguinIceball = 21,
  TripleRedShell = 22,
  Boomerang = 23,
  BlueMushroom = 24,
  TripleBanana = 25,
  TripleSpeed = 26,
  FlyingSquirrel = 27,
  Yoshi = 28,
  SuperSquirrel = 29,
  Propeller = 30

}

export function IdToImage(ID: number): string {

  var url: string = "";
  switch (ID) {

    case 3:
      url = "/assets/images/redShell.png";
      break;

    case 4:
      url = "/assets/images/rocket.png";
      break;

    case 5:
      url = "/assets/images/lightning.png";
      break;

    case 6:
      url = "/assets/images/star.png";
      break;

    case 7:
      url = "/assets/images/banana.png";
      break;

    case 8:
      url = "/assets/images/blueShell.png";
      break;

    case 9:
      url = "/assets/images/crownSpeed.png";
      break;

    case 10:
      url = "/assets/images/bombomb.png";
      break;

    case 11:
      url = "/assets/images/cloudLightning.png";
      break;

    case 12:
      url = "/assets/images/greenShell.png";
      break;

    case 13:
      url = "/assets/images/shroomSpeed.png";
      break;

    case 14:
      url = "/assets/images/pseudoBox.png";
      break;

    case 15:
      url = "/assets/images/blooper.png";
      break;

    case 16:
      url = "/assets/images/kingBoo.png";
      break;

    case 17:
      url = "/assets/images/tripleGreenShell.png";
      break;

    case 18:
      url = "/assets/images/giant.png";
      break;

    case 19:
      url = "/assets/images/fireFlower.png";
      break;

    case 20:
      url = "/assets/images/iceFlower.png";
      break;

    case 21:
      url = "/assets/images/penguin.png";
      break;

    case 22:
      url = "/assets/images/tripleRedShell.png";
      break;

    case 23:
      url = "/assets/images/boomerang.png";
      break;

    case 24:
      url = "/assets/images/blueShroom.png";
      break;

    case 25:
      url = "/assets/images/3Bananas.png";
      break;

    case 26:
      url = "/assets/images/3Shrooms.png";
      break;

    case 27:
      url = "/assets/images/flyingSquirrel.png";
      break;

    case 28:
      url = "/assets/images/yoshi.png";
      break;

    case 29:
      url = "/assets/images/superSquirrel.png";
      break;

    case 30:
      url = "/assets/images/propeller.png";
      break;


    default:

      break;
  }

  return url;
}
