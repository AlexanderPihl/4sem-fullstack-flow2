const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    { id: 1, name: "course 1" },
    { id: 2, name: "course 2" },
    { id: 3, name: "course 3" }
];

app.get('/', (reg, res) => {
    res.send('Hello World')
});

app.get('/api/courses', (reg, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    //Destructuring error
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(result.error.details[0].message); //400 Bad Request

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found'); //404

    // Validate
    // If invalid, return 400 - Bad request
    const { error } = validateCourse(req.body); // Destructuring error
    if (error) return res.status(400).send(result.error.details[0].message); //400 Bad Request

    // Update course
    course.name = req.body.name;
    // Return the updated course
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found'); //404
    res.send(course);
})


app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found'); //404

    //Delete
    const index = courses.indexOf(course);
    course.splice(index, 1);

    //Return the same course
    res.send(course);
});



//PORT number assigned dynamically
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));

//Validation logic in one function
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}