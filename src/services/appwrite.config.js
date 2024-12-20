import { Client, Account } from "appwrite";
const client = new Client();
client.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
const account = new Account(client);
export default account;
