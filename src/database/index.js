import { Database } from "@vuex-orm/core";
import Chauffeur from "../models/Chauffeur";
import Course from "../models/Course";
import Patient from "../models/Patient";
import Phone from "../models/Phone";
import Place from "../models/Place";
import User from "../models/User";
import Category from "../models/Category";

const database = new Database();

database.register(Course);
database.register(Chauffeur);
database.register(Patient);
database.register(Phone);
database.register(Place);
database.register(User);
database.register(Category);

export default database;
