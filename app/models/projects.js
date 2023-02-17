const Sequelize = require('sequelize');
const db = require('../../database/database');

const Project = db.define('projects', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.JSONB,
        allowNull: false,
    }
});

module.exports = Project;