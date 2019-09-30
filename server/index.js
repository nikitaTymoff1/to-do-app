const express = require('express');
const cors = require('cors');
const port = 4000;
const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('tododata', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true,
        timestamps: false
    }
});

const Model = Sequelize.Model;
class Task extends Model {}
Task.init({
    task: {
        type: Sequelize.STRING,
        allowNull: false
    },
    completed: {
        type: Sequelize.BOOLEAN,
    }
}, {
    sequelize,
    modelName: 'data'
});

const app = express();

const findAll = (res) =>{
    Task.findAll().then(task => {
        res.send(JSON.stringify(task, null, 4))
    });
};

app.use(cors());

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.post('/add', (req, res) => {
    Task.create({ task: req.query.task, completed: false}).then(task => {
        console.log("auto-generated ID:", task.id);
        findAll(res);
    })
});
app.get('/tasks', (req, res) => {
    Task.findAll().then(task => {
        console.log("All tasks:", JSON.stringify(task, null, 4));
        res.send(JSON.stringify(task, null, 4))
    });

});
app.post('/update', (req, res) => {
    Task.update({ completed: req.query.completed }, {
        where: {
            id: req.query.id
        }
    }).then(() => {
        console.log("Done");
        findAll(res)
    });
});
app.get('/delete', (req, res) => {
    Task.destroy({
        where: {
            id: req.query.id
        }
    }).then(() => {
        console.log("Done");
        findAll(res)
    });
});

app.listen(port, () => {
    console.log(`listening to ${port}`)
});

