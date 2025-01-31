import jsonServer from "json-server";
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

import list from "./mockdata.json" assert { type: "json" };

server.use( jsonServer.bodyParser );

server.use( function( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', req.headers.origin );
    res.header( 'Access-Control-Allow-Credentials', "true" );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' );

    next();
});

// GET empty list
server.get( '/api/todolist/empty', (req, res) => {
    const response = [];

    setTimeout(() => {
        res.status(200).jsonp(response);
    }, 3000);
});

// GET list
// GET search query
// GET filter query
server.get( '/api/todolist', (req, res) => {

    let todolist = list.todoList;

    if(req.query.filter) {
        const query = (req.query.filter as string);

        if(query === "completed") {
            todolist = todolist.filter((todo) => {
                return todo.completed === true;
            });
        }

        if(query === "pending") {
            todolist = todolist.filter((todo) => {
                return todo.completed === false;
            });
        }

    }

    if(req.query.search) {
        const query = (req.query.search as string).toLowerCase();

        todolist = todolist.filter((todo) => {
            return todo.title.toLowerCase().includes(query);
        });
    }

    res.status(200).jsonp(todolist);
});

// POST new todo
server.post( '/api/todolist', (req, res) => {
    const newTodo = req.body;

    const response = list.todoList;

    response.unshift(newTodo);

    setTimeout(() => {
        res.status(200).jsonp(response[0]);
    }, 3000);
});

// PATCH todo
server.patch( '/api/todolist/:todoId', (req, res) => {
    const todoId = req.params.todoId;
    const updatedTodo = req.body;

    const response = list.todoList;

    const index = response.findIndex(value => value.id === todoId);

    if(index === -1) {
        res.status(400).jsonp({ message: "Item not found." });
        return;
    }
    
    const todo = response[index];

    if(updatedTodo.title !== undefined) {
        todo.title = updatedTodo.title;
    }

    if(updatedTodo.completed !== undefined) {
        todo.completed = updatedTodo.completed;
    }

    setTimeout(() => {
        res.status(200).jsonp(todo);
    }, 3000);
});

// Delete todo
server.delete( '/api/todolist/:todoId', (req, res) => {
    const todoId = req.params.todoId;

    const response = list.todoList;

    const index = response.findIndex(value => value.id === todoId);

    if(index === -1) {
        res.status(400).jsonp({ message: "Item not found." });
        return;
    }
    
    const deletedItem = response.splice(index, 1)[0];

    setTimeout(() => {
        res.status(200).jsonp(deletedItem);
    }, 3000);
});

server.use( middlewares );

const port = 5000;
server.listen( port, () => {
    console.info( 'JSON Server running on port ' + port );
});
