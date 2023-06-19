import { Injectable } from '@angular/core';
import * as Realm from "realm-web";

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private _app!: Realm.App;
  isInitialized = false;
  songsChanged = true;

  constructor() {
  }

  async init() {
    this._app = new Realm.App({id: "application-0-yxpna"});
    const credentials = Realm.Credentials.anonymous();
    try {
      await this._app.logIn(credentials);
      this.isInitialized = true;
      console.log("Login successful")
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }

  async getSongs() {
    if (!this.isInitialized) {
      await this.init();
    }
    const user = this._app.currentUser;
    if (user && this.songsChanged) {
      this.songsChanged = false;
      this.watchSongsChanges(user);
      return user.functions.callFunction('GetSongs');
    }
    return false;
  }

  watchSongsChanges(user: Realm.User) {
    const mongo = user.mongoClient("mongodb-atlas");
    const collection = mongo.db("gb").collection("songs");
    collection.watch().next().then(change => {
      if (change) {
        console.log("change");
        this.songsChanged = true;
      }
    }).catch(err => {
      console.error("Failed to watch songs changes", err);
    });
  }
}
