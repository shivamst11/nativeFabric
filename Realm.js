import Realm from 'realm';
// Returns the shared instance of the Realm app.
export function getRealmApp() {
  const appId = 'application-0-ukwsf'; // Set App ID here.
  const appConfig = {
    id: appId,
  };
  return new Realm.App(appConfig);
}
