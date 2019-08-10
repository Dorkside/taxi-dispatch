import { Database } from "@vuex-orm/core";
import User from "@/models/User";
import Todo from "@/models/Todo";
import Chauffeur from "../models/Chauffeur";
import Course from "../models/Course";
import Patient from "../models/Patient";

const database = new Database();

database.register(User);
database.register(Todo);
database.register(Course);
database.register(Chauffeur);
database.register(Patient);

export default database;
