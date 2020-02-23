import { Database } from "@vuex-orm/core";
import Chauffeur from "../models/Chauffeur";
import Course from "../models/Course";
import Patient from "../models/Patient";
import Phone from "../models/Phone";

const database = new Database();

database.register(Course);
database.register(Chauffeur);
database.register(Patient);
database.register(Phone);

export default database;
