const request = require('supertest');
const app = require('../../app');
const getAllUsers = require('../model/user');
const database = require('../db/dbService');